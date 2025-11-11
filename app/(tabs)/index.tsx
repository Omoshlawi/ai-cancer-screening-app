import CHPLandingScreenLayout from "@/components/layout/CHPLandingScreenLayout";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <CHPLandingScreenLayout>
        <Text>Home</Text>
      </CHPLandingScreenLayout>
    </SafeAreaView>
  );
}
