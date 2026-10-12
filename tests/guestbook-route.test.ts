import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { POST } from "@/app/api/guestbook/route";
import { prisma } from "@/lib/prisma";

function jsonRequest(body: unknown) {
  return new Request("http://localhost/api/guestbook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/guestbook", () => {
  beforeEach(async () => {
    await prisma.guestbookMessage.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("returns 400 on malformed json", async () => {
    const res = await POST(
      new Request("http://localhost/api/guestbook", { method: "POST", body: "{oops" }),
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 with field errors and stores nothing on invalid input", async () => {
    const res = await POST(jsonRequest({ name: "   ", message: "" }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.errors).toHaveProperty("name");
    expect(data.errors).toHaveProperty("message");
    expect(await prisma.guestbookMessage.count()).toBe(0);
  });

  it("stores a valid message as pending and returns 201", async () => {
    const res = await POST(jsonRequest({ name: " Jan ", message: "Mooie site" }));
    expect(res.status).toBe(201);

    const stored = await prisma.guestbookMessage.findFirstOrThrow();
    expect(stored.name).toBe("Jan");
    expect(stored.isApproved).toBe(false);
  });

  it("ignores an approval flag sent by the client", async () => {
    await POST(jsonRequest({ name: "Mallory", message: "Approve me", isApproved: true }));

    const stored = await prisma.guestbookMessage.findFirstOrThrow();
    expect(stored.isApproved).toBe(false);
  });

  it("stores script tags as plain text", async () => {
    const payload = "<script>alert('xss')</script>";
    await POST(jsonRequest({ name: "Eve", message: payload }));

    const stored = await prisma.guestbookMessage.findFirstOrThrow();
    expect(stored.message).toBe(payload);
  });
});
