import { authClient } from "@/lib/auth-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useNetworkStatus } from "./useNetworkStatus";

const SESSION_STORAGE_KEY = "@auth_session";

export const useSessionWithOfflineSupport = () => {
  const { isOnline } = useNetworkStatus();
  const session = authClient.useSession();

  const [offlineSession, setOfflineSession] = useState(null);
  const [isOfflinePending, setIsOfflinePending] = useState(true);

  // 1. Persist the session to AsyncStorage when online
  useEffect(() => {
    const persistSession = async () => {
      // Only attempt to persist when online and the session has finished loading
      if (isOnline && !session.isPending) {
        try {
          if (session.data) {
            // Save active session
            await AsyncStorage.setItem(
              SESSION_STORAGE_KEY,
              JSON.stringify(session.data),
            );
          } else {
            // If session.data is null (e.g., user logged out), clear storage
            await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
          }
        } catch (error) {
          console.error("Failed to persist auth session:", error);
        }
      }
    };

    persistSession();
  }, [isOnline, session.data, session.isPending]);

  // 2. Retrieve the session from AsyncStorage when offline
  useEffect(() => {
    const loadOfflineSession = async () => {
      if (!isOnline) {
        setIsOfflinePending(true);
        try {
          const storedSession = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
          if (storedSession) {
            setOfflineSession(JSON.parse(storedSession));
          } else {
            setOfflineSession(null);
          }
        } catch (error) {
          console.error("Failed to load offline auth session:", error);
          setOfflineSession(null);
        } finally {
          setIsOfflinePending(false);
        }
      }
    };

    loadOfflineSession();
  }, [isOnline]);

  // 3. Return the correct session object based on network state
  if (isOnline) {
    return session;
  }

  // Mimic the better-auth return signature for offline mode
  return {
    data: offlineSession,
    isPending: isOfflinePending,
    error: null, // You can add a specific offline error object here if needed
  };
};
