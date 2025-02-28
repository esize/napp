"use server";
import { createSecurityLog, createUser } from "@/data";
import { hashPassword } from "@/lib/auth/password";
import { z } from "zod";
import { ZSAError } from "zsa";
import { procedure } from "@/actions/procedures";

const RegisterSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const createUserAction = procedure
  .createServerAction()
  .input(RegisterSchema)
  .handler(async ({ input }) => {
    try {
      const passwordHash = await hashPassword(input.password);
      const [id] = await createUser({
        username: input.username,
        passwordHash,
      });
      await createSecurityLog({
        userId: id.id,
        action: "CREATE",
        resource: "USER",
        details: `Created user ${input.username}`,
      });
      return { success: true, id: id.id };
    } catch (error) {
      throw new ZSAError("INTERNAL_SERVER_ERROR", error);
    }
  });
