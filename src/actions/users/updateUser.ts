"use server";

import { z } from "zod";
import { ZSAError } from "zsa";
import { updateUserById as updateUser, createSecurityLog } from "@/data";
import { authedProcedure } from "@/actions/procedures";

const UpdateUserSchema = z.object({
  id: z.string(),
  username: z.string().min(3).optional(),
  isActive: z.boolean().optional(),
  isLocked: z.boolean().optional(),
});

export const updateUserById = authedProcedure
  .createServerAction()
  .input(UpdateUserSchema)
  .handler(async ({ ctx, input }) => {
    try {
      const user = await updateUser(input.id, {
        username: input.username,
        isActive: input.isActive,
        isLocked: input.isLocked,
      });

      await createSecurityLog({
        userId: ctx.user!.sub,
        action: "UPDATE",
        resource: "USER",
        details: `Updated user ${input.id}`,
        ipAddress: ctx.ipAddress,
      });

      return user;
    } catch (error) {
      throw new ZSAError("INTERNAL_SERVER_ERROR", error);
    }
  });
