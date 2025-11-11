import CHPLandingScreenLayout from "@/components/layout/CHPLandingScreenLayout";
import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { authClient } from "@/lib/auth-client";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { data: userSession } = authClient.useSession();
  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <CHPLandingScreenLayout>
        <Box className="flex-1 p-4">
          <Card
            size="lg"
            variant="elevated"
            className="rounded-none bg-background-0 p-4 gap-2"
          >
            <Heading size="md" className="mb-1">
              {new Date().getHours() < 12
                ? "Good Morning"
                : new Date().getHours() < 18
                ? "Good Afternoon"
                : "Good Evening"}
              , {userSession?.user?.name}
            </Heading>
            <Text size="sm" className="text-typography-500">
              {new Date().toLocaleString()}
            </Text>
            <Badge
              size="lg"
              variant="solid"
              action="success"
              className="rounded-full w-[100px] gap-2"
            >
              <BadgeIcon
                as={() => (
                  <MaterialCommunityIcons name="wifi" size={12} color="white" />
                )}
                className="ml-2"
              />
              <BadgeText className="w-fit">Verified</BadgeText>
            </Badge>
          </Card>
        </Box>
      </CHPLandingScreenLayout>
    </SafeAreaView>
  );
}
