import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/contact/route";
import { GET as getCaptcha } from "@/app/api/contact/captcha/route";
import { sendEmail } from "@/lib/email";

vi.mock("@/lib/email", () => ({
  sendEmail: vi.fn().mockResolvedValue(true),
}));

function jsonRequest(body: unknown) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// Asks the captcha route for a sum and returns the fields needed to pass it.
async function solvedCaptcha() {
  const { question, token } = await getCaptcha().json();
  const [a, b] = question.split(" + ").map(Number);
  return { captchaToken: token, captchaAnswer: String(a + b) };
}

const validFields = {
  firstName: "Ada",
  lastName: "Lovelace",
  email: "visitor@example.com",
  phone: "+31 6 12345678",
  subject: "Question",
  message: "Hello World!",
};

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.mocked(sendEmail).mockClear();
    vi.mocked(sendEmail).mockResolvedValue(true);
    vi.stubEnv("CONTACT_INBOX", "portfolio@kohese.nl");
  });

  it("returns 400 on malformed json", async () => {
    const res = await POST(
      new Request("http://localhost/api/contact", { method: "POST", body: "{oops" }),
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 with field errors on invalid input", async () => {
    const res = await POST(jsonRequest({ email: "nope" }));
    expect(res.status).toBe(400);
    const data = await res.json();
    for (const field of ["firstName", "lastName", "email", "phone", "subject", "message"]) {
      expect(data.errors).toHaveProperty(field);
    }
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("enforces the maximum lengths from the design", async () => {
    const res = await POST(
      jsonRequest({
        ...validFields,
        ...(await solvedCaptcha()),
        firstName: "a".repeat(61),
        email: `${"a".repeat(70)}@example.com`,
        phone: "1".repeat(21),
        subject: "a".repeat(201),
        message: "a".repeat(601),
      }),
    );
    const { errors } = await res.json();
    expect(Object.keys(errors).sort()).toEqual([
      "email",
      "firstName",
      "message",
      "phone",
      "subject",
    ]);
  });

  it("rejects HTML and links in the message", async () => {
    for (const message of ["<script>alert(1)</script>", "Visit https://evil.test"]) {
      const res = await POST(jsonRequest({ ...validFields, ...(await solvedCaptcha()), message }));
      expect(res.status).toBe(400);
      expect((await res.json()).errors).toHaveProperty("message");
    }
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("returns 400 and sends nothing when the captcha is wrong", async () => {
    const { captchaToken } = await solvedCaptcha();
    const res = await POST(jsonRequest({ ...validFields, captchaToken, captchaAnswer: "99" }));
    expect(res.status).toBe(400);
    expect((await res.json()).errors).toHaveProperty("captchaAnswer");
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("returns 500 when the email service fails", async () => {
    vi.mocked(sendEmail).mockResolvedValueOnce(false);
    const res = await POST(jsonRequest({ ...validFields, ...(await solvedCaptcha()) }));
    expect(res.status).toBe(500);
  });

  it("sends all details to the fixed inbox and returns 201", async () => {
    const res = await POST(jsonRequest({ ...validFields, ...(await solvedCaptcha()) }));
    expect(res.status).toBe(201);
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "portfolio@kohese.nl",
        replyTo: "visitor@example.com",
        text: expect.stringContaining("Ada Lovelace"),
      }),
    );
    expect(vi.mocked(sendEmail).mock.calls[0][0].text).toContain("+31 6 12345678");
  });
});
