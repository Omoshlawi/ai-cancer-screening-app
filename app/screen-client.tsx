import {
  ClientSearch,
  ContraceptiveUse,
  DiagnosisHistory,
  FamilyHistory,
  ObstetricHostory,
  ReviewAndSubmit,
  ScreeningHistory,
  ScreeningResults,
  SexualHealthHistory,
  SmokingHistory,
} from "@/components/client/screening-form";
import { ScreenLayout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { screenClientSchema } from "@/constants/schemas";
import { useSearchClients } from "@/hooks/useClients";
import { SCREENING_FORM_STEPS } from "@/lib/constants";
import { ScreenClientFormData } from "@/types/client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

const ScreenClientScreen = () => {
  const [step, setStep] = useState(1);

  const form = useForm<ScreenClientFormData>({
    resolver: zodResolver(screenClientSchema),
    defaultValues: {
      clientId: "",
      lifeTimePatners: 0,
      firstIntercourseAge: 0,
      everDiagnosedWithHIV: "NOT_SURE",
      everDiagnosedWithHPV: "NOT_SURE",
      everDiagnosedWithSTI: "NOT_SURE",
      totalBirths: 0,
      everScreenedForCervicalCancer: "NOT_SURE",
      usedOralContraceptivesForMoreThan5Years: "NOT_SURE",
      smoke: "NEVER",
      familyMemberDiagnosedWithCervicalCancer: "NO",
    },
  });

  const seachClientAsync = useSearchClients();

  const onSubmit: SubmitHandler<ScreenClientFormData> = async (data) => {
    try {
      // await screenClient(data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <ScreenLayout title="Screen Client">
      <FormProvider {...form}>
        <VStack space="lg" className="flex-1">
          <Card size="md" variant="elevated">
            <VStack space="md">
              <Text size="sm">{`Step ${step} of ${SCREENING_FORM_STEPS.length}`}</Text>
              <Progress
                value={(step / SCREENING_FORM_STEPS.length) * 100}
                size="md"
                orientation="horizontal"
              >
                <ProgressFilledTrack className="bg-teal-500" />
              </Progress>
              <Text size="sm">{SCREENING_FORM_STEPS[step - 1]}</Text>
            </VStack>
          </Card>
          <Card size="md" variant="elevated" className="flex-1">
            {step === 1 && (
              <ClientSearch
                onNext={() => setStep(2)}
                searchClientAsync={seachClientAsync}
              />
            )}
            {step === 2 && (
              <SexualHealthHistory
                onNext={() => setStep(3)}
                onPrevious={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <DiagnosisHistory
                onNext={() => setStep(4)}
                onPrevious={() => setStep(2)}
              />
            )}
            {step === 4 && (
              <ObstetricHostory
                onNext={() => setStep(5)}
                onPrevious={() => setStep(3)}
              />
            )}
            {step === 5 && (
              <ScreeningHistory
                onNext={() => setStep(6)}
                onPrevious={() => setStep(4)}
              />
            )}
            {step === 6 && (
              <ContraceptiveUse
                onNext={() => setStep(7)}
                onPrevious={() => setStep(5)}
              />
            )}
            {step === 7 && (
              <SmokingHistory
                onNext={() => setStep(8)}
                onPrevious={() => setStep(6)}
              />
            )}
            {step === 8 && (
              <FamilyHistory
                onNext={() => setStep(9)}
                onPrevious={() => setStep(7)}
              />
            )}
            {step === 9 && (
              <ReviewAndSubmit
                onNext={form.handleSubmit(onSubmit)}
                onPrevious={() => setStep(8)}
                clients={seachClientAsync.clients}
              />
            )}

            {step === 10 /*&& cli*/ && <ScreeningResults />}
          </Card>
        </VStack>
      </FormProvider>
    </ScreenLayout>
  );
};

export default ScreenClientScreen;
