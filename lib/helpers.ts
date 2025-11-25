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
