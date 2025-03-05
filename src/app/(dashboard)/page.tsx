import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container m-4">
      <h1>Welcome!</h1>
      <Button asChild>
        <Link href="/admin/users">Users list</Link>
      </Button>
    </div>
  );
}
