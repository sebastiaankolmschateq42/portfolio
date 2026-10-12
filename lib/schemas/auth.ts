import { z } from "zod";

const email = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, { message: "Email must be less than 254 characters" })
  .pipe(z.email({ message: "Enter a valid email address" }));

export const registerSchema = z.object({
  email,
  displayName: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name must be less than 50 characters" }),
  password: z
    .string()
    .min(12, { message: "Password must be at least 12 characters" })
    .max(128, { message: "Password must be less than 128 characters" }),
});

export const verifySchema = z.object({
  email,
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, { message: "Enter the 6-digit code from the email" }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type VerifyInput = z.infer<typeof verifySchema>;
