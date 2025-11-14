import Toaster from "@/components/toaster";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { loginSchema } from "@/constants/schemas";
import { authClient } from "@/lib/auth-client";
import { LoginFormData } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
const LoginScreen = () => {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const toast = useToast();
  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      await authClient.signIn.username(
        {
          username: data.username,
          password: data.password,
          callbackURL: "",
          rememberMe: true,
        },
        {
          onError(context) {
            toast.show({
              placement: "top",
              render: ({ id }) => {
                const uniqueToastId = "toast-" + id;
                return (
                  <Toaster
                    uniqueToastId={uniqueToastId}
                    variant="outline"
                    title="Login failed"
                    description={context.error.message}
                    action="error"
                  />
                );
              },
            });
          },
          onSuccess(context) {
            toast.show({
              placement: "top",
              render: ({ id }) => {
                const uniqueToastId = "toast-" + id;
                return (
                  <Toaster
                    uniqueToastId={uniqueToastId}
                    variant="outline"
                    title="Login successful"
                    description="You are now logged in"
                    action="success"
                  />
                );
              },
            });
          },
        }
      );
    } catch (error: any) {
      console.error(error);
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toaster
              uniqueToastId={uniqueToastId}
              variant="outline"
              title="Login failed"
              description={error?.message || "An unknown error occurred"}
              action="error"
            />
          );
        },
      });
    }
  };
  return (
    <Box className="flex-1 items-center justify-center p-4 bg-background-100">
      <FormControl className="p-4 border border-outline-200 rounded-lg w-full bg-background-50">
        <VStack space="lg">
          <Text className="text-2xl font-bold text-center mb-8">
            Secure Authentication
          </Text>
          <Controller
            control={form.control}
            name="username"
            render={({ field, fieldState }) => (
              <Input
                variant="outline"
                size="lg"
                isInvalid={!!fieldState?.error?.message}
              >
                <InputField
                  placeholder="Enter Username..."
                  {...field}
                  onChangeText={field.onChange}
                  autoCapitalize="none"
                />
              </Input>
            )}
          />
          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <Input
                variant="outline"
                size="lg"
                isInvalid={!!fieldState?.error?.message}
              >
                <InputField
                  placeholder="Enter Password..."
                  {...field}
                  onChangeText={field.onChange}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </Input>
            )}
          />
          <Box className="flex-row items-center justify-end">
            <Link href="/auth/forgot-password" withAnchor>
              <Text className="text-sm text-primary-500">
                Forgot Password {"\u2192"}
              </Text>
            </Link>
          </Box>
          <Button
            onPress={form.handleSubmit(onSubmit)}
            disabled={form.formState.isSubmitting}
          >
            <ButtonText size="lg" className="text-background-100">
              Login
            </ButtonText>
          </Button>
        </VStack>
      </FormControl>
    </Box>
  );
};

export default LoginScreen;
