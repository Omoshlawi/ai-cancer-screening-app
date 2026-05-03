import React, { FC } from "react";
import { useResponsive } from "@/hooks/use-responsive";
import AppBar from "../app-bar";
import { Box } from "../ui/box";
import SafeAreaScreen from "./SafeAreaScreen";
type ScreenLayoutProps = {
  title: string;
  children: React.ReactNode;
};
const ScreenLayout: FC<ScreenLayoutProps> = ({ title, children }) => {
  const { contentMaxWidth, horizontalPadding } = useResponsive();

  return (
    <SafeAreaScreen mode="lib">
      <AppBar title={title} />
      <Box
        className="flex-1 bg-background-50 w-full self-center"
        style={{
          maxWidth: contentMaxWidth,
          paddingHorizontal: horizontalPadding,
          paddingVertical: horizontalPadding,
        }}
      >
        {children}
      </Box>
    </SafeAreaScreen>
  );
};

export default ScreenLayout;
