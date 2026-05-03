import { RecentActivity, SummaryCards } from "@/components/home";
import CHPLandingScreenLayout from "@/components/layout/CHPLandingScreenLayout";
import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { useResponsive } from "@/hooks/use-responsive";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useSessionWithOfflineSupport } from "@/hooks/useSessionWithOfflineSupport";
import { Wifi, WifiOff } from "lucide-react-native";
import { ScrollView } from "react-native";
export default function HomeScreen() {
  const { data: userSession } = useSessionWithOfflineSupport();
  const { isOnline } = useNetworkStatus();
  const { horizontalPadding, isTablet } = useResponsive();

  return (
    <CHPLandingScreenLayout>
      <Box
        className="flex-1"
        style={{ paddingHorizontal: horizontalPadding, paddingVertical: 16 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          <Card
            size="lg"
            variant="elevated"
            className="rounded-none bg-primary-500 gap-2"
            style={{ padding: isTablet ? 24 : 16 }}
          >
            <Heading size="md" className="mb-1 text-typography-0">
              {new Date().getHours() < 12
                ? "Good Morning"
                : new Date().getHours() < 18
                  ? "Good Afternoon"
                  : "Good Evening"}
              , {userSession?.user?.name}
            </Heading>
            <Text size="sm" className="text-primary-200">
              {new Date().toLocaleString()}
            </Text>
            <Badge
              size="lg"
              variant="solid"
              action={isOnline ? "success" : "error"}
              className={`rounded-full gap-2 self-start ${
                isOnline ? "bg-primary-200" : "bg-error-200"
              }`}
              style={{ minWidth: isTablet ? 120 : 100 }}
            >
              <BadgeIcon as={isOnline ? Wifi : WifiOff} className="ml-2" />
              <BadgeText className="w-fit">
                {isOnline ? "Online" : "Offline"}
              </BadgeText>
            </Badge>
          </Card>
          <SummaryCards />
          <RecentActivity />
        </ScrollView>
      </Box>
    </CHPLandingScreenLayout>
  );
}
