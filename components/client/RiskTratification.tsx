import {
  getRiskColor,
  getRiskInterpretation,
  getRiskPercentage,
} from "@/lib/helpers";
import { Client } from "@/types/client";
import Color from "color";
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
  const risk = client.screenings?.[0]?.scoringResult?.aggregateScore ?? 0;
  const riskPercentage = getRiskPercentage(
    client.screenings?.[0]?.scoringResult?.interpretation
  );
  const symptoms =
    client.screenings?.[0]?.scoringResult?.breakdown.map(
      (factor) => factor.reason
    ) ?? [];
  return (
    <Card size="sm" variant="elevated" className="p-2 gap-3">
      <Heading size="xs">AI Risk Tratification</Heading>
      <HStack className="justify-between items-center">
        <Text size="sm" className="text-typography-600 font-medium">
          Risk Level
        </Text>
        <Text
          className="px-3 py-1 rounded-full font-bold uppercase"
          style={{
            color: getRiskColor(
              client.screenings?.[0]?.scoringResult?.interpretation
            ),
            backgroundColor: Color(
              getRiskColor(
                client.screenings?.[0]?.scoringResult?.interpretation
              )
            )
              .alpha(0.1)
              .toString(),
          }}
          size="xs"
        >
          {getRiskInterpretation(
            client.screenings?.[0]?.scoringResult?.interpretation
          )}
        </Text>
      </HStack>
      <Progress
        value={riskPercentage}
        size="sm"
        orientation="horizontal"
        className="w-full h-2"
      >
        <ProgressFilledTrack
          style={{
            backgroundColor: getRiskColor(
              client.screenings?.[0]?.scoringResult?.interpretation
            ),
          }}
        />
      </Progress>
      <HStack className="justify-between items-center">
        <Text size="sm" className="text-typography-600 font-medium">
          Risk Score
        </Text>
        <Text
          size="lg"
          className="font-bold"
          style={{
            color: getRiskColor(
              client.screenings?.[0]?.scoringResult?.interpretation
            ),
          }}
        >
          {risk}
        </Text>
      </HStack>
      <Text size="xs" className="text-typography-500 italic">
        Based on demographics, clinical and symptoms data
      </Text>
      <Card
        className="w-full flex flex-col gap-3 p-4"
        style={{
          backgroundColor: Color(
            getRiskColor(client.screenings?.[0]?.scoringResult?.interpretation)
          )
            .alpha(0.1)
            .toString(),
        }}
      >
        <HStack space="md" className="items-center">
          <Icon
            as={TriangleAlert}
            size="sm"
            style={{
              color: getRiskColor(
                client.screenings?.[0]?.scoringResult?.interpretation
              ),
            }}
          />
          <Text
            size="sm"
            className="font-bold uppercase tracking-wider"
            style={{
              color: getRiskColor(
                client.screenings?.[0]?.scoringResult?.interpretation
              ),
            }}
          >
            Current Symptoms
          </Text>
        </HStack>
        <VStack space="sm" className="mt-1">
          {symptoms.map((symptom, index) => (
            <HStack key={index} space="md" className="items-center">
              <Icon
                as={Check}
                size="xs"
                style={{
                  color: getRiskColor(
                    client.screenings?.[0]?.scoringResult?.interpretation
                  ),
                }}
              />
              <Text
                size="sm"
                className="font-medium"
                style={{
                  color: getRiskColor(
                    client.screenings?.[0]?.scoringResult?.interpretation
                  ),
                }}
              >
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
