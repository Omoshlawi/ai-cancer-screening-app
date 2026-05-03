import { useClients } from "@/hooks/useClients";
import { usePendingFollowUps } from "@/hooks/useFollowUp";
import { useScreenings } from "@/hooks/useScreenings";
import { RiskInterpretation } from "@/types/screening";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import dayjs from "dayjs";
import { router } from "expo-router";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  LucideIcon,
  Users,
} from "lucide-react-native";
import React, { useMemo } from "react";
import { Pressable } from "react-native";
import { useResponsive } from "@/hooks/use-responsive";
import { Box } from "../ui/box";
import { Card } from "../ui/card";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";
const SummaryCards = () => {
  const { isLargeTablet, isTablet } = useResponsive();
  const { totalCount: screeningsCount } = useScreenings({
    screeningDateFrom: dayjs().startOf("day").toISOString(),
    screeningDateTo: dayjs().endOf("day").toISOString(),
    limit: "1",
  });
  const { totalCount: clientsCount } = useClients({
    limit: "1",
    owner: "mine",
  });
  const { totalCount: highriskClientsCount } = useScreenings({
    screeningDateFrom: dayjs().startOf("day").toISOString(),
    screeningDateTo: dayjs().endOf("day").toISOString(),
    risk: RiskInterpretation.HIGH_RISK,
    limit: "1",
  });
  const { totalCount: followUpCount } = usePendingFollowUps({
    limit: "1",
  });
  const cards = useMemo<
    {
      title: string;
      value: number;
      icon: LucideIcon;
      iconClassName: string;
    }[]
  >(() => {
    return [
      {
        title: "Today's Screenings",
        value: screeningsCount,
        icon: CheckCircle,
        iconClassName: "text-primary-200",
      },
      {
        title: "Pending Follow-ups",
        value: followUpCount,
        icon: Clock,
        iconClassName: "text-warning-200",
      },
      {
        title: "High Risk  cases",
        value: highriskClientsCount,
        icon: AlertCircle,
        iconClassName: "text-error-200",
      },
      {
        title: "My Clients",
        value: clientsCount,
        icon: Users,
        iconClassName: "text-info-200",
      },
    ];
  }, [clientsCount, screeningsCount, highriskClientsCount, followUpCount]);

  const columns = isLargeTablet ? 4 : isTablet ? 2 : 2;
  const gap = 8;
  const widthPercent = `calc(${100 / columns}% - ${gap}px)`;

  return (
    <Box className="w-full flex flex-row flex-wrap gap-2 mt-4">
      {cards.map((card, index) => (
        <Pressable
          key={index}
          className="flex-1"
          style={{
            minWidth: isLargeTablet ? 0 : isTablet ? 240 : 150,
            width: widthPercent as never,
          }}
          onPress={() => {
            if (card.title === "Today's Screenings") {
              router.push("/screenings-today");
            } else if (card.title === "Pending Follow-ups") {
              router.push("/pending-followups");
            } else if (card.title === "High Risk  cases") {
              router.push("/high-risk");
            }
          }}
        >
          <Card
            size="lg"
            className="rounded-none gap-3 bg-background-0"
            style={{ padding: isTablet ? 20 : 12, minHeight: isTablet ? 132 : 0 }}
          >
            <Box className="flex-row items-center gap-2 justify-between">
              <Text className="font-bold text-2xl">{card.value}</Text>
              <Icon
                as={card.icon}
                size="lg"
                className={cn(card.iconClassName, "font-bold")}
              />
            </Box>
            <Text className="">{card.title}</Text>
          </Card>
        </Pressable>
      ))}
    </Box>
  );
};

export default SummaryCards;
