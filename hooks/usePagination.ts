import { useCallback } from "react";
import { useSearchParamsExtended } from "./useSearchParams";

type UsePaginationOptions = {
  defaultLimit?: number;
  defaultPage?: number;
};

export const usePagination = (options?: UsePaginationOptions) => {
  const { defaultLimit = 10, defaultPage = 1 } = options ?? {};
  const { searchParams, updateParams } = useSearchParamsExtended();
  const limit = searchParams?.get("limit") ?? `${defaultLimit}`;
  const page = searchParams?.get("page") ?? `${defaultPage}`;

  const showPagination = useCallback(
    (totalCount: number = 0) => {
      const _limit = Number(limit);
      return totalCount >= _limit;
    },
    [limit]
  );
  return {
    limit,
    page,
    onPageChange: (page: number) => updateParams({ page: `${page}` }),
    showPagination,
  };
};

export const useMergePaginationInfo = (
  params: Record<string, string> = {},
  options?: UsePaginationOptions
) => {
  const { limit, onPageChange, page, showPagination } = usePagination(options);
  const mergedParams = { ...params, limit: String(limit), page: String(page) };

  return {
    mergedSearchParams: mergedParams as Record<string, string>,
    onPageChange,
    showPagination,
  };
};
