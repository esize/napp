import { notFound } from "next/navigation";
import { getUserById } from "@/data";
import EditUserModal from "./modal";
import React from "react";

export default async function EditUserModalPage({
  params,
}: {
  params: { id: string };
}) {
  // For intercepted routes, we need to be extra careful with params
  if (!params || !params.id) {
    console.error("Missing user ID in params:", params);
    notFound();
  }

  const user = await getUserById(params.id);

  if (!user) {
    notFound();
  }

  return <EditUserModal user={user} />;
}
