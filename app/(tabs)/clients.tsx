import { ClientFilter } from "@/components/client";
import { CHPLandingScreenLayout } from "@/components/layout";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { router } from "expo-router";
import { UserPlus } from "lucide-react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const ClientsScreen = () => {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<"all" | "low" | "medium" | "high">("all");
  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <CHPLandingScreenLayout>
        <Box className="flex-1 p-4">
          <VStack space="md">
            <Button
              action="default"
              className="border border-dashed border-teal-500 bg-background-0"
              onPress={() => router.push("/add-client")}
            >
              <Icon as={UserPlus} size="sm" className="text-typography-500" />
              <ButtonText className="text-typography-500">
                Register New Client
              </ButtonText>
            </Button>
            <ClientFilter
              search={search}
              level={level}
              onSearchChange={setSearch}
              onLevelChange={setLevel}
            />
          </VStack>
        </Box>
      </CHPLandingScreenLayout>
    </SafeAreaView>
  );
};

export default ClientsScreen;
