"use server";

import { z } from "zod";
import { authenticateUser } from "@/lib/auth/password";
import { createSecurityLog, updateUserById } from "@/data";
import { redirect } from "next/navigation";

// Define schema for login input
const LoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  redirectTo: z.string().optional(),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export async function login(data: LoginInput, clientIp?: string) {
  try {
    // Validate input
    const validatedData = LoginSchema.parse(data);

    // Authenticate user
    const authResult = await authenticateUser(
      validatedData.username,
      validatedData.password
    );

    if (!authResult.success) {
      return {
        success: false,
        errors: [
          {
            path: "root",
            message: authResult.message || "Authentication failed",
          },
        ],
      };
    }

    // Update last login timestamp
    if (authResult.user) {
      await updateUserById(authResult.user.sub, {
        lastLogin: new Date(),
      });

      // Log successful login
      await createSecurityLog({
        userId: authResult.user.sub,
        action: "LOGIN",
        resource: "USER",
        details: "User login",
        ipAddress: clientIp,
      });
    }

    // Redirect to requested page or default
    const redirectPath = validatedData.redirectTo || "/dashboard";
    redirect(redirectPath);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      };
    }

    console.error("Login error:", error);
    return {
      success: false,
      errors: [{ path: "root", message: "Login failed" }],
    };
  }
}
