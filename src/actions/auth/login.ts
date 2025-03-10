"use server";

import { z } from "zod";
import { authenticateUser } from "@/lib/auth/password";
import { createSecurityLog, updateUserById } from "@/data";
import { procedure } from "@/actions/procedures";
import { ZSAError } from "zsa";
import { LoginSchema } from "@/types/auth";

export type LoginInput = z.infer<typeof LoginSchema>;

export const login = procedure
  .createServerAction()
  .input(LoginSchema)
  .handler(async ({ ctx, input }) => {
    try {
      const authResult = await authenticateUser(input.username, input.password);
      if (!authResult.success) {
        throw new ZSAError("ERROR", "Authentication failed");
      }

      if (authResult.user) {
        await updateUserById(authResult.user.sub, {
          lastLogin: new Date(),
        });
        await createSecurityLog({
          userId: authResult.user.sub,
          action: "LOGIN",
          resource: "USER",
          details: "User login",
          ipAddress: ctx.ipAddress,
        });
      }
      return { success: true };
    } catch {
      throw new ZSAError("ERROR", "Authentication failed");
    }
  });
