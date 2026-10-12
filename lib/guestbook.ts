import { prisma } from "@/lib/prisma";
import type { GuestbookInput } from "@/lib/schemas/guestbook";

const publicFields = {
  id: true,
  name: true,
  message: true,
  createdAt: true,
} as const;

export async function addGuestbookMessage(input: GuestbookInput) {
  return prisma.guestbookMessage.create({
    data: { name: input.name, message: input.message },
    select: publicFields,
  });
}

export async function getApprovedGuestbookMessages() {
  return prisma.guestbookMessage.findMany({
    where: { isApproved: true },
    orderBy: { createdAt: "desc" },
    select: publicFields,
  });
}
