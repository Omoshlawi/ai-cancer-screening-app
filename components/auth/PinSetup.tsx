import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { setupPin, setBiometricEnabled, checkBiometricAvailability } from "@/lib/local-auth";
import { useState, useEffect } from "react";
import { Alert } from "react-native";

interface PinSetupProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export default function PinSetup({ onComplete, onSkip }: PinSetupProps) {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [step, setStep] = useState<"pin" | "confirm">("pin");
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkBiometric();
  }, []);

  const checkBiometric = async () => {
    const status = await checkBiometricAvailability();
    setBiometricAvailable(status.hasBiometrics);
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
      const success = await setupPin(pin);
      if (success) {
        // If biometrics are available, ask if user wants to enable them
        if (biometricAvailable) {
          Alert.alert(
            "Enable Biometric Authentication?",
            "Would you like to use fingerprint or face ID for faster login?",
            [
              {
                text: "Skip",
                style: "cancel",
                onPress: async () => {
                  await setBiometricEnabled(false);
                  onComplete();
                },
              },
              {
                text: "Enable",
                onPress: async () => {
                  await setBiometricEnabled(true);
                  onComplete();
                },
              },
            ]
          );
        } else {
          onComplete();
        }
      } else {
        Alert.alert("Error", "Failed to set up PIN. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="flex-1 items-center justify-center p-4 bg-background-100">
      <FormControl className="p-4 border border-outline-200 rounded-lg w-full bg-background-50">
        <VStack space="lg">
          <Text className="text-2xl font-bold text-center mb-2">
            {step === "pin" ? "Set Up PIN" : "Confirm PIN"}
          </Text>
          <Text className="text-sm text-center text-typography-500 mb-4">
            {step === "pin"
              ? "Create a 4-digit PIN for secure access"
              : "Re-enter your PIN to confirm"}
          </Text>
          <Input variant="outline" size="lg">
            <InputField
              placeholder={step === "pin" ? "Enter PIN" : "Confirm PIN"}
              value={step === "pin" ? pin : confirmPin}
              onChangeText={step === "pin" ? setPin : setConfirmPin}
              keyboardType="numeric"
              secureTextEntry
              maxLength={6}
            />
          </Input>
          <VStack space="sm">
            <Button
              onPress={step === "pin" ? handlePinSubmit : handleConfirmPin}
              disabled={isLoading || (step === "pin" ? pin.length < 4 : confirmPin.length < 4)}
            >
              <ButtonText size="lg" className="text-background-100">
                {step === "pin" ? "Continue" : "Confirm"}
              </ButtonText>
            </Button>
            {onSkip && step === "pin" && (
              <Button
                variant="outline"
                onPress={onSkip}
                disabled={isLoading}
              >
                <ButtonText size="lg">Skip</ButtonText>
              </Button>
            )}
          </VStack>
        </VStack>
      </FormControl>
    </Box>
  );
}

