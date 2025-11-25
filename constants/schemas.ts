import dayjs from "dayjs";
import z from "zod";
import { PHONE_NUMBER_REGEX } from ".";

// Local Authentication Constants
export const PIN_LENGTH = 4;
export const PIN_MIN_LENGTH = 4;

export const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8),
});

export const forgotPasswordSchema = z.object({
  email: z.email(),
});

export const changePasswordSchema = z
  .object({
    newPassword: z.string().min(8),
    currentPassword: z.string().min(8),
    confirmPassword: z.string().min(8),
    revokeOtherSessions: z.boolean(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const clientSchema = z.object({
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  dateOfBirth: z.date().refine((date) => dayjs(date).isBefore(dayjs()), {
    message: "Date of birth must not be a future date",
  }),
  phoneNumber: z.string().regex(PHONE_NUMBER_REGEX, {
    message: "Phone number must be a valid Kenyan phone number",
  }),
  address: z.string().min(3),
  nationalId: z.string().min(6),
  maritalStatus: z.enum([
    "SINGLE",
    "MARRIED",
    "DIVORCED",
    "WIDOWED",
    "SEPARATED",
  ]),
});

const screenBoolean = z.enum(["YES", "NO", "NOT_SURE"]);

export const screenClientSchema = z.object({
  clientId: z.string(),
  lifeTimePatners: z.coerce.number(),
  firstIntercourseAge: z.coerce.number(),
  everDiagnosedWithHIV: screenBoolean,
  everDiagnosedWithHPV: screenBoolean,
  everDiagnosedWithSTI: screenBoolean,
  totalBirths: z.coerce.number(),
  everScreenedForCervicalCancer: screenBoolean,
  usedOralContraceptivesForMoreThan5Years: screenBoolean,
  smoking: z.enum(["CURRENTLY", "NEVER", "PAST"]),
  familyMemberDiagnosedWithCervicalCancer: screenBoolean,
});
