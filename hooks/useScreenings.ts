import { apiFetch, APIFetchResponse, constructUrl } from "@/lib/api";
import { invalidateCache } from "@/lib/helpers";
import { ScreenClientFormData, Screening } from "@/types/screening";
import useSWR from "swr";

const createScreening = async (data: ScreenClientFormData) => {
  const url = constructUrl("/screenings");
  const response = await apiFetch<Screening>(url, {
    method: "POST",
    data: data,
  });
  invalidateCache();
  return response.data;
};

const updateScreening = async (
  id: string,
  data: Partial<ScreenClientFormData>
) => {
  const url = constructUrl(`/screenings/${id}`);
  const response = await apiFetch<Screening>(url, {
    method: "PUT",
    data: data,
  });
  invalidateCache();
  return response.data;
};

const deleteScreening = async (id: string) => {
  const url = constructUrl(`/screenings/${id}`);
  const response = await apiFetch<Screening>(url, {
    method: "DELETE",
  });
  invalidateCache();  
  return response.data;
};

export const useScreenings = (params: Record<string, string> = {}) => {
  const url = constructUrl("/screenings", params);
  const { data, error, isLoading } =
    useSWR<APIFetchResponse<{ results: Screening[]; totalCount: number }>>(url);
  return {
    screenings: data?.data?.results ?? [],
    error,
    isLoading,
    count: data?.data?.totalCount ?? 0,
  };
};

export const useScreening = (id?: string) => {
  const url = id ? constructUrl(`/screenings/${id}`) : null;
  const { data, error, isLoading } = useSWR<APIFetchResponse<Screening>>(url);
  return { screening: data?.data, error, isLoading };
};

export const useScreeningsApi = () => {
  return {
    createScreening,
    updateScreening,
    deleteScreening,
  };
};
