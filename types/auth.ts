import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
} from "@/constants/schemas";
import z from "zod";

export type LoginFormData = z.infer<typeof loginSchema>;

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
