import { z } from "zod";

export const contactSchema = z.object({
  email: z
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" })
    .max(100, { message: "Email must be less than 100 characters" }),
  subject: z
    .string()
    .min(1, { message: "Subject is required" })
    .max(100, { message: "Subject must be less than 100 characters" }),
  message: z
    .string()
    .min(1, { message: "Message is required" })
    .max(1000, { message: "Message must be less than 1000 characters" }),
});

export type Contact = z.infer<typeof contactSchema>;
