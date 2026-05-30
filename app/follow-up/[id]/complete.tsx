import DateTimePickerInput from "@/components/date-time-picker";
import { ScreenLayout } from "@/components/layout";
import Toaster from "@/components/toaster";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import {
  AddIcon,
  AlertCircleIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  CloseIcon,
} from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
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
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { completeReferralSchema } from "@/constants/schemas";
import { useReferralApi } from "@/hooks/useReferrals";
import { handleApiErrors } from "@/lib/api";
import {
  getActionTakenDisplay,
  getReferralResultDisplay,
  getTestTypeDisplay,
} from "@/lib/helpers";
import {
  CompleteReferralFormData,
  ReferralTestFormData,
} from "@/types/screening";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import { Calendar } from "lucide-react-native";
import React from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { ScrollView, View } from "react-native";

const TEST_TYPES: { label: string; value: ReferralTestFormData["testType"] }[] =
  [
    { label: getTestTypeDisplay("VIA")!, value: "VIA" },
    { label: getTestTypeDisplay("PAP_SMEAR")!, value: "PAP_SMEAR" },
    { label: getTestTypeDisplay("HPV_TEST")!, value: "HPV_TEST" },
  ];

const RESULTS_BY_TYPE: Record<
  ReferralTestFormData["testType"],
  { label: string; value: ReferralTestFormData["testResult"] }[]
> = {
  VIA: [
    { label: getReferralResultDisplay("POSITIVE")!, value: "POSITIVE" },
    { label: getReferralResultDisplay("NEGATIVE")!, value: "NEGATIVE" },
    { label: getReferralResultDisplay("SUSPICIOUS")!, value: "SUSPICIOUS" },
  ],
  PAP_SMEAR: [
    {
      label: getReferralResultDisplay("CYTOLOGY_POSITIVE")!,
      value: "CYTOLOGY_POSITIVE",
    },
    {
      label: getReferralResultDisplay("CYTOLOGY_NEGATIVE")!,
      value: "CYTOLOGY_NEGATIVE",
    },
  ],
  HPV_TEST: [
    { label: getReferralResultDisplay("POSITIVE")!, value: "POSITIVE" },
    { label: getReferralResultDisplay("NEGATIVE")!, value: "NEGATIVE" },
  ],
};

const ACTIONS_BY_TYPE: Record<
  ReferralTestFormData["testType"],
  { label: string; value: NonNullable<ReferralTestFormData["actionTaken"]> }[]
> = {
  VIA: [
    { label: getActionTakenDisplay("TREATED")!, value: "TREATED" },
    { label: getActionTakenDisplay("BIOPSY")!, value: "BIOPSY" },
  ],
  PAP_SMEAR: [{ label: getActionTakenDisplay("BIOPSY")!, value: "BIOPSY" }],
  HPV_TEST: [],
};

const EMPTY_TEST = {
  testType: undefined,
  testResult: undefined,
  actionTaken: undefined,
};

type TestEntryProps = {
  index: number;
  canRemove: boolean;
  onRemove: () => void;
  control: ReturnType<typeof useForm>["control"];
  setValue: ReturnType<typeof useForm>["setValue"];
};

