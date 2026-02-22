import { APIFetchResponse, APIListResponse, constructUrl } from "@/lib/api";
import { Activity } from "@/types/users";
import useSWR from "swr";
import { useMergePaginationInfo } from "./usePagination";
import { useSessionWithOfflineSupport } from "./useSessionWithOfflineSupport";

export const useActivities = (params: Record<string, string> = {}) => {
  const { data: userSession, isPending } = useSessionWithOfflineSupport();
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
