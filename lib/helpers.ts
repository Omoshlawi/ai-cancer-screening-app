import { RiskInterpretation } from "@/types/screening";
import { SCREENING_FORM_BOOLEAN_OPTIONS, SMOKING_OPTIONS } from "./constants";

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
};

export const getBooleanDisplayValue = (value: string | number) => {
  return (
    SCREENING_FORM_BOOLEAN_OPTIONS.find((option) => option.value === value)
      ?.label || "N/A"
  );
};

export const getSmokingDisplayValue = (value: string | number) => {
  return (
    SMOKING_OPTIONS.find((option) => option.value === value)?.label || "N/A"
  );
};

export const getRiskInterpretation = (interpretation?: RiskInterpretation) => {
  switch (interpretation) {
    case RiskInterpretation.NO_RISK:
      return "No Risk";
    case RiskInterpretation.VERY_LOW_RISK:
      return "Very Low Risk";
    case RiskInterpretation.LOW_RISK:
      return "Low Risk";
    case RiskInterpretation.MODERATE_RISK:
      return "Moderate Risk";
    case RiskInterpretation.HIGH_RISK:
      return "High Risk";
    case RiskInterpretation.VERY_HIGH_RISK:
      return "Very High Risk";
    default:
      return "N/A";
  }
};

export const getRiskColor = (interpretation?: RiskInterpretation) => {
  switch (interpretation) {
    case RiskInterpretation.NO_RISK:
      return "green";
    case RiskInterpretation.VERY_LOW_RISK:
      return "blue";
    case RiskInterpretation.LOW_RISK:
      return "blue";
    case RiskInterpretation.MODERATE_RISK:
      return "orange";
    case RiskInterpretation.HIGH_RISK:
      return "red";
    case RiskInterpretation.VERY_HIGH_RISK:
      return "red";
    default:
      return "gray";
  }
};
