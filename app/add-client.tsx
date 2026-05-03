import {
  ContactInformation,
  IdentificationAndStatus,
  PersonalInformation,
  SuccessSubmussion,
} from "@/components/client/form";
import { KeyboardAvoidingLayout, ScreenLayout } from "@/components/layout";
import Toaster from "@/components/toaster";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { clientSchema } from "@/constants/schemas";
import { useClientApi } from "@/hooks/useClients";
import { handleApiErrors } from "@/lib/api";
import { Client, ClientFormData } from "@/types/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, IdCard, Phone, UserCircle } from "lucide-react-native";
import React, { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { FormStepper } from "@/components/ui/form-stepper";
import { Box } from "@/components/ui/box";

const AddClientScreen = () => {
  const [step, setStep] = useState(1);
  const [cli, setCli] = useState<Client | ClientFormData>();
  const toast = useToast();
  const form = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      county: "",
      subcounty: "",
      ward: "",
    },
  });

  const steps = [
    { icon: UserCircle, label: "Profile" },
    { icon: Phone, label: "Contact" },
    { icon: IdCard, label: "Status" },
    { icon: CheckCircle, label: "Finish" },
  ];

  const { createClient } = useClientApi();
  const onSubmit: SubmitHandler<ClientFormData> = async (data) => {
    try {
      const _client = await createClient(data);
      if (_client) {
        setStep(4);
        setCli(_client);
        toast.show({
          placement: "top",
          render: ({ id }) => {
            const uniqueToastId = "toast-" + id;
            return (
              <Toaster
                uniqueToastId={uniqueToastId}
                variant="outline"
                title="Success"
                description="Client successfully registered"
                action="success"
              />
            );
          },
        });
      }
    } catch (error) {
      const errors = handleApiErrors<ClientFormData>(error);
      if (errors.detail) {
        toast.show({
          placement: "top",
          render: ({ id }) => {
            const uniqueToastId = "toast-" + id;
            return (
              <Toaster
                uniqueToastId={uniqueToastId}
                variant="outline"
                title="Error"
                description={errors.detail}
                action="error"
              />
            );
          },
        });
      } else {
        Object.entries(errors ?? {}).forEach(([field, error]) => {
          form.setError(field as keyof ClientFormData, { message: error });
          form.setValue("county", "");
          form.setValue("subcounty", "");
          form.setValue("ward", "");
          toast.show({
            placement: "top",
            render: ({ id }) => {
              const uniqueToastId = "toast-" + id;
              return (
                <Toaster
                  uniqueToastId={uniqueToastId}
                  variant="outline"
                  title={`${field} Error `}
                  description={error}
                  action="error"
                />
              );
            },
          });
        });
      }
    }
  };

  return (
    <ScreenLayout title="Add New Client">
      <FormProvider {...form}>
        <VStack space="lg" className="flex-1">
          <Card size="md" variant="elevated" className="px-0 pt-0 pb-4 overflow-hidden">
             <FormStepper steps={steps} currentStep={step} />
          </Card>
          <Card size="md" variant="elevated" className="flex-1 p-0 overflow-hidden">
            <KeyboardAvoidingLayout>
              <Box className="p-4 flex-1">
                {step === 1 && <PersonalInformation onNext={() => setStep(2)} />}
                {step === 2 && (
                  <ContactInformation
                    onNext={() => setStep(3)}
                    onPrevious={() => setStep(1)}
                  />
                )}
                {step === 3 && (
                  <IdentificationAndStatus
                    onNext={form.handleSubmit(onSubmit)}
                    onPrevious={() => setStep(2)}
                  />
                )}
                {step === 4 && cli && <SuccessSubmussion client={cli} />}
              </Box>
            </KeyboardAvoidingLayout>
          </Card>
        </VStack>
      </FormProvider>
    </ScreenLayout>
  );
};

export default AddClientScreen;
