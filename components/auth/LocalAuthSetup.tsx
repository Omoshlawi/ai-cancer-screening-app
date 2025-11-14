import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormControl } from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import {
  authenticateWithBiometrics,
  setupPin,
  setBiometricEnabled,
  checkBiometricAvailability,
} from "@/lib/local-auth";
import { useState, useEffect } from "react";
import { Alert, ActivityIndicator } from "react-native";

interface LocalAuthSetupProps {
  onComplete: () => void;
  onCancel: () => void;
}

export default function LocalAuthSetup({
  onComplete,
  onCancel,
}: LocalAuthSetupProps) {
  const [step, setStep] = useState<"biometric" | "pin" | "confirm">("biometric");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  useEffect(() => {
    checkBiometric();
  }, []);

  const checkBiometric = async () => {
    const status = await checkBiometricAvailability();
    setBiometricAvailable(status.hasBiometrics);
    if (!status.hasBiometrics) {
      // Skip biometric step if not available
      setStep("pin");
    }
  };

  const handleBiometricAuth = async () => {
    setIsLoading(true);
    try {
      const success = await authenticateWithBiometrics();
      if (success) {
        await setBiometricEnabled(true);
        setStep("pin");
      } else {
        Alert.alert(
          "Biometric Authentication Failed",
          "Please try again or continue with PIN setup."
        );
      }
    } catch (error) {
      console.error("Biometric auth error:", error);
      Alert.alert(
        "Error",
        "Biometric authentication failed. You can continue with PIN setup."
      );
      setStep("pin");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinSubmit = () => {
    if (pin.length < 4) {
      Alert.alert("Invalid PIN", "PIN must be at least 4 digits");
      return;
    }
    setStep("confirm");
  };

  const handleConfirmPin = async () => {
    if (pin !== confirmPin) {
      Alert.alert("PIN Mismatch", "PINs do not match. Please try again.");
      setPin("");
      setConfirmPin("");
      setStep("pin");
      return;
    }

    setIsLoading(true);
    try {
      const pinSuccess = await setupPin(pin);
      if (pinSuccess) {
        onComplete();
      } else {
        Alert.alert("Error", "Failed to set up PIN. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "biometric" && biometricAvailable) {
    return (
      <Box className="flex-1 items-center justify-center p-4 bg-background-100">
        <Card className="p-6 w-full max-w-md">
          <VStack space="lg">
            <Text className="text-2xl font-bold text-center">
              Enable Biometric Authentication
            </Text>
            <Text className="text-sm text-center text-typography-500">
              Use your fingerprint or face ID to secure your account. You'll
              also need to set up a PIN as backup.
            </Text>
            {isLoading ? (
              <ActivityIndicator size="large" />
            ) : (
              <VStack space="sm">
                <Button onPress={handleBiometricAuth} disabled={isLoading}>
                  <ButtonText size="lg" className="text-background-100">
                    Authenticate with Biometrics
                  </ButtonText>
                </Button>
                <Button
                  variant="outline"
                  onPress={() => setStep("pin")}
                  disabled={isLoading}
                >
                  <ButtonText size="lg">Skip Biometrics</ButtonText>
                </Button>
                <Button
                  variant="outline"
                  onPress={onCancel}
                  disabled={isLoading}
                >
                  <ButtonText size="lg">Cancel</ButtonText>
                </Button>
              </VStack>
            )}
          </VStack>
        </Card>
      </Box>
    );
  }

  if (step === "pin") {
    return (
      <Box className="flex-1 items-center justify-center p-4 bg-background-100">
        <FormControl className="p-4 border border-outline-200 rounded-lg w-full bg-background-50">
          <VStack space="lg">
            <Text className="text-2xl font-bold text-center mb-2">
              Set Up PIN
            </Text>
            <Text className="text-sm text-center text-typography-500 mb-4">
              Create a 4-digit PIN for secure access
            </Text>
            <Input variant="outline" size="lg">
              <InputField
                placeholder="Enter PIN"
                value={pin}
                onChangeText={setPin}
                keyboardType="numeric"
                secureTextEntry
                maxLength={6}
              />
            </Input>
            <VStack space="sm">
              <Button
                onPress={handlePinSubmit}
                disabled={isLoading || pin.length < 4}
              >
                <ButtonText size="lg" className="text-background-100">
                  Continue
                </ButtonText>
              </Button>
              <Button variant="outline" onPress={onCancel} disabled={isLoading}>
                <ButtonText size="lg">Cancel</ButtonText>
              </Button>
            </VStack>
          </VStack>
        </FormControl>
      </Box>
    );
  }

  // Confirm PIN step
  return (
    <Box className="flex-1 items-center justify-center p-4 bg-background-100">
      <FormControl className="p-4 border border-outline-200 rounded-lg w-full bg-background-50">
        <VStack space="lg">
          <Text className="text-2xl font-bold text-center mb-2">
            Confirm PIN
          </Text>
          <Text className="text-sm text-center text-typography-500 mb-4">
            Re-enter your PIN to confirm
          </Text>
          <Input variant="outline" size="lg">
            <InputField
              placeholder="Confirm PIN"
              value={confirmPin}
              onChangeText={setConfirmPin}
              keyboardType="numeric"
              secureTextEntry
              maxLength={6}
            />
          </Input>
          <VStack space="sm">
            <Button
              onPress={handleConfirmPin}
              disabled={isLoading || confirmPin.length < 4}
            >
              <ButtonText size="lg" className="text-background-100">
                Confirm
              </ButtonText>
            </Button>
            <Button
              variant="outline"
              onPress={() => {
                setStep("pin");
                setConfirmPin("");
              }}
              disabled={isLoading}
            >
              <ButtonText size="lg">Back</ButtonText>
            </Button>
          </VStack>
        </VStack>
      </FormControl>
    </Box>
  );
}

