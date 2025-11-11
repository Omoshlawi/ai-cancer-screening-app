import { loginSchema } from "@/constants/schemas";
import z from "zod";

export type LoginFormData = z.infer<typeof loginSchema>;
