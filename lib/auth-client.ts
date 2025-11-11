import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  baseURL: "http://localhost:600", // Base URL of your Better Auth backend.
  trustedOrigins: ["aicancerscreeningapp://"],
  plugins: [
    expoClient({
      scheme: "aicancerscreeningapp",
      storagePrefix: "aicancerscreeningapp",
      storage: SecureStore,
    }),
  ],
});
