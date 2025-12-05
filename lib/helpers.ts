import { ReferralStatus, RiskInterpretation } from "@/types/screening";
import { mutate } from "./api";
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

export const getReferralStatusColor = (status?: ReferralStatus) => {
  switch (status) {
    case ReferralStatus.PENDING:
      return "orange";
    case ReferralStatus.COMPLETED:
      return "green";
    case ReferralStatus.CANCELLED:
      return "red";
    default:
      return "gray";
  }
};

export const getReferralStatusDisplayValue = (status?: ReferralStatus) => {
  switch (status) {
    case ReferralStatus.PENDING:
      return "Pending";
    case ReferralStatus.COMPLETED:
      return "Completed";
    case ReferralStatus.CANCELLED:
      return "Cancelled";
  }
};

export const getRiskPercentage = (interpretation?: RiskInterpretation) => {
  switch (interpretation) {
    case RiskInterpretation.LOW_RISK:
      return 0;
    case RiskInterpretation.MEDIUM_RISK:
      return 50;
    case RiskInterpretation.HIGH_RISK:
      return 100;
  }
};

export const invalidateCache = () => {
  mutate("/screenings");
  mutate("/clients"); // invalidate clients for the screening
  mutate("/referrals"); // invalidate referrals for the screening
  mutate("/activities"); // invalidate activities
};
