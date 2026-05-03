import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import FormStepHeader from "@/components/ui/form-step-header";
import { HStack } from "@/components/ui/hstack";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CircleIcon,
} from "@/components/ui/icon";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "@/components/ui/radio";
import { VStack } from "@/components/ui/vstack";
import {
  SCREENING_FORM_BOOLEAN_OPTIONS,
  SCREENING_FORM_STEPS,
} from "@/lib/constants";
import { ScreenClientFormData } from "@/types/screening";
import { AlertCircleIcon, Stethoscope } from "lucide-react-native";
import React, { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";

type DiagnosisHistoryProps = {
  onNext: () => void;
  onPrevious: () => void;
};

const DiagnosisHistory: FC<DiagnosisHistoryProps> = ({
  onNext,
  onPrevious,
}) => {
  const form = useFormContext<ScreenClientFormData>();
  return (
    <VStack space="md" className="flex-1 items-center">
      <FormStepHeader icon={Stethoscope} title={SCREENING_FORM_STEPS[2]} />

      <Controller
        control={form.control}
        name="everDiagnosedWithHIV"
        render={({ field, fieldState: { invalid, error } }) => (
          <FormControl
            isInvalid={invalid}
            size="md"
            isDisabled={false}
            isReadOnly={false}
            isRequired={false}
            className="w-full"
          >
            <FormControlLabel>
              <FormControlLabelText>
                Have you ever been diagnosed with HIV?
              </FormControlLabelText>
            </FormControlLabel>
            <RadioGroup value={field.value} onChange={field.onChange}>
              <VStack space="sm">
                {SCREENING_FORM_BOOLEAN_OPTIONS.map((option) => (
                  <Radio key={option.value} value={option.value}>
                    <RadioIndicator>
                      <RadioIcon as={CircleIcon} />
                    </RadioIndicator>
                    <RadioLabel>{option.label}</RadioLabel>
                  </Radio>
                ))}
              </VStack>
            </RadioGroup>

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
      <Controller
        control={form.control}
        name="everDiagnosedWithHPV"
        render={({ field, fieldState: { invalid, error } }) => (
          <FormControl
            isInvalid={invalid}
            size="md"
            isDisabled={false}
            isReadOnly={false}
            isRequired={false}
            className="w-full"
          >
            <FormControlLabel>
              <FormControlLabelText>
                Have you ever been diagnosed with HPV?
              </FormControlLabelText>
            </FormControlLabel>
            <RadioGroup value={field.value} onChange={field.onChange}>
              <VStack space="sm">
                {SCREENING_FORM_BOOLEAN_OPTIONS.map((option) => (
                  <Radio key={option.value} value={option.value}>
                    <RadioIndicator>
                      <RadioIcon as={CircleIcon} />
                    </RadioIndicator>
                    <RadioLabel>{option.label}</RadioLabel>
                  </Radio>
                ))}
              </VStack>
            </RadioGroup>

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
      <Controller
        control={form.control}
        name="everDiagnosedWithSTI"
        render={({ field, fieldState: { invalid, error } }) => (
          <FormControl
            isInvalid={invalid}
            size="md"
            isDisabled={false}
            isReadOnly={false}
            isRequired={false}
            className="w-full"
          >
            <FormControlLabel>
              <FormControlLabelText>
                Have you ever been diagnosed with STI?
              </FormControlLabelText>
            </FormControlLabel>
            <RadioGroup value={field.value} onChange={field.onChange}>
              <VStack space="sm">
                {SCREENING_FORM_BOOLEAN_OPTIONS.map((option) => (
                  <Radio key={option.value} value={option.value}>
                    <RadioIndicator>
                      <RadioIcon as={CircleIcon} />
                    </RadioIndicator>
                    <RadioLabel>{option.label}</RadioLabel>
                  </Radio>
                ))}
              </VStack>
            </RadioGroup>

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

      <HStack space="sm" className="w-full">
        <Button
          action="secondary"
          className="flex-1 justify-between"
          onPress={onPrevious}
        >
          <ButtonIcon as={ArrowLeftIcon} />
          <ButtonText>Previous</ButtonText>
        </Button>
        <Button
          action="primary"
          className="flex-1 bg-primary-500 justify-between"
          onPress={async () => {
            const isValid = await form.trigger([
              "everDiagnosedWithHIV",
              "everDiagnosedWithHPV",
              "everDiagnosedWithSTI",
            ]);
            if (isValid) {
              onNext();
            }
          }}
        >
          <ButtonText>Next</ButtonText>
          <ButtonIcon as={ArrowRightIcon} />
        </Button>
      </HStack>
    </VStack>
  );
};

export default DiagnosisHistory;
