import { APIFetchResponse } from "@/lib/api";
import { constructUrl } from "@/lib/api/constructUrl";
import { Client } from "@/types/client";
import useSWR from "swr";

const useClients = () => {
  const url = constructUrl("/clients");
  const { data, error, isLoading } =
    useSWR<APIFetchResponse<{ results: Client[] }>>(url);
  return { clients: data?.data?.results ?? [], error, isLoading };
};

export default useClients;
