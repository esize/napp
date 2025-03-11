import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <h2 className="mb-4 text-2xl font-bold">User Not Found</h2>
      <p className="mb-6 text-muted-foreground">
        The user you&apos;re trying to edit doesn&apos;t exist or has been
        deleted.
      </p>
      <Button asChild>
        <Link href="/admin/users">Return to Users List</Link>
      </Button>
    </div>
  );
}
