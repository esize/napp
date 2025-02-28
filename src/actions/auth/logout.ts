"use server";

import { clearTokens } from "@/lib/auth/jwt";
import { createSecurityLog } from "@/data";
import { redirect } from "next/navigation";
import { authedProcedure } from "@/actions/procedures";

export const logout = authedProcedure
  .createServerAction()
  .handler(async ({ ctx }) => {
    try {
      await clearTokens();
      if (ctx.user) {
        await createSecurityLog({
          userId: ctx.user.sub,
          action: "LOGOUT",
          resource: "USER",
          details: "User logout",
          ipAddress: ctx.ipAddress,
        });
      }
      redirect("/");
    } catch (error) {
      console.error("Logout error:", error);
      await clearTokens();
      redirect("/login");
    }
  });
