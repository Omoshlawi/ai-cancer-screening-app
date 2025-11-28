import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { getBooleanDisplayValue, getSmokingDisplayValue } from "@/lib/helpers";
import { Client } from "@/types/client";

import { ScreenClientFormData } from "@/types/screening";
import dayjs from "dayjs";
import { ArrowLeftIcon } from "lucide-react-native";
import React, { FC, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import VariableValue from "../VariableValue";

type ReviewAndSubmitProps = {
  onNext: () => Promise<void>;
  onPrevious: () => void;
  clients?: Client[];
};

const ReviewAndSubmit: FC<ReviewAndSubmitProps> = ({
  onNext,
  onPrevious,
  clients = [],
}) => {
  const form = useFormContext<ScreenClientFormData>();
  const clientId = form.watch("clientId");
  const client = clients.find((client) => client.id === clientId);

  const values = useMemo<{ variable: string; value: string | number }[]>(() => {
    return [
      {
        variable: "Client Name",
        value: client?.firstName + " " + client?.lastName,
      },
      {
        variable: "Age",
        value: client?.dateOfBirth
          ? dayjs().diff(dayjs(client.dateOfBirth), "years")
          : "N/A",
      },
      {
        variable: "Age at first intercourse",
        value: form.watch("firstIntercourseAge"),
      },
      {
        variable: "Lifetime partners",
        value: form.watch("lifeTimePatners"),
      },
      {
        variable: "HIV diagnosis",
        value: getBooleanDisplayValue(form.watch("everDiagnosedWithHIV")),
      },
      {
        variable: "HPV diagnosis",
        value: getBooleanDisplayValue(form.watch("everDiagnosedWithHPV")),
      },
      {
        variable: "STI diagnosis",
        value: getBooleanDisplayValue(form.watch("everDiagnosedWithSTI")),
      },
      {
        variable: "Number of births",
        value: form.watch("totalBirths"),
      },

      {
        variable: "Screened before",
        value: getBooleanDisplayValue(
          form.watch("everScreenedForCervicalCancer")
        ),
      },
      {
        variable: "OCP>5 years",
        value: getBooleanDisplayValue(
          form.watch("usedOralContraceptivesForMoreThan5Years")
        ),
      },
      {
        variable: "Smoking History",
        value: getSmokingDisplayValue(form.watch("smoking")),
      },
      {
        variable: "Family History",
        value: getBooleanDisplayValue(
          form.watch("familyMemberDiagnosedWithCervicalCancer")
        ),
      },
    ];
  }, [client?.dateOfBirth, client?.firstName, client?.lastName, form]);

  return (
    <VStack space="md" className="flex-1 items-center">
      <Heading size="xs" className="text-start w-full">
        Risk Factors Identified
      </Heading>

      <VStack space="sm">
        {values.map((value, i) => (
          <VariableValue
            key={i}
            value={value.value}
            variable={value.variable}
          />
        ))}
      </VStack>

      <HStack space="sm" className="w-full">
        <Button
          action="secondary"
          size="sm"
          className="flex-1 justify-between rounded-none"
          onPress={onPrevious}
        >
          <ButtonIcon as={ArrowLeftIcon} />
          <ButtonText>Edit/Go back</ButtonText>
        </Button>
        <Button
          action="primary"
          size="sm"
          className="flex-1 bg-teal-500 justify-between rounded-none"
          isDisabled={form.formState.isSubmitting}
          onPress={async () => {
            const isValid = await form.trigger();
            if (isValid) {
              await onNext();
            }
          }}
        >
          {form.formState.isSubmitting && (
            <ButtonSpinner color={"white"} size={"small"} />
          )}
          <ButtonText>
            {form.formState.isSubmitting ? "Submitting..." : "Submit"}
          </ButtonText>
        </Button>
      </HStack>
    </VStack>
  );
};

export default ReviewAndSubmit;
