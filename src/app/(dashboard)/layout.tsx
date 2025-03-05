import { AuthProvider } from "@/lib/auth/auth-provider";
import { requireAuthentication } from "@/lib/auth/server-utils";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import React from "react";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireAuthentication();

  return (
    <NuqsAdapter>
      <AuthProvider initialUser={user}>{children}</AuthProvider>
    </NuqsAdapter>
  );
}
