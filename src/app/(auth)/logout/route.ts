import { logout } from "@/actions/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export const GET = async (request: Request) => {
  const headersList = await headers();
  const purpose =
    headersList.get("Purpose") ||
    headersList.get("X-Purpose") ||
    headersList.get("Sec-Purpose");
  const isMobileRequest = headersList.get("Sec-Fetch-Mode") === "navigate";
  // Only perform logout for actual navigation, not for prefetch requests
  if (purpose !== "prefetch" && isMobileRequest) {
    await logout();
    redirect("/login");
  }

  // For prefetch requests, just return a 200 OK without doing anything
  return new Response(null, { status: 200 });
};
