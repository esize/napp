"use server";
import { createSecurityLog, createUser } from "@/data";
import { createUserToken, hashPassword } from "@/lib/auth/password";
import { ZSAError } from "zsa";
import { procedure } from "@/actions/procedures";
import { CreateUserSchema } from "@/types/auth";

export const createUserAction = procedure
  .createServerAction()
  .input(CreateUserSchema)
  .handler(async ({ input }) => {
    try {
      const passwordHash = await hashPassword(input.password);
      const user = await createUser({
        username: input.username,
        passwordHash,
      });
      await createSecurityLog({
        userId: user.id,
        action: "CREATE",
        resource: "USER",
        details: `Created user ${input.username}`,
      });

      await createUserToken(user);
      return;
    } catch (error) {
      throw new ZSAError("INTERNAL_SERVER_ERROR", error);
    }
  });
