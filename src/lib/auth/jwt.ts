import { SignJWT, jwtVerify } from 'jose';
import { env } from '@/env';
import { cookies } from 'next/headers';
import { TokenPayload } from '@/types/auth';

const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);

export async function createAccessToken(payload: Omit<TokenPayload, 'exp'>, expiresIn = '15m'): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

export async function createRefreshToken(userId: string, expiresIn = '7d'): Promise<string> {
  return await new SignJWT({ sub: userId, type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

export async function verifyToken<T = TokenPayload>(token: string): Promise<T | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as T;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export async function getTokens(): Promise<{ accessToken: string | null; refreshToken: string | null }> {
  const cookieStore = await cookies();
  
  const accessToken = cookieStore.get('access_token')?.value || null;
  const refreshToken = cookieStore.get('refresh_token')?.value || null;
  
  return { accessToken, refreshToken };
}

export async function setTokens(
  accessToken: string, 
  refreshToken: string,
  options: { secure?: boolean; maxAge?: { access: number; refresh: number } } = {}
): Promise<void> {
  const cookieStore = await cookies();
  
  // Default values
  const secure = options.secure ?? process.env.NODE_ENV === 'production';
  const maxAgeAccess = options.maxAge?.access ?? 15 * 60; // 15 minutes default
  const maxAgeRefresh = options.maxAge?.refresh ?? 7 * 24 * 60 * 60; // 7 days default
  
  cookieStore.set({
    name: 'access_token',
    value: accessToken,
    httpOnly: true,
    path: '/',
    secure,
    maxAge: maxAgeAccess,
  });
  
  cookieStore.set({
    name: 'refresh_token',
    value: refreshToken,
    httpOnly: true,
    path: '/',
    secure,
    maxAge: maxAgeRefresh,
  });
}

export async function clearTokens(): Promise<void> {
  const cookieStore = await cookies();
  
  cookieStore.set({
    name: 'access_token',
    value: '',
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0, // Expire immediately
  });
  
  cookieStore.set({
    name: 'refresh_token',
    value: '',
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0, // Expire immediately
  });
}