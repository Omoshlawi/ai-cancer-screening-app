import { apiFetch, APIFetchResponse, mutate } from "@/lib/api";
import { constructUrl } from "@/lib/api/constructUrl";
import { Client, ClientFormData } from "@/types/client";
import { useState } from "react";
import useSWR from "swr";
import { useDebouncedValue } from "./useDebouncedValue";

export const useClients = () => {
  const url = constructUrl("/clients");
  const { data, error, isLoading } =
    useSWR<APIFetchResponse<{ results: Client[] }>>(url);
  return { clients: data?.data?.results ?? [], error, isLoading };
};

const createClient = async (data: ClientFormData) => {
  const url = constructUrl("/clients");
  const response = await apiFetch<Client>(url, {
    method: "POST",
    data: data,
  });
  mutate("/clients");
  return response.data;
};

const updateClient = async (id: string, data: Partial<ClientFormData>) => {
  const url = constructUrl(`/clients/${id}`);
  const response = await apiFetch<Client>(url, {
    method: "PUT",
    data: data,
  });
  mutate("/clients");
  return response.data;
};

const deleteClient = async (id: string) => {
  const url = constructUrl(`/clients/${id}`);
  const response = await apiFetch<Client>(url, {
    method: "DELETE",
  });
  mutate("/clients");
  return response.data;
};

export const useClient = (id?: string) => {
  const url = id ? constructUrl(`/clients/${id}`) : null;
  const { data, error, isLoading } = useSWR<APIFetchResponse<Client>>(url);
  return { client: data?.data, error, isLoading };
};

export const useClientApi = () => {
  return {
    createClient,
    updateClient,
    deleteClient,
  };
};

export const useSearchClients = () => {
  const [search, setSearch] = useState<string>("");
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
