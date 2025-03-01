"use server";

import { getUserById } from "@/data";
import { ZSAError } from "zsa";
import { authedProcedure } from "../procedures";
import { type TokenPayload } from "@/types/auth";
import { getAuthenticatedUser } from "@/lib/auth/password";

export const refreshUser = authedProcedure
  .createServerAction()
  .handler(async () => {
    try {
      // This will use our improved token rotation mechanism
      const user = await getAuthenticatedUser();

      if (!user) {
        throw new ZSAError("NOT_AUTHORIZED", "User not authenticated.");
      }

      // Get fresh user data
      const freshUserData = await getUserById(user.sub);

      const refreshedUserData: TokenPayload = {
        sub: freshUserData.id,
        username: freshUserData.username,
        isActive: freshUserData.isActive,
        isLocked: freshUserData.isLocked,
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
