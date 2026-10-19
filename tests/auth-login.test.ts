import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import bcrypt from "bcryptjs";
import { POST as login } from "@/app/api/auth/login/route";
import { POST as loginVerify } from "@/app/api/auth/login/verify/route";
import { POST as logout } from "@/app/api/auth/logout/route";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { verifySession } from "@/lib/session";

vi.mock("@/lib/email", () => ({
  sendEmail: vi.fn().mockResolvedValue(true),
}));

const PASSWORD = "correct horse battery";

function jsonRequest(url: string, body: unknown) {
  return new Request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function createUser({ verified = true } = {}) {
  await prisma.user.create({
    data: {
      email: "jan@example.com",
      displayName: "Jan",
      passwordHash: await bcrypt.hash(PASSWORD, 4),
      emailVerifiedAt: verified ? new Date() : null,
    },
  });
}

function lastMailedCode(): string {
  const calls = vi.mocked(sendEmail).mock.calls;
  return calls[calls.length - 1][0].text.match(/\d{6}/)![0];
}

function sessionToken(res: Response): string | undefined {
  return res.headers.get("set-cookie")?.match(/^session=([^;]*)/)?.[1];
}

describe("login with password and emailed code", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
    vi.mocked(sendEmail).mockClear();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("rejects a wrong password without mailing a code", async () => {
    await createUser();
    const res = await login(
      jsonRequest("http://localhost/api/auth/login", {
        email: "jan@example.com",
        password: "wrong password",
      }),
    );

    expect(res.status).toBe(401);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("gives the same answer for an unknown address", async () => {
    const res = await login(
      jsonRequest("http://localhost/api/auth/login", {
        email: "nobody@example.com",
        password: PASSWORD,
      }),
    );

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Invalid email or password" });
  });

  it("does not let an unverified account log in", async () => {
    await createUser({ verified: false });
    const res = await login(
      jsonRequest("http://localhost/api/auth/login", {
        email: "jan@example.com",
        password: PASSWORD,
      }),
    );

    expect(res.status).toBe(401);
  });

  it("mails a code after the right password but does not create a session yet", async () => {
    await createUser();
    const res = await login(
      jsonRequest("http://localhost/api/auth/login", {
        email: "Jan@Example.com",
        password: PASSWORD,
      }),
    );

    expect(res.status).toBe(202);
    expect(res.headers.get("set-cookie")).toBeNull();
    expect(lastMailedCode()).toMatch(/^\d{6}$/);
  });

  it("creates a session after the right code", async () => {
    await createUser();
    await login(
      jsonRequest("http://localhost/api/auth/login", {
        email: "jan@example.com",
        password: PASSWORD,
      }),
    );

    const res = await loginVerify(
      jsonRequest("http://localhost/api/auth/login/verify", {
        email: "jan@example.com",
        code: lastMailedCode(),
      }),
    );

    expect(res.status).toBe(200);
    const session = await verifySession(sessionToken(res));
    expect(session?.role).toBe("USER");
  });

  it("rejects a wrong code without creating a session", async () => {
    await createUser();
    await login(
      jsonRequest("http://localhost/api/auth/login", {
        email: "jan@example.com",
        password: PASSWORD,
      }),
    );
    const wrong = lastMailedCode() === "000000" ? "000001" : "000000";

    const res = await loginVerify(
      jsonRequest("http://localhost/api/auth/login/verify", {
        email: "jan@example.com",
        code: wrong,
      }),
    );

    expect(res.status).toBe(400);
    expect(res.headers.get("set-cookie")).toBeNull();
  });

  it("clears the session cookie on logout", async () => {
    const res = await logout();

    expect(res.status).toBe(200);
    const cookie = res.headers.get("set-cookie") ?? "";
    expect(cookie).toMatch(/^session=;/);
    expect(cookie).toMatch(/Expires=Thu, 01 Jan 1970|Max-Age=0/i);
  });
});
