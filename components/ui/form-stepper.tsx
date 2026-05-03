import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Check } from "lucide-react-native";

interface Step {
  icon: any;
  label?: string;
}

interface FormStepperProps {
  steps: Step[];
  currentStep: number; // 1-indexed
}

export const FormStepper = ({ steps, currentStep }: FormStepperProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.stepsWrapper}>
        {/* Background Line */}
        <View style={styles.line} />
        
        <View style={styles.stepsContainer}>
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isActive = stepNumber === currentStep;

            return (
              <View key={index} style={styles.stepItem}>
                <View
                  style={[
                    styles.iconContainer,
                    isActive && styles.activeIcon,
                    isCompleted && styles.completedIcon,
                    !isActive && !isCompleted && styles.pendingIcon,
                  ]}
                >
                  {isCompleted ? (
                    <Icon as={Check} size="sm" className="text-primary-600" />
                  ) : (
                    <Icon
                      as={step.icon}
                      size="sm"
                      className={isActive ? "text-white" : "text-typography-400"}
                    />
                  )}
                </View>
                {step.label && (
                  <Text
                    style={[
                      styles.label,
                      isActive ? styles.activeLabel : styles.pendingLabel,
                    ]}
                    numberOfLines={1}
                  >
                    {step.label}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  stepsWrapper: {
    width: "100%",
    position: "relative",
  },
  line: {
    position: "absolute",
    top: 20,
    left: 32,
    right: 32,
    height: 2,
    backgroundColor: "#E5E7EB", // outline-100
  },
  stepsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
  },
  stepItem: {
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    zIndex: 10,
    backgroundColor: "white",
  },
  activeIcon: {
    backgroundColor: "#0f766e", // primary-500
    borderColor: "#0f766e",
    transform: [{ scale: 1.1 }],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completedIcon: {
    backgroundColor: "white",
    borderColor: "#0f766e",
  },
  pendingIcon: {
    backgroundColor: "white",
    borderColor: "#E5E7EB",
  },
  label: {
    marginTop: 12,
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
  },
  activeLabel: {
    color: "#0f766e",
  },
  pendingLabel: {
    color: "#9CA3AF",
  },
});
