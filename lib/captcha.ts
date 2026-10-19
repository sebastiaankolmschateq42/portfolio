import "server-only";
import { createHmac, randomInt, randomUUID, timingSafeEqual } from "node:crypto";

// A simple sum the visitor has to solve before the contact form is sent.
// The answer is never sent to the browser: the token only carries an HMAC of it,
// so the server can check the answer later without storing anything per visitor.

const TTL_MS = 10 * 60 * 1000;

export type Captcha = { question: string; token: string };
export type CaptchaResult = "ok" | "wrong" | "expired";

// Tokens that were already checked, so each one can be tried only once (nonce -> expiresAt).
const usedNonces = new Map<string, number>();

function sign(answer: number, expiresAt: number, nonce: string) {
  const secret = process.env.CAPTCHA_SECRET;
  if (!secret) throw new Error("CAPTCHA_SECRET is not set");
  return createHmac("sha256", secret).update(`${answer}.${expiresAt}.${nonce}`).digest("hex");
}

export function createCaptcha(now = Date.now()): Captcha {
  const a = randomInt(1, 10);
  const b = randomInt(1, 10);
  const expiresAt = now + TTL_MS;
  const nonce = randomUUID();
  return {
    question: `${a} + ${b}`,
    token: `${expiresAt}.${nonce}.${sign(a + b, expiresAt, nonce)}`,
  };
}

export function verifyCaptcha(token: string, answer: string, now = Date.now()): CaptchaResult {
  const [expiresRaw, nonce, signature] = token.split(".");
  const expiresAt = Number(expiresRaw);
  if (!nonce || !signature || !Number.isSafeInteger(expiresAt)) return "wrong";
  if (expiresAt < now || usedNonces.has(nonce)) return "expired";

  // Burn the token before comparing: guessing all possible sums with one token is impossible.
  usedNonces.set(nonce, expiresAt);
  forgetExpired(now);

  const expected = Buffer.from(sign(Number(answer), expiresAt, nonce), "hex");
  const given = Buffer.from(signature, "hex");
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return "wrong";
  return "ok";
}

function forgetExpired(now: number) {
  for (const [nonce, expiresAt] of usedNonces) {
    if (expiresAt < now) usedNonces.delete(nonce);
  }
}
