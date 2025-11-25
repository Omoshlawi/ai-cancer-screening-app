import { clientSchema, screenClientSchema } from "@/constants/schemas";
import z from "zod";

export type ClientFormData = z.infer<typeof clientSchema>;

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  nationalId: string;
  maritalStatus: ClientFormData["maritalStatus"];
  level?: "low" | "medium" | "high";
}

export type ScreenClientFormData = z.infer<typeof screenClientSchema>;
