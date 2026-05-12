import { apiFetch, APIFetchResponse, constructUrl } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { useMemo } from "react";
import useSWR from "swr";

export const flattenPermisionsObject = (
  permissions: Record<string, string[]>,
) => {
  return Object.entries(permissions)
    .sort(([a], [b]) => a.localeCompare(b)) // Sort resources
    .flatMap(
      ([resource, actions]) =>
        [...actions].sort().map((action) => `${resource}.${action}`), // Sort actions
    );
};

/**
 * System-level permission check hook (Server-side validation)
 *
 * Validates user permissions at the system level using the Better Auth admin plugin.
 * This performs server-side validation to ensure permissions cannot be bypassed by
 * client manipulation. Use this for security-critical checks.
 *
 * @param permissions - Object mapping resources to arrays of required actions
 *                      Example: { user: ['impersonate', 'delete'], category: ['create'] }
 *
 * @returns Object containing:
 *   - hasAccess: boolean - True if user has all specified system-level permissions
 *   - isLoading: boolean - True while the permission check is in progress
 *   - error: any - Error object if the request fails
 *   - mutate: function - SWR mutate function to manually revalidate
 *
 * @example
 * // Check if user can impersonate others (admin-only action)
 * const { hasAccess, isLoading } = useUserHasSystemAccess({
 *   user: ['impersonate']
 * });
 *
 * if (isLoading) return <Loader />;
 *
 * return (
 *   <>
 *     {hasAccess && <ImpersonateUserButton />}
 *   </>
 * );
 *
 * @example
 * // Check multiple system permissions
 * const { hasAccess: canManageSystem } = useUserHasSystemAccess({
 *   user: ['create', 'delete'],
 *   category: ['create', 'delete'],
 *   amenity: ['create', 'delete']
 * });
 *
 * @security
 * - This hook makes a server-side API call to validate permissions
 * - Always use this for security-critical operations (user impersonation, system config)
 * - System-level permissions are typically admin or superadmin only
 * - The backend MUST validate permissions before executing any operations
 *
 * @note
 * - Uses SWR for caching and automatic revalidation
 * - Permissions are checked against the user's system-level role (admin, user, etc.)
 * - Returns false by default if the API call fails or returns no data
 */
export const useUserHasSystemAccess = (
  permissions: Record<string, string[]>,
) => {
  // Optimization: Skip API call if permissions object is empty
  const hasPermissions = Object.keys(permissions).length > 0;
  const { data: userSession } = authClient.useSession();
  const _permission = useMemo(
    () => flattenPermisionsObject(permissions).join(","),
    [permissions],
  );
  const url = constructUrl(`/auth/admin/has-permission`, {
    permissions: _permission,
    user: userSession?.user?.id,
  });
  const { data, error, isLoading, mutate } = useSWR<
    APIFetchResponse<{ success: boolean }>
  >(
    // Only fetch if there are permissions to check
    hasPermissions ? url : null,
    (url_: string) => apiFetch(url_, { method: "POST", data: { permissions } }),
  );

  return {
    isLoading: hasPermissions ? isLoading : false,
    mutate,
    error: hasPermissions ? error : undefined,
    hasAccess: hasPermissions ? (data?.data?.success ?? false) : false,
  };
};
