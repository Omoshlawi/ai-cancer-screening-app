import { Stack } from "expo-router";
import React from "react";

const SettingsLayout = () => {
  return (
    <Stack>
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
