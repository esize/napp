"use client";

import { useAuth } from "@/lib/auth/auth-provider";
import { toast } from "sonner";

export default function Test() {
  toast("Hey!", {});
  const { user } = useAuth();
  return <div>Hello {user?.username}</div>;
}
