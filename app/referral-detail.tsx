import VariableValue from "@/components/client/VariableValue";
import ScreenLayout from "@/components/layout/ScreenLayout";
import { ErrorState, When } from "@/components/state-full-widgets";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useReferral } from "@/hooks/useReferrals";
import {
  getReferralStatusDisplayValue,
  getRiskInterpretation,
} from "@/lib/helpers";
import { Referral } from "@/types/screening";
import dayjs from "dayjs";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { Linking, Platform } from "react-native";

const ReferralDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { referral, isLoading, error } = useReferral(id);
  return (
    <ScreenLayout title="Referral Detail">
      <When
        asyncState={{ isLoading, error, data: referral }}
        error={(e) => <ErrorState error={e} />}
        loading={() => <Spinner color="primary" />}
        success={(referral) => (
          <VStack space="md" className="flex-1">
            <ClientDetailsDetails referral={referral!} />
            <AppointmentDetails referral={referral!} />
            <Card
              size="lg"
              variant="elevated"
              className="gap-3 bg-background-0 rounded-none"
            >
              <Text size="sm" className="text-typography-500 font-bold">
                Clinical Notes:
              </Text>
              <Text size="sm" className="text-typography-500">
                {referral?.additionalNotes}
              </Text>
            </Card>
            <HStack space="sm" className="justify-between items-center">
              <Button
                size="sm"
                className="flex-1"
                action="secondary"
                onPress={async () => {
                  const phoneNumber = referral?.screening?.client?.phoneNumber;
                  if (phoneNumber) {
                    const url = Platform.select({
                      ios: `telprompt:${phoneNumber}`,
                      android: `tel:${phoneNumber}`,
                      default: `tel:${phoneNumber}`,
                    });
                    if (url && (await Linking.canOpenURL(url))) {
                      await Linking.openURL(url);
                    }
                  }
                }}
              >
                <ButtonText>Call Client</ButtonText>
              </Button>
              <Button
                size="sm"
                className="flex-1"
                action="secondary"
                onPress={async () => {
                  const facilityPhoneNumber =
                    referral?.healthFacility?.phoneNumber;
                  if (facilityPhoneNumber) {
                    const url = Platform.select({
                      ios: `telprompt:${facilityPhoneNumber}`,
                      android: `tel:${facilityPhoneNumber}`,
                      default: `tel:${facilityPhoneNumber}`,
                    });
                    if (url && (await Linking.canOpenURL(url))) {
                      await Linking.openURL(url);
                    }
                  }
                }}
              >
                <ButtonText>Call Facility</ButtonText>
              </Button>
            </HStack>
            <Button action="primary" size="sm">
              <ButtonText>Print Summary</ButtonText>
            </Button>
            <Button action="primary" size="sm" className="bg-teal-500">
              <ButtonText>Send SMS Reminder</ButtonText>
            </Button>
          </VStack>
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
