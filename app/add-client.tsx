import {
  ContactInformation,
  IdentificationAndStatus,
  PersonalInformation,
  SuccessSubmussion,
} from "@/components/client/form";
import { ScreenLayout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { clientSchema } from "@/constants/schemas";
import { ClientFormData } from "@/types/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, IdCard, Phone, UserCircle } from "lucide-react-native";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

const AddClientScreen = () => {
  const [step, setStep] = useState(1);
  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: new Date(),
      phoneNumber: "",
      address: "",
      nationalId: "",
      maritalStatus: "single",
    },
  });
  return (
    <ScreenLayout title="Add New Client">
      <FormProvider {...form}>
        <VStack space="lg" className="flex-1">
          <Card size="md" variant="elevated">
            <HStack className="justify-between items-center">
              <Icon
                as={UserCircle}
                size="sm"
                className={
                  step === 1
                    ? "bg-teal-500 text-white rounded-full p-4"
                    : "bg-gray-200 text-gray-500 p-4 rounded-full"
                }
              />
              <Icon
                as={Phone}
                size="sm"
                className={
                  step === 2
                    ? "bg-teal-500 text-white rounded-full p-4"
                    : "bg-gray-200 text-gray-500 p-4 rounded-full"
                }
              />
              <Icon
                as={IdCard}
                size="sm"
                className={
                  step === 3
                    ? "bg-teal-500 text-white rounded-full p-4"
                    : "bg-gray-200 text-gray-500 p-4 rounded-full"
                }
              />
              <Icon
                as={CheckCircle}
                size="sm"
                className={
                  step === 4
                    ? "bg-teal-500 text-white rounded-full p-4"
                    : "bg-gray-200 text-gray-500 p-4 rounded-full"
                }
              />
            </HStack>
            <Heading size="sm" className="text-center mt-4">
              {step === 1 && "Personal Information"}
              {step === 2 && "Contact Information"}
              {step === 3 && "Identification and Status"}
              {step === 4 && "Success"}
            </Heading>
          </Card>
          <Card size="md" variant="elevated" className="flex-1">
            {step === 1 && <PersonalInformation onNext={() => setStep(2)} />}
            {step === 2 && (
              <ContactInformation
                onNext={() => setStep(3)}
                onPrevious={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <IdentificationAndStatus
                onNext={() => setStep(4)}
                onPrevious={() => setStep(2)}
              />
            )}
            {step === 4 && <SuccessSubmussion />}
          </Card>
        </VStack>
      </FormProvider>
    </ScreenLayout>
  );
};

export default AddClientScreen;
