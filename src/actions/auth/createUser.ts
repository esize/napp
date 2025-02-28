"use server";
import { createSecurityLog, createUser } from "@/data";
import { hashPassword } from "@/lib/auth/password";
import { z } from "zod";

const RegisterSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export async function createUserAction(data: RegisterInput, clientIp?: string) {
  try {
    const validatedData = RegisterSchema.parse(data);
    const passwordHash = await hashPassword(validatedData.password);

    const [id] = await createUser({
      username: validatedData.username,
      passwordHash,
    });

    // Log the user creation event
    await createSecurityLog({
      userId: id.id,
      action: "CREATE",
      resource: "USER",
      details: `Created user ${validatedData.username}`,
      ipAddress: clientIp,
    });

    return { success: true, id: id.id };
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
    console.error("Registration error:", error);
    return {
      success: false,
      errors: [{ path: "root", message: "Registration failed" }],
    };
  }
}
