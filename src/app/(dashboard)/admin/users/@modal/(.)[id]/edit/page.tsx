// In src/app/(dashboard)/admin/users/@modal/(.)([id])/edit/page.tsx
import { notFound } from "next/navigation";
import { getUserById } from "@/data";
import EditUserModal from "./modal";
import React from "react";

export default async function EditUserModalPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    notFound();
  }

  return <EditUserModal params={params} user={user} />;
}
