import { apiFetch, APIFetchResponse, constructUrl } from "@/lib/api";
import useSWR from "swr";
import { useNetworkStatus } from "./useNetworkStatus";

export interface Address {
  id: string;
  country: string;
  level: number;
  parentId?: string;
  code: string;
  name: string;
  nameLocal?: string;
  voided: boolean;
}

type SearchProps = {
  level?: 1 | 2 | 3;
  parentName?: string;
};
export const useAddressHierarchy = (params: SearchProps = {}) => {
  const url = constructUrl("/address-hierarchy", { limit: 100, ...params });
  const { data, error, isLoading } =
    useSWR<APIFetchResponse<{ results: Address[]; totalCount: number }>>(url);
  return {
    addresses: data?.data?.results ?? [],
    error,
    isLoading,
    count: data?.data?.totalCount ?? 0,
  };
};

interface County {
  code: string;
  name: string;
  subCounties?: SubCounty[];
}

interface SubCounty {
  code: string;
  name: string;
  wards?: Ward[];
}

interface Ward {
  code: string;
  name: string;
}

export const useAddressHierarchyWithOfflineSupport = (
  params: SearchProps = {},
) => {
  const { isOnline } = useNetworkStatus();

  // We include isOnline in the constructUrl to ensure SWR re-fetches when network status changes
  const url = constructUrl("/address-hierarchy", {
    limit: 100,
    ...params,
    isOnline: isOnline ? "true" : "false",
  });

  const fetcher = async () => {
    if (isOnline) {
      return apiFetch<{ results: Address[]; totalCount: number }>(url);
    }

    // --- OFFLINE MODE ---
    const locations: County[] = require("../assets/data/locations.json");
    let results: Address[] = [];

    const targetLevel = params.level || 1;
    const filterParent = params.parentName?.toLowerCase();

    // Level 1: Counties
    if (targetLevel === 1) {
      locations.forEach((county) => {
        results.push({
          id: county.code,
          country: "Kenya", // Or your default country code
          level: 1,
          code: county.code,
          name: county.name,
          voided: false,
        });
      });
    }
    // Level 2: Sub-Counties
    else if (targetLevel === 2) {
      locations.forEach((county) => {
        // Filter by parentName (County name) if provided
        if (!filterParent || county.name.toLowerCase() === filterParent) {
          county.subCounties?.forEach((sub) => {
            results.push({
              id: sub.code,
              country: "Kenya",
              level: 2,
              parentId: county.code,
              code: sub.code,
              name: sub.name,
              voided: false,
            });
          });
        }
      });
    }
    // Level 3: Wards
    else if (targetLevel === 3) {
      locations.forEach((county) => {
        county.subCounties?.forEach((sub) => {
          // Filter by parentName (Sub-County name) if provided
          if (!filterParent || sub.name.toLowerCase() === filterParent) {
            sub.wards?.forEach((ward) => {
              results.push({
                id: ward.code,
                country: "Kenya",
                level: 3,
                parentId: sub.code,
                code: ward.code,
                name: ward.name,
                voided: false,
              });
            });
          }
        });
      });
    }

    // Apply the limit parameter (defaulting to 100 as per your constructUrl)
    const limitedResults = results.slice(0, 100);

    // Return in the exact shape that the online apiFetch wrapper returns
    // Assuming APIFetchResponse resolves to { data: { results, totalCount } }
    return {
      data: {
        results: limitedResults,
        totalCount: results.length, // return the total count before the limit was applied
      },
    } as APIFetchResponse<{ results: Address[]; totalCount: number }>;
  };

  const { data, error, isLoading } = useSWR(url, fetcher);

  return {
    addresses: data?.data?.results ?? [],
    error,
    isLoading,
    count: data?.data?.totalCount ?? 0,
  };
};
