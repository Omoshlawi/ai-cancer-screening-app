import { useHealthFacilities } from "@/hooks/useHealthFacilities";
import { Hospital, MapPin, Phone } from "lucide-react-native";
import React from "react";
import { FlatList } from "react-native";
import { EmptyState, ErrorState } from "../state-full-widgets";
import { Box } from "../ui/box";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Image } from "../ui/image";
import { Spinner } from "../ui/spinner";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

type FacilityListViewProps = {
  search?: string;
  typeId?: string;
};

const FacilityListView = ({ search, typeId }: FacilityListViewProps) => {
  const { healthFacilities, error, isLoading } = useHealthFacilities({
    search: search || "",
    typeId: typeId || "",
  });

  if (isLoading) {
    return <Spinner />;
  }
  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <VStack space="md" className="flex-1">
      <FlatList
        data={healthFacilities}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<EmptyState message="No facilities found" />}
        ItemSeparatorComponent={() => <Box className="h-2" />}
        renderItem={({ item }) => (
          <Card size="md" variant="elevated">
            <HStack className="items-center" space="sm">
              {item.logo ? (
                <Image
                  source={{
                    uri: item.logo,
                  }}
                  alt="Logo"
                  size="lg"
                  className="aspect-1 rounded-sm"
                />
              ) : (
                <Icon
                  as={Hospital}
                  className="aspect-1 rounded-sm color-background-200"
                  size={60 as any}
                />
              )}
              <VStack space="md" className="flex-1">
                <HStack className="items-center justify-between" space="sm">
                  <Heading size="xs">{item.name}</Heading>
                  <Text
                    size="2xs"
                    className="bg-teal-100 px-2 py-1 rounded-full text-teal-500"
                  >
                    {item.type.name}
                  </Text>
                </HStack>
                <HStack className="items-center" space="sm">
                  <Icon as={MapPin} size="sm" className="text-typography-500" />
                  <Text size="xs">{item.address}</Text>
                </HStack>
                <HStack className="items-center" space="sm">
                  <Icon as={Phone} size="sm" className="text-typography-500" />
                  <Text size="xs">{`${item.phoneNumber} | ${item.email}`}</Text>
                </HStack>
              </VStack>
            </HStack>
          </Card>
        )}
      />
    </VStack>
  );
};

export default FacilityListView;
