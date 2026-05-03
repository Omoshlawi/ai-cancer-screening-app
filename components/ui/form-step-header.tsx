import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Heading } from "@/components/ui/heading";

interface FormStepHeaderProps {
  icon: any;
  title: string;
  description?: string;
}

const FormStepHeader = ({ icon, title, description }: FormStepHeaderProps) => (
  <View style={styles.container}>
    <View style={styles.iconWrapper}>
      <Icon as={icon} size="xl" className="text-primary-600" />
    </View>
    <Heading size="md" className="text-typography-900 text-center font-bold tracking-tight">
      {title}
    </Heading>
    {description && (
      <Text style={styles.description}>{description}</Text>
    )}
    <View style={styles.accentBar} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 24,
    width: "100%",
  },
  iconWrapper: {
    backgroundColor: "#f0fdfa", // primary-50
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#ccfbf1", // primary-100
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  accentBar: {
    height: 4,
    width: 48,
    backgroundColor: "#ccfbf1", // primary-100
    borderRadius: 2,
    marginTop: 8,
  },
  description: {
    fontSize: 12,
    color: "#6B7280", // text-typography-500
    textAlign: "center",
    marginTop: 2,
  },
});

export default FormStepHeader;
