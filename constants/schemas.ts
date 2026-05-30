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
  dateOfBirth: z.date().refine(
    (date) => {
      const today = dayjs();
      const dob = dayjs(date);
      const age = today.diff(dob, "year");
      return dob.isBefore(today, "day") && age >= 16 && age <= 80;
    },
    {
      message:
        "Client age must be between 16 and 80 years (DOB must not be a future date)",
    },
  ),
  phoneNumber: z.string().regex(PHONE_NUMBER_REGEX, {
    message: "Use formart 07xxx or 01xxx ",
  }),
  county: z.string().min(3),
  subcounty: z.string().min(3),
  ward: z.string().min(3),
  nationalId: z.string().min(6).optional(),
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
  clientId: z.string().nonempty(),
  lifeTimePatners: z.coerce.number(),
  firstIntercourseAge: z.coerce
    .number()
    .min(10, "Age must be at least 10")
    .max(100, "Age must be less than 100"),
  everDiagnosedWithHIV: screenBoolean,
  everDiagnosedWithHPV: screenBoolean,
  everDiagnosedWithSTI: screenBoolean,
  totalBirths: z.coerce.number(),
  everScreenedForCervicalCancer: screenBoolean,
  usedOralContraceptivesForMoreThan5Years: screenBoolean,
  smoking: z.enum(["CURRENTLY", "NEVER", "PAST"]),
  familyMemberDiagnosedWithCervicalCancer: screenBoolean,
  coordinates: z.object({
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
  }),
  followUpId: z.string().optional(),
  outcomeNotes: z.string().optional(),
});

export const referralSchema = z.object({
  clientId: z.string(),
  screeningId: z.string(),
  appointmentTime: z.coerce.date(),
  healthFacilityId: z.string(),
  additionalNotes: z.string().optional(),
});

export const referralTestSchema = z
  .object({
    testType: z.enum(["VIA", "PAP_SMEAR", "HPV_TEST"]),
    testResult: z.enum([
      "POSITIVE",
      "NEGATIVE",
      "SUSPICIOUS",
      "CYTOLOGY_POSITIVE",
      "CYTOLOGY_NEGATIVE",
    ]),
    actionTaken: z.enum(["TREATED", "BIOPSY", "REFERRED"]).optional(),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const validResults: Record<string, string[]> = {
      VIA: ["POSITIVE", "NEGATIVE", "SUSPICIOUS"],
      PAP_SMEAR: ["CYTOLOGY_POSITIVE", "CYTOLOGY_NEGATIVE"],
      HPV_TEST: ["POSITIVE", "NEGATIVE"],
    };
    if (
      data.testType &&
      !validResults[data.testType].includes(data.testResult)
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Invalid result for selected test type",
        path: ["testResult"],
      });
    }

    if (data.testType === "VIA" && data.testResult === "POSITIVE") {
      if (
        data.actionTaken !== undefined &&
        data.actionTaken !== "TREATED" &&
        data.actionTaken !== "REFERRED"
      ) {
        ctx.addIssue({
          code: "custom",
          message: "VIA Positive only allows Treated or Referred",
          path: ["actionTaken"],
        });
      }
    }

    if (data.testType === "VIA" && data.testResult === "SUSPICIOUS") {
      if (data.actionTaken !== undefined && data.actionTaken !== "BIOPSY") {
        ctx.addIssue({
          code: "custom",
          message: "VIA Suspicious only allows Biopsy",
          path: ["actionTaken"],
        });
      }
    }

    if (data.actionTaken === "REFERRED" && !data.notes?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Notes are required when action is Referred",
        path: ["notes"],
      });
    }
  });

export const completeReferralSchema = z.object({
  tests: z.array(referralTestSchema).min(1, "At least one test is required"),
  visitedDate: z.coerce.date(),
  finalDiagnosis: z.string().optional(),
});

export const followUpSchema = z
  .object({
    category: z.enum(["REFERRAL_ADHERENCE", "RE_SCREENING_RECALL"]),
    startDate: z.coerce.date(),
    dueDate: z.coerce.date(),
    priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
    screeningId: z.string().nonempty(),
    referralId: z.string().nonempty().optional(),
  })
  .refine((data) => data.dueDate >= data.startDate, {
    message: "Due date must not be before start date",
    path: ["dueDate"],
  });

export const cancelFollowUpSchema = z.object({
  cancelReason: z.enum([
    "DECEASED",
    "RELOCATED",
    "UNREACHABLE",
    "REFUSED_SERVICE",
    "INCORRECT_DATA",
    "HOSPITALIZED_OTHER",
  ]),
  cancelNotes: z.string().optional(),
});

export const updateFollowUpSchema = followUpSchema.pick({
  dueDate: true,
  priority: true,
  startDate: true,
});

export const outreachActionSchema = z
  .object({
    actionDate: z.coerce.date(),
    actionType: z.enum([
      "PHONE_CALL",
      "HOME_VISIT",
      "SMS_SENT",
      "FACILITY_VERIFICATION",
    ]),
    outcome: z.enum([
      "PATIENT_UNAVAILABLE",
      "PATIENT_COMMITTED",
      "PATIENT_VISITED_FACILITY",
      "PATIENT_REFUSED",
      "BARRIER_IDENTIFIED",
      "LOST_CONTACT",
    ]),
    barriers: z.string().optional(),
    duration: z.coerce.number().optional(),
    location: z.string().optional(),
    nextPlannedDate: z.coerce.date().optional(),
    notes: z.string().optional(),
  })
  .refine(
    (data) =>
      data.nextPlannedDate === undefined ||
      data.nextPlannedDate > data.actionDate,
    {
      message: "Next planned date must be after action date",
      path: ["nextPlannedDate"],
    },
  );
