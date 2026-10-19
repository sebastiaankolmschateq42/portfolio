import { z } from "zod";

// Limits follow the UC2 design (SM1): first/last name 60, email 80, phone 20,
// subject 200, message 600.
export const contactFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: "First name is required" })
    .max(60, { message: "First name must be at most 60 characters" }),
  lastName: z
    .string()
    .trim()
    .min(1, { message: "Last name is required" })
    .max(60, { message: "Last name must be at most 60 characters" }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .max(80, { message: "Email must be at most 80 characters" })
    .pipe(z.email({ message: "Invalid email address" })),
  phone: z
    .string()
    .trim()
    .min(1, { message: "Phone number is required" })
    .max(20, { message: "Phone number must be at most 20 characters" })
    .regex(/^\+?[0-9 ()-]{6,}$/, { message: "Use digits, spaces, +, - or ( )" }),
  subject: z
    .string()
    .trim()
    .min(1, { message: "Subject is required" })
    .max(200, { message: "Subject must be at most 200 characters" }),
  // Plain text only: stricter than the design, which allows a small set of HTML elements.
  message: z
    .string()
    .trim()
    .min(1, { message: "Message is required" })
    .max(600, { message: "Message must be at most 600 characters" })
    .refine((value) => !/<[a-z/!]/i.test(value), { message: "HTML is not allowed" })
    .refine((value) => !/(https?:\/\/|www\.)/i.test(value), {
      message: "Links are not allowed",
    }),
  captchaAnswer: z
    .string()
    .trim()
    .regex(/^\d{1,2}$/, { message: "Enter the answer as a number" }),
});

// What the server receives: the form fields plus the signed captcha token.
export const contactRequestSchema = contactFormSchema.extend({
  captchaToken: z.string().min(1).max(200),
});

export type ContactForm = z.infer<typeof contactFormSchema>;
export type ContactRequest = z.infer<typeof contactRequestSchema>;
