import Toaster from "@/components/toaster";
import { Box } from "@/components/ui/box";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { AlertCircleIcon, ArrowRightIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { loginSchema } from "@/constants/schemas";
import { authClient } from "@/lib/auth-client";
import { LoginFormData } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
const LoginScreen = () => {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const [hidePassword, setHidePassword] = useState(true);
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
            render={({ field, fieldState: { invalid, error } }) => (
              <FormControl
                isInvalid={invalid}
                size="md"
                isDisabled={false}
                isReadOnly={false}
                isRequired={false}
                className="w-full"
              >
                <FormControlLabel>
                  <FormControlLabelText>username</FormControlLabelText>
                </FormControlLabel>
                <Input variant="outline" isInvalid={!!error?.message}>
                  <InputField
                    placeholder="Enter Username..."
                    {...field}
                    onChangeText={field.onChange}
                    autoCapitalize="none"
                  />
                </Input>
                {error && (
                  <FormControlError>
                    <FormControlErrorIcon
                      as={AlertCircleIcon}
                      className="text-red-500"
                    />
                    <FormControlErrorText className="text-red-500">
                      {error.message}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
            )}
          />
          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState: { invalid, error } }) => (
              <FormControl
                isInvalid={invalid}
                size="md"
                isDisabled={false}
                isReadOnly={false}
                isRequired={false}
                className="w-full"
              >
                <FormControlLabel>
                  <FormControlLabelText>Password</FormControlLabelText>
                </FormControlLabel>
                <Input variant="outline" isInvalid={!!error?.message}>
                  <InputField
                    placeholder="Enter Password..."
                    {...field}
                    onChangeText={field.onChange}
                    secureTextEntry={hidePassword}
                    autoCapitalize="none"
                  />
                  <InputSlot
                    className="px-3"
                    onPress={() => setHidePassword((p) => !p)}
                  >
                    <InputIcon as={hidePassword ? EyeOff : Eye} />
                  </InputSlot>
                </Input>
                {error && (
                  <FormControlError>
                    <FormControlErrorIcon
                      as={AlertCircleIcon}
                      className="text-red-500"
                    />
                    <FormControlErrorText className="text-red-500">
                      {error.message}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
            )}
          />
          <Box className="flex-row items-center justify-end">
            <Link href="/auth/forgot-password" withAnchor>
              <Text className="text-sm text-teal-500">
                Forgot Password {"\u2192"}
              </Text>
            </Link>
          </Box>
          <Button
            onPress={form.handleSubmit(onSubmit)}
            disabled={form.formState.isSubmitting}
            className="w-full bg-teal-500 justify-between rounded-none"
          >
            {form.formState.isSubmitting && (
              <ButtonSpinner className="text-white" />
            )}
            <ButtonText size="lg" className="text-background-100">
              Login
            </ButtonText>
            <ButtonIcon as={ArrowRightIcon} />
          </Button>
        </VStack>
      </FormControl>
    </Box>
  );
};

export default LoginScreen;
