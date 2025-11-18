import { expoClient } from "@better-auth/expo/client";
import {
  adminClient,
  jwtClient,
  usernameClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  baseURL: "http://localhost:600", // Base URL of your Better Auth backend.
  // baseURL: "http://10.76.170.25:600", // Base URL of your Better Auth backend.
  // baseURL: "http://192.168.1.115:600", // Base URL of your Better Auth backend.
  trustedOrigins: ["aicancerscreeningapp://"],
  plugins: [
    expoClient({
      scheme: "aicancerscreeningapp",
      storagePrefix: "aicancerscreeningapp",
      storage: SecureStore,
    }),
    adminClient(),
    usernameClient(),
    jwtClient(),
  ],
});
