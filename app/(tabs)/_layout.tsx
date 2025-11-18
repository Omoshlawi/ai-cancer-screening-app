import { Tabs } from "expo-router";
import React from "react";

import { FloatingTabButton } from "@/components/floating-tab-button";
import { HapticTab } from "@/components/haptic-tab";
import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { BookOpenText, Home, Hospital, Users } from "lucide-react-native";

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
        name="clients"
        options={{
          title: "Clients",
          tabBarIcon: ({ focused, size }) => (
            <Icon
              as={Users}
              size={"xl"}
              className={cn(focused ? "text-teal-700" : "text-typography-500")}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="floating-action"
        options={{
          title: "",
          tabBarButton: FloatingTabButton,
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="education"
        options={{
          title: "Education",
          tabBarIcon: ({ focused, size }) => (
            <Icon
              as={BookOpenText}
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
