import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import type { AuthCodePurpose } from "@/generated/prisma/client";

const CODE_TTL_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function hashCode(code: string): string {
  const secret = process.env.AUTH_CODE_SECRET;
  if (!secret) {
    throw new Error("AUTH_CODE_SECRET is not set");
  }
  return createHmac("sha256", secret).update(code).digest("hex");
}

function generateCode(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export async function createAuthCode(userId: string, purpose: AuthCodePurpose): Promise<string> {
  const code = generateCode();

  await prisma.$transaction([
    prisma.authCode.updateMany({
      where: { userId, purpose, usedAt: null },
      data: { usedAt: new Date() },
    }),
    prisma.authCode.create({
      data: {
        userId,
        purpose,
        codeHash: hashCode(code),
        expiresAt: new Date(Date.now() + CODE_TTL_MS),
      },
    }),
  ]);

  return code;
}

export async function verifyAuthCode(
  userId: string,
  purpose: AuthCodePurpose,
  code: string,
): Promise<boolean> {
  const record = await prisma.authCode.findFirst({
    where: { userId, purpose, usedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });

  if (!record || record.attempts >= MAX_ATTEMPTS) {
    return false;
  }

  await prisma.authCode.update({
    where: { id: record.id },
    data: { attempts: { increment: 1 } },
  });

  const expected = Buffer.from(record.codeHash, "hex");
  const actual = Buffer.from(hashCode(code), "hex");
  if (!timingSafeEqual(expected, actual)) {
    return false;
  }

  const consumed = await prisma.authCode.updateMany({
    where: { id: record.id, usedAt: null },
    data: { usedAt: new Date() },
  });
  return consumed.count === 1;
}

const subjects: Record<AuthCodePurpose, string> = {
  VERIFY: "Verify your email address",
  LOGIN: "Your login code",
};

export async function sendAuthCodeEmail(
  to: string,
  purpose: AuthCodePurpose,
  code: string,
): Promise<boolean> {
  return sendEmail({
    to,
    subject: subjects[purpose],
    text: `Your code is ${code}. It is valid for 5 minutes. If you did not request this, you can ignore this email.`,
  });
}
