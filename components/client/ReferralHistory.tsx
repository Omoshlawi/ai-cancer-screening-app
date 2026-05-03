import { useReferrals } from "@/hooks/useReferrals";
import {
  getReferralStatusColor,
  getReferralStatusDisplayValue,
  getRiskInterpretation,
} from "@/lib/helpers";
import { Client } from "@/types/client";
import Color from "color";
import dayjs from "dayjs";
import { router } from "expo-router";
import { Calendar, PlusIcon } from "lucide-react-native";
import React, { FC } from "react";
import ListTile from "../list-tile";
import { ErrorState } from "../state-full-widgets";
import { Button, ButtonText } from "../ui/button";
import { Box } from "../ui/box";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Spinner } from "../ui/spinner";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

type ReferralHistoryProps = {
  client: Client;
};

const ReferralHistory: FC<ReferralHistoryProps> = ({ client }) => {
  const { referrals, isLoading, error } = useReferrals({
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
        <Heading size="xs">Referral History</Heading>
        <Button
          action="secondary"
          variant="outline"
          size="xs"
          onPress={() =>
            router.push({
              pathname: "/add-referral",
              params: { client: client?.id, search: client?.phoneNumber },
            })
          }
        >
          <Icon as={PlusIcon} size="xs" />
          <ButtonText size="xs">Add Referral</ButtonText>
        </Button>
      </HStack>
      {referrals.length > 0 ? (
        <VStack space="sm" className="bg-background-50 p-3 rounded-lg">
          {referrals.map((referral) => (
            <ListTile
              key={referral.id}
              title={referral.healthFacility?.name}
              description={`${dayjs(referral.appointmentTime).format(
                "DD MMM YYYY, HH:mm",
              )} | ${getRiskInterpretation(
                referral.screening?.scoringResult?.interpretation,
              )} (${referral.screening?.scoringResult?.aggregateScore})`}
              leading={
                <Box className="p-2 bg-background-0 rounded-full">
                  <Icon as={Calendar} size="sm" className="text-primary-600" />
                </Box>
              }
              trailing={
                <Text
                  size="xs"
                  className="px-3 py-1 rounded-full font-bold uppercase"
                  style={{
                    color: getReferralStatusColor(referral.status),
                    backgroundColor: Color(
                      getReferralStatusColor(referral.status),
                    )
                      .alpha(0.1)
                      .toString(),
                  }}
                >
                  {getReferralStatusDisplayValue(referral.status)}
                </Text>
              }
              onPress={() =>
                router.push({
                  pathname: "/referral-detail",
                  params: { id: referral.id },
                })
              }
            />
          ))}
        </VStack>
      ) : (
        <Text size="xs" className="text-typography-500">
          No Referral history found
        </Text>
      )}
    </Card>
  );
};

export default ReferralHistory;
