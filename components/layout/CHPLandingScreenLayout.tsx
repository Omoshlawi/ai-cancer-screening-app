import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { FC } from "react";
import { Box } from "../ui/box";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

type CHPLandingScreenLayoutProps = {
  children: React.ReactNode;
};
const CHPLandingScreenLayout: FC<CHPLandingScreenLayoutProps> = ({
  children,
}) => {
  const colorScheme = useColorScheme();
  return (
    <VStack className="flex-1 bg-background-50">
      {/* APP bar */}
      <HStack className="justify-between items-center p-4 bg-background-0">
        <Text className="text-2xl font-bold ">LOGO</Text>
        <HStack space="xl" className="items-center">
          <Link href="/notifications" asChild>
            <MaterialCommunityIcons
              name="bell-outline"
              size={24}
              color={colorScheme === "dark" ? "white" : "black"}
            />
          </Link>
          <Link href="/settings" asChild>
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={26}
              color={colorScheme === "dark" ? "white" : "black"}
            />
          </Link>
        </HStack>
      </HStack>
      <Box className="flex-1">{children}</Box>
    </VStack>
  );
};

export default CHPLandingScreenLayout;
