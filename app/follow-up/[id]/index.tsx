import VariableValue from "@/components/client/VariableValue";
import { ScreenLayout } from "@/components/layout";
import ListTile from "@/components/list-tile";
import { ErrorState, When } from "@/components/state-full-widgets";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { DEFAULT_DATE_FORMAT } from "@/constants";
import { useFollowUp } from "@/hooks/useFollowUp";
import {
  getFollowUpCategoryDisply,
  getOutreachOutcomeColor,
  getOutreachOutcomeDisplay,
  getPriorityDisplay,
} from "@/lib/helpers";
import { FollowUp } from "@/types/follow-up";
import Color from "color";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import { Calendar, PlusIcon } from "lucide-react-native";
import React, { useMemo } from "react";
import { ScrollView } from "react-native";

const FollowUpDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const followUpAsync = useFollowUp(id);
  return (
    <ScreenLayout title="Follow Up Details">
      <When
        asyncState={{ ...followUpAsync, data: followUpAsync.followUp }}
        loading={() => <Spinner />}
        error={(e) => <ErrorState error={e} />}
        success={(followUp) => {
          return (
            <ScrollView>
              <VStack space="md" className="flex-1">
                <FollowUpDetails followUp={followUp!} />
              </VStack>
            </ScrollView>
          );
        }}
      />
    </ScreenLayout>
  );
};

export default FollowUpDetailScreen;

const FollowUpDetails = ({ followUp }: { followUp: FollowUp }) => {
  const { outreachActions } = followUp;
  const values = useMemo<
    { variable: string; value: string | number | undefined; show: boolean }[]
  >(() => {
    return [
      {
        variable: "Category",
        value: getFollowUpCategoryDisply(followUp.category),
        show: true,
      },
      {
        variable: "Priority",
        value: getPriorityDisplay(followUp.priority),
        show: true,
      },
      {
        variable: "Status",
        value: followUp.completedAt
          ? "Completed"
          : followUp.canceledAt
          ? "Canceled"
          : "Ongoing",
        show: true,
      },
      {
        variable: "Cancelation Date",
        value:
          followUp.canceledAt &&
          dayjs(followUp.canceledAt).format(DEFAULT_DATE_FORMAT),
        show: !!followUp.canceledAt,
      },
      {
        variable: "Canceletion Reason",
        value: followUp.cancelReason,
        show: !!followUp.canceledAt,
      },
      {
        variable: "Canceletion Notes",
        value: followUp.cancelNotes,
        show: !!followUp.canceledAt,
      },
      {
        variable: "Completion Date",
        value:
          followUp.completedAt &&
          dayjs(followUp.completedAt).format(DEFAULT_DATE_FORMAT),
        show: !!followUp.completedAt,
      },
      {
        variable: "Outcome Notes",
        value: followUp?.outcomeNotes,
        show: !!followUp.completedAt,
      },
      {
        variable: "Start Date",
        value: dayjs(followUp.startDate).format(DEFAULT_DATE_FORMAT),
        show: true,
      },
      {
        variable: "End Date",
        value: dayjs(followUp.startDate).format(DEFAULT_DATE_FORMAT),
        show: true,
      },

      {
        variable: "Outreach Actions",
        value: outreachActions?.length,
        show: true,
      },
    ];
  }, [followUp, outreachActions]);
  return (
    <>
      <Card
        size="lg"
        variant="elevated"
        className="gap-3 bg-background-0 rounded-none"
      >
        <VStack space="sm">
          <Heading size="sm" className="text-typography-500">
            Details
          </Heading>
          {values.map((value, i) => {
            if (!value.show) return null;
            return (
              <VariableValue
                key={i}
                value={value.value ?? "N/A"}
                variable={value.variable}
              />
            );
          })}
        </VStack>
      </Card>
      <Card
        size="lg"
        variant="elevated"
        className="gap-3 bg-background-0 rounded-none"
      >
        <VStack space="sm">
          <HStack className="justify-between">
            <Heading size="sm" className="text-typography-500">
              Outreach Actions
            </Heading>
            <Button
              variant="outline"
              size="xs"
              onPress={() => {
                router.push({
                  pathname: "/follow-up/[id]/add-action",
                  params: { id: followUp.id },
                });
              }}
            >
              <ButtonIcon as={PlusIcon} />
              <ButtonText>Record action</ButtonText>
            </Button>
          </HStack>
          {outreachActions && outreachActions.length > 0 ? (
            <VStack space="xs" className="bg-background-50 p-2 rounded-md">
              {outreachActions.map((action) => (
                <ListTile
                  key={action.id}
                  title={dayjs(action.createdAt).format("DD/MM/YYYY")}
                  description={`Score: ${action.actionType}`}
                  leading={
                    <Icon
                      as={Calendar}
                      size="xs"
                      className="text-typography-500"
                    />
                  }
                  trailing={
                    <Text
                      size="2xs"
                      className={`px-2 py-1 rounded-md`}
                      style={{
                        color: getOutreachOutcomeColor(action.outcome),
                        backgroundColor: Color(
                          getOutreachOutcomeColor(action.outcome)
                        )
                          .alpha(0.1)
                          .toString(),
                      }}
                    >
                      {getOutreachOutcomeDisplay(action.outcome)}
                    </Text>
                  }
                  onPress={() => {
                    // router.push({
                    //   pathname: "/screening-detail",
                    //   params: { id: action.id },
                    // });
                  }}
                />
              ))}
            </VStack>
          ) : (
            <Text size="xs" className="text-typography-500">
              No actions found
            </Text>
          )}
        </VStack>
      </Card>
    </>
  );
};
