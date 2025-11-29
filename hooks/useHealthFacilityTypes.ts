import { APIFetchResponse, constructUrl } from "@/lib/api";
import { APIListResponse } from "@/lib/api/types";
import { HealthFacilityType } from "@/types/facilities";
import useSWR from "swr";

export const useHealthFacilityTypes = () => {
  const url = constructUrl("/health-facility-types");
  const { data, error, isLoading } = useSWR<
    APIFetchResponse<APIListResponse<HealthFacilityType>>
  >(url);

  return {
    facilityTypes: data?.data?.results ?? [],
    error,
    isLoading,
  };
};

