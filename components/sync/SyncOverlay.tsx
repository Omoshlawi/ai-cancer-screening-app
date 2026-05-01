import Toaster from "@/components/toaster";
import { useSyncOfflineData } from "@/hooks/useSyncOfflineData";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "../ui/actionsheet";
import { Button, ButtonText } from "../ui/button";
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
    acknowledgeOverlay,
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
        // Indismissable: ignore close attempts; user must acknowledge via CTA
      }}
    >
      <ActionsheetBackdrop />
      <ActionsheetContent style={{ maxHeight: "80%" }}>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <VStack space="lg" className="w-full">
          {!isCompleted ? (
            <>
              <Heading size="md">Sync Required</Heading>
              <Text size="sm" className="color-typography-500">
                You are back online. We need to sync your offline data before
                you continue.
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
                    {errors.length} item(s) failed to sync. They will remain
                    offline for retry.
                  </Text>
                </VStack>
              ) : null}
              <Text size="xs" className="color-typography-400">
                Please wait; this sheet will update when sync completes.
              </Text>
            </>
          ) : (
            <>
              <Heading size="md">Sync Complete</Heading>
              <Text size="sm" className="color-typography-500">
                All offline items have been processed. Review highlights and
                proceed to Today’s Screenings to follow up.
              </Text>
              <VStack space="xs">
                <Text size="sm" className="color-typography-600">
                  Clients synced: {syncedClientsCount}
                </Text>
                <Text size="sm" className="color-typography-600">
                  Screenings synced: {syncedScreeningsCount}
                </Text>
                <Text size="sm" className="color-typography-600">
                  Duration:{" "}
                  {durationMs ? Math.max(1, Math.round(durationMs / 1000)) : 0}s
                </Text>
                <Text size="sm" className="color-typography-600">
                  Issues: {errors.length} item(s) retained offline for retry
                </Text>
              </VStack>
              <VStack space="sm">
                <Text size="xs" className="color-typography-500">
                  Visit Today’s Screenings to:
                </Text>
                <Text size="xs" className="color-typography-500">
                  - Follow up on high risk clients (referrals)
                </Text>
                <Text size="xs" className="color-typography-500">
                  - Schedule rescreening follow-ups based on results
                </Text>
              </VStack>
              <Button
                action="primary"
                className="bg-primary-500"
                onPress={() => {
                  acknowledgeOverlay();
                  router.push("/screenings-today");
                }}
              >
                <ButtonText>View Today’s Screenings</ButtonText>
              </Button>
            </>
          )}
        </VStack>
      </ActionsheetContent>
    </Actionsheet>
  );
};

export default SyncOverlay;
