import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { router } from "expo-router";
import { Dot } from "lucide-react-native";
import React from "react";
import ListTile from "../list-tile";
import { Box } from "../ui/box";
import { Button, ButtonText } from "../ui/button";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";
const RecentActivity = () => {
  const recentActivity = [
    {
      id: 1,
      name: "Mary Wanjiku",
      description: "Screening Completed",
      time: "2 hrs ago",
      riskScore: "low",
    },
    {
      id: 2,
      name: "John Doe",
      description: "Screening Completed",
      time: "1 hr ago",
      riskScore: "high",
    },
    {
      id: 3,
      name: "Jane Doe",
      description: "Screening Completed",
      time: "1 hr ago",
      riskScore: "medium",
    },
  ];
  return (
    <Box className="mt-4">
      <HStack className="justify-between items-center">
        <Heading size="xs">Recent Activity</Heading>
        <Button
          variant="link"
          size="sm"
          onPress={() => router.push("/activities")}
        >
          <ButtonText className="text-teal-600">View All</ButtonText>
        </Button>
      </HStack>
      <Card className="bg-background-0 flex-col gap-2 mt-2">
        {recentActivity.map((activity) => (
          <ListTile
            key={activity.id}
            leading={
              <Icon
                as={Dot}
                className={cn(
                  activity.riskScore === "low"
                    ? "text-teal-600"
                    : activity.riskScore === "medium"
                    ? "text-yellow-600"
                    : "text-red-600"
                )}
                size="xl"
              />
            }
            title={activity.name}
            description={`${activity.description} - ${activity.riskScore} risk`}
            trailing={
              <Text size="xs" className="text-typography-500">
                {activity.time}
              </Text>
            }
          />
        ))}
      </Card>
    </Box>
  );
};

export default RecentActivity;
