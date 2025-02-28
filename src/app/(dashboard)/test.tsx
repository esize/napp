"use client";

import { useAuth } from "@/lib/auth/auth-provider";

export default function Test() {
  const user = useAuth();
  return <div>Hello {user.user?.username}</div>;
}
