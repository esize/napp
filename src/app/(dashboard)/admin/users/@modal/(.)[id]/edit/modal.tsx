// In src/app/(dashboard)/admin/users/@modal/(.)([id])/edit/modal.tsx
"use client";

import { notFound, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../../../../../components/ui/dialog";
import EditUserForm from "../../../[id]/edit/form";
import { SanitizedUser } from "../../../../../../../db/schema";
import React from "react";

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
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
    >
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
