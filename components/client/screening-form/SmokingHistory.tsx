import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { SCREENING_FORM_STEPS } from "@/lib/constants";
import { ScreenClientFormData } from "@/types/client";
import { ArrowLeftIcon, ArrowRightIcon, UserSearch } from "lucide-react-native";
import React, { FC } from "react";
import { useFormContext } from "react-hook-form";

type SmokingHistoryProps = {
  onNext: () => void;
  onPrevious: () => void;
};

const SmokingHistory: FC<SmokingHistoryProps> = ({ onNext, onPrevious }) => {
  const form = useFormContext<ScreenClientFormData>();
  return (
    <VStack space="md" className="flex-1 items-center">
      <Box className="bg-teal-100 rounded-full p-6 w-fit ">
        <Icon
          as={UserSearch}
          size="sm"
          className="text-teal-500 rounded-full p-6 bg-teal-100"
        />
      </Box>
      <Heading size="sm" className="text-typography-500">
        {SCREENING_FORM_STEPS[6]}
      </Heading>

      <HStack space="sm" className="w-full">
        <Button
          action="secondary"
          size="sm"
          className="flex-1 justify-between rounded-none"
          onPress={onPrevious}
        >
          <ButtonIcon as={ArrowLeftIcon} />
          <ButtonText>Previous</ButtonText>
        </Button>
        <Button
          action="primary"
          size="sm"
          className="flex-1 bg-teal-500 justify-between rounded-none"
          onPress={async () => {
            const isValid = await form.trigger(["smoke"]);
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

export default SmokingHistory;
