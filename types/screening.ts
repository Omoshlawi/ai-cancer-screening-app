import { screenClientSchema } from "@/constants/schemas";
import z from "zod";

export type Screening = {
  id: string;
  clientId: string;
  lifeTimePatners: number;
  firstIntercourseAge: number;
  everDiagnosedWithHIV: "YES" | "NO" | "NOT_SURE";
  everDiagnosedWithHPV: "YES" | "NO" | "NOT_SURE";
  everDiagnosedWithSTI: "YES" | "NO" | "NOT_SURE";
  totalBirths: number;
  everScreenedForCervicalCancer: "YES" | "NO" | "NOT_SURE";
  usedOralContraceptivesForMoreThan5Years: "YES" | "NO" | "NOT_SURE";
  smoking: "CURRENTLY" | "NEVER" | "PAST";
  familyMemberDiagnosedWithCervicalCancer: "YES" | "NO" | "NOT_SURE";
  createdAt: string;
  updatedAt: string;
};

export type ScreenClientFormData = z.infer<typeof screenClientSchema>;
