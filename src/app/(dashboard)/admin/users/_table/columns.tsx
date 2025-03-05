"use client";

import { ColumnDef } from "@tanstack/react-table";

import { type SanitizedUser } from "@/db/schema";

export const columns: ColumnDef<SanitizedUser>[] = [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "isActive",
    header: "Is Active?",
  },
  {
    accessorKey: "isLocked",
    header: "Is Locked?",
  },
  {
    accessorKey: "lastLogin",
    header: "Last Login",
  },
];
