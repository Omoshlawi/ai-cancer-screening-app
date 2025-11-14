import PinEntry from "@/components/auth/PinEntry";
import { useLocalAuth } from "@/hooks/use-local-auth";
import { authenticateWithBiometrics } from "@/lib/local-auth";
import { useState, useEffect, useCallback } from "react";
import { Modal, ActivityIndicator } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";

interface LocalAuthModalProps {
  visible: boolean;
  onSuccess: () => void;
}

export default function LocalAuthModal({
  visible,
  onSuccess,
}: LocalAuthModalProps) {
  const { status, isLoading } = useLocalAuth();
  const [showPinEntry, setShowPinEntry] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const attemptBiometricAuth = useCallback(async () => {
    console.log("Attempting biometric auth, status:", status);
    
    if (!status?.isBiometricEnabled) {
      // If biometrics not enabled but PIN exists, show PIN entry
      if (status?.hasPin) {
        console.log("Biometrics not enabled, showing PIN entry");
        setShowPinEntry(true);
      } else {
        // No local auth set up, just close
        console.log("No PIN set up, allowing access");
        onSuccess();
      }
      return;
    }

    setIsAuthenticating(true);
    try {
      console.log("Attempting biometric authentication...");
      const success = await authenticateWithBiometrics();
      console.log("Biometric auth result:", success);
      if (success) {
        onSuccess();
      } else {
        // Biometric failed, show PIN entry
        console.log("Biometric failed, showing PIN entry");
        if (status.hasPin) {
          setShowPinEntry(true);
        } else {
          onSuccess(); // If no PIN, just allow access
        }
      }
    } catch (error) {
      console.error("Biometric auth error:", error);
      if (status.hasPin) {
        setShowPinEntry(true);
      } else {
        onSuccess();
      }
    } finally {
      setIsAuthenticating(false);
    }
  }, [status, onSuccess]);

  useEffect(() => {
    if (!visible) {
      // Reset states when modal is hidden
      setShowPinEntry(false);
      setIsAuthenticating(false);
      return;
    }

    // Wait for status to load before attempting auth
    if (visible && !isLoading && status !== null) {
      setShowPinEntry(false); // Reset PIN entry state
      // Small delay to ensure modal is rendered
      const timer = setTimeout(() => {
        attemptBiometricAuth();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [visible, isLoading, status, attemptBiometricAuth]);

  const handlePinSuccess = () => {
    onSuccess();
  };

  const handlePinCancel = () => {
    // Don't allow cancel - user must authenticate
    // Could show error or retry
  };

  if (!visible) return null;

  if (isLoading || isAuthenticating) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <Box className="flex-1 items-center justify-center bg-black/80">
          <Box className="bg-background-50 p-6 rounded-lg">
            <ActivityIndicator size="large" />
            <Text className="mt-4 text-typography-500 text-center">
              Authenticating...
            </Text>
          </Box>
        </Box>
      </Modal>
    );
  }

  if (showPinEntry) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <Box className="flex-1 items-center justify-center bg-black/80">
          <Box className="w-full max-w-md">
            <PinEntry onSuccess={handlePinSuccess} />
          </Box>
        </Box>
      </Modal>
    );
  }

  return null;
}

