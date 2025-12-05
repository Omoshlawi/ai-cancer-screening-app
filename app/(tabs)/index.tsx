import { RecentActivity, SummaryCards } from "@/components/home";
import CHPLandingScreenLayout from "@/components/layout/CHPLandingScreenLayout";
import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { authClient } from "@/lib/auth-client";
import { Wifi, WifiOff } from "lucide-react-native";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function HomeScreen() {
  const { data: userSession } = authClient.useSession();
  const { isOnline } = useNetworkStatus();
  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <CHPLandingScreenLayout>
        <Box className="flex-1 p-4">
          <ScrollView showsVerticalScrollIndicator={false}>
            <Card
              size="lg"
              variant="elevated"
              className="rounded-none bg-teal-500 p-4 gap-2"
            >
              <Heading size="md" className="mb-1 text-white">
                {new Date().getHours() < 12
                  ? "Good Morning"
                  : new Date().getHours() < 18
                  ? "Good Afternoon"
                  : "Good Evening"}
                , {userSession?.user?.name}
              </Heading>
              <Text size="sm" className="text-teal-200">
                {new Date().toLocaleString()}
              </Text>
              <Badge
                size="lg"
                variant="solid"
                action={isOnline ? "success" : "error"}
                className={`rounded-full w-[100px] gap-2 ${
                  isOnline ? "bg-teal-200" : "bg-red-200"
                }`}
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
    </SafeAreaView>
  );
}
