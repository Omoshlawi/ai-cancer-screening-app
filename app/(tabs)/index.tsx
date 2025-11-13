import { RecentActivity, SummaryCards } from "@/components/home";
import CHPLandingScreenLayout from "@/components/layout/CHPLandingScreenLayout";
import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { authClient } from "@/lib/auth-client";
import { Wifi } from "lucide-react-native";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { data: userSession } = authClient.useSession();
  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <CHPLandingScreenLayout>
        <Box className="flex-1 p-4">
          <ScrollView>
            <Card
              size="lg"
              variant="elevated"
              className="rounded-none bg-teal-800 p-4 gap-2"
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
                action="success"
                className="rounded-full w-[100px] gap-2 bg-teal-200"
              >
                <BadgeIcon as={Wifi} className="ml-2" />
                <BadgeText className="w-fit">Online</BadgeText>
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
