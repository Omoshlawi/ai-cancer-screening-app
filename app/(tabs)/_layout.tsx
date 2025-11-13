import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { Home, Hospital } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "teal",
        tabBarButton: HapticTab,
        tabBarLabel: ({ focused, children }) => (
          <Text
            className={cn(focused ? "text-teal-700" : "text-typography-500")}
            size="sm"
          >
            {children}
          </Text>
        ),
        tabBarBackground: () => (
          <Box className="bg-background-0 w-full h-full" />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, size }) => (
            <Icon
              as={Home}
              size={"xl"}
              className={cn(focused ? "text-teal-700" : "text-typography-500")}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="facilities"
        options={{
          title: "Facilities",
          tabBarIcon: ({ focused, size }) => (
            <Icon
              as={Hospital}
              size={"xl"}
              className={cn(focused ? "text-teal-700" : "text-typography-500")}
            />
          ),
        }}
      />
    </Tabs>
  );
}
