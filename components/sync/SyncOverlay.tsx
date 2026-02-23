import Toaster from "@/components/toaster";
import { useSyncOfflineData } from "@/hooks/useSyncOfflineData";
import React, { useEffect, useRef } from "react";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "../ui/actionsheet";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Progress, ProgressFilledTrack } from "../ui/progress";
import { Spinner } from "../ui/spinner";
import { Text } from "../ui/text";
import { useToast } from "../ui/toast";
import { VStack } from "../ui/vstack";

const SyncOverlay = () => {
  const {
    shouldShowOverlay,
    isSyncing,
    progress,
    errors,
    isCompleted,
    syncedClientsCount,
    syncedScreeningsCount,
    durationMs,
  } = useSyncOfflineData();
  const toast = useToast();
  const toastShownRef = useRef(false);
  const percent =
    progress.total > 0
      ? Math.min(100, Math.round((progress.completed / progress.total) * 100))
      : 0;

  useEffect(() => {
    if (!isCompleted && toastShownRef.current) {
      toastShownRef.current = false;
    }
  }, [isCompleted]);

  useEffect(() => {
    if (isCompleted && !toastShownRef.current) {
      toastShownRef.current = true;
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          const seconds = durationMs
            ? Math.max(1, Math.round(durationMs / 1000))
            : 0;
          const description = `${syncedClientsCount} client(s), ${syncedScreeningsCount} screening(s) synced in ${seconds}s. ${errors.length} issue(s) encountered.`;
          return (
            <Toaster
              uniqueToastId={uniqueToastId}
              variant="outline"
              title="Sync Complete"
              description={description}
              action="success"
            />
          );
        },
      });
    }
  }, [
    isCompleted,
    syncedClientsCount,
    syncedScreeningsCount,
    durationMs,
    errors.length,
    toast,
  ]);

  if (!shouldShowOverlay) {
    return null;
  }

  return (
    <Actionsheet
      isOpen={true}
      onClose={() => {
        // Indismissable while syncing: ignore close attempts
      }}
    >
      <ActionsheetBackdrop />
      <ActionsheetContent style={{ maxHeight: "80%" }}>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <VStack space="lg" className="w-full">
          <Heading size="md">Sync Required</Heading>
          <Text size="sm" className="color-typography-500">
            You are back online. We need to sync your offline data before you
            continue.
          </Text>
          <VStack space="sm">
            <HStack space="sm" className="items-center">
              {isSyncing ? <Spinner /> : null}
              <Text size="sm">
                {isSyncing ? "Syncing data..." : "Preparing sync..."}
              </Text>
            </HStack>
            <Progress value={percent}>
              <ProgressFilledTrack />
            </Progress>
            <Text size="xs">
              {progress.completed}/{progress.total} items
            </Text>
          </VStack>
          {errors.length > 0 ? (
            <VStack space="xs">
              <Heading size="xs">Issues encountered</Heading>
              <Text size="xs" className="color-error-500">
                {errors.length} item(s) failed to sync. They will remain offline
                for retry.
              </Text>
            </VStack>
          ) : null}
          <Text size="xs" className="color-typography-400">
            This sheet will close automatically when sync completes.
          </Text>
        </VStack>
      </ActionsheetContent>
    </Actionsheet>
  );
};

export default SyncOverlay;
