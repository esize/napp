import { DataTable } from "@/components/ui/data-table";
import { getUsers } from "@/data";
import { columns } from "./_table/columns";

import type { SearchParams } from "nuqs/server";
import { searchParamsCache } from "./_table/search-params";
import React from "react";

type PageProps = {
  searchParams: Promise<SearchParams>;
};
export default async function UsersPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const { pageIndex, pageSize } = await searchParamsCache.parse(searchParams);

  const { users, userCount } = await getUsers({ pageSize, pageIndex });
  console.log({ pageIndex, pageSize, users });

  return (
    <div className="container mx-auto py-10">
      <React.Suspense>
        <DataTable columns={columns} data={users} rowCount={userCount} />
      </React.Suspense>
    </div>
  );
}
