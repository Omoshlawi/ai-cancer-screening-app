import * as React from "react";
import { Box } from "../ui/box";
import { Heading } from "../ui/heading";
import EmptyStateSvg from "./EmptyStateSvg";

type EmptyStateProps = {
  message?: string;
};

const EmptyState: React.FC<EmptyStateProps> = ({
  message = "No data available",
}) => {
  return (
    <Box className="flex-1 flex-col gap-m justify-center items-center">
      <EmptyStateSvg width={"80%"} style={{ aspectRatio: 1 }} />
      <Heading size="xs" className="text-center">
        {message}
      </Heading>
    </Box>
  );
};

export default EmptyState;
