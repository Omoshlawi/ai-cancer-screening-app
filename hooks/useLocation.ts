import * as Location from "expo-location";
import { useCallback, useEffect, useRef, useState } from "react";

type Coordinates = {
  latitude: number;
  longitude: number;
};

const LOCATION_MAX_AGE_MS = 30 * 60 * 1000; // 30 min — accept cached fix up to this old
const LOCATION_TIMEOUT_MS = 15_000; // 15 s — give up on fresh GPS after this

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

      // Phase 1: use last known position immediately — works offline with a warm cache
      const lastKnown = await Location.getLastKnownPositionAsync({
        maxAge: LOCATION_MAX_AGE_MS,
      });
      if (lastKnown && isMountedRef.current) {
        setCoordinates({
          latitude: lastKnown.coords.latitude,
          longitude: lastKnown.coords.longitude,
        });
        setIsLoading(false); // unblock the form right away
      }

      // Phase 2: attempt a fresh GPS fix with a timeout; silently updates if Phase 1 succeeded
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), LOCATION_TIMEOUT_MS)
      );
      const fresh = await Promise.race([
        Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
        timeoutPromise,
      ]);

      if (isMountedRef.current) {
        setCoordinates({
          latitude: fresh.coords.latitude,
          longitude: fresh.coords.longitude,
        });
      }
    } catch (err) {
      if (!isMountedRef.current) return;

      // Only surface an error if we have no coordinates at all (Phase 1 also failed)
      setCoordinates((prev) => {
        if (prev) return prev;
        const message =
          err instanceof Error && err.message !== "timeout"
            ? err.message
            : "Unable to capture your location. Please try again.";
        setError(message);
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
