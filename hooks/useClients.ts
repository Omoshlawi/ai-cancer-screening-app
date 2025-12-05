import { apiFetch, APIFetchResponse } from "@/lib/api";
import { constructUrl } from "@/lib/api/constructUrl";
import { invalidateCache } from "@/lib/helpers";
import { Client, ClientFormData } from "@/types/client";
import { Referral, ReferralFormData } from "@/types/screening";
import { useState } from "react";
import useSWR from "swr";
import { useDebouncedValue } from "./useDebouncedValue";

export const useClients = (params: Record<string, string> = {}) => {
  const url = constructUrl("/clients", params);
  const { data, error, isLoading } =
    useSWR<APIFetchResponse<{ results: Client[]; totalCount: number }>>(url);
  return {
    clients: data?.data?.results ?? [],
    error,
    isLoading,
    count: data?.data?.totalCount ?? 0,
  };
};

const createClient = async (data: ClientFormData) => {
  const url = constructUrl("/clients");
  const response = await apiFetch<Client>(url, {
    method: "POST",
    data: data,
  });

  invalidateCache();
  return response.data;
};

const updateClient = async (id: string, data: Partial<ClientFormData>) => {
  const url = constructUrl(`/clients/${id}`);
  const response = await apiFetch<Client>(url, {
    method: "PUT",
    data: data,
  });
  invalidateCache();
  return response.data;
};

const deleteClient = async (id: string) => {
  const url = constructUrl(`/clients/${id}`);
  const response = await apiFetch<Client>(url, {
    method: "DELETE",
  });
  invalidateCache();
  return response.data;
};

export const useClient = (id?: string) => {
  const url = id ? constructUrl(`/clients/${id}`) : null;
  const { data, error, isLoading } = useSWR<APIFetchResponse<Client>>(url);
  return { client: data?.data, error, isLoading };
};

export const referClient = async (data: ReferralFormData) => {
  const url = constructUrl("/referrals");
  const response = await apiFetch<Referral>(url, {
    method: "POST",
    data: data,
  });
  invalidateCache();
  return response.data;
};

export const useClientApi = () => {
  return {
    createClient,
    updateClient,
    deleteClient,
    referClient,
  };
};

export const useSearchClients = (defaultSearch: string = "") => {
  const [search, setSearch] = useState<string>(defaultSearch);
  const [debounced] = useDebouncedValue(search, 500);
  const url = constructUrl("/clients", { search: debounced });
  const { data, error, isLoading } = useSWR<
    APIFetchResponse<{ results: Client[] }>
  >(debounced ? url : undefined);
  return {
    clients: data?.data?.results ?? [],
    isLoading,
    error,
    onSearchChange: setSearch,
    searchValue: search,
  };
};
