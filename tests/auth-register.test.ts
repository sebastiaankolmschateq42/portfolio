import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import { POST as register } from "@/app/api/auth/register/route";
import { POST as verify } from "@/app/api/auth/verify/route";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

vi.mock("@/lib/email", () => ({
  sendEmail: vi.fn().mockResolvedValue(true),
}));

function jsonRequest(url: string, body: unknown) {
  return new Request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validRegistration = {
  email: "Jan@Example.com",
  displayName: "Jan",
  password: "correct horse battery",
};

function lastMailedCode(): string {
  const calls = vi.mocked(sendEmail).mock.calls;
  const text = calls[calls.length - 1][0].text;
  return text.match(/\d{6}/)![0];
}

describe("registration and email verification", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
    vi.mocked(sendEmail).mockClear();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("returns 400 with field errors on invalid input", async () => {
    const res = await register(
      jsonRequest("http://localhost/api/auth/register", {
        email: "nope",
        displayName: "",
        password: "short",
      }),
    );
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(Object.keys(data.errors).sort()).toEqual(["displayName", "email", "password"]);
  });

  it("creates an unverified account with a hashed password and mails a code", async () => {
    const res = await register(
      jsonRequest("http://localhost/api/auth/register", validRegistration),
    );
    expect(res.status).toBe(202);

    const user = await prisma.user.findUniqueOrThrow({ where: { email: "jan@example.com" } });
    expect(user.emailVerifiedAt).toBeNull();
    expect(user.role).toBe("USER");
    expect(user.passwordHash).not.toBe(validRegistration.password);
    expect(user.passwordHash).toMatch(/^\$2[aby]\$12\$/);
    expect(sendEmail).toHaveBeenCalledWith(expect.objectContaining({ to: "jan@example.com" }));
    expect(lastMailedCode()).toMatch(/^\d{6}$/);
  });

  it("gives the same response for an address that already has a verified account", async () => {
    await register(jsonRequest("http://localhost/api/auth/register", validRegistration));
    await prisma.user.updateMany({ data: { emailVerifiedAt: new Date() } });
    const before = await prisma.user.findUniqueOrThrow({ where: { email: "jan@example.com" } });
    vi.mocked(sendEmail).mockClear();

    const res = await register(
      jsonRequest("http://localhost/api/auth/register", {
        ...validRegistration,
        password: "attacker password 123",
      }),
    );

    expect(res.status).toBe(202);
    expect(sendEmail).not.toHaveBeenCalled();
    const after = await prisma.user.findUniqueOrThrow({ where: { email: "jan@example.com" } });
    expect(after.passwordHash).toBe(before.passwordHash);
  });

  it("verifies the email with the mailed code and sets a secure session cookie", async () => {
    await register(jsonRequest("http://localhost/api/auth/register", validRegistration));

    const res = await verify(
      jsonRequest("http://localhost/api/auth/verify", {
        email: "jan@example.com",
        code: lastMailedCode(),
      }),
    );

    expect(res.status).toBe(200);
    const cookie = res.headers.get("set-cookie") ?? "";
    expect(cookie).toMatch(/^session=/);
    expect(cookie).toMatch(/HttpOnly/i);
    expect(cookie).toMatch(/SameSite=strict/i);

    const user = await prisma.user.findUniqueOrThrow({ where: { email: "jan@example.com" } });
    expect(user.emailVerifiedAt).not.toBeNull();
  });

  it("rejects a wrong code without setting a cookie", async () => {
    await register(jsonRequest("http://localhost/api/auth/register", validRegistration));
    const wrong = lastMailedCode() === "000000" ? "000001" : "000000";

    const res = await verify(
      jsonRequest("http://localhost/api/auth/verify", { email: "jan@example.com", code: wrong }),
    );

    expect(res.status).toBe(400);
    expect(res.headers.get("set-cookie")).toBeNull();
    const user = await prisma.user.findUniqueOrThrow({ where: { email: "jan@example.com" } });
    expect(user.emailVerifiedAt).toBeNull();
  });

  it("gives the same error for an unknown address", async () => {
    const res = await verify(
      jsonRequest("http://localhost/api/auth/verify", {
        email: "nobody@example.com",
        code: "123456",
      }),
    );

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Invalid or expired code" });
  });
});
