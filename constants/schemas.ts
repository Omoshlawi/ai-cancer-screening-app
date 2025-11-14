import z from "zod";

// Local Authentication Constants
export const PIN_LENGTH = 4;
export const PIN_MIN_LENGTH = 4;

export const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
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
