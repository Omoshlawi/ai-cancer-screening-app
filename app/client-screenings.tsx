import VariableValue from "@/components/client/VariableValue";
import { ScreenLayout } from "@/components/layout";
import { EmptyState } from "@/components/state-full-widgets";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { useOfflineClient } from "@/hooks/useClients";
import { useOfflineClientScreenings } from "@/hooks/useScreenings";
import { getBooleanDisplayValue, getSmokingDisplayValue } from "@/lib/helpers";
import { ScreenClientFormData } from "@/types/screening";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView } from "react-native";

const ClientScreenings = () => {
  const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>();
  const client = useOfflineClient(phoneNumber);
  const { screenings, removeOfflineScreening } =
    useOfflineClientScreenings(phoneNumber);
  return (
    <ScreenLayout title="Client Screenings">
      <ScrollView>
        <VStack space="md">
          <Card>
            <VStack space="md">
              <Heading size="xs" className="color-typography-500">
                Client Details
              </Heading>
              <VariableValue
                value={client?.firstName + " " + client?.lastName}
                variable="Name"
              />
              <VariableValue value={phoneNumber} variable="Phone Number" />
              <VariableValue
                value={dayjs(client?.dateOfBirth).format("YYYY-MM-DD")}
                variable="Date of Birth"
              />
              <VariableValue
                value={[client?.county, client?.subcounty, client?.ward]
                  .filter(Boolean)
                  .join(", ")}
                variable="Address"
              />
            </VStack>
          </Card>
          <Heading size="xs" className="color-typography-500">
            Screenings
          </Heading>
          {screenings.length === 0 ? (
            <Box className="w-full flex-1">
              <EmptyState message="No screnings for this clients yet" />
            </Box>
          ) : (
            <>
              {screenings.map((screening, i) => (
                <ScreeningCard
                  key={i}
                  screening={screening}
                  onDelete={() => removeOfflineScreening(i)}
                />
              ))}
            </>
          )}
          <Button
            action="primary"
            onPress={() => {
              router.push({
                pathname: "/screen-client",
                params: {
                  search: phoneNumber,
                },
              });
            }}
          >
            <ButtonText>Add Screening</ButtonText>
          </Button>
        </VStack>
      </ScrollView>
    </ScreenLayout>
  );
};

export default ClientScreenings;

const ScreeningCard = ({
  screening,
  onDelete,
}: {
  screening: ScreenClientFormData;
  onDelete?: () => void;
}) => {
  const values = useMemo<{ variable: string; value: string | number }[]>(() => {
    return [
      {
        variable: "Age at first intercourse",
        value: screening.firstIntercourseAge,
      },
      {
        variable: "Lifetime partners",
        value: screening.lifeTimePatners,
      },
      {
        variable: "HIV diagnosis",
        value: getBooleanDisplayValue(screening.everDiagnosedWithHIV),
      },
      {
        variable: "HPV diagnosis",
        value: getBooleanDisplayValue(screening.everDiagnosedWithHPV),
      },
      {
        variable: "STI diagnosis",
        value: getBooleanDisplayValue(screening.everDiagnosedWithSTI),
      },
      {
        variable: "Number of births",
        value: screening.totalBirths,
      },

      {
        variable: "Screened before",
        value: getBooleanDisplayValue(screening.everScreenedForCervicalCancer),
      },
      {
        variable: "OCP>5 years",
        value: getBooleanDisplayValue(
          screening.usedOralContraceptivesForMoreThan5Years,
        ),
      },
      {
        variable: "Smoking History",
        value: getSmokingDisplayValue(screening.smoking),
      },
      {
        variable: "Family History",
        value: getBooleanDisplayValue(
          screening.familyMemberDiagnosedWithCervicalCancer,
        ),
      },
      {
        variable: "Screening Date",
        value: dayjs((screening as any).timeStamp).format("YYYY-MM-DD"),
      },
    ];
  }, [screening]);
  return (
    <Card>
      <VStack space="md">
        {values.map((value, i) => (
          <VariableValue
            key={i}
            value={value.value}
            variable={value.variable}
          />
        ))}
        {onDelete && (
          <Button action="negative" variant="outline" onPress={onDelete}>
            <ButtonText>Remove Screening</ButtonText>
          </Button>
        )}
      </VStack>
    </Card>
  );
};
