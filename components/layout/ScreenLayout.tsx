import React, { FC } from "react";
import AppBar from "../app-bar";
import { Box } from "../ui/box";
import SafeAreaScreen from "./SafeAreaScreen";
type ScreenLayoutProps = {
  title: string;
  children: React.ReactNode;
};
const ScreenLayout: FC<ScreenLayoutProps> = ({ title, children }) => {
  return (
    <SafeAreaScreen mode="lib">
      <AppBar title={title} />
      <Box className="flex-1 bg-background-50 p-4">{children}</Box>
    </SafeAreaScreen>
  );
};

export default ScreenLayout;
