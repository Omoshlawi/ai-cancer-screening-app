import { useHealthFacilityTypes } from "@/hooks/useHealthFacilityTypes";
import { ChevronDownIcon, FilterIcon, Search } from "lucide-react-native";
import React, { FC, useMemo } from "react";
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
import { Spinner } from "../ui/spinner";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
type FacilityFilterProps = {
  search?: string;
  onSearchChange?: (search: string) => void;
  facilityType?: string;
  onFacilityTypeChange?: (facilityType: string) => void;
  totalCount?: number;
};

const FacilityFilter: FC<FacilityFilterProps> = ({
  search,
  onSearchChange,
  facilityType,
  onFacilityTypeChange,
  totalCount = 0,
}) => {
  const { facilityTypes: backendTypes, isLoading } = useHealthFacilityTypes();

  const facilityTypes = useMemo(() => {
    // Add "All" option at the beginning
    const allOption = { label: "All", id: "all" };
    
    // Map backend types to the format needed by the select
    const typesFromBackend = backendTypes.map((type) => ({
      label: type.name,
      id: type.id,
    }));

    return [allOption, ...typesFromBackend];
  }, [backendTypes]);
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
            placeholder="Search facility..."
            value={search}
            onChangeText={onSearchChange}
          />
        </Input>
        <HStack space="sm" className="w-full justify-between items-center">
          <Icon as={FilterIcon} size="md" className="text-typography-500" />
          {isLoading ? (
            <Spinner size="small" />
          ) : (
            <Select
              className="flex-1"
              selectedValue={facilityType}
              onValueChange={(value) => onFacilityTypeChange?.(value)}
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
                  {facilityTypes.map((facilityTypeOption) => (
                    <SelectItem
                      label={facilityTypeOption.label}
                      value={facilityTypeOption.id}
                      key={facilityTypeOption.id}
                    />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
          )}
        </HStack>
        <Divider />
        <Text size="2xs">
          {totalCount} {totalCount === 1 ? "Facility" : "Facilities"} Found
        </Text>
      </VStack>
    </Card>
  );
};

export default FacilityFilter;
