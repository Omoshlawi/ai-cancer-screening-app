import { ScreenLayout } from "@/components/layout";
import ListTile from "@/components/list-tile";
import Pagination from "@/components/Pagination";
import { EmptyState, ErrorState, When } from "@/components/state-full-widgets";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useScreenings } from "@/hooks/useScreenings";
import { getRiskColor, getRiskInterpretation } from "@/lib/helpers";
import { RiskInterpretation, Screening } from "@/types/screening";
import Color from "color";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { router } from "expo-router";
import { Calendar } from "lucide-react-native";
import React from "react";
dayjs.extend(relativeTime);

const HighRiskScreeningsToday = () => {
  const { isOnline } = useNetworkStatus();
  const { screenings, error, isLoading, ...pagination } = useScreenings({
    screeningDateFrom: dayjs().startOf("day").toISOString(),
    screeningDateTo: dayjs().endOf("day").toISOString(),
    risk: RiskInterpretation.HIGH_RISK,
  });

  const renderTile = (s: Screening) => {
    const risk = s.scoringResult?.interpretation;
    return (
      <ListTile
        leading={
          <Icon as={Calendar} size="xs" className="text-typography-500" />
        }
        title={
          `${s.client?.firstName ?? ""} ${s.client?.lastName ?? ""}`.trim() ||
          "Unknown Client"
        }
        description={`Score: ${s.scoringResult?.aggregateScore ?? "N/A"}`}
        trailing={
          <Text
            size="2xs"
            className="px-2 py-1 rounded-md"
            style={{
              color: getRiskColor(risk),
              backgroundColor: Color(getRiskColor(risk)).alpha(0.1).toString(),
            }}
          >
            {getRiskInterpretation(risk)}
          </Text>
        }
        onPress={() =>
          router.push({
            pathname: "/screening-detail",
            params: { id: s.id },
          })
        }
      />
    );
  };

  return (
    <ScreenLayout title="High Risk (Today)">
      {isOnline ? (
        <When
          asyncState={{ isLoading, error, data: screenings }}
          loading={() => <Spinner />}
          error={(e) => <ErrorState error={e} />}
          success={(list) => {
            if (!list?.length)
              return <EmptyState message="No high risk screenings today" />;
            return (
              <Box className="flex-1 mt-2">
                <Card size="sm" variant="elevated" className="p-2 gap-3">
                  <Box className="bg-background-50 p-2 rounded-md">
                    {list.map((s) => (
                      <Box key={s.id} className="mb-2">
                        {renderTile(s)}
                      </Box>
                    ))}
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

export default HighRiskScreeningsToday;
