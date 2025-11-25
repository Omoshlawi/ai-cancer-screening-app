import { BottomSheet } from "@/components/auth";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { SCREENING_FORM_STEPS } from "@/lib/constants";
import { ScreenClientFormData } from "@/types/client";
import { router } from "expo-router";
import { ArrowRightIcon, Phone, UserPlus } from "lucide-react-native";
import React, { FC } from "react";
import { useFormContext } from "react-hook-form";

type ClientSearchProps = {
  onNext: () => void;
};

const ClientSearch: FC<ClientSearchProps> = ({ onNext }) => {
  const form = useFormContext<ScreenClientFormData>();
  return (
    <VStack space="md" className="flex-1 items-center">
      <Icon
        as={Phone}
        size="sm"
        className="text-teal-500 rounded-full p-6 bg-teal-100"
      />
      <Heading size="sm" className="text-typography-500">
        {SCREENING_FORM_STEPS[0]}
      </Heading>

      

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
