import { authClient } from "@/lib/auth-client";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

interface UseTwoFactorAuthReturn {
  twoFactorEnabled: boolean;
  isChecking2FA: boolean;
  show2FASetup: boolean;
  showDisable2FA: boolean;
  disablePassword: string;
  setShowDisable2FA: (show: boolean) => void;
  setDisablePassword: (password: string) => void;
  handle2FAToggle: (value: boolean) => void;
  handleDisable2FA: () => Promise<void>;
  handle2FASetupComplete: () => Promise<void>;
  handle2FASetupCancel: () => void;
  check2FAStatus: () => Promise<void>;
}

export function useTwoFactorAuth(): UseTwoFactorAuthReturn {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isChecking2FA, setIsChecking2FA] = useState(true);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [showDisable2FA, setShowDisable2FA] = useState(false);
  const [disablePassword, setDisablePassword] = useState("");

  const check2FAStatus = useCallback(async () => {
    setIsChecking2FA(true);
    try {
      // Check if user has 2FA enabled by checking their session data
      // Better Auth stores 2FA status in the user object
      const session = await authClient.getSession();
      if (session?.data?.user) {
        // Check if 2FA is enabled - Better Auth typically stores this in user metadata
        // We'll check by attempting to get 2FA status
        // For now, we'll assume it's stored in user.twoFactorEnabled or similar
        // This might need adjustment based on your Better Auth backend implementation
        setTwoFactorEnabled(
          (session.data.user as any).twoFactorEnabled === true
        );
      }
    } catch (error) {
      console.error("Error checking 2FA status:", error);
    } finally {
      setIsChecking2FA(false);
    }
  }, []);

  useEffect(() => {
    check2FAStatus();
  }, [check2FAStatus]);

  const handle2FAToggle = useCallback((value: boolean) => {
    if (value) {
      // Enable 2FA - show setup modal
      setShow2FASetup(true);
    } else {
      // Disable 2FA - show password modal
      setShowDisable2FA(true);
    }
  }, []);

  const handleDisable2FA = useCallback(async () => {
    if (!disablePassword) {
      Alert.alert("Error", "Password is required");
      return;
    }
    try {
      const result = await authClient.twoFactor.disable({
        password: disablePassword,
      });
      if (result.error) {
        Alert.alert("Error", result.error.message || "Failed to disable 2FA");
        setDisablePassword("");
      } else {
        setTwoFactorEnabled(false);
        setShowDisable2FA(false);
        setDisablePassword("");
        Alert.alert("Success", "Two-factor authentication has been disabled");
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.message || "An error occurred. Please try again."
      );
      setDisablePassword("");
    }
  }, [disablePassword]);

  const handle2FASetupComplete = useCallback(async () => {
    setShow2FASetup(false);
    setTwoFactorEnabled(true);
    await check2FAStatus();
  }, [check2FAStatus]);

  const handle2FASetupCancel = useCallback(() => {
    setShow2FASetup(false);
  }, []);

  return {
    twoFactorEnabled,
    isChecking2FA,
    show2FASetup,
    showDisable2FA,
    disablePassword,
    setShowDisable2FA,
    setDisablePassword,
    handle2FAToggle,
    handleDisable2FA,
    handle2FASetupComplete,
    handle2FASetupCancel,
    check2FAStatus,
  };
}
