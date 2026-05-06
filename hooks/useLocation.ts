import * as Location from "expo-location";
import { useCallback, useEffect, useRef, useState } from "react";
import { LAST_KNOWN_LOCATION_KEY } from "@/lib/constants";
import { mmkvStorage } from "@/lib/storage";

type Coordinates = {
  latitude: number;
  longitude: number;
};

// Wait this long for a warm GPS fix before falling back to cached sources
const QUICK_TIMEOUT_MS = 10_000;
// Maximum total time to wait for GPS (background phase after falling back)
const TOTAL_TIMEOUT_MS = 60_000;

export const useLocation = () => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const captureLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== Location.PermissionStatus.GRANTED) {
        throw new Error("Location permission is required to proceed.");
      }

      // Start fresh GPS immediately — most accurate, keep reference for background wait
      const freshGpsPromise = Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Phase 1: quick GPS fix (warm GPS resolves within 10 s)
      const quickFix = await Promise.race([
        freshGpsPromise.then((p) => p).catch(() => null),
        new Promise<null>((resolve) =>
          setTimeout(() => resolve(null), QUICK_TIMEOUT_MS)
        ),
      ]);

      if (quickFix) {
        if (isMountedRef.current) {
          const coords = {
            latitude: quickFix.coords.latitude,
            longitude: quickFix.coords.longitude,
          };
          setCoordinates(coords);
          mmkvStorage.set(LAST_KNOWN_LOCATION_KEY, JSON.stringify(coords));
          setIsLoading(false);
        }
        return;
      }

      // Phase 2: OS-level last known position — works offline, no age limit
      const lastKnown = await Location.getLastKnownPositionAsync();
      if (lastKnown && isMountedRef.current) {
        setCoordinates({
          latitude: lastKnown.coords.latitude,
          longitude: lastKnown.coords.longitude,
        });
        setIsLoading(false);
      }

      // Phase 3: our own persisted cache — survives long offline periods
      if (!lastKnown) {
        const persisted = mmkvStorage.getString(LAST_KNOWN_LOCATION_KEY);
        if (persisted && isMountedRef.current) {
          const cached = JSON.parse(persisted) as Coordinates;
          setCoordinates(cached);
          setIsLoading(false);
        }
      }

      // Background: keep waiting for fresh GPS to resolve and silently update
      try {
        const eventual = await Promise.race([
          freshGpsPromise,
          new Promise<never>((_, reject) =>
            setTimeout(
              () => reject(new Error("timeout")),
              TOTAL_TIMEOUT_MS - QUICK_TIMEOUT_MS
            )
          ),
        ]);
        if (isMountedRef.current) {
          const coords = {
            latitude: eventual.coords.latitude,
            longitude: eventual.coords.longitude,
          };
          setCoordinates(coords);
          mmkvStorage.set(LAST_KNOWN_LOCATION_KEY, JSON.stringify(coords));
          setError(null);
        }
      } catch {
        // GPS did not resolve within total timeout — fallback coords already set (or not)
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      setCoordinates((prev) => {
        if (prev) return prev;
        setError(
          err instanceof Error
            ? err.message
            : "Unable to capture your location. Please try again."
        );
        return null;
      });
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    captureLocation();
  }, [captureLocation]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    coordinates,
    isLoading,
    error,
    retry: captureLocation,
  };
};

export type UseLocatioReturn = ReturnType<typeof useLocation>;
