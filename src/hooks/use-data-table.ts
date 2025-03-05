// src/hooks/use-data-table.ts
"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type VisibilityState,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

export type DataTableOptions<TData> = {
  columns: ColumnDef<TData>[];
  data: TData[];
  pageCount: number;
  initialPage?: number;
  initialPageSize?: number;
};

export function useDataTable<TData>({
  columns,
  data,
  pageCount,
  initialPage = 1,
  initialPageSize = 10,
}: DataTableOptions<TData>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Set up pagination
  const pagination = {
    pageIndex: initialPage - 1, // Convert to zero-based indexing
    pageSize: initialPageSize,
  };

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination,
      rowSelection,
      columnVisibility,
      columnFilters,
    },
    enableRowSelection: true,
    manualPagination: true,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newPagination = updater(pagination);

        // Create new URLSearchParams
        const params = new URLSearchParams(searchParams);
        params.set("page", String(newPagination.pageIndex + 1));
        params.set("size", String(newPagination.pageSize));

        // Update URL and trigger navigation
        router.push(`${pathname}?${params.toString()}`);
      } else {
        // Similar logic for direct value assignment
        const params = new URLSearchParams(searchParams);
        params.set("page", String(updater.pageIndex + 1));
        params.set("size", String(updater.pageSize));

        router.push(`${pathname}?${params.toString()}`);
      }
    },
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return { table };
}
