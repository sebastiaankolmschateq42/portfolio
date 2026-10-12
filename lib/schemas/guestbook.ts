import { z } from "zod";

export const guestbookSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name must be less than 50 characters" }),
  message: z
    .string()
    .min(1, { message: "Message is required" })
    .max(500, { message: "Message must be less than 500 characters" }),
});

export type GuestbookInput = z.infer<typeof guestbookSchema>;

export type GuestbookItem = GuestbookInput & {
  id: string;
  isApproved: boolean;
  createdAt: string;
};
