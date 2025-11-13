import CHPLandingScreenLayout from "@/components/layout/CHPLandingScreenLayout";
import { Box } from "@/components/ui/box";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FacilitiesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <CHPLandingScreenLayout>
        <Box className="flex-1 p-4"></Box>
      </CHPLandingScreenLayout>
    </SafeAreaView>
  );
}
