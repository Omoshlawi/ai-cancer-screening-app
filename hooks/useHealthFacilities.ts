import { APIFetchResponse, constructUrl } from "@/lib/api";
import { HealthFacility } from "@/types/facilities";
import useSWR from "swr";

export const useHealthFacilities = (params: Record<string, string> = {}) => {
  const url = constructUrl("/health-facilities", params);
  const { data, error, isLoading } = useSWR<
    APIFetchResponse<{
      results: HealthFacility[];
    }>
  >(url);
  return {
    healthFacilities: data?.data?.results ?? [],
    error,
    isLoading,
  };
};
