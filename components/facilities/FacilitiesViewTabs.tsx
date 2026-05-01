import { GridIcon, ListIcon } from "lucide-react-native";
import React, { FC } from "react";
import { Button, ButtonIcon } from "../ui/button";
import { HStack } from "../ui/hstack";

export type FacilitiesViewTabsProps = {
  activeView?: "list" | "grid" | "map";
  onViewChange?: (tab: "list" | "grid" | "map") => void;
};

const FacilitiesViewTabs: FC<FacilitiesViewTabsProps> = ({
  activeView = "list",
  onViewChange,
}) => {
  return (
    <HStack space="xs">
      <Button
        size="xs"
        action="secondary"
        className={`${activeView === "list" ? "bg-primary-500" : "bg-primary-100"}`}
        onPress={() => onViewChange?.("list")}
        style={{ aspectRatio: 1 }}
      >
        <ButtonIcon
          as={ListIcon}
          size="md"
          className={`${
            activeView === "list" ? "text-typography-0" : "text-primary-500"
          }`}
        />
      </Button>
      <Button
        size="xs"
        action="secondary"
        className={`${
          activeView === "grid" ? "bg-primary-500" : "bg-primary-100 text-primary-500"
        }`}
        onPress={() => onViewChange?.("grid")}
        style={{ aspectRatio: 1 }}
      >
        <ButtonIcon
          as={GridIcon}
          size="md"
          className={`${
            activeView === "grid" ? "text-typography-0" : "text-primary-500"
          }`}
        />
      </Button>
      {/* <Button
        size="xs"
        action="secondary"
        className={`${
          activeView === "map" ? "bg-primary-500" : "bg-primary-100 text-primary-500"
        }`}
        onPress={() => onViewChange?.("map")}
        style={{ aspectRatio: 1 }}
      >
        <ButtonIcon
          as={MapIcon}
          size="md"
          className={`${activeView === "map" ? "text-typography-0" : "text-primary-500"}`}
        />
      </Button> */}
    </HStack>
  );
};

export default FacilitiesViewTabs;
