import { AuthProvider } from "@/lib/auth/auth-provider";
import { requireAuthentication } from "@/lib/auth/server-utils";
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireAuthentication();

  return (
    <AuthProvider initialUser={user}>
      <SidebarProvider>
        <AppSidebar initialUser={user} />
        <main className="mx-8 my-4 w-full flex flex-col">
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </AuthProvider>
  );
}
