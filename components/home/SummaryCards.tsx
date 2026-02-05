import { useClients } from "@/hooks/useClients";
import { usePendingFollowUps } from "@/hooks/useFollowUp";
import { useScreenings } from "@/hooks/useScreenings";
import { RiskInterpretation } from "@/types/screening";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import dayjs from "dayjs";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  LucideIcon,
  Users,
} from "lucide-react-native";
import React, { useMemo } from "react";
import { Box } from "../ui/box";
import { Card } from "../ui/card";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";
const SummaryCards = () => {
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
        iconClassName: "text-teal-200",
      },
      {
        title: "Pending Follow-ups",
        value: followUpCount,
        icon: Clock,
        iconClassName: "text-yellow-200",
      },
      {
        title: "High Risk  cases",
        value: highriskClientsCount,
        icon: AlertCircle,
        iconClassName: "text-red-200",
      },
      {
        title: "My Clients",
        value: clientsCount,
        icon: Users,
        iconClassName: "text-blue-200",
      },
    ];
  }, [clientsCount, screeningsCount, highriskClientsCount, followUpCount]);
  return (
    <Box className="w-full flex flex-row flex-wrap gap-2 mt-4">
      {cards.map((card, index) => (
        <Card
          key={index}
          size="lg"
          className="flex-1 min-w-[48%] rounded-none bg-background-0 w-[48%] p-3 gap-3"
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
      ))}
    </Box>
  );
};

export default SummaryCards;
