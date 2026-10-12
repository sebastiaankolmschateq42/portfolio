import { describe, it, expect } from "vitest";
import { SignJWT } from "jose";
import { signSession, verifySession } from "@/lib/session";

describe("session tokens", () => {
  it("round-trips a signed session", async () => {
    const token = await signSession({ userId: "user-1", role: "USER" });
    expect(await verifySession(token)).toEqual({ userId: "user-1", role: "USER" });
  });

  it("rejects a tampered token", async () => {
    const token = await signSession({ userId: "user-1", role: "USER" });
    const [header, , signature] = token.split(".");
    const forgedPayload = Buffer.from(JSON.stringify({ sub: "user-1", role: "ADMIN" })).toString(
      "base64url",
    );

    expect(await verifySession(`${header}.${forgedPayload}.${signature}`)).toBeNull();
  });

  it("rejects a token signed with another secret", async () => {
    const token = await new SignJWT({ role: "ADMIN" })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject("user-1")
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode("attacker-chosen-secret"));

    expect(await verifySession(token)).toBeNull();
  });

  it("rejects an expired token", async () => {
    const token = await new SignJWT({ role: "USER" })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject("user-1")
      .setExpirationTime(Math.floor(Date.now() / 1000) - 60)
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    expect(await verifySession(token)).toBeNull();
  });

  it("returns null without a token", async () => {
    expect(await verifySession(undefined)).toBeNull();
  });
});
