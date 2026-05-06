import { APIFetchError } from "@/lib/api";
import * as React from "react";
import { Box } from "../ui/box";
import { Text } from "../ui/text";
import ErrorStateSvg from "./ErrorStateSvg";

type ErrorStateProps<T> = {
  message?: string;
  detail?: string;
  error?: APIFetchError<T>;
};
const ErrorState = <T extends { detail?: string; [k: string]: any }>({
  message,
  detail,
  error,
}: ErrorStateProps<T>) => {
  return (
    <Box className="flex-1 flex-col gap-m justify-center items-center">
      <ErrorStateSvg width={"80%"} style={{ aspectRatio: 1 }} />

      {(message || error) && (
        <Text className="">{error?.message ?? message}</Text>
      )}
      {(detail || error) && (
        <Text className="">
          {error?.response?.data?.detail ??
            error?.response?.data?.message ??
            detail}
        </Text>
      )}
    </Box>
  );
};

export default ErrorState;
