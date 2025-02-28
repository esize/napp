"use server";

import { getClientIp, getCurrentUser } from "@/lib/auth/server-utils";
import { createServerActionProcedure, ZSAError } from "zsa";

export const procedure = createServerActionProcedure().handler(async () => {
  return { ipAddress: await getClientIp() };
});

export const authedProcedure = createServerActionProcedure(procedure).handler(
  async ({ ctx }) => {
    try {
      const user = await getCurrentUser();
      return {
        ...ctx,
        user,
      };
    } catch {
      throw new ZSAError("NOT_AUTHORIZED", "User not authenticated.");
    }
  }
);
