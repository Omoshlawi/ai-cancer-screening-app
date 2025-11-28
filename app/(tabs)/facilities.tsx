import {
  FacilityFilter,
  FacilityGridView,
  FacilityListView,
  FacilityMapView,
} from "@/components/facilities";
import FacilitiesViewTabs, {
  FacilitiesViewTabsProps,
} from "@/components/facilities/FacilitiesViewTabs";
import CHPLandingScreenLayout from "@/components/layout/CHPLandingScreenLayout";
import { VStack } from "@/components/ui/vstack";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FacilitiesScreen() {
  const [activeView, setActiveView] =
    useState<FacilitiesViewTabsProps["activeView"]>("map");
  const [search, setSearch] = useState("");
  const [facilityType, setFacilityType] = useState("");
  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <CHPLandingScreenLayout>
        <VStack space="md" className="flex-1 p-4">
          <FacilitiesViewTabs
            activeView={activeView}
            onViewChange={setActiveView}
          />
          <FacilityFilter
            search={search}
            onSearchChange={setSearch}
            facilityType={facilityType}
            onFacilityTypeChange={setFacilityType}
          />
          {activeView === "list" && <FacilityListView />}
          {activeView === "grid" && <FacilityGridView />}
          {activeView === "map" && <FacilityMapView />}
        </VStack>
      </CHPLandingScreenLayout>
    </SafeAreaView>
  );
}
