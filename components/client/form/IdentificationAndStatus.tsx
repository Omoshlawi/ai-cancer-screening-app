import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { ArrowLeftIcon, Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { ArrowRightIcon, IdCard } from "lucide-react-native";
import React from "react";

type IdentificationAndStatusProps = {
  onNext: () => void;
  onPrevious: () => void;
};

const IdentificationAndStatus = ({
  onNext,
  onPrevious,
}: IdentificationAndStatusProps) => {
  return (
    <VStack space="md" className="flex-1 items-center">
      <Icon
        as={IdCard}
        size="sm"
        className="text-teal-500 rounded-full p-6 bg-teal-100"
      />
      <Heading size="sm" className="text-typography-500">
        Identification and Status
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
          onPress={onNext}
        >
          <ButtonText>Next</ButtonText>
          <ButtonIcon as={ArrowRightIcon} />
        </Button>
      </HStack>
    </VStack>
  );
};

export default IdentificationAndStatus;
