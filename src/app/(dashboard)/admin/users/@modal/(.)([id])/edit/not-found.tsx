import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export default function NotFoundModal() {
  const router = useRouter();

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Not Found</DialogTitle>
          <DialogDescription>
            The user you&apos;re trying to edit doesn&apos;t exist or has been
            deleted.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <Button onClick={() => router.back()}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
