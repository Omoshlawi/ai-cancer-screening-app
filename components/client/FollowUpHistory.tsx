import { useFollowUps } from "@/hooks/useFollowUp";
import {
  getFollowUpCategoryDisply,
  getPriorityDisplay,
  getReferralStatusColor,
  getStatusFromDates,
} from "@/lib/helpers";
import { Client } from "@/types/client";
import Color from "color";
import dayjs from "dayjs";
import { router } from "expo-router";
import { ArrowRightLeft } from "lucide-react-native";
import React, { FC } from "react";
import ListTile from "../list-tile";
import { ErrorState } from "../state-full-widgets";
import { Box } from "../ui/box";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Spinner } from "../ui/spinner";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

type FollowUpHistoryProps = {
  client: Client;
};

const FollowUpHistory: FC<FollowUpHistoryProps> = ({ client }) => {
  const { followUps, isLoading, error } = useFollowUps({
    clientId: client?.id,
    limit: "100",
  });
  if (isLoading) {
    return <Spinner color="primary" />;
  }
  if (error) {
    return <ErrorState error={error} />;
  }
  return (
    <Card size="sm" variant="elevated" className="p-2 gap-3">
      <HStack className="justify-between items-center">
        <Heading size="xs">Follow up History</Heading>
      </HStack>
      {followUps.length > 0 ? (
        <VStack space="sm" className="bg-background-50 p-3 rounded-lg">
          {followUps.map((followUp) => (
            <ListTile
              key={followUp.id}
              title={`${getFollowUpCategoryDisply(followUp.category)}`}
              description={`Range: ${dayjs(followUp.startDate).format("DD MMM YYYY")} - ${dayjs(followUp.dueDate).format("DD MMM YYYY")} | Priority: ${getPriorityDisplay(followUp.priority)}`}
              leading={
                <Box className="p-2 bg-background-0 rounded-full">
                  <Icon
                    as={ArrowRightLeft}
                    size="sm"
                    className="text-primary-600"
                  />
                </Box>
              }
              trailing={
                <Text
                  size="xs"
                  className="px-3 py-1 rounded-full font-bold uppercase"
                  style={{
                    color: getReferralStatusColor(
                      getStatusFromDates(
                        followUp.completedAt,
                        followUp.canceledAt,
                      ),
                    ),
                    backgroundColor: Color(
                      getReferralStatusColor(
                        getStatusFromDates(
                          followUp.completedAt,
                          followUp.canceledAt,
                        ),
                      ),
                    )
                      .alpha(0.1)
                      .toString(),
                  }}
                >
                  {followUp.completedAt
                    ? "Completed"
                    : followUp.canceledAt
                      ? "Cancelled"
                      : "Ongoing"}
                </Text>
              }
              onPress={() =>
                router.push({
                  pathname: "/follow-up/[id]",
                  params: { id: followUp.id },
                })
              }
            />
          ))}
        </VStack>
      ) : (
        <Text size="xs" className="text-typography-500">
          No Followups for this referral
        </Text>
      )}
    </Card>
  );
};

export default FollowUpHistory;
