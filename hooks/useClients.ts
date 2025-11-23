import { apiFetch, APIFetchResponse } from "@/lib/api";
import { constructUrl } from "@/lib/api/constructUrl";
import { Client, ClientFormData } from "@/types/client";
import useSWR from "swr";

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
  return response.data;
};

const updateClient = async (id: string, data: Partial<ClientFormData>) => {
  const url = constructUrl(`/clients/${id}`);
  const response = await apiFetch<Client>(url, {
    method: "PUT",
    data: data,
  });
  return response.data;
};

const deleteClient = async (id: string) => {
  const url = constructUrl(`/clients/${id}`);
  const response = await apiFetch<Client>(url, {
    method: "DELETE",
  });
  return response.data;
};

export const useClient = (id?: string) => {
  const url = id ? constructUrl(`/clients/${id}`) : null;
  const { data, error, isLoading } = useSWR<APIFetchResponse<Client>>(url);
  return { client: data?.data ?? null, error, isLoading };
};

export const useClientApi = () => {
  return {
    createClient,
    updateClient,
    deleteClient,
  };
};
