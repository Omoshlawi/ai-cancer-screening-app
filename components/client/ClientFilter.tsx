import { ChevronDownIcon, FilterIcon, Search } from "lucide-react-native";
import React, { FC, useMemo } from "react";
import { Button, ButtonIcon } from "../ui/button";
import { Card } from "../ui/card";
import { Divider } from "../ui/divider";
import { HStack } from "../ui/hstack";
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

type Level = "all" | "low" | "medium" | "high";

type ClientFilterProps = {
  search?: string;
  onSearchChange?: (search: string) => void;
  level?: Level;
  onLevelChange?: (level: Level) => void;
};

const ClientFilter: FC<ClientFilterProps> = ({
  search,
  onSearchChange,
  level,
  onLevelChange,
}) => {
  const levels = useMemo<{ label: string; value: Level }[]>(() => {
    return [
      {
        label: "All Risk Levels",
        value: "all",
      },
      {
        label: "Low Risks",
        value: "low",
      },
      {
        label: "Medium Risks",
        value: "medium",
      },
      {
        label: "High Risks",
        value: "high",
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
        <HStack space="sm" className="w-full justify-between">
          <Button action="default">
            <ButtonIcon
              as={FilterIcon}
              size="sm"
              className="text-typography-500"
            />
          </Button>
          <Select
            className="flex-1"
            selectedValue={level}
            onValueChange={(value) => onLevelChange?.(value as Level)}
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
        <Text size="2xs">12 Found Clients</Text>
      </VStack>
    </Card>
  );
};

export default ClientFilter;
