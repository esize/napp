"use server";

import { getUserById } from "@/data";
import { ZSAError } from "zsa";
import { authedProcedure } from "../procedures";
import { type TokenPayload } from "@/types/auth";

export const refreshUser = authedProcedure
  .createServerAction()
  .handler(async ({ ctx }) => {
    try {
      if (!ctx.user) {
        throw new ZSAError("NOT_AUTHORIZED", "User not authenticated.");
      }
      const user = await getUserById(ctx.user.sub);
      const refreshedUserData: TokenPayload = {
        sub: user.id,
        username: user.username,
        isActive: user.isActive,
        isLocked: user.isLocked,
      };
      return { user: refreshedUserData };
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      throw new ZSAError(
        "INTERNAL_SERVER_ERROR",
        "Failed to refresh user data"
      );
    }
  });
