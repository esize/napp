import "server-only";
import { hash, verify } from "argon2";
import { redirect } from "next/navigation";
import {
  verifyToken,
  createAccessToken,
  getTokens,
  setTokens,
  createRefreshToken,
  refreshTokens,
} from "./jwt";
import { getUserByUsername } from "@/data";
import { TokenPayload } from "@/types/auth";
import { User } from "@/db/schema";

export async function hashPassword(password: string): Promise<string> {
  return await hash(password);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await verify(hashedPassword, password);
}

export async function getAuthenticatedUser(): Promise<TokenPayload | null> {
  // Get tokens from cookies
  const { accessToken, refreshToken } = await getTokens();

  // Check if access token exists and is valid
  if (accessToken) {
    const payload = await verifyToken<TokenPayload>(accessToken);
    if (payload) {
      return payload;
    }
  }

  // If no valid access token, try refresh token
  if (refreshToken) {
    try {
      // Use the new token rotation mechanism
      const newTokens = await refreshTokens(refreshToken);

      if (newTokens) {
        // Set the new tokens in cookies
        await setTokens(newTokens.accessToken, newTokens.refreshToken);

        // Return the user from the access token
        const newPayload = await verifyToken<TokenPayload>(
          newTokens.accessToken
        );
        return newPayload;
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  }

  return null;
}

export async function requireAuth(): Promise<TokenPayload> {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function authenticateUser(
  username: string,
  password: string
): Promise<{
  success: boolean;
  user?: TokenPayload;
  message?: string;
}> {
  try {
    const user = await getUserByUsername(username);

    if (!user) {
      await verifyPassword(password, "randomstringfortimingattacks");
      return {
        success: false,
        message: "Invalid credentials",
      };
    }

    // Verify the password
    const isValidPassword = await verifyPassword(password, user.passwordHash);

    if (!isValidPassword) {
      return {
        success: false,
        message: "Invalid credentials",
      };
    }

    return await createUserToken(user);
  } catch (error) {
    console.error("Authentication error:", error);
    return {
      success: false,
      message: "An error occurred during authentication",
    };
  }
}

export async function createUserToken(user: User) {
  const payload: Omit<TokenPayload, "exp"> = {
    sub: user.id,
    username: user.username,
    isActive: user.isActive,
    isLocked: user.isLocked,
  };
  const accessToken = await createAccessToken(payload);
  const refreshToken = await createRefreshToken(user.id);

  // Set cookies
  await setTokens(accessToken, refreshToken);
  return {
    success: true,
    user: payload,
  };
}
