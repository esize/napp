import { logout } from "@/actions/auth";
import { redirect } from "next/navigation";

export const GET = async () => {
  await logout();
  redirect("/login");
};
