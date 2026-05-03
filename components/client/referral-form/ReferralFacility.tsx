import ActionSheetWrapper from "@/components/actions-sheet-wrapper";
import { EmptyState, ErrorState } from "@/components/state-full-widgets";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { AlertCircleIcon, Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useHealthFacilities } from "@/hooks/useHealthFacilities";
import { useScreening } from "@/hooks/useScreenings";
import { Client } from "@/types/client";
import { ReferralFormData } from "@/types/screening";
import { ChevronDown, Hospital, Info, MapPin } from "lucide-react-native";
import React, { FC, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TouchableOpacity } from "react-native";

type ReferralFacilityProps = {
  client: Client;
};

const ReferralFacility: FC<ReferralFacilityProps> = ({ client }) => {
  const [search, setSearch] = useState<string>("");
  const form = useFormContext<ReferralFormData>();
  const screeningId = form.watch("screeningId");
  const [showForLocation, setShowForLocation] = useState<
    ("county" | "subcounty")[]
  >(["county", "subcounty"]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { screening: _ } = useScreening(screeningId);
  const {
    healthFacilities: nearbyHealthFacilities,
    error: nearbyError,
    isLoading: nearbyIsLoading,
  } = useHealthFacilities({
    search,
    county: showForLocation.includes("county") ? client.county : undefined,
    subcounty: showForLocation.includes("subcounty")
      ? client.subcounty
      : undefined,
  });

  // useNearbyHealthFacilities({
  //   lat: /*screening?.coordinates?.latitude ??*/ -1.2921,
  //   lng: /*screening?.coordinates?.longitude ??*/ 36.8219,
  // });
  return (
    <Controller
      control={form.control}
      name="healthFacilityId"
      render={({ field, fieldState: { invalid, error } }) => (
        <ActionSheetWrapper
          loading={nearbyIsLoading}
          renderTrigger={({ onPress }) => (
            <FormControl
              isInvalid={invalid}
              size="md"
              isReadOnly
              className="w-full"
            >
              <FormControlLabel>
                <FormControlLabelText>Referral Facility</FormControlLabelText>
              </FormControlLabel>
              <Input className="my-1">
                <InputField
                  placeholder="Referral Facility"
                  {...field}
                  value={
                    field.value
                      ? nearbyHealthFacilities.find(
                          (facility) => facility.id === field.value,
                        )?.name
                      : ""
                  }
                  onChangeText={field.onChange}
                  onPress={onPress}
                />
                <InputSlot
                  className="absolute inset-0"
                  onPress={field.disabled ? undefined : onPress}
                />
                <InputSlot
                  className="px-3"
                  onPress={field.disabled ? undefined : onPress}
                >
                  <InputIcon as={ChevronDown} />
                </InputSlot>
              </Input>

              {error && (
                <FormControlError>
                  <FormControlErrorIcon
                    as={AlertCircleIcon}
                    className="text-error-500"
                  />
                  <FormControlErrorText className="text-error-500">
                    {error.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
          )}
          data={nearbyHealthFacilities}
          renderItem={({ item, close }) => (
            <TouchableOpacity
              onPress={() => {
                close();
                field.onChange(item.id);
              }}
            >
              <Card size="md" variant="elevated">
                <HStack className="items-center" space="sm">
                  {item.logo ? (
                    <Image
                      source={{
                        uri: item.logo,
                      }}
                      alt="Logo"
                      size="lg"
                      className="aspect-1 rounded-sm"
                    />
                  ) : (
                    <Icon
                      as={Hospital}
                      className="aspect-1 rounded-sm color-background-200"
                      size={60 as any}
                    />
                  )}
                  <VStack space="md" className="flex-1">
                    <HStack className="items-center justify-between" space="sm">
                      <Heading size="xs">{item.name}</Heading>
                      <Text
                        size="2xs"
                        className="bg-primary-100 px-2 py-1 rounded-full text-primary-500 absolute right-2 top-1"
                      >
                        {item.type.name}
                      </Text>
                    </HStack>
                    <HStack className="items-center" space="sm">
                      <Icon
                        as={MapPin}
                        size="sm"
                        className="text-typography-500"
                      />
                      <Text size="xs">
                        {`${item.ward ? item.ward + ", " : ""} ${
                          item.subcounty
                        }, ${item.county}`}
                      </Text>
                    </HStack>
                    <HStack className="items-center" space="sm">
                      <Icon
                        as={Info}
                        size="sm"
                        className="text-typography-500"
                      />
                      <Text size="xs">{`MFL: ${item.kmflCode} | Owner: ${
                        item.owner ?? "N/A"
                      }`}</Text>
                    </HStack>
                  </VStack>
                </HStack>
              </Card>
            </TouchableOpacity>
          )}
          renderEmptyState={() => {
            if (error || nearbyError) {
              console.log(error, nearbyError);

              return (
                <ErrorState error={(error as any) || (nearbyError as any)} />
              );
            }
            return <EmptyState message="No nearby facilities found" />;
          }}
          searchable
          searchText={search}
          onSearchTextChange={setSearch}
          searchTags={
            client && (
              <Box className="flex-row gap-2">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    setShowForLocation((prev) =>
                      prev.includes("county")
                        ? prev.filter((item) => item !== "county")
                        : [...prev, "county"],
                    )
                  }
                >
                  <Text
                    className={` px-2 py-1 text-nowrap rounded-xs text-primary-500 ${
                      showForLocation.includes("county")
                        ? "bg-primary-500 text-typography-0"
                        : "bg-primary-50 text-primary-500"
                    }`}
                    size="xs"
                  >
                    {client.county}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    setShowForLocation((prev) =>
                      prev.includes("subcounty")
                        ? prev.filter((item) => item !== "subcounty")
                        : [...prev, "subcounty"],
                    )
                  }
                >
                  <Text
                    className={`px-2 py-1 text-nowrap rounded-xs ${
                      showForLocation.includes("subcounty")
                        ? "bg-primary-500 text-typography-0"
                        : "bg-primary-50 text-primary-500"
                    }`}
                    size="xs"
                  >
                    {client.subcounty}
                  </Text>
                </TouchableOpacity>
              </Box>
            )
          }
        />
      )}
    />
  );
};

export default ReferralFacility;
