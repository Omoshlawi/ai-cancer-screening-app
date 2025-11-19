import { clientSchema } from "@/constants/schemas";
import z from "zod";

export type ClientFormData = z.infer<typeof clientSchema>;
