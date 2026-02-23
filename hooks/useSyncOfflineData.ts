import { apiFetch, constructUrl, handleApiErrors } from "@/lib/api";
import { invalidateCache } from "@/lib/helpers";
import { mmkvStorage } from "@/lib/storage";
import { Client, ClientFormData } from "@/types/client";
import { ScreenClientFormData } from "@/types/screening";
import { useEffect, useMemo, useRef, useState } from "react";
import { useOfflineClients } from "./useClients";
import { useNetworkStatus } from "./useNetworkStatus";

type SyncItemError = {
  type: "client" | "screening";
  key: string;
  message: string;
};

type SyncProgress = {
  total: number;
  completed: number;
};

export const useSyncOfflineData = () => {
  const { isOnline } = useNetworkStatus();
  const { clients: offlineClients, setOfflineClients } = useOfflineClients();
  const [isSyncing, setIsSyncing] = useState(false);
  const [progress, setProgress] = useState<SyncProgress>({
    total: 0,
    completed: 0,
  });
  const [errors, setErrors] = useState<SyncItemError[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const hasInitialized = useRef(false);
  const [syncedClientsCount, setSyncedClientsCount] = useState(0);
  const [syncedScreeningsCount, setSyncedScreeningsCount] = useState(0);
  const [durationMs, setDurationMs] = useState<number | null>(null);

  const offlineScreeningsCount = useMemo(() => {
    return offlineClients.reduce((acc, c) => {
      const raw = mmkvStorage.getString(c.phoneNumber);
      const list: (ScreenClientFormData & { timeStamp: number })[] = raw
        ? JSON.parse(raw)
        : [];
      return acc + list.length;
    }, 0);
  }, [offlineClients]);

  const totalItemsToSync = useMemo(() => {
    return offlineClients.length + offlineScreeningsCount;
  }, [offlineClients.length, offlineScreeningsCount]);

  const [overlayVisible, setOverlayVisible] = useState(false);

  useEffect(() => {
    if (isOnline && totalItemsToSync > 0) {
      setOverlayVisible(true);
    }
  }, [isOnline, totalItemsToSync]);

  const acknowledgeOverlay = () => {
    setOverlayVisible(false);
  };

  useEffect(() => {
    // Reset completion state when we go offline or new items appear
    if (!isOnline) {
      setIsCompleted(false);
      setOverlayVisible(false);
    }
  }, [isOnline]);

  const updateProgress = () => {
    setProgress((p) => ({ ...p, completed: p.completed + 1 }));
  };

  const markCompleted = () => {
    setIsSyncing(false);
    setIsCompleted(true);
  };

  const startSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setErrors([]);
    setProgress({ total: totalItemsToSync, completed: 0 });
    setSyncedClientsCount(0);
    setSyncedScreeningsCount(0);
    const start = Date.now();
    try {
      // Sync clients one-by-one
      for (const c of offlineClients) {
        const clientId = await ensureClientOnline(c).catch((error) => {
          const msg = handleApiErrors(error).detail ?? "Failed to sync client";
          setErrors((e) => [
            ...e,
            { type: "client", key: c.phoneNumber, message: msg },
          ]);
          return null;
        });
        // If client synced/exists, remove it from offline cache
        if (clientId) {
          const remaining = offlineClients.filter(
            (oc) => oc.phoneNumber !== c.phoneNumber,
          );
          setOfflineClients(remaining);
          setSyncedClientsCount((n) => n + 1);
        }
        updateProgress();
        // Sync screenings tied to this client (keyed by phoneNumber)
        const screeningsRaw = mmkvStorage.getString(c.phoneNumber);
        const screenings: (ScreenClientFormData & { timeStamp: number })[] =
          screeningsRaw ? JSON.parse(screeningsRaw) : [];
        if (clientId && screenings.length) {
          for (let i = 0; i < screenings.length; i++) {
            const payload: ScreenClientFormData = {
              ...screenings[i],
              clientId, // replace offline clientId(phoneNumber) with real id
            };
            try {
              await apiFetch<Client>(constructUrl("/screenings"), {
                method: "POST",
                data: payload,
              });
              updateProgress();
              setSyncedScreeningsCount((n) => n + 1);
            } catch (error) {
              const msg =
                handleApiErrors(error).detail ?? "Failed to sync screening";
              setErrors((e) => [
                ...e,
                {
                  type: "screening",
                  key: `${c.phoneNumber}#${i}`,
                  message: msg,
                },
              ]);
            }
          }
          // Clear synced screenings for this client
          mmkvStorage.remove(c.phoneNumber);
        } else if (screenings.length) {
          // We had screenings but client failed to sync; keep them
          // progress update will be handled per attempted screening only when clientId exists
        }
      }
      // Invalidate caches so online views refresh after syncing
      invalidateCache();
    } finally {
      setDurationMs(Date.now() - start);
      markCompleted();
    }
  };

  const ensureClientOnline = async (data: ClientFormData): Promise<string> => {
    // Try to find client by phone number first
    const searchUrl = constructUrl("/clients", { search: data.phoneNumber });
    try {
      const searchResp = await apiFetch<{ results: Client[] }>(searchUrl);
      const existing = (searchResp.data?.results ?? []).find(
        (c) => c.phoneNumber === data.phoneNumber,
      );
      if (existing?.id) {
        return existing.id;
      }
    } catch {
      // ignore search errors, proceed to create
    }
    // Create client online
    const createResp = await apiFetch<Client>(constructUrl("/clients"), {
      method: "POST",
      data: {
        ...data,
        nationalId: data.nationalId ? data.nationalId : undefined,
      },
    });
    return createResp.data.id;
  };

  // Auto-start once when overlay appears after going online
  useEffect(() => {
    if (overlayVisible && !hasInitialized.current) {
      hasInitialized.current = true;
      startSync();
    }
    if (!overlayVisible) {
      hasInitialized.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overlayVisible]);

  return {
    shouldShowOverlay: overlayVisible,
    isSyncing,
    progress,
    errors,
    isCompleted,
    startSync,
    syncedClientsCount,
    syncedScreeningsCount,
    durationMs,
    acknowledgeOverlay,
  };
};
