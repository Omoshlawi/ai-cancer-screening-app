import ScreenLayout from "@/components/layout/ScreenLayout";
import ListTile from "@/components/list-tile";
import Pagination from "@/components/Pagination";
import { EmptyState, ErrorState, When } from "@/components/state-full-widgets";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { usePendingReferralsForMyFacilities } from "@/hooks/useReferrals";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { getReferralStatusColor } from "@/lib/helpers";
import Color from "color";
import dayjs from "dayjs";
import { router } from "expo-router";
import { ArrowRightLeft } from "lucide-react-native";
import React from "react";

const NotificationsScreen = () => {
  const { isOnline } = useNetworkStatus();
  const { referrals, error, isLoading, ...pagination } =
    usePendingReferralsForMyFacilities({});

  return (
    <ScreenLayout title="Pending Referrals">
      {isOnline ? (
        <When
          asyncState={{ isLoading, error, data: referrals }}
          loading={() => <Spinner />}
          error={(e) => <ErrorState error={e} />}
          success={(list) => {
            if (!list?.length)
              return (
                <EmptyState message="No pending referrals for your facilities" />
              );
            return (
              <Box className="flex-1 mt-2">
                <Card size="sm" variant="elevated" className="p-2 gap-3">
                  <Box className="bg-background-50 p-2 rounded-md">
                    {list.map((referral) => {
                      const statusColor = getReferralStatusColor(
                        referral.status,
                      );
                      const clientName =
                        `${referral.screening?.client?.firstName ?? ""} ${referral.screening?.client?.lastName ?? ""}`.trim() ||
                        "Unknown Client";
                      return (
                        <Box key={referral.id} className="mb-2">
                          <ListTile
                            leading={
                              <Icon
                                as={ArrowRightLeft}
                                className="text-typography-500"
                                size="xs"
                              />
                            }
                            title={clientName}
                            description={`${referral.healthFacility?.name ?? "Unknown Facility"} · ${dayjs(referral.appointmentTime).format("YYYY-MM-DD")}`}
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
                                {referral.status}
                              </Text>
                            }
                            onPress={() =>
                              router.push({
                                pathname: "/referral-detail",
                                params: { id: referral.id },
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
      ) : (
        <EmptyState message="Oops! Looks like you're offline. This feature needs a connection to work." />
      )}
    </ScreenLayout>
  );
};

export default NotificationsScreen;
