import { ScreenLayout } from "@/components/layout";
import ListTile from "@/components/list-tile";
import Pagination from "@/components/Pagination";
import { EmptyState, ErrorState, When } from "@/components/state-full-widgets";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { usePendingFollowUps } from "@/hooks/useFollowUp";
import { getReferralStatusColor, getStatusFromDates } from "@/lib/helpers";
import Color from "color";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { router } from "expo-router";
import { ArrowRightLeft } from "lucide-react-native";
import React from "react";
dayjs.extend(relativeTime);

const PendingFollowUpsScreen = () => {
  const { followUps, error, isLoading, ...pagination } = usePendingFollowUps(
    {},
  );

  return (
    <ScreenLayout title="Pending Follow-ups">
      <When
        asyncState={{ isLoading, error, data: followUps }}
        loading={() => <Spinner />}
        error={(e) => <ErrorState error={e} />}
        success={(list) => {
          if (!list?.length)
            return <EmptyState message="No pending follow-ups" />;
          return (
            <Box className="flex-1 mt-2">
              <Card size="sm" variant="elevated" className="p-2 gap-3">
                <Box className="bg-background-50 p-2 rounded-md">
                  {list.map((f) => {
                    const statusColor = getReferralStatusColor(
                      getStatusFromDates(f.completedAt, f.canceledAt),
                    );
                    return (
                      <Box key={f.id} className="mb-2">
                        <ListTile
                          leading={
                            <Icon
                              as={ArrowRightLeft}
                              className="text-typography-500"
                              size="xs"
                            />
                          }
                          title={
                            `${f.client?.firstName ?? ""} ${
                              f.client?.lastName ?? ""
                            }`.trim() || "Unknown Client"
                          }
                          description={`Due: ${dayjs(f.dueDate).format(
                            "YYYY-MM-DD",
                          )} | Priority: ${f.priority}`}
                          trailing={
                            <Text
                              size="2xs"
                              className="px-2 py-1 rounded-md"
                              style={{
                                color: statusColor,
                                backgroundColor: Color(statusColor)
                                  .alpha(0.1)
                                  .toString(),
                              }}
                            >
                              {f.completedAt
                                ? "Completed"
                                : f.canceledAt
                                  ? "Cancelled"
                                  : "Ongoing"}
                            </Text>
                          }
                          onPress={() =>
                            router.push({
                              pathname: "/follow-up/[id]",
                              params: { id: f.id },
                            })
                          }
                        />
                      </Box>
                    );
                  })}
                </Box>
              </Card>
              <Pagination {...pagination} isLoading={isLoading} />
            </Box>
          );
        }}
      />
    </ScreenLayout>
  );
};

export default PendingFollowUpsScreen;
