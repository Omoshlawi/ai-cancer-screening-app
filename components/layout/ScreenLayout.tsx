import React, { FC } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AppBar from "../app-bar";
import { Box } from "../ui/box";
type ScreenLayoutProps = {
  title: string;
  children: React.ReactNode;
};
const ScreenLayout: FC<ScreenLayoutProps> = ({ title, children }) => {
  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <AppBar title={title} />
      <Box className="flex-1 bg-background-50 p-4">{children}</Box>
    </SafeAreaView>
  );
};

export default ScreenLayout;
