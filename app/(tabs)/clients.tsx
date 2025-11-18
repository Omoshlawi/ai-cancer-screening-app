import { CHPLandingScreenLayout } from "@/components/layout";
import { Box } from "@/components/ui/box";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const ClientsScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <CHPLandingScreenLayout>
        <Box className="flex-1 p-4"></Box>
      </CHPLandingScreenLayout>
    </SafeAreaView>
  );
};

export default ClientsScreen;
