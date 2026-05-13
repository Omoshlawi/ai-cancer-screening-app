import VariableValue from "@/components/client/VariableValue";
import { ReferralFollowUps } from "@/components/follow-up";
import ScreenLayout from "@/components/layout/ScreenLayout";
import { ErrorState, When } from "@/components/state-full-widgets";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { EditIcon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useUserHasSystemAccess } from "@/hooks/use-user-has-access";
import { useReferral } from "@/hooks/useReferrals";
import { authClient } from "@/lib/auth-client";
import {
  getActionTakenDisplay,
  getReferralResultDisplay,
  getReferralStatusDisplayValue,
  getRiskInterpretation,
  getTestTypeDisplay,
} from "@/lib/helpers";
import { Referral } from "@/types/screening";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import { PlusIcon } from "lucide-react-native";
import React, { useMemo } from "react";
import { ScrollView } from "react-native";

const ReferralDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: sessionData } = authClient.useSession();
  const { referral, isLoading, error } = useReferral(id);
  const { hasAccess } = useUserHasSystemAccess({ followups: ["create"] });
  const { hasAccess: hasFollowupList } = useUserHasSystemAccess({
    followups: ["list"],
  });
  const { hasAccess: canComplete } = useUserHasSystemAccess({
    referrals: ["complete"],
  });

  return (
    <ScreenLayout title="Referral Detail">
      <When
        asyncState={{ isLoading, error, data: referral }}
        error={(e) => <ErrorState error={e} />}
        loading={() => <Spinner color="primary" />}
        success={(referral) => (
          <ScrollView>
            <VStack space="md" className="flex-1">
              <ClientDetailsDetails referral={referral!} />
              <AppointmentDetails referral={referral!} />
              <Card
                size="lg"
                variant="elevated"
                className="gap-3 bg-background-0 rounded-none"
              >
                <Heading size="sm" className="text-typography-500 font-bold">
                  Clinical Notes:
                </Heading>
                <Text size="sm" className="text-typography-500">
                  {referral?.additionalNotes
                    ? referral?.additionalNotes
                    : "No clinical notes"}
                </Text>
              </Card>
              {canComplete &&
                referral?.status === "COMPLETED" &&
                !!referral.tests?.length && (
                  <TestOutcomes referral={referral!} canEdit={canComplete} />
                )}
              {hasFollowupList && <ReferralFollowUps referral={referral!} />}
              {referral?.status !== "COMPLETED" &&
                hasAccess &&
                referral?.screening?.provider?.userId ===
                  sessionData?.user?.id && (
                  <AddFollowUpBtn referral={referral!} />
                )}
              {referral?.status !== "COMPLETED" && canComplete && (
                <CompleteReferralBtn referral={referral!} />
              )}
            </VStack>
          </ScrollView>
        )}
      />
    </ScreenLayout>
  );
};

export default ReferralDetailScreen;

const ClientDetailsDetails = ({ referral }: { referral: Referral }) => {
  const { screening } = referral;
  const values = useMemo<
    { variable: string; value: string | number | undefined }[]
  >(() => {
    return [
      {
        variable: "Client Name",
        value: `${screening?.client?.firstName} ${screening?.client?.lastName}`,
      },
      {
        variable: "Age",
        value: screening?.client?.dateOfBirth
          ? dayjs().diff(dayjs(screening.client?.dateOfBirth), "years")
          : "N/A",
      },
      {
        variable: "Phone Number",
        value: screening?.client?.phoneNumber ?? "N/A",
      },
      {
        variable: "Screening Score",
        value: screening?.scoringResult?.aggregateScore?.toString() ?? "N/A",
      },
      {
        variable: "Screening Interpretation",
        value: screening?.scoringResult?.interpretation
          ? getRiskInterpretation(screening?.scoringResult?.interpretation)
          : "N/A",
      },
      {
        variable: "Referred By",
        value: `${(screening?.provider as any)?.firstName} ${(screening?.provider as any)?.lastName} (${(screening?.provider as any)?.phoneNumber})`,
      },
    ];
  }, [screening]);
  return (
    <Card
      size="lg"
      variant="elevated"
      className="gap-3 bg-background-0 rounded-none"
    >
      <VStack space="sm">
        <Heading size="sm" className="text-typography-500">
          Client Details
        </Heading>
        {values.map((value, i) => {
          return (
            <VariableValue
              key={i}
              value={value.value ?? "N/A"}
              variable={value.variable}
            />
          );
        })}
      </VStack>
    </Card>
  );
};

