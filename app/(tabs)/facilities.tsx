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
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useHealthFacilities } from "@/hooks/useHealthFacilities";
import { useResponsive } from "@/hooks/use-responsive";
import { Box } from "@/components/ui/box";
import { useState } from "react";

export default function FacilitiesScreen() {
  const [activeView, setActiveView] =
    useState<FacilitiesViewTabsProps["activeView"]>("list");
  const [search, setSearch] = useState("");
  const [facilityType, setFacilityType] = useState("all");
  const [debouncedSearch] = useDebouncedValue(search, 500);

  // Fetch facilities to get total count for the filter
  const { totalCount } = useHealthFacilities({
    search: debouncedSearch || "",
    typeId: facilityType || "",
  });
  const { horizontalPadding } = useResponsive();

  return (
    <CHPLandingScreenLayout>
      <Box
        className="flex-1"
        style={{ paddingHorizontal: horizontalPadding, paddingVertical: 16 }}
      >
        <VStack space="md" className="flex-1">
          <FacilitiesViewTabs
            activeView={activeView}
            onViewChange={setActiveView}
          />
          <FacilityFilter
            search={search}
            onSearchChange={setSearch}
            facilityType={facilityType}
            onFacilityTypeChange={setFacilityType}
            totalCount={totalCount}
          />
          {activeView === "list" && (
            <FacilityListView search={debouncedSearch} typeId={facilityType} />
          )}
          {activeView === "grid" && (
            <FacilityGridView search={debouncedSearch} typeId={facilityType} />
          )}
          {activeView === "map" && (
            <FacilityMapView search={debouncedSearch} typeId={facilityType} />
          )}
        </VStack>
      </Box>
    </CHPLandingScreenLayout>
  );
}
