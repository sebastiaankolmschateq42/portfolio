import "server-only";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createAuthCode, sendAuthCodeEmail, verifyAuthCode } from "@/lib/auth-codes";
import type { RegisterInput } from "@/lib/schemas/auth";
import type { Session } from "@/lib/session";

const BCRYPT_COST = 12;

/**
 * Creates (or refreshes an unverified) account and mails a verification code.
 * For an address that already has a verified account it does nothing, so the caller
 * can give every visitor the same response and nobody can find out which addresses exist.
 */
export async function registerAccount(input: RegisterInput): Promise<void> {
  // Hash before the lookup so new and existing addresses take the same time.
  const passwordHash = await bcrypt.hash(input.password, BCRYPT_COST);

  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing?.emailVerifiedAt) {
    return;
  }

  const user = existing
    ? await prisma.user.update({
        where: { id: existing.id },
        data: { displayName: input.displayName, passwordHash },
      })
    : await prisma.user.create({
        data: { email: input.email, displayName: input.displayName, passwordHash },
      });

  const code = await createAuthCode(user.id, "VERIFY");
  const sent = await sendAuthCodeEmail(user.email, "VERIFY", code);
  if (!sent) {
    throw new Error("Failed to send verification email");
  }
}

/** Marks the email as verified when the code is right and returns the new session. */
export async function verifyEmail(email: string, code: string): Promise<Session | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.emailVerifiedAt) {
    return null;
  }

  if (!(await verifyAuthCode(user.id, "VERIFY", code))) {
    return null;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerifiedAt: new Date() },
  });
  return { userId: user.id, role: user.role };
}
