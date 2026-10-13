import "server-only";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createAuthCode, sendAuthCodeEmail, verifyAuthCode } from "@/lib/auth-codes";
import type { LoginInput, RegisterInput } from "@/lib/schemas/auth";
import type { Session } from "@/lib/session";

const BCRYPT_COST = 12;

// Compared against when the address is unknown, so a failed login takes as long
// whether or not the account exists.
let dummyHash: string | undefined;
function getDummyHash(): string {
  dummyHash ??= bcrypt.hashSync("dummy password for timing", BCRYPT_COST);
  return dummyHash;
}

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

/**
 * First factor: checks email and password. On success a login code is mailed;
 * no session is created yet. Returns false for every failure reason alike.
 */
export async function startLogin(input: LoginInput): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  const passwordMatches = await bcrypt.compare(
    input.password,
    user?.passwordHash ?? getDummyHash(),
  );

  if (!user || !passwordMatches || !user.emailVerifiedAt) {
    return false;
  }

  const code = await createAuthCode(user.id, "LOGIN");
  const sent = await sendAuthCodeEmail(user.email, "LOGIN", code);
  if (!sent) {
    throw new Error("Failed to send login code");
  }
  return true;
}

/** Second factor: the mailed code. Returns the session when it is right. */
export async function completeLogin(email: string, code: string): Promise<Session | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.emailVerifiedAt) {
    return null;
  }

  if (!(await verifyAuthCode(user.id, "LOGIN", code))) {
    return null;
  }
  return { userId: user.id, role: user.role };
}
