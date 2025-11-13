import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

import Toaster from "@/components/toaster";
import { Box } from "@/components/ui/box";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Heading } from "@/components/ui/heading";
import { useToast } from "@/components/ui/toast";
import "@/global.css";
import { authClient } from "@/lib/auth-client";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

export const unstable_settings = {
  anchor: "(tabs)",
};
// Prevent the splash screen from auto-hiding before asset and auth state loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const theme = useColorScheme();

  const { data, isPending, error } = authClient.useSession();
  const isLoggedIn = !!data?.user?.id;
  const toast = useToast();
  useEffect(() => {
    if (!isPending) {
      SplashScreen.hideAsync();
    }
    if (error) {
      toast.show({
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toaster
              uniqueToastId={uniqueToastId}
              variant="outline"
              title="Login failed"
              description={error.message}
              action="error"
            />
          );
        },
      });
    }
  }, [isPending, error, toast]);

  return (
    <GluestackUIProvider mode={theme}>
      <Stack
        screenOptions={{
          headerShown: false,
          title: "Home",
          headerBackground: () => (
            <Box className="bg-background-0 w-full h-full" />
          ),
          headerTitle: ({ children }) => (
            <Heading className={"text-typography-500"} size="xl">
              {children}
            </Heading>
          ),
        }}
      >
        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false, title: "Home" }}
          />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
          <Stack.Screen
            name="notifications"
            options={{ headerShown: true, title: "Notifications" }}
          />
        </Stack.Protected>
        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen name="auth" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </GluestackUIProvider>
  );
}
