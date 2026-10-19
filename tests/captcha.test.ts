import { describe, it, expect } from "vitest";
import { createCaptcha, verifyCaptcha } from "@/lib/captcha";

function solve(question: string) {
  const [a, b] = question.split(" + ").map(Number);
  return String(a + b);
}

describe("captcha", () => {
  it("asks a sum without revealing the answer", () => {
    const { question, token } = createCaptcha();
    expect(question).toMatch(/^\d \+ \d$/);
    const parts = token.split(".");
    expect(parts).toHaveLength(3);
    expect(parts).not.toContain(solve(question));
  });

  it("accepts the right answer", () => {
    const { question, token } = createCaptcha();
    expect(verifyCaptcha(token, solve(question))).toBe("ok");
  });

  it("rejects a wrong answer", () => {
    const { question, token } = createCaptcha();
    const wrong = String(Number(solve(question)) + 1);
    expect(verifyCaptcha(token, wrong)).toBe("wrong");
  });

  it("can be used only once, also after a wrong answer", () => {
    const first = createCaptcha();
    expect(verifyCaptcha(first.token, "99")).toBe("wrong");
    expect(verifyCaptcha(first.token, solve(first.question))).toBe("expired");

    const second = createCaptcha();
    expect(verifyCaptcha(second.token, solve(second.question))).toBe("ok");
    expect(verifyCaptcha(second.token, solve(second.question))).toBe("expired");
  });

  it("expires after ten minutes", () => {
    const now = Date.now();
    const { question, token } = createCaptcha(now);
    const later = now + 10 * 60 * 1000 + 1;
    expect(verifyCaptcha(token, solve(question), later)).toBe("expired");
  });

  it("rejects a token that was changed", () => {
    const { question, token } = createCaptcha();
    const [, nonce, signature] = token.split(".");
    const extended = `${Date.now() + 60 * 60 * 1000}.${nonce}.${signature}`;
    expect(verifyCaptcha(extended, solve(question))).toBe("wrong");
    expect(verifyCaptcha("not-a-token", "5")).toBe("wrong");
  });
});