const TestEntry = ({
  index,
  canRemove,
  onRemove,
  control,
  setValue,
}: TestEntryProps) => {
  const testType = useWatch({
    control,
    name: `tests.${index}.testType`,
  }) as ReferralTestFormData["testType"] | undefined;

  const testResult = useWatch({
    control,
    name: `tests.${index}.testResult`,
  }) as ReferralTestFormData["testResult"] | undefined;

  const resultOptions = testType ? RESULTS_BY_TYPE[testType] : [];
  const actionOptions = testType ? ACTIONS_BY_TYPE[testType] : [];
  const NEGATIVE_RESULTS: ReferralTestFormData["testResult"][] = [
    "NEGATIVE",
    "CYTOLOGY_NEGATIVE",
  ];
  const showAction =
    actionOptions.length > 0 &&
    !!testResult &&
    !NEGATIVE_RESULTS.includes(testResult);

  return (
    <View className="border border-outline-200 rounded-md p-4 bg-background-0">
      <HStack className="justify-between items-center mb-3">
        <Text className="font-semibold text-typography-700">
          Test {index + 1}
        </Text>
        {canRemove && (
          <Button size="sm" variant="link" onPress={onRemove} className="p-0">
            <ButtonIcon as={CloseIcon} className="text-error-500" />
          </Button>
        )}
      </HStack>

      <VStack space="md">
        <Controller
          control={control}
          name={`tests.${index}.testType`}
          render={({ field, fieldState: { invalid, error } }) => {
            const selected = TEST_TYPES.find((t) => t.value === field.value);
            return (
              <FormControl isInvalid={invalid} size="md" className="w-full">
                <FormControlLabel>
                  <FormControlLabelText>Test Type</FormControlLabelText>
                </FormControlLabel>
                <Select
                  className="w-full"
                  selectedValue={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setValue(`tests.${index}.testResult`, undefined as any);
                    setValue(`tests.${index}.actionTaken`, undefined as any);
                  }}
                >
                  <SelectTrigger variant="outline" size="md">
                    <SelectInput
                      placeholder="Select test type"
                      className="flex-1"
                      value={selected?.label}
                    />
                    <SelectIcon className="mr-3" as={ChevronDownIcon} />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      {TEST_TYPES.map((t) => (
                        <SelectItem
                          key={t.value}
                          label={t.label}
                          value={t.value}
                        />
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>
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
            );
          }}
        />

        <Controller
          control={control}
          name={`tests.${index}.testResult`}
          render={({ field, fieldState: { invalid, error } }) => {
            const selected = resultOptions.find((r) => r.value === field.value);
            return (
              <FormControl
                isInvalid={invalid}
                isDisabled={!testType}
                size="md"
                className="w-full"
              >
                <FormControlLabel>
                  <FormControlLabelText>Test Result</FormControlLabelText>
                </FormControlLabel>
                <Select
                  className="w-full"
                  selectedValue={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setValue(`tests.${index}.actionTaken`, undefined as any);
                  }}
                >
                  <SelectTrigger variant="outline" size="md">
                    <SelectInput
                      placeholder={
                        testType ? "Select result" : "Select test type first"
                      }
                      className="flex-1"
                      value={selected?.label}
                    />
                    <SelectIcon className="mr-3" as={ChevronDownIcon} />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      {resultOptions.map((r) => (
                        <SelectItem
                          key={r.value}
                          label={r.label}
                          value={r.value}
                        />
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>
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
            );
          }}
        />

        {showAction && (
          <Controller
            control={control}
            name={`tests.${index}.actionTaken`}
            render={({ field, fieldState: { invalid, error } }) => {
              const selected = actionOptions.find(
                (a) => a.value === field.value,
              );
              return (
                <FormControl isInvalid={invalid} size="md" className="w-full">
                  <FormControlLabel>
                    <FormControlLabelText>Action Taken</FormControlLabelText>
                  </FormControlLabel>
                  <Select
                    className="w-full"
                    selectedValue={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger variant="outline" size="md">
                      <SelectInput
                        placeholder="Select action"
                        className="flex-1"
                        value={selected?.label}
                      />
                      <SelectIcon className="mr-3" as={ChevronDownIcon} />
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent>
                        <SelectDragIndicatorWrapper>
                          <SelectDragIndicator />
                        </SelectDragIndicatorWrapper>
                        {actionOptions.map((a) => (
                          <SelectItem
                            key={a.value}
                            label={a.label}
                            value={a.value}
                          />
                        ))}
                      </SelectContent>
                    </SelectPortal>
                  </Select>
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
              );
            }}
          />
        )}
      </VStack>
    </View>
  );
};

const CompleteFollowUpScreen = () => {
  const { referralId } = useLocalSearchParams<{ referralId: string }>();
  const toast = useToast();
  const { completeReferral } = useReferralApi();

  const form = useForm({
    resolver: zodResolver(completeReferralSchema),
    defaultValues: {
      visitedDate: dayjs().toDate(),
      tests: [EMPTY_TEST],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tests",
  });

  const onSubmit = async (data: CompleteReferralFormData) => {
    try {
      await completeReferral(referralId, data);
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toaster
            uniqueToastId={"toast-" + id}
            variant="outline"
            title="Success"
            description="Referral successfully completed"
            action="success"
          />
        ),
      });
      router.back();
    } catch (error) {
      const errors = handleApiErrors(error);
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toaster
            uniqueToastId={"toast-" + id}
            variant="outline"
            title="Error"
            description={errors?.detail}
            action="error"
          />
        ),
      });
    }
  };

  return (
    <ScreenLayout title="Complete Follow up">
      <ScrollView>
        <FormControl className="p-4 w-full bg-background-50">
          <VStack space="lg">
            <Controller
              control={form.control}
              name="visitedDate"
              render={({ field, fieldState: { invalid, error } }) => (
                <DateTimePickerInput
                  date={field.value as Date | undefined}
                  onDateChanged={field.onChange}
                  renderTrigger={({ onPress, formattedDate }) => (
                    <FormControl
                      isInvalid={invalid}
                      size="md"
                      isReadOnly={true}
                      className="w-full"
                    >
                      <FormControlLabel>
                        <FormControlLabelText>
                          Client Date of Visit
                        </FormControlLabelText>
                      </FormControlLabel>
                      <Input className="my-1" size="md">
                        <InputField
                          placeholder="Select date"
                          value={formattedDate}
                        />
                        <InputSlot
                          className="absolute inset-0"
                          onPress={onPress}
                        />
                        <InputSlot className="px-3" onPress={onPress}>
                          <InputIcon as={Calendar} />
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
                />
              )}
            />

            <VStack space="md">
              {fields.map((field, index) => (
                <TestEntry
                  key={field.id}
                  index={index}
                  canRemove={fields.length > 1}
                  onRemove={() => remove(index)}
                  control={form.control as any}
                  setValue={form.setValue as any}
                />
              ))}

              <Button
                variant="outline"
                onPress={() => append(EMPTY_TEST as any)}
                className="w-full border-dashed border-outline-300"
              >
                <ButtonIcon as={AddIcon} className="text-primary-500" />
                <ButtonText className="text-primary-500">
                  Add Another Test
                </ButtonText>
              </Button>
            </VStack>

            <Controller
              control={form.control}
              name="finalDiagnosis"
              render={({ field, fieldState: { invalid, error } }) => (
                <FormControl isInvalid={invalid} size="md" className="w-full">
                  <FormControlLabel>
                    <FormControlLabelText>Final Diagnosis</FormControlLabelText>
                  </FormControlLabel>
                  <Textarea size="md">
                    <TextareaInput
                      placeholder="Type notes here..."
                      {...field}
                      onChangeText={field.onChange}
                    />
                  </Textarea>
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
            />

            <Button
              onPress={form.handleSubmit(onSubmit as any)}
              disabled={form.formState.isSubmitting}
              className="w-full bg-primary-500 justify-between rounded-none"
            >
              {form.formState.isSubmitting && (
                <ButtonSpinner className="text-typography-0" />
              )}
              <ButtonText size="lg" className="text-background-100">
                Complete
              </ButtonText>
              <ButtonIcon as={ArrowRightIcon} />
            </Button>
          </VStack>
        </FormControl>
      </ScrollView>
    </ScreenLayout>
  );
};

export default CompleteFollowUpScreen;
