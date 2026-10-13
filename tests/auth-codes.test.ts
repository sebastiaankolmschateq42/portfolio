import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { createAuthCode, verifyAuthCode } from "@/lib/auth-codes";

async function createUser() {
  const user = await prisma.user.create({
    data: { email: "jan@example.com", displayName: "Jan", passwordHash: "not-a-real-hash" },
  });
  return user.id;
}

describe("auth codes", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("creates a six digit code and stores only its hash", async () => {
    const userId = await createUser();
    const code = await createAuthCode(userId, "LOGIN");

    expect(code).toMatch(/^\d{6}$/);
    const stored = await prisma.authCode.findFirstOrThrow({ where: { userId } });
    expect(stored.codeHash).not.toContain(code);
  });

  it("accepts the right code exactly once", async () => {
    const userId = await createUser();
    const code = await createAuthCode(userId, "LOGIN");

    expect(await verifyAuthCode(userId, "LOGIN", code)).toBe(true);
    expect(await verifyAuthCode(userId, "LOGIN", code)).toBe(false);
  });

  it("rejects a wrong code", async () => {
    const userId = await createUser();
    const code = await createAuthCode(userId, "LOGIN");
    const wrong = code === "000000" ? "000001" : "000000";

    expect(await verifyAuthCode(userId, "LOGIN", wrong)).toBe(false);
  });

  it("locks the code after five wrong attempts", async () => {
    const userId = await createUser();
    const code = await createAuthCode(userId, "LOGIN");
    const wrong = code === "000000" ? "000001" : "000000";

    for (let i = 0; i < 5; i++) {
      await verifyAuthCode(userId, "LOGIN", wrong);
    }
    expect(await verifyAuthCode(userId, "LOGIN", code)).toBe(false);
  });

  it("rejects an expired code", async () => {
    const userId = await createUser();
    const code = await createAuthCode(userId, "LOGIN");
    await prisma.authCode.updateMany({
      where: { userId },
      data: { expiresAt: new Date(Date.now() - 1000) },
    });

    expect(await verifyAuthCode(userId, "LOGIN", code)).toBe(false);
  });

  it("does not accept a code for a different purpose", async () => {
    const userId = await createUser();
    const code = await createAuthCode(userId, "VERIFY");

    expect(await verifyAuthCode(userId, "LOGIN", code)).toBe(false);
  });

  it("invalidates the previous code when a new one is created", async () => {
    const userId = await createUser();
    const first = await createAuthCode(userId, "LOGIN");
    const second = await createAuthCode(userId, "LOGIN");

    if (first !== second) {
      expect(await verifyAuthCode(userId, "LOGIN", first)).toBe(false);
    }
    expect(await verifyAuthCode(userId, "LOGIN", second)).toBe(true);
  });
});