const AppointmentDetails = ({ referral }: { referral: Referral }) => {
  const values = useMemo<
    { variable: string; value: string | number | undefined }[]
  >(() => {
    return [
      {
        variable: "Appointment Time",
        value: dayjs(referral.appointmentTime).format("DD/MM/YYYY HH:mm"),
      },
      {
        variable: "Health Facility",
        value: referral.healthFacility?.name,
      },
      {
        variable: "Status",
        value: getReferralStatusDisplayValue(referral.status),
      },
    ];
  }, [referral]);
  return (
    <Card
      size="lg"
      variant="elevated"
      className="gap-3 bg-background-0 rounded-none"
    >
      <VStack space="sm">
        <Heading size="sm" className="text-typography-500">
          Appointment Details
        </Heading>
        {values.map((value, i) => {
          return (
            <VariableValue
              key={i}
              value={value.value ?? "N/A"}
              variable={value.variable}
            />
          );
        })}
      </VStack>
    </Card>
  );
};

const AddFollowUpBtn = ({ referral }: { referral: Referral }) => {
  return (
    <Button
      action="primary"
      className="bg-primary-500"
      onPress={() => {
        router.push({
          pathname: "/follow-up",
          params: {
            referralId: referral.id,
            appointmentTime: referral?.appointmentTime,
            screeningId: referral?.screeningId,
          },
        });
      }}
    >
      <ButtonIcon as={PlusIcon} />
      <ButtonText>Add Follow Up</ButtonText>
    </Button>
  );
};

const CompleteReferralBtn = ({ referral }: { referral: Referral }) => {
  return (
    <Button
      action="positive"
      onPress={() => {
        router.push({
          pathname: "/referral/[id]/complete",
          params: { id: referral.id },
        });
      }}
    >
      <ButtonText>Complete Referral</ButtonText>
    </Button>
  );
};

const TestOutcomes = ({
  referral,
  canEdit,
}: {
  referral: Referral;
  canEdit: boolean;
}) => (
  <Card
    size="lg"
    variant="elevated"
    className="gap-3 bg-background-0 rounded-none"
  >
    <VStack space="sm">
      <HStack className="justify-between items-center">
        <Heading size="sm" className="text-typography-500 font-bold">
          Test Outcomes
        </Heading>
        {canEdit && (
          <Button
            size="sm"
            variant="link"
            onPress={() =>
              router.push({
                pathname: "/referral/[id]/complete",
                params: { id: referral.id },
              })
            }
          >
            <ButtonIcon as={EditIcon} className="text-primary-500" />
            <ButtonText className="text-primary-500">Edit</ButtonText>
          </Button>
        )}
      </HStack>
      {referral.visitedDate && (
        <VariableValue
          variable="Date Visited"
          value={dayjs(referral.visitedDate).format("DD/MM/YYYY")}
        />
      )}
      {referral.tests?.map((test, i) => (
        <VStack key={i} space="xs" className="border-t border-outline-100 pt-2">
          <VariableValue
            variable="Test Type"
            value={getTestTypeDisplay(test.testType) ?? "N/A"}
          />
          <VariableValue
            variable="Result"
            value={getReferralResultDisplay(test.testResult) ?? "N/A"}
          />
          {test.actionTaken && (
            <VariableValue
              variable="Action Taken"
              value={getActionTakenDisplay(test.actionTaken) ?? "N/A"}
            />
          )}
        </VStack>
      ))}
      {referral.finalDiagnosis && (
        <VariableValue
          variable="Final Diagnosis"
          value={referral.finalDiagnosis}
        />
      )}
    </VStack>
  </Card>
);
