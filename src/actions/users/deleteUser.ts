"use server";

import { z } from "zod";
import { ZSAError } from "zsa";
import { deactivateUser, createSecurityLog } from "@/data";
import { authedProcedure } from "@/actions/procedures";

const DeleteUserSchema = z.object({
  id: z.string(),
});

export const deleteUser = authedProcedure
  .createServerAction()
  .input(DeleteUserSchema)
  .handler(async ({ ctx, input }) => {
    try {
      // For safety, we're just deactivating the user rather than deleting
      const user = await deactivateUser(input.id);

      await createSecurityLog({
        userId: ctx.user!.sub,
        action: "DELETE",
        resource: "USER",
        details: `Deactivated user ${input.id}`,
        ipAddress: ctx.ipAddress,
      });

      return user;
    } catch (error) {
      throw new ZSAError("INTERNAL_SERVER_ERROR", error);
    }
  });
