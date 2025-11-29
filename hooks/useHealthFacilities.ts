import { APIFetchResponse, constructUrl } from "@/lib/api";
import { APIListResponse } from "@/lib/api/types";
import { HealthFacility } from "@/types/facilities";
import useSWR from "swr";

export const useHealthFacilities = (params: Record<string, string> = {}) => {
  // Build query params - only include non-empty values
  const queryParams: Record<string, string> = {};

  if (params.search && params.search.trim()) {
    queryParams.search = params.search.trim();
  }

  if (params.typeId && params.typeId !== "all") {
    queryParams.typeId = params.typeId;
  }

  if (params.page) {
    queryParams.page = params.page;
  }

  if (params.limit) {
    queryParams.limit = params.limit;
  }

  const url = constructUrl("/health-facilities", queryParams);
  const { data, error, isLoading } =
    useSWR<APIFetchResponse<APIListResponse<HealthFacility>>>(url);

  return {
    healthFacilities: data?.data?.results ?? [],
    totalCount: data?.data?.totalCount ?? 0,
    error,
    isLoading,
  };
};
