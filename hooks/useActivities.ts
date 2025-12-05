import { APIFetchResponse, constructUrl } from "@/lib/api";
import { Activity } from "@/types/users";
import useSWR from "swr";

export const useActivities = (params: Record<string, string> = {}) => {
  const url = constructUrl("/activities", params);
  const { data, error, isLoading } =
    useSWR<APIFetchResponse<{ results: Activity[]; totalCount: number }>>(url);
  return {
    activities: data?.data?.results ?? [],
    error,
    isLoading,
    count: data?.data?.totalCount ?? 0,
  };
};
