import { parseAsFloat, createSearchParamsCache } from "nuqs/server";

// Describe your search params, and reuse this in useQueryStates / createSerializer:
export const paginationSearchParams = {
  pageIndex: parseAsFloat.withDefault(1),
  pageSize: parseAsFloat.withDefault(25),
};

export const searchParamsCache = createSearchParamsCache(
  paginationSearchParams
);
