import ActionSheetWrapper from "@/components/actions-sheet-wrapper";
import AppBar from "@/components/app-bar";
import LocalAuthSetup from "@/components/auth/LocalAuthSetup";
import ListTile from "@/components/list-tile";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { authClient } from "@/lib/auth-client";
import { getInitials } from "@/lib/helpers";
import {
  isLocalAuthEnabled,
  isLocalAuthSetup,
  setLocalAuthEnabled,
} from "@/lib/local-auth";
import { Theme, useThemeStore } from "@/store/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Modal, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const SettingsScreen = () => {
  const { data: userSession } = authClient.useSession();
  const colorScheme = useColorScheme();
  const setTheme = useThemeStore((state) => state.setTheme);
  const router = useRouter();
  const [localAuthEnabled, setLocalAuthEnabledState] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkLocalAuthStatus();
  }, []);

  const checkLocalAuthStatus = async () => {
    setIsChecking(true);
    try {
      const enabled = await isLocalAuthEnabled();
      setLocalAuthEnabledState(enabled);
    } catch (error) {
      console.error("Error checking local auth status:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleLocalAuthToggle = async (value: boolean) => {
    if (value) {
      // Check if local auth is already set up
      const isSetup = await isLocalAuthSetup();
      if (isSetup) {
        // Already set up, just enable it
        await setLocalAuthEnabled(true);
        setLocalAuthEnabledState(true);
      } else {
        // Need to set up first
        setShowSetup(true);
      }
    } else {
      // Disable local auth
      Alert.alert(
        "Disable Local Authentication?",
        "This will disable biometric and PIN authentication when the app comes to foreground.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Disable",
            style: "destructive",
            onPress: async () => {
              await setLocalAuthEnabled(false);
              setLocalAuthEnabledState(false);
            },
          },
        ]
      );
    }
  };

  const handleSetupComplete = async () => {
    await setLocalAuthEnabled(true);
    setLocalAuthEnabledState(true);
    setShowSetup(false);
  };

  const handleSetupCancel = () => {
    setShowSetup(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <AppBar title="Settings" />
      <ScrollView>
        <VStack className="flex-1 bg-background-50 p-4" space="xl">
          <Card
            size="lg"
            variant="filled"
            className="rounded-none bg-background-0 p-4"
          >
            <HStack space="lg">
              <Avatar size="md">
                <AvatarFallbackText>
                  {userSession?.user?.name
                    ? getInitials(userSession?.user?.name)
                    : "N/A"}
                </AvatarFallbackText>
                <AvatarImage
                  source={{
                    uri: userSession?.user?.image ?? "",
                  }}
                />
                <AvatarBadge />
              </Avatar>
              <VStack space="xs">
                <Heading size="md" className="mb-1">
                  {userSession?.user?.name}
                </Heading>
                <Text size="sm">{userSession?.user?.email}</Text>
              </VStack>
            </HStack>
          </Card>
          <Card
            size="lg"
            variant="filled"
            className="rounded-none bg-background-0 p-4"
          >
            <VStack space="lg">
              <Box>
                <Heading size="md" className="mb-1">
                  Security and Privacy
                </Heading>
                <Divider className="my-0.5" />
                <ListTile
                  leading={
                    <MaterialCommunityIcons
                      name="key-outline"
                      size={24}
                      color={colorScheme === "dark" ? "white" : "black"}
                    />
                  }
                  title="Change Password"
                  description="Change your password to secure your account."
                  onPress={() => router.push("/settings/change-password")}
                  trailing={
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={16}
                      color={colorScheme === "dark" ? "white" : "black"}
                    />
                  }
                />
                <ListTile
                  leading={
                    <MaterialCommunityIcons
                      name="fingerprint"
                      size={24}
                      color={colorScheme === "dark" ? "white" : "black"}
                    />
                  }
                  title="Local Authentication"
                  description="Use fingerprint or PIN when app comes to foreground."
                  trailing={
                    <Switch
                      size="md"
                      isDisabled={isChecking}
                      value={localAuthEnabled}
                      onValueChange={handleLocalAuthToggle}
                      trackColor={{ false: "#d4d4d4", true: "#525252" }}
                      thumbColor="#fafafa"
                      ios_backgroundColor="#d4d4d4"
                    />
                  }
                />
                <ListTile
                  leading={
                    <MaterialCommunityIcons
                      name="lock-outline"
                      size={24}
                      color={colorScheme === "dark" ? "white" : "black"}
                    />
                  }
                  title="Two-Factor Authentication"
                  description="Enable two-factor authentication to secure your account."
                  trailing={
                    <Switch
                      size="md"
                      isDisabled={false}
                      trackColor={{ false: "#d4d4d4", true: "#525252" }}
                      thumbColor="#fafafa"
                      ios_backgroundColor="#d4d4d4"
                    />
                  }
                />
              </Box>
            </VStack>
          </Card>
          <Card
            size="lg"
            variant="filled"
            className="rounded-none bg-background-0 p-4"
          >
            <VStack space="lg">
              <Box>
                <Heading size="md" className="mb-1">
                  App Preferences
                </Heading>
                <Divider className="my-0.5" />
                <ActionSheetWrapper
                  renderTrigger={({ onPress }) => (
                    <ListTile
                      onPress={onPress}
                      leading={
                        <Ionicons
                          name="language-outline"
                          size={24}
                          color={colorScheme === "dark" ? "white" : "black"}
                        />
                      }
                      title="Language"
                      description="Select your preferred language."
                      trailing={
                        <MaterialCommunityIcons
                          name="chevron-right"
                          size={24}
                          color={colorScheme === "dark" ? "white" : "black"}
                        />
                      }
                    />
                  )}
                  data={[
                    { label: "English", value: "en" },
                    { label: "Spanish", value: "es" },
                    { label: "French", value: "fr" },
                    { label: "German", value: "de" },
                    { label: "Italian", value: "it" },
                  ]}
                  renderItem={({ item, close }) => (
                    <TouchableOpacity
                      onPress={() => {
                        close();
                      }}
                    >
                      <Card
                        size="md"
                        variant="filled"
                        className="rounded-none bg-background-0 p-4"
                      >
                        <HStack
                          space="lg"
                          className="items-center justify-between"
                        >
                          <Text size="md" className="text-start flex-1">
                            {item.label}
                          </Text>
                          <MaterialCommunityIcons
                            name="chevron-right"
                            size={20}
                            color={colorScheme === "dark" ? "white" : "black"}
                          />
                        </HStack>
                      </Card>
                    </TouchableOpacity>
                  )}
                  valueExtractor={(item) => item.value}
                />
                <ActionSheetWrapper
                  renderTrigger={({ onPress }) => (
                    <ListTile
                      onPress={onPress}
                      leading={
                        <MaterialCommunityIcons
                          name="theme-light-dark"
                          size={24}
                          color={colorScheme === "dark" ? "white" : "black"}
                        />
                      }
                      title="Theme"
                      description="Select your preferred theme."
                      trailing={
                        <MaterialCommunityIcons
                          name="chevron-right"
                          size={24}
                          color={colorScheme === "dark" ? "white" : "black"}
                        />
                      }
                    />
                  )}
                  data={[
                    { label: "Light", value: "light" },
                    { label: "Dark", value: "dark" },
                    { label: "System", value: "system" },
                  ]}
                  renderItem={({ item, close }) => (
                    <TouchableOpacity
                      onPress={() => {
                        close();
                        setTheme(item.value as Theme);
                      }}
                    >
                      <Card
                        size="md"
                        variant="filled"
                        className="rounded-none bg-background-0 p-4"
                      >
                        <HStack
                          space="lg"
                          className="items-center justify-between"
                        >
                          <MaterialCommunityIcons
                            name={
                              item.value === "light"
                                ? "weather-sunny"
                                : item.value === "dark"
                                ? "weather-night"
                                : "weather-sunny-alert"
                            }
                            size={20}
                            color={colorScheme === "dark" ? "white" : "black"}
                          />
                          <Text size="md" className="text-start flex-1">
                            {item.label}
                          </Text>
                          <MaterialCommunityIcons
                            name="chevron-right"
                            size={24}
                            color={colorScheme === "dark" ? "white" : "black"}
                          />
                        </HStack>
                      </Card>
                    </TouchableOpacity>
                  )}
                  valueExtractor={(item) => item.value}
                />
              </Box>
            </VStack>
          </Card>
          <Card
            size="lg"
            variant="filled"
            className="rounded-none bg-background-0 p-4"
          >
            <VStack space="lg">
              <Box>
                <Heading size="md" className="mb-1">
                  Support
                </Heading>
                <Divider className="my-0.5" />
                <ListTile
                  description="Help and Support"
                  trailing={
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={16}
                      color={colorScheme === "dark" ? "white" : "black"}
                    />
                  }
                />
                <ListTile
                  description="Privacy Policy"
                  trailing={
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={16}
                      color={colorScheme === "dark" ? "white" : "black"}
                    />
                  }
                />
                <ListTile
                  description="Terms of Service"
                  trailing={
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={16}
                      color={colorScheme === "dark" ? "white" : "black"}
                    />
                  }
                />
              </Box>
            </VStack>
          </Card>
          <Button action="negative" onPress={() => authClient.signOut()}>
            <Text className="font-bold">Logout</Text>
          </Button>
        </VStack>
        <Modal
          visible={showSetup}
          transparent
          animationType="slide"
          statusBarTranslucent
        >
          <Box className="flex-1 bg-black/80">
            <LocalAuthSetup
              onComplete={handleSetupComplete}
              onCancel={handleSetupCancel}
            />
          </Box>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
