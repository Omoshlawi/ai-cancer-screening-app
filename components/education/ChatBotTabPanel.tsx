import { Bot, Send } from "lucide-react-native";
import React from "react";
import { ScrollView } from "react-native";
import { Box } from "../ui/box";
import { Button, ButtonIcon } from "../ui/button";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";
import { Textarea, TextareaInput } from "../ui/textarea";
import { VStack } from "../ui/vstack";

const ChatBotTabPanel = () => {
  const defaultMessages = [
    "Screening prosidure",
    "Training requirements",
    "Client cancelling",
    "Equipment needed",
  ];

  return (
    <VStack space="md" className="flex-1">
      <Heading>Your AI Assistant</Heading>
      <Text className="text-typography-500" size="xs">
        Ask me anything about CHP Training, Screening Procidures, or cervical
        cancer
      </Text>
      <Card>
        <ScrollView>
          <VStack space="md">
            <HStack space="md">
              <Box
                className="p-2 rounded-full bg-teal-500"
                style={{
                  width: 40,
                  height: 40,
                  minWidth: 40,
                  minHeight: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon as={Bot} size="xl" color="white" />
              </Box>
              <VStack space="sm" className="flex-1">
                <Text
                  className="text-typography-700 bg-background-50 p-2 flex-1"
                  size="sm"
                >
                  Hello, I&apos;m your AI assistant. How can I help you today?
                </Text>
                <Box className="flex-row gap-2 flex-wrap w-full">
                  {defaultMessages.map((message, index) => (
                    <Text
                      key={index}
                      className="bg-teal-50 px-2 py-1 text-nowrap rounded-xs text-teal-500"
                      size="xs"
                    >
                      {message}
                    </Text>
                  ))}
                </Box>
              </VStack>
            </HStack>
            <HStack space="md" className="w-full items-end">
              <Textarea
                size="sm"
                isReadOnly={false}
                isInvalid={false}
                isDisabled={false}
                className="flex-1"
              >
                <TextareaInput placeholder="Type your question here here..." />
              </Textarea>
              <Button
                size="sm"
                className="bg-teal-500 text-white rounded-full w-12 h-12"
              >
                <ButtonIcon as={Send} color="white" />
              </Button>
            </HStack>
          </VStack>
        </ScrollView>
      </Card>
    </VStack>
  );
};

export default ChatBotTabPanel;
