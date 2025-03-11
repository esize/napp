import { getUserById } from "@/data";
import { notFound } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import EditUserForm from "../../../[id]/edit/form";

export default async function EditUserModal({
  params,
}: {
  params: { id: string };
}) {
  const user = await getUserById(params.id);

  if (!user) {
    notFound();
  }

  return (
    <Dialog open>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user details. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <EditUserForm params={params} user={user} />
      </DialogContent>
    </Dialog>
  );
}
