"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { TokenPayload } from "@/types/auth";
import { NavUser } from "./nav-user";

export function AppSidebar({
  initialUser,
}: {
  initialUser: TokenPayload | null;
}) {
  return (
    <Sidebar variant="inset">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={initialUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
