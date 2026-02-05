import { APIFetchResponse, APIListResponse, constructUrl } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { Activity } from "@/types/users";
import useSWR from "swr";
import { useMergePaginationInfo } from "./usePagination";

export const useActivities = (params: Record<string, string> = {}) => {
  const { data: userSession, isPending } = authClient.useSession();
  const { onPageChange, mergedSearchParams, showPagination } =
    useMergePaginationInfo({
      ...params,
      userId: userSession?.user.id as string,
    });
  const url = constructUrl("/activities", mergedSearchParams);
  const { data, error, isLoading } =
    useSWR<APIFetchResponse<APIListResponse<Activity>>>(url);
  const { results: activities = [], ...rest } =
    data?.data ?? ({} as APIListResponse<Activity>);
  return {
    ...rest,
    activities,
    error,
    isLoading: isLoading || isPending,
    onPageChange,
    showPagination: showPagination(rest.totalCount),
  };
};
