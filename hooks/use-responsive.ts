import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const isTablet = width >= 768;
    const isLargeTablet = width >= 1100;
    const horizontalPadding = isLargeTablet ? 32 : isTablet ? 24 : 16;
    const contentMaxWidth = isLargeTablet ? 1180 : isTablet ? 920 : undefined;

    return {
      width,
      height,
      isTablet,
      isLargeTablet,
      horizontalPadding,
      contentMaxWidth,
    };
  }, [height, width]);
}
