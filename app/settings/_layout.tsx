import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Stack } from "expo-router";
import React from "react";

const SettingsLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        title: "Settings",
        headerBackground: () => (
          <Box className="bg-background-0 w-full h-full" />
        ),
        headerTitle: ({ children }) => (
          <Heading className={"text-typography-500"} size="xl">
            {children}
          </Heading>
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{ headerShown: true, title: "Settings" }}
      />
      <Stack.Screen
        name="change-password"
        options={{ headerShown: true, title: "Change Password" }}
      />
    </Stack>
  );
};

export default SettingsLayout;
