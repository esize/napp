"use client";

import { notFound, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import EditUserForm from "../../../[id]/edit/form";
import { SanitizedUser } from "@/db/schema";

export default function EditUserModal({
  params,
  user,
}: {
  params: { id: string };
  user: SanitizedUser;
}) {
  const router = useRouter();

  if (!user) {
    notFound();
  }

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user details. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <EditUserForm
          params={params}
          user={user}
          onSuccess={() => router.back()}
        />
      </DialogContent>
    </Dialog>
  );
}
