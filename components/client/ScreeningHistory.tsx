import { useScreenings } from "@/hooks/useScreenings";
import { getRiskColor, getRiskInterpretation } from "@/lib/helpers";
import { Client } from "@/types/client";
import Color from "color";
import dayjs from "dayjs";
import { router } from "expo-router";
import { Calendar } from "lucide-react-native";
import React, { FC } from "react";
import ListTile from "../list-tile";
import { ErrorState } from "../state-full-widgets";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { Icon } from "../ui/icon";
import { Spinner } from "../ui/spinner";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

type ScreeningHistoryProps = {
  client: Client;
};

const ScreeningHistory: FC<ScreeningHistoryProps> = ({ client }) => {
  const { screenings, isLoading, error } = useScreenings({
    clientId: client?.id,
    limit: "3",
  });
  if (isLoading) {
    return <Spinner color="primary" />;
  }
  if (error) {
    return <ErrorState error={error} />;
  }
  return (
    <Card size="sm" variant="elevated" className="p-2 gap-3">
      <Heading size="xs">Screening History</Heading>
      {screenings.length > 0 ? (
        <VStack space="xs" className="bg-background-50 p-2 rounded-md">
          {screenings.map((screening) => (
            <ListTile
              key={screening.id}
              title={dayjs(screening.createdAt).format("DD/MM/YYYY")}
              description={`Score: ${
                screening.scoringResult?.aggregateScore?.toString() ?? "N/A"
              }`}
              leading={
                <Icon as={Calendar} size="xs" className="text-typography-500" />
              }
              trailing={
                <Text
                  size="2xs"
                  className={`px-2 py-1 rounded-md`}
                  style={{
                    color: getRiskColor(
                      screening.scoringResult?.interpretation
                    ),
                    backgroundColor: Color(
                      getRiskColor(screening.scoringResult?.interpretation)
                    )
                      .alpha(0.1)
                      .toString(),
                  }}
                >
                  {getRiskInterpretation(
                    screening.scoringResult?.interpretation
                  )}
                </Text>
              }
              onPress={() =>
                router.push({
                  pathname: "/screening-detail",
                  params: { id: screening.id },
                })
              }
            />
          ))}
        </VStack>
      ) : (
        <Text size="xs" className="text-typography-500">
          No screening history found
        </Text>
      )}
    </Card>
  );
};

export default ScreeningHistory;
