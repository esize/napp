import { User } from "@/db/schema";
import { z } from "zod";

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

export const LoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  redirectTo: z.string().optional(),
});

export const CreateUserSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string().min(1, "Password is required"),
    redirectTo: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
