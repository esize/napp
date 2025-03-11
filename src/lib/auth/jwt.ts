"use server";
// Updated src/lib/auth/jwt.ts
import { SignJWT, jwtVerify } from "jose";
import { env } from "@/env";
import { cookies } from "next/headers";
import { TokenPayload } from "@/types/auth";
import { nanoid } from "nanoid";
import { getUserById } from "@/data";
import {
  createRefreshTokenRecord,
  isRefreshTokenValid,
  markRefreshTokenAsUsed,
  revokeAllUserRefreshTokens,
} from "@/data/security/refreshToken";

const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);

export async function createAccessToken(
  payload: Omit<TokenPayload, "exp">,
  expiresIn = "15m"
): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

export async function createRefreshToken(
  userId: string,
  expiresIn = "7d"
): Promise<string> {
  // Generate a unique ID for this token
  const tokenId = nanoid(64);

  // Calculate expiration time
  const expiresInSeconds = 7 * 24 * 60 * 60; // 7 days in seconds
  const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

  // Create JWT with the token ID
  const token = await new SignJWT({
    sub: userId,
    type: "refresh",
    jti: tokenId, // Include the token ID in the JWT
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);

  // Store token in database
  await createRefreshTokenRecord({
    id: tokenId,
    userId,
    expiresAt,
    used: false,
    revoked: false,
  });

  return token;
}

export async function verifyToken<T = TokenPayload>(
  token: string
): Promise<T | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as T;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export async function getTokens(): Promise<{
  accessToken: string | null;
  refreshToken: string | null;
}> {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value || null;
  const refreshToken = cookieStore.get("refresh_token")?.value || null;

  return { accessToken, refreshToken };
}

export async function setTokens(
  accessToken: string,
  refreshToken: string,
  options: {
    secure?: boolean;
    maxAge?: { access: number; refresh: number };
  } = {}
): Promise<void> {
  const cookieStore = await cookies();

  // Default values
  const secure = options.secure ?? process.env.NODE_ENV === "production";
  const maxAgeAccess = options.maxAge?.access ?? 15 * 60; // 15 minutes default
  const maxAgeRefresh = options.maxAge?.refresh ?? 7 * 24 * 60 * 60; // 7 days default

  cookieStore.set({
    name: "access_token",
    value: accessToken,
    httpOnly: true,
    path: "/",
    secure,
    sameSite: "lax", // 'strict' would be more secure but can impact UX
    maxAge: maxAgeAccess,
  });

  cookieStore.set({
    name: "refresh_token",
    value: refreshToken,
    httpOnly: true,
    path: "/",
    secure,
    sameSite: "lax",
    maxAge: maxAgeRefresh,
  });
}

export async function clearTokens(): Promise<void> {
  const cookieStore = await cookies();

  // cookieStore.set({
  //   name: "access_token",
  //   value: "",
  //   httpOnly: true,
  //   path: "/",
  //   secure: process.env.NODE_ENV === "production",
  //   maxAge: 0, // Expire immediately
  // });

  // cookieStore.set({
  //   name: "refresh_token",
  //   value: "",
  //   httpOnly: true,
  //   path: "/",
  //   secure: process.env.NODE_ENV === "production",
  //   maxAge: 0, // Expire immediately
  // });

  cookieStore.delete("refresh_token");
  cookieStore.delete("access_token");
}

// New function to implement token rotation
export async function refreshTokens(
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string } | null> {
  // Verify the refresh token
  const payload = await verifyToken<{ sub: string; type: string; jti: string }>(
    refreshToken
  );

  if (!payload || payload.type !== "refresh" || !payload.jti) {
    return null;
  }

  try {
    // Check if the token is valid (not used or revoked)
    const isValid = await isRefreshTokenValid(payload.jti);

    if (!isValid) {
      // Potential token reuse - revoke all tokens for this user
      await revokeAllUserRefreshTokens(payload.sub);
      return null;
    }

    // Mark the current token as used
    await markRefreshTokenAsUsed(payload.jti);

    // Get user data
    const user = await getUserById(payload.sub);
    if (!user) return null;

    // Create new tokens
    const tokenPayload = {
      sub: user.id,
      username: user.username,
      isActive: user.isActive,
      isLocked: user.isLocked,
    };

    const newAccessToken = await createAccessToken(tokenPayload);
    const newRefreshToken = await createRefreshToken(user.id);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (error) {
    console.error("Error during token refresh:", error);
    return null;
  }
}
