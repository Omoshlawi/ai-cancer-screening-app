import { Client } from "@/types/client";
import { Check, TriangleAlert } from "lucide-react-native";
import React, { FC } from "react";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Progress, ProgressFilledTrack } from "../ui/progress";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

type RiskTratificationProps = {
  client: Client;
};

const RiskTratification: FC<RiskTratificationProps> = ({ client }) => {
  const risk = 85;
  const symptoms = [
    "Multiple Sexual patners (4-5)",
    "Early sexual debut (<16years)",
    "Never Previously screened",
    "Abnomal Viginal Bleeding reported",
  ];
  return (
    <Card size="sm" variant="elevated" className="p-2 gap-3">
      <Heading size="xs">AI Risk Tratification</Heading>
      <HStack className="justify-between items-center">
        <Text size="2xs" className="text-typography-500">
          Risk Level
        </Text>
        <Text
          className="text-red-500 px-2  rounded-full bg-red-100 "
          size="2xs"
        >
          High Risk
        </Text>
      </HStack>
      <Progress
        value={risk}
        size="xs"
        orientation="horizontal"
        className="w-full "
      >
        <ProgressFilledTrack className="bg-red-500" />
      </Progress>
      <HStack className="justify-between items-center">
        <Text size="2xs" className="text-typography-500">
          Risk Score
        </Text>
        <Text className="text-red-500" size="2xs">
          {risk}
        </Text>
      </HStack>
      <Text size="2xs" className="text-typography-500 ">
        Based on demographics, clinical and symptoms data
      </Text>
      <Card className="w-full flex flex-col gap-2 bg-red-50">
        <HStack space="md">
          <Icon as={TriangleAlert} size="2xs" className="text-red-500 " />
          <Text size="2xs" className="text-red-500 font-bold">
            Current Symptoms
          </Text>
        </HStack>
        <VStack space="sm">
          {symptoms.map((symptom, index) => (
            <HStack key={index} space="md">
              <Icon as={Check} size="2xs" className="text-red-500" />
              <Text size="2xs" className="text-red-500">
                {symptom}
              </Text>
            </HStack>
          ))}
        </VStack>
      </Card>
    </Card>
  );
};

export default RiskTratification;
