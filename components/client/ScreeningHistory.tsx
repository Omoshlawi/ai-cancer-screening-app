import { Client } from "@/types/client";
import { Calendar } from "lucide-react-native";
import React, { FC } from "react";
import ListTile from "../list-tile";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

type ScreeningHistoryProps = {
  client?: Client;
};

const ScreeningHistory: FC<ScreeningHistoryProps> = ({ client }) => {
  return (
    <Card size="sm" variant="elevated" className="p-2 gap-3">
      <Heading size="xs">Screening History</Heading>
      <VStack space="xs">
        {Array.from({ length: 3 }).map((_, index) => (
          <ListTile
            key={index}
            title="Screening 1"
            description="2025-01-01"
            className="bg-background-50"
            leading={
              <Icon as={Calendar} size="xs" className="text-typography-500" />
            }
            trailing={
              <Text
                size="xs"
                className="text-red-500 bg-red-100 px-2 py-1 rounded-full"
              >
                High Risk
              </Text>
            }
          />
        ))}
      </VStack>
    </Card>
  );
};

export default ScreeningHistory;
