// src/app/(dashboard)/admin/users/page.tsx
import { Suspense } from "react";
import { getUsers } from "@/data";
import { UsersTable } from "./users-table";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: { page?: string; size?: string };
}) {
  // Parse pagination parameters from URL
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const pageSize = searchParams.size ? parseInt(searchParams.size) : 10;

  // Fetch users data with pagination
  const { users, pageCount } = await getUsers({
    page,
    pageSize,
  });

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight mb-4">Users</h1>
      <p className="text-muted-foreground mb-8">
        Manage user accounts and permissions.
      </p>

      <Suspense fallback={<div>Loading users...</div>}>
        <UsersTable
          initialUsers={users}
          initialPageCount={pageCount}
          initialPage={page}
          initialPageSize={pageSize}
        />
      </Suspense>
    </>
  );
}
