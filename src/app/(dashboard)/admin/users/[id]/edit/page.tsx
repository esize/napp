import { getUserById } from "@/data";
import { notFound } from "next/navigation";
import EditUserForm from "./form";
import { connection } from "next/server";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    return {
      title: "User Not Found",
    };
  }

  return {
    title: `Edit User: ${user.username}`,
  };
}

export default async function EditUserPage({
  params,
}: {
  params: { id: string };
}) {
  await connection();
  const id = await params.id;
  const user = await getUserById(id);

  if (!user) {
    notFound();
  }

  return <EditUserForm params={{ id }} user={user} />;
}
