import { router } from "expo-router";
import { UserCircle } from "lucide-react-native";
import React, { FC } from "react";
import { useResponsive } from "@/hooks/use-responsive";
import Logo from "../Logo";
import { Box } from "../ui/box";
import { Button } from "../ui/button";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { VStack } from "../ui/vstack";
import SafeAreaScreen from "./SafeAreaScreen";

type CHPLandingScreenLayoutProps = {
  children: React.ReactNode;
};
const CHPLandingScreenLayout: FC<CHPLandingScreenLayoutProps> = ({
  children,
}) => {
  const { contentMaxWidth, horizontalPadding, isTablet } = useResponsive();

  return (
    <SafeAreaScreen mode="padded">
      <VStack className="flex-1 bg-background-50 h-full w-full">
        {/* APP bar */}
        <HStack
          className="justify-between items-center bg-background-0 w-full self-center"
          style={{
            height: isTablet ? 72 : 56,
            maxWidth: contentMaxWidth,
            paddingHorizontal: horizontalPadding,
            paddingVertical: isTablet ? 16 : 12,
          }}
        >
          <Logo
            size="sm"
            className="h-full aspect-square max-w-[180px]"
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
        <Box
          className="flex-1 w-full self-center"
          style={{ maxWidth: contentMaxWidth }}
        >
          {children}
        </Box>
      </VStack>
    </SafeAreaScreen>
  );
};

export default CHPLandingScreenLayout;
