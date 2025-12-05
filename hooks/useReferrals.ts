import { APIFetchResponse, constructUrl } from "@/lib/api";
import { Referral } from "@/types/screening";
import useSWR from "swr";

export const useReferrals = (params: Record<string, string> = {}) => {
  const url = constructUrl("/referrals", params);
  const { data, error, isLoading } =
    useSWR<APIFetchResponse<{ results: Referral[] }>>(url);
  return { referrals: data?.data?.results ?? [], error, isLoading };
};

export const useReferral = (id?: string) => {
  const url = id ? constructUrl(`/referrals/${id}`) : null;
  const { data, error, isLoading } = useSWR<APIFetchResponse<Referral>>(url);
  return { referral: data?.data, error, isLoading };
};
