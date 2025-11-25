import ActionSheetWrapper from "@/components/actions-sheet-wrapper";
import ListTile from "@/components/list-tile";
import { EmptyState, ErrorState } from "@/components/state-full-widgets";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { useSearchClients } from "@/hooks/useClients";
import { SCREENING_FORM_STEPS } from "@/lib/constants";
import { ScreenClientFormData } from "@/types/client";
import dayjs from "dayjs";
import { router } from "expo-router";
import {
  AlertCircleIcon,
  ArrowRightIcon,
  ChevronRight,
  Phone,
  UserCircle,
  UserPlus,
  UserSearch,
} from "lucide-react-native";
import React, { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";

type ClientSearchProps = {
  onNext: () => void;
  searchClientAsync: ReturnType<typeof useSearchClients>;
};

const ClientSearch: FC<ClientSearchProps> = ({ onNext, searchClientAsync }) => {
  const form = useFormContext<ScreenClientFormData>();

  const { isLoading, onSearchChange, searchValue, clients } = searchClientAsync;

  return (
    <VStack space="md" className="flex-1 items-center">
      <Box className="bg-teal-100 rounded-full p-6 w-fit ">
        <Icon
          as={UserSearch}
          size="sm"
          className="text-teal-500 rounded-full p-6 bg-teal-100"
        />
      </Box>
      <Heading size="sm" >
        {SCREENING_FORM_STEPS[0]}
      </Heading>

      <Controller
        control={form.control}
        name="clientId"
        render={({ field, fieldState: { invalid, error } }) => (
          <ActionSheetWrapper
            loading={isLoading}
            renderTrigger={({ onPress }) => (
              <FormControl
                isInvalid={invalid}
                size="md"
                isReadOnly
                className="w-full"
              >
                <FormControlLabel>
                  <FormControlLabelText>Client</FormControlLabelText>
                </FormControlLabel>
                <Input className="my-1" size="md">
                  <InputField
                    placeholder="Client"
                    {...field}
                    value={
                      field.value
                        ? clients.find((client) => client.id === field.value)
                            ?.firstName +
                          " " +
                          clients.find((client) => client.id === field.value)
                            ?.lastName
                        : ""
                    }
                    onChangeText={field.onChange}
                    onPress={onPress}
                  />
                </Input>

                {error && (
                  <FormControlError>
                    <FormControlErrorIcon
                      as={AlertCircleIcon}
                      className="text-red-500"
                    />
                    <FormControlErrorText className="text-red-500">
                      {error.message}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
            )}
            data={clients}
            renderItem={({ item, close }) => (
              <ListTile
                title={`${item.firstName} ${item.lastName}`}
                description={`Age: ${dayjs().diff(
                  dayjs(item.dateOfBirth),
                  "years"
                )} | ID: ${item.nationalId}`}
                leading={
                  <Icon
                    as={UserCircle}
                    size="lg"
                    className="text-typography-500"
                  />
                }
                trailing={
                  <Icon
                    as={ChevronRight}
                    size="lg"
                    className="text-typography-500"
                  />
                }
                onPress={() => {
                  form.setValue("clientId", item.id);
                  close();
                }}
              />
            )}
            renderEmptyState={() => {
              if (error) {
                return <ErrorState error={error as any} />;
              }
              return <EmptyState message="No clients found" />;
            }}
            searchable
            searchText={searchValue}
            onSearchTextChange={onSearchChange}
          />
        )}
      />

      <Button
        action="default"
        className="border border-dashed border-teal-500 bg-background-0 w-full"
        onPress={() => router.push("/add-client")}
      >
        <Icon as={UserPlus} size="sm" className="text-typography-500" />
        <ButtonText className="text-typography-500">
          Register New Client
        </ButtonText>
      </Button>

      <Button
        action="primary"
        size="sm"
        className="w-full bg-teal-500 justify-between rounded-none"
        onPress={async () => {
          const isValid = await form.trigger(["clientId"]);
          if (isValid) {
            onNext();
          }
        }}
      >
        <ButtonText>Next</ButtonText>
        <ButtonIcon as={ArrowRightIcon} />
      </Button>
    </VStack>
  );
};

export default ClientSearch;
