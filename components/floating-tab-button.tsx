import { Icon } from "@/components/ui/icon";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";
import { Plus } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

export function FloatingTabButton(props: BottomTabBarButtonProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <View style={styles.container}>
      <PlatformPressable
        {...props}
        onPress={(e) => {
          // Prevent navigation - don't call the original onPress handler
          e.preventDefault();
          e.stopPropagation();
          if (process.env.EXPO_OS === "ios") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
          // Future: Open bottom sheet here
        }}
        onPressIn={(ev) => {
          setPressed(true);
          if (process.env.EXPO_OS === "ios") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          props.onPressIn?.(ev);
        }}
        onPressOut={(ev) => {
          setPressed(false);
          props.onPressOut?.(ev);
        }}
        style={[styles.button, pressed && styles.buttonPressed]}
      >
        <Icon as={Plus} size="xl" className="text-white" />
      </PlatformPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28, // Makes it perfectly circular
    backgroundColor: "#14b8a6", // teal-500
    alignItems: "center",
    justifyContent: "center",
    marginTop: -20, // Raise it above the baseline
    elevation: 8, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
});
