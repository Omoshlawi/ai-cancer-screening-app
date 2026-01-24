import { FollowUp, OutreachAction } from "@/types/follow-up";
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

export const getPriorityDisplay = (priority: FollowUp["priority"]) => {
  switch (priority) {
    case "HIGH":
      return "High";
    case "MEDIUM":
      return "Medium";
    default:
      return "Low";
  }
};

export const getFollowUpCategoryDisply = (category: FollowUp["category"]) => {
  if (category === "REFERRAL_ADHERENCE") return "Referral Adherence";
  return "Re Screening Recall";
};

export const getOutreachOutcomeColor = (outcome: OutreachAction["outcome"]) => {
  switch (outcome) {
    case "PATIENT_CONTACTED":
      return "blue";
    case "PATIENT_UNAVAILABLE":
      return "gray";
    case "PATIENT_COMMITTED":
      return "green";
    case "PATIENT_VISITED_FACILITY":
      return "green";
    case "PATIENT_REFUSED":
      return "red";
    case "BARRIER_IDENTIFIED":
      return "orange";
    case "LOST_CONTACT":
      return "gray";
  }
};
export const getOutreachOutcomeDisplay = (
  outcome: OutreachAction["outcome"]
) => {
  switch (outcome) {
    case "PATIENT_CONTACTED":
      return "Patient Contacted";
    case "PATIENT_UNAVAILABLE":
      return "Patient Unavailable";
    case "PATIENT_COMMITTED":
      return "Patient Committed";
    case "PATIENT_VISITED_FACILITY":
      return "Patient Visited Facility";
    case "PATIENT_REFUSED":
      return "Patient Refused";
    case "BARRIER_IDENTIFIED":
      return "Barrier Identified";
    case "LOST_CONTACT":
      return "Lost Contact";
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

export const getStatusFromDates = (
  completionDate?: string,
  cancelationDate?: string
) => {
  if (completionDate) return ReferralStatus.COMPLETED;
  if (cancelationDate) return ReferralStatus.CANCELLED;
  return ReferralStatus.PENDING;
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
