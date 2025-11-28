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
    case RiskInterpretation.LOW_RISK:
      return "Low Risk";
    case RiskInterpretation.MEDIUM_RISK:
      return "Moderate Risk";
    case RiskInterpretation.HIGH_RISK:
      return "High Risk";
    default:
      return "N/A";
  }
};

export const getRiskColor = (interpretation?: RiskInterpretation) => {
  switch (interpretation) {
    case RiskInterpretation.LOW_RISK:
      return "blue";
    case RiskInterpretation.MEDIUM_RISK:
      return "orange";
    case RiskInterpretation.HIGH_RISK:
      return "red";
    default:
      return "gray";
  }
};
