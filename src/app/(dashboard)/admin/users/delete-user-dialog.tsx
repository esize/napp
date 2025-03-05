"use client";
import { toast } from "sonner";
import { SanitizedUser } from "@/db/schema";
import { deleteUser } from "@/actions/users";
import { useServerAction } from "zsa-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteUserDialogProps {
  open: boolean;
  user: SanitizedUser | null;
  onOpenChange: (open: boolean) => void;
  onUserDeleted: () => void;
}

export function DeleteUserDialog({
  open,
  user,
  onOpenChange,
  onUserDeleted,
}: DeleteUserDialogProps) {
  const { execute, isPending } = useServerAction(deleteUser);
  async function onDelete() {
    if (!user) return;

    try {
      const [, error] = await execute({
        id: user.id,
      });

      if (error) {
        toast.error("Failed to delete user");
        return;
      }

      toast.success("User deleted successfully");
      onOpenChange(false);
      onUserDeleted();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the user
            <span className="font-bold"> {user?.username}</span> and remove
            their data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} disabled={isPending}>
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
