import { User } from "@/db/schema";

export interface TokenPayload {
  // JWT standard claims
  sub: User["id"]; // Subject (user ID)
  exp?: number; // Expiration time
  iat?: number; // Issued at time

  username: User["username"];
  isActive: User["isActive"];
  isLocked: User["isLocked"];
}

// You might also want to define other auth-related types
export interface RefreshTokenPayload {
  sub: string; // Subject (user ID)
  type: "refresh"; // Token type
  exp?: number; // Expiration time
  iat?: number; // Issued at time
}

export interface AuthResult {
  success: boolean;
  user?: TokenPayload;
  message?: string;
}
