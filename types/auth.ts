import { forgotPasswordSchema, loginSchema } from "@/constants/schemas";
import z from "zod";

export type LoginFormData = z.infer<typeof loginSchema>;

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
