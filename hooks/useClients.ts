import { apiFetch, APIFetchResponse, APIListResponse } from "@/lib/api";
import { constructUrl } from "@/lib/api/constructUrl";
import { authClient } from "@/lib/auth-client";
import { OFFLINE_CLIENTS_KEY } from "@/lib/constants";
import { invalidateCache } from "@/lib/helpers";
import { Client, ClientFormData } from "@/types/client";
import { useMemo, useState } from "react";
import { useMMKVString } from "react-native-mmkv";
import useSWR from "swr";
import { useDebouncedValue } from "./useDebouncedValue";
import { useNetworkStatus } from "./useNetworkStatus";
import { useMergePaginationInfo } from "./usePagination";
export const useClients = (params: Record<string, string> = {}) => {
  const { data: userSession, isPending } = authClient.useSession();
  const { onPageChange, mergedSearchParams, showPagination } =
    useMergePaginationInfo({
      ...params,
      createdByUserId: (params.owner === "mine"
        ? userSession?.user.id
        : undefined) as string,
    });
  const url = constructUrl("/clients", mergedSearchParams);
  const { data, error, isLoading } =
    useSWR<APIFetchResponse<APIListResponse<Client>>>(url);
  const { results: clients = [], ...rest } =
    data?.data ?? ({} as APIListResponse<Client>);
  return {
    ...rest,
    clients,
    error,
    isLoading: isLoading || isPending,
    onPageChange,
    showPagination: showPagination(rest.totalCount),
  };
};

const createClient = async (data: ClientFormData) => {
  const url = constructUrl("/clients");
  const response = await apiFetch<Client>(url, {
    method: "POST",
    data: {
      ...data,
      nationalId: data.nationalId ? data.nationalId : undefined,
    },
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

export const useOfflineClients = () => {
  const [offlineClients = JSON.stringify([]), setOfflineClients] =
    useMMKVString(OFFLINE_CLIENTS_KEY);
  const clients = useMemo<ClientFormData[]>(
    () => JSON.parse(offlineClients) || [],
    [offlineClients],
  );
  return {
    clients,
    setOfflineClients: (clients: ClientFormData[]) => {
      setOfflineClients(JSON.stringify(clients));
    },
    addOfflineClient: (client: ClientFormData) => {
      setOfflineClients(JSON.stringify([...clients, client]));
    },
    updateOfflineClient: (phoneNumber: string, client: ClientFormData) => {
      const updatedClients = clients.map((c) =>
        c.phoneNumber === phoneNumber ? client : c,
      );
      setOfflineClients(JSON.stringify(updatedClients));
    },
    removeOfflineClient: (phoneNumber: string) => {
      setOfflineClients(
        JSON.stringify(clients.filter((c) => c.phoneNumber !== phoneNumber)),
      );
    },
  };
};
export const useOfflineClient = (phoneNumber: string) => {
  const { clients } = useOfflineClients();
  return useMemo(
    () => clients.find((c) => c.phoneNumber === phoneNumber),
    [clients, phoneNumber],
  );
};

export const useClientApi = () => {
  const { isOnline } = useNetworkStatus();
  const { addOfflineClient } = useOfflineClients();
  return {
    createClient: async (data: ClientFormData) => {
      try {
        if (isOnline) {
          const client = await createClient(data);
          return client;
        }
        addOfflineClient(data);
        return data;
      } catch (error) {
        addOfflineClient(data);
        throw error;
      }
    },
    updateClient,
    deleteClient,
  };
};

export const useSearchClients = (defaultSearch: string = "") => {
  const { isOnline } = useNetworkStatus();
  const { clients: offlineClients } = useOfflineClients();
  const [search, setSearch] = useState<string>(defaultSearch);
  const [debounced] = useDebouncedValue(search, 500);
  const url = constructUrl("/clients", { search: debounced });
  const { data, error, isLoading } = useSWR<
    APIFetchResponse<{ results: Client[] }>
  >(debounced ? url : undefined);

  const clients = useMemo(() => {
    if (isOnline) {
      return data?.data?.results ?? [];
    }
    return offlineClients.filter((c) => {
      const name = `${c.firstName} ${c.lastName}`.toLowerCase();
      return (
        name.includes(search.toLowerCase()) ||
        c.phoneNumber.includes(search.toLowerCase())
      );
    });
  }, [data?.data?.results, isOnline, offlineClients, search]);
  return {
    clients,
    isLoading,
    error,
    onSearchChange: setSearch,
    searchValue: search,
  };
};
