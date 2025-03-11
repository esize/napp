import "server-only";

import { redirect } from "next/navigation";
import { getAuthenticatedUser, requireAuth } from "@/lib/auth/password";
import { TokenPayload } from "@/types/auth";
import { cookies, headers } from "next/headers";

export async function getCurrentUser() {
  return await getAuthenticatedUser();
}

export async function requireAuthentication(): Promise<TokenPayload> {
  const user = await requireAuth();

  if (!user || !user.isActive || user.isLocked) {
    redirect("/login");
  }

  return user;
}

export async function requireAdmin(): Promise<TokenPayload> {
  const user = await requireAuthentication();

  // You'll need to implement role checking here
  // This is just a placeholder - you'd need to check if user has admin role
  // Consider querying user roles and checking for admin role

  // For now, just redirect if not admin
  // This should be replaced with actual role checking
  redirect("/unauthorized");

  return user;
}

export async function getClientIp(): Promise<string | undefined> {
  const headersList = await headers();
  // Try different headers that might contain the client IP
  return (
    headersList.get("x-forwarded-for")?.split(",")[0].trim() ||
    headersList.get("x-real-ip") ||
    "unknown"
  );
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return !!cookieStore.get("access_token")?.value;
}

// For pages that should only be accessible to logged-out users (like login page)
export async function redirectIfAuthenticated(
  redirectTo: string = "/dashboard"
) {
  const user = await getAuthenticatedUser();
  if (user) {
    redirect(redirectTo);
  }
}
