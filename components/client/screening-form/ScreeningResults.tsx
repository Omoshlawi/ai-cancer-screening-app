import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { SCREENING_FORM_STEPS } from "@/lib/constants";
import { Screening } from "@/types/screening";
import { UserSearch } from "lucide-react-native";
import React, { FC } from "react";

type ScreeningResultsProps = {
  screening: Screening;
};
const ScreeningResults: FC<ScreeningResultsProps> = ({ screening }) => {
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
        {SCREENING_FORM_STEPS[7]}
      </Heading>
    </VStack>
  );
};

export default ScreeningResults;
