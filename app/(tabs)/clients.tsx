import { OfflineClients, OnlineClients } from "@/components/client";
import { CHPLandingScreenLayout } from "@/components/layout";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useResponsive } from "@/hooks/use-responsive";
import { router, useLocalSearchParams } from "expo-router";
import { UserPlus } from "lucide-react-native";
import React from "react";

const ClientsScreen = () => {
  const { isOnline } = useNetworkStatus();
  const { horizontalPadding, isTablet } = useResponsive();
  const { owner } = useLocalSearchParams<{ owner?: "all" | "mine" }>();

  return (
    <CHPLandingScreenLayout>
      <Box
        className="flex-1"
        style={{ paddingHorizontal: horizontalPadding, paddingVertical: 16 }}
      >
        <VStack space="md" className="flex-1">
          <Button
            action="default"
            className="border border-dashed border-primary-500 bg-background-0"
            onPress={() => router.push("/add-client")}
            style={{ alignSelf: isTablet ? "flex-start" : "stretch" }}
          >
            <Icon as={UserPlus} size="sm" className="text-typography-500" />
            <ButtonText className="text-typography-500">
              Register New Client
            </ButtonText>
          </Button>
          {isOnline ? <OnlineClients initialOwner={owner ?? "all"} /> : <OfflineClients />}
        </VStack>
      </Box>
    </CHPLandingScreenLayout>
  );
};

export default ClientsScreen;
