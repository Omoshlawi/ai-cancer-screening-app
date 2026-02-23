import { useOfflineClients } from "@/hooks/useClients";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { mmkvStorage } from "@/lib/storage";
import { ClientFormData } from "@/types/client";
import dayjs from "dayjs";
import { router } from "expo-router";
import { ArrowRight, Dot, MapPin, Phone } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { FlatList } from "react-native";
import { EmptyState } from "../state-full-widgets";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from "../ui/actionsheet";
import { Box } from "../ui/box";
import { Button, ButtonIcon, ButtonText } from "../ui/button";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import ClientFilter from "./ClientFilter";

const OfflineClients = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const { clients } = useOfflineClients();
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const name = `${client.firstName} ${client.lastName}`.toLowerCase();
      return (
        client.phoneNumber.includes(debouncedSearch.toLowerCase()) ||
        client.nationalId?.includes(debouncedSearch.toLowerCase()) ||
        name.includes(debouncedSearch.toLowerCase())
      );
    });
  }, [clients, debouncedSearch]);
  return (
    <>
      <ClientFilter
        search={search}
        onSearchChange={setSearch}
        count={filteredClients.length}
        onOwnerChange={() => {}}
        mode={"offline"}
      />
      <Box className="flex-1 ">
        <FlatList
          data={clients}
          keyExtractor={(item) => item.phoneNumber}
          ItemSeparatorComponent={() => <Box className="h-2" />}
          ListEmptyComponent={() => <EmptyState message="No clients found" />}
          renderItem={({ item }) => {
            return <Item {...item} />;
          }}
        />
      </Box>
    </>
  );
};

export default OfflineClients;

const Item = (item: ClientFormData) => {
  const { removeOfflineClient } = useOfflineClients();
  const age = dayjs().diff(dayjs(item.dateOfBirth), "years");
  const [showActionsheet, setShowActionsheet] = React.useState(false);

  return (
    <Card size="md" variant="elevated">
      <VStack space="md">
        <Heading size="sm">
          {item.firstName} {item.lastName}
        </Heading>
        <HStack className="items-center" space="lg">
          <Text size="sm" className="text-typography-500">
            Age: {age}
          </Text>
          <Icon as={Dot} size="sm" className="text-typography-500" />
          <Text size="sm" className="text-typography-500">
            Id: {item.nationalId}
          </Text>
        </HStack>
        <HStack className="items-center" space="lg">
          <Icon as={Phone} size="xs" className="text-typography-500" />
          <Text size="sm" className="text-typography-500">
            {item.phoneNumber}
          </Text>
        </HStack>
        <HStack className="justify-between w-full flex" space="md">
          <HStack className="items-center flex flex-1" space="lg">
            <Icon as={MapPin} size="xs" className="text-typography-500" />
            <Text size="sm" className="text-typography-500">
              Address: {`${item.county}, ${item.subcounty} ${item.ward ?? ""}`}
            </Text>
          </HStack>
          <Button
            action="positive"
            size="sm"
            className="bg-teal-500"
            onPress={() => {
              setShowActionsheet(true);
            }}
          >
            <ButtonText>Actions</ButtonText>
            <ButtonIcon as={ArrowRight} size="sm" />
          </Button>
          <Actionsheet
            isOpen={showActionsheet}
            onClose={() => setShowActionsheet(false)}
          >
            <ActionsheetBackdrop />
            <ActionsheetContent>
              <ActionsheetDragIndicatorWrapper>
                <ActionsheetDragIndicator />
              </ActionsheetDragIndicatorWrapper>
              <ActionsheetItem
                onPress={() => {
                  setShowActionsheet(false);
                  router.push({
                    pathname: "/edit-client",
                    params: { phoneNumber: item.phoneNumber },
                  });
                }}
              >
                <ActionsheetItemText>Edit Client</ActionsheetItemText>
              </ActionsheetItem>
              <ActionsheetItem
                onPress={() => {
                  setShowActionsheet(false);
                  router.push({
                    pathname: "/screen-client",
                    params: { search: item.phoneNumber },
                  });
                }}
              >
                <ActionsheetItemText>Screen Client</ActionsheetItemText>
              </ActionsheetItem>
              <ActionsheetItem
                onPress={() => {
                  setShowActionsheet(false);
                  router.push({
                    pathname: "/client-screenings",
                    params: { phoneNumber: item.phoneNumber },
                  });
                }}
              >
                <ActionsheetItemText>View Screenings</ActionsheetItemText>
              </ActionsheetItem>
              <ActionsheetItem
                onPress={() => {
                  setShowActionsheet(false);
                  removeOfflineClient(item.phoneNumber);
                  mmkvStorage.remove(item.phoneNumber);
                }}
              >
                <ActionsheetItemText>Delete Client</ActionsheetItemText>
              </ActionsheetItem>
            </ActionsheetContent>
          </Actionsheet>
        </HStack>
      </VStack>
    </Card>
  );
};
