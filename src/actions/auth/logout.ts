"use server";

import { clearTokens } from "@/lib/auth/jwt";
import { getAuthenticatedUser } from "@/lib/auth/password";
import { createSecurityLog } from "@/data";
import { redirect } from "next/navigation";

export async function logout(clientIp?: string) {
  try {
    // Get current user before clearing tokens
    const user = await getAuthenticatedUser();

    // Clear tokens
    await clearTokens();

    // Log the logout if user was authenticated
    if (user) {
      await createSecurityLog({
        userId: user.sub,
        action: "LOGOUT",
        resource: "USER",
        details: "User logout",
        ipAddress: clientIp,
      });
    }

    // Redirect to login page
    redirect("/login");
  } catch (error) {
    console.error("Logout error:", error);
    // Clear tokens even if logging fails
    await clearTokens();
    redirect("/login");
  }
}
