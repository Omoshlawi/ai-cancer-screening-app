import React from "react";
import { Box } from "../ui/box";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";

const VariableValue = ({
  value,
  variable,
  score,
}: {
  value: string | number;
  variable: string;
  score?: number;
}) => {
  return (
    <Box className="w-full flex flex-row items-center justify-between py-2 border-b border-background-100">
      <Text size="sm" className="text-typography-600 flex-1">
        {variable}
      </Text>
      <HStack space="md" className="items-center">
        <Text size="sm" className="text-typography-900 font-bold">
          {value}
        </Text>
        {score !== undefined && score !== null && (
          <Box className="bg-primary-50 px-2 py-0.5 rounded">
            <Text size="xs" className="text-primary-700 font-bold">
              +{score}
            </Text>
          </Box>
        )}
      </HStack>
    </Box>
  );
};

export default VariableValue;
