import { apiFetch, APIFetchResponse, constructUrl, mutate } from "@/lib/api";
import {
  CancelFollowUpFormData,
  FollowUp,
  FollowUpFormData,
  OutreachAction,
  OutreachActionFormData,
  UpdateFollowUpFormData,
} from "@/types/follow-up";
import useSWR from "swr";

export const useFollowUp = () => {
  const url = constructUrl("/follow-up");
  const { data, error, isLoading } =
    useSWR<APIFetchResponse<{ results: FollowUp[] }>>(url);
  return {
    followUps: data?.data?.results ?? [],
    isLoading,
    error,
  };
};

const createFollowUp = async (data: FollowUpFormData) => {
  const res = await apiFetch<FollowUp>("/follow-up", {
    method: "POST",
    data: data,
  });
  mutate("/follow-up");
  return res.data;
};

const updateFollowUp = async (id: string, data: UpdateFollowUpFormData) => {
  const res = await apiFetch<FollowUp>(`/follow-up/${id}`, {
    method: "PUT",
    data,
  });
  mutate("/follow-up");
  return res.data;
};

const createFollowUpOutreachAction = async (
  followUpId: string,
  data: OutreachActionFormData
) => {
  const res = await apiFetch<OutreachAction>(
    `follow-up/${followUpId}/outreach-action`,
    {
      method: "POST",
      data,
    }
  );
  mutate("/follow-up");
  return res.data;
};

const cancelFollowUp = async (id: string, data: CancelFollowUpFormData) => {
  const res = await apiFetch<FollowUp>(`/follow-up/${id}/cancel`, {
    method: "POST",
    data,
  });
  mutate("/follow-up");
  return res.data;
};

export const useFollowUpApi = () => {
  return {
    createFollowUp,
    updateFollowUp,
    createFollowUpOutreachAction,
    cancelFollowUp,
  };
};
