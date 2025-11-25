import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { SCREENING_FORM_STEPS } from "@/lib/constants";
import { Phone } from "lucide-react-native";
import React from "react";

const ScreeningResults = () => {
  return (
    <VStack space="md" className="flex-1 items-center">
      <Icon
        as={Phone}
        size="sm"
        className="text-teal-500 rounded-full p-6 bg-teal-100"
      />
      <Heading size="sm" className="text-typography-500">
        {SCREENING_FORM_STEPS[7]}
      </Heading>
    </VStack>
  );
};

export default ScreeningResults;
