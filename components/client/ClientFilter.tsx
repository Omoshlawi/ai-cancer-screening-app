import { RiskInterpretation } from "@/types/screening";
import { ChevronDownIcon, FilterIcon, Search } from "lucide-react-native";
import React, { FC, useMemo } from "react";
import { TouchableOpacity } from "react-native";
import { Box } from "../ui/box";
import { Card } from "../ui/card";
import { Divider } from "../ui/divider";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "../ui/input";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "../ui/select";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

type ClientFilterProps = {
  search?: string;
  onSearchChange?: (search: string) => void;
  level?: RiskInterpretation | "";
  onLevelChange?: (level: RiskInterpretation | "") => void;
  count?: number;
  owner?: "mine" | "all";
  onOwnerChange?: (owner: "mine" | "all") => void;
};

const ClientFilter: FC<ClientFilterProps> = ({
  search,
  onSearchChange,
  level,
  onLevelChange,
  count = 0,
  onOwnerChange,
  owner,
}) => {
  const levels = useMemo<
    { label: string; value: RiskInterpretation | "" }[]
  >(() => {
    return [
      {
        label: "All Risk Levels",
        value: "",
      },
      {
        label: "Low Risks",
        value: RiskInterpretation.LOW_RISK,
      },
      {
        label: "Medium Risks",
        value: RiskInterpretation.MEDIUM_RISK,
      },
      {
        label: "High Risks",
        value: RiskInterpretation.HIGH_RISK,
      },
    ];
  }, []);
  return (
    <Card size="md" variant="elevated">
      <VStack space="md">
        <Input
          variant="outline"
          size="md"
          isDisabled={false}
          isInvalid={false}
          isReadOnly={false}
        >
          <InputSlot className="pl-3">
            <InputIcon as={Search} />
          </InputSlot>
          <InputField
            placeholder="Search by name, phone or ID..."
            value={search}
            onChangeText={onSearchChange}
          />
        </Input>
        <HStack space="sm" className="w-full justify-between items-center">
          <Icon as={FilterIcon} size="md" className="text-typography-500" />
          <Select
            className="flex-1"
            selectedValue={level ?? ""}
            onValueChange={(value) =>
              onLevelChange?.(value as RiskInterpretation | "")
            }
          >
            <SelectTrigger variant="outline" size="md">
              <SelectInput placeholder="Select option" className="flex-1" />
              <SelectIcon className="mr-3" as={ChevronDownIcon} />
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                {levels.map((level, i) => (
                  <SelectItem
                    label={level.label}
                    value={level.value}
                    key={level.value}
                  />
                ))}
              </SelectContent>
            </SelectPortal>
          </Select>
        </HStack>
        <Divider />
        <HStack className="justify-between items-center">
          <Text size="2xs">
            {count} Found Client{count !== 1 ? "s" : ""}
          </Text>
          <Box className="flex-row gap-2">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onOwnerChange?.("all")}
            >
              <Text
                className={` px-2 py-1 text-nowrap rounded-xs text-teal-500 ${
                  owner === "all"
                    ? "bg-teal-500 text-white"
                    : "bg-teal-50 text-teal-500"
                }`}
                size="xs"
              >
                All clients
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onOwnerChange?.("mine")}
            >
              <Text
                className={`px-2 py-1 text-nowrap rounded-xs ${
                  owner === "mine"
                    ? "bg-teal-500 text-white"
                    : "bg-teal-50 text-teal-500"
                }`}
                size="xs"
              >
                My clients
              </Text>
            </TouchableOpacity>
          </Box>
        </HStack>
      </VStack>
    </Card>
  );
};

export default ClientFilter;
