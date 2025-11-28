import { apiFetch, APIFetchResponse, constructUrl, mutate } from "@/lib/api";
import { ScreenClientFormData, Screening } from "@/types/screening";
import useSWR from "swr";

const createScreening = async (data: ScreenClientFormData) => {
  const url = constructUrl("/screenings");
  const response = await apiFetch<Screening>(url, {
    method: "POST",
    data: data,
  });
  mutate("/screenings");
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
  mutate("/screenings");
  return response.data;
};

const deleteScreening = async (id: string) => {
  const url = constructUrl(`/screenings/${id}`);
  const response = await apiFetch<Screening>(url, {
    method: "DELETE",
  });
  mutate("/screenings");
  return response.data;
};

export const useScreenings = (params: Record<string, string> = {}) => {
  const url = constructUrl("/screenings", params);
  const { data, error, isLoading } =
    useSWR<APIFetchResponse<{ results: Screening[] }>>(url);
  return { screenings: data?.data?.results ?? [], error, isLoading };
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
