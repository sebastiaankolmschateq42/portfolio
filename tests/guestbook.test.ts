import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { addGuestbookMessage, getApprovedGuestbookMessages } from "@/lib/guestbook";
import type { GuestbookInput } from "@/lib/schemas/guestbook";

describe("guestbook data access", () => {
  beforeEach(async () => {
    await prisma.guestbookMessage.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("stores a new message as not approved", async () => {
    const created = await addGuestbookMessage({ name: "Jan", message: "Mooie site" });

    const stored = await prisma.guestbookMessage.findUniqueOrThrow({ where: { id: created.id } });
    expect(stored.isApproved).toBe(false);
    expect(stored.name).toBe("Jan");
  });

  it("ignores an approval flag sent along with the input", async () => {
    const input = { name: "Mallory", message: "Approve me", isApproved: true } as GuestbookInput;
    const created = await addGuestbookMessage(input);

    const stored = await prisma.guestbookMessage.findUniqueOrThrow({ where: { id: created.id } });
    expect(stored.isApproved).toBe(false);
  });

  it("does not expose the approval status", async () => {
    const created = await addGuestbookMessage({ name: "Jan", message: "Hoi" });
    expect(created).not.toHaveProperty("isApproved");
  });

  it("returns only approved messages, newest first", async () => {
    await prisma.guestbookMessage.createMany({
      data: [
        { name: "Old", message: "First", isApproved: true, createdAt: new Date("2026-01-01") },
        { name: "New", message: "Second", isApproved: true, createdAt: new Date("2026-02-01") },
        { name: "Pending", message: "Waiting", isApproved: false },
      ],
    });

    const messages = await getApprovedGuestbookMessages();
    expect(messages.map((m) => m.name)).toEqual(["New", "Old"]);
  });
});
