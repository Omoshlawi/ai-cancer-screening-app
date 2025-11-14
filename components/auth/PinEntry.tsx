import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { authenticateWithPin } from "@/lib/local-auth";
import { useState } from "react";
import { Alert } from "react-native";

interface PinEntryProps {
  onSuccess: () => void;
  onCancel?: () => void;
  maxAttempts?: number;
}

export default function PinEntry({
  onSuccess,
  onCancel,
  maxAttempts = 5,
}: PinEntryProps) {
  const [pin, setPin] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (pin.length < 4) {
      Alert.alert("Invalid PIN", "PIN must be at least 4 digits");
      return;
    }

    setIsLoading(true);
    try {
      const success = await authenticateWithPin(pin);
      if (success) {
        setAttempts(0);
        onSuccess();
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setPin("");
        if (newAttempts >= maxAttempts) {
          Alert.alert(
            "Too Many Attempts",
            "You have exceeded the maximum number of attempts. Please try again later."
          );
          if (onCancel) {
            onCancel();
          }
        } else {
          Alert.alert(
            "Incorrect PIN",
            `Incorrect PIN. ${maxAttempts - newAttempts} attempts remaining.`
          );
        }
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
            Enter PIN
          </Text>
          <Text className="text-sm text-center text-typography-500 mb-4">
            Enter your PIN to continue
          </Text>
          <Input variant="outline" size="lg">
            <InputField
              placeholder="Enter PIN"
              value={pin}
              onChangeText={setPin}
              keyboardType="numeric"
              secureTextEntry
              maxLength={6}
              autoFocus
            />
          </Input>
          {attempts > 0 && (
            <Text className="text-sm text-center text-error-500">
              {maxAttempts - attempts} attempts remaining
            </Text>
          )}
          <VStack space="sm">
            <Button onPress={handleSubmit} disabled={isLoading || pin.length < 4}>
              <ButtonText size="lg" className="text-background-100">
                Verify
              </ButtonText>
            </Button>
            {onCancel && (
              <Button variant="outline" onPress={onCancel} disabled={isLoading}>
                <ButtonText size="lg">Cancel</ButtonText>
              </Button>
            )}
          </VStack>
        </VStack>
      </FormControl>
    </Box>
  );
}

