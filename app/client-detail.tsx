import { ScreenLayout } from "@/components/layout";
import { ErrorState, When } from "@/components/state-full-widgets";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useClient } from "@/hooks/useClients";
import Color from "color";
import dayjs from "dayjs";
import { useLocalSearchParams } from "expo-router";
import {
  CalendarPlus,
  Edit,
  IdCard,
  MoreVertical,
  Phone,
  Pin,
} from "lucide-react-native";
import React, { useMemo } from "react";

const ClientDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { client, isLoading, error } = useClient(id);
  const personalInformation = useMemo(
    () => [
      {
        icon: Phone,
        label: "Phone Number",
        value: `${client?.phoneNumber}`,
        color: "red",
      },
      {
        icon: Pin,
        label: "Location",
        value: `${client?.address}`,
        color: "blue",
      },
      {
        icon: IdCard,
        label: "ID",
        value: `${client?.nationalId}`,
        color: "green",
      },
      {
        icon: CalendarPlus,
        label: "Date of Birth",
        value: `${dayjs(client?.dateOfBirth).format("DD/MM/YYYY")}`,
        color: "purple",
      },
      {
        icon: CalendarPlus,
        label: "Age",
        value: `${dayjs().diff(dayjs(client?.dateOfBirth), "years")}`,
        color: "teal",
      },
    ],
    [client]
  );
  return (
    <ScreenLayout title="Client Detail">
      <When
        asyncState={{ isLoading, error, data: client }}
        error={(e) => <ErrorState error={e} />}
        loading={() => <Spinner color="primary" />}
        success={(client) => (
          <VStack space="lg" className="flex-1">
            <HStack className="justify-between items-center">
              <VStack>
                <Heading size="lg">
                  {client?.firstName} {client?.lastName}
                </Heading>
                <Text size="sm" className="text-typography-500">
                  Client Profile and Screening History
                </Text>
              </VStack>
              <Button
                className="p-0 bg-background-0"
                action="secondary"
                style={{ aspectRatio: 1 }}
              >
                <ButtonIcon
                  as={MoreVertical}
                  size="md"
                  className="text-typography-950"
                />
              </Button>
            </HStack>
            <Card size="sm" variant="elevated" className="p-2">
              <HStack className="justify-between items-center">
                <Heading size="xs">Patient Information</Heading>
                <Button action="positive" variant="outline" size="xs">
                  <ButtonIcon as={Edit} size="xs" />
                  <ButtonText size="xs">Edit</ButtonText>
                </Button>
              </HStack>
              <Box className="w-full flex flex-row flex-wrap gap-2">
                {personalInformation.map((item, i) => (
                  <HStack
                    className="flex-1 min-w-[48%] rounded-none bg-background-0 w-[48%] p-2 gap-3 items-center"
                    key={i}
                  >
                    <Box
                      className={`p-2 rounded-full`}
                      style={{
                        backgroundColor: Color(item.color)
                          .alpha(0.1)
                          .toString(),
                      }}
                    >
                      <Icon as={item.icon} size="xs" color={item.color} />
                    </Box>
                    <VStack>
                      <Text size="2xs">{item.label}</Text>
                      <Text size="2xs">{item.value}</Text>
                    </VStack>
                  </HStack>
                ))}
              </Box>
            </Card>
          </VStack>
        )}
      />
    </ScreenLayout>
  );
};

export default ClientDetail;
