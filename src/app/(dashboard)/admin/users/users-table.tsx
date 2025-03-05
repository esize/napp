// src/app/(dashboard)/admin/users/users-table.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SanitizedUser } from "@/db/schema";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { useDataTable } from "@/hooks/use-data-table";
import { columns, UserAction } from "./columns";
import { UserSheet } from "./user-sheet";
import { DeleteUserDialog } from "./delete-user-dialog";
import { getUsersAction } from "@/actions/users";
import { useServerAction } from "zsa-react";

interface UsersTableProps {
  initialUsers: SanitizedUser[];
  initialPageCount: number;
  initialPage: number;
  initialPageSize: number;
}

export function UsersTable({
  initialUsers,
  initialPageCount,
  initialPage,
  initialPageSize,
}: UsersTableProps) {
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<SanitizedUser[]>(initialUsers);
  const [pageCount, setPageCount] = useState(initialPageCount);
  const [userAction, setUserAction] = useState<UserAction | null>(null);

  // Use server action for fetching users
  const { execute: fetchUsers } = useServerAction(getUsersAction);

  // This effect will run when search params change
  useEffect(() => {
    const page = Number(searchParams.get("page") || initialPage);
    const pageSize = Number(searchParams.get("size") || initialPageSize);

    // Fetch users with new pagination parameters
    const loadUsers = async () => {
      try {
        const [result, error] = await fetchUsers({ page, pageSize });

        if (error) {
          console.error("Error fetching users:", error);
          return;
        }

        if (result) {
          setUsers(result.users);
          setPageCount(result.pageCount);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    loadUsers();
  }, [searchParams, fetchUsers, initialPage, initialPageSize]);

  // For optimistic updates
  const handleUserSaved = useCallback(() => {
    if (userAction?.type === "edit" && userAction.user) {
      // After an edit, refresh the current page
      const page = Number(searchParams.get("page") || initialPage);
      const pageSize = Number(searchParams.get("size") || initialPageSize);
      fetchUsers({ page, pageSize });
    }
  }, [userAction, fetchUsers, searchParams, initialPage, initialPageSize]);

  // For optimistic deletion
  const handleUserDeleted = useCallback(() => {
    if (userAction?.type === "delete" && userAction.user) {
      // After a delete, refresh the current page
      const page = Number(searchParams.get("page") || initialPage);
      const pageSize = Number(searchParams.get("size") || initialPageSize);
      fetchUsers({ page, pageSize });
    }
  }, [userAction, fetchUsers, searchParams, initialPage, initialPageSize]);

  // Set up columns with action handlers
  const tableColumns = columns((action) => setUserAction(action));

  // Use the custom hook for data table
  const { table } = useDataTable({
    columns: tableColumns,
    data: users,
    pageCount: pageCount,
    initialPage: Number(searchParams.get("page") || initialPage),
    initialPageSize: Number(searchParams.get("size") || initialPageSize),
  });

  return (
    <div>
      <DataTable table={table} />
      <DataTablePagination table={table} />

      {/* Edit User Sheet */}
      <UserSheet
        open={userAction?.type === "edit"}
        user={userAction?.type === "edit" ? userAction.user : null}
        onOpenChange={(open) => !open && setUserAction(null)}
        onUserSaved={handleUserSaved}
      />

      {/* Delete User Dialog */}
      <DeleteUserDialog
        open={userAction?.type === "delete"}
        user={userAction?.type === "delete" ? userAction.user : null}
        onOpenChange={(open) => !open && setUserAction(null)}
        onUserDeleted={handleUserDeleted}
      />
    </div>
  );
}
