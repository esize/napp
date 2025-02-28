import { logout } from "@/actions/auth";

export const GET = async () => {
  return await logout();
};
