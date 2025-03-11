import { AuthProvider } from "@/lib/auth/auth-provider";
import { requireAuthentication } from "@/lib/auth/server-utils";
import React from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { BreadcrumbNav } from "./breadcrumbs";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireAuthentication();

  return (
    <AuthProvider initialUser={user}>
      <SidebarProvider>
        <AppSidebar initialUser={user} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 h-4 bgred-500 w-1"
              />
              <BreadcrumbNav />
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 pt-0 m-4">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}
