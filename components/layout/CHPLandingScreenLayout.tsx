import { router } from "expo-router";
import { UserCircle } from "lucide-react-native";
import React, { FC } from "react";
import Logo from "../Logo";
import { Box } from "../ui/box";
import { Button } from "../ui/button";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { VStack } from "../ui/vstack";

type CHPLandingScreenLayoutProps = {
  children: React.ReactNode;
};
const CHPLandingScreenLayout: FC<CHPLandingScreenLayoutProps> = ({
  children,
}) => {
  return (
    <VStack className="flex-1 bg-background-50 h-full w-full">
      {/* APP bar */}
      <HStack
        className="justify-between items-center p-4 bg-background-0"
        style={{ height: 56 }}
      >
        <Logo
          size="sm"
          className="h-full aspect-square"
          resizeMode="contain"
          mode="name"
        />
        <HStack space="xl" className="items-center">
          {/* <Button
            action="default"
            onPress={() => router.push("/notifications")}
            className="p-0 m-0"
          >
            <Icon as={Bell} size={"xl"} />
          </Button> */}

          <Button
            action="default"
            onPress={() => router.push("/settings")}
            className="p-0 m-0"
          >
            <Icon as={UserCircle} size={"xl"} />
          </Button>
        </HStack>
      </HStack>
      <Box className="flex-1">{children}</Box>
    </VStack>
  );
};

export default CHPLandingScreenLayout;
