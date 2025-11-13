import { Link } from "expo-router";
import { Bell, UserCircle } from "lucide-react-native";
import React, { FC } from "react";
import { Box } from "../ui/box";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

type CHPLandingScreenLayoutProps = {
  children: React.ReactNode;
};
const CHPLandingScreenLayout: FC<CHPLandingScreenLayoutProps> = ({
  children,
}) => {
  return (
    <VStack className="flex-1 bg-background-50">
      {/* APP bar */}
      <HStack className="justify-between items-center p-4 bg-background-0">
        <Text className="text-2xl font-bold ">LOGO</Text>
        <HStack space="xl" className="items-center">
          <Link href="/notifications" asChild>
            <Icon as={Bell} size={"xl"} />
          </Link>
          <Link href="/settings" asChild>
            <Icon as={UserCircle} size={"xl"} />
          </Link>
        </HStack>
      </HStack>
      <Box className="flex-1">{children}</Box>
    </VStack>
  );
};

export default CHPLandingScreenLayout;
