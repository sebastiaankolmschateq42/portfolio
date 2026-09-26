import { describe, it, expect, vi, afterEach } from "vitest";
import { sendEmail } from "@/lib/email";

const sendMailMock = vi.fn().mockResolvedValue({});

vi.mock("nodemailer", () => ({
  default: { createTransport: () => ({ sendMail: sendMailMock }) },
}));

function stubSmtpEnv() {
  vi.stubEnv("SMTP_HOST", "smtp.test");
  vi.stubEnv("SMTP_PORT", "2525");
  vi.stubEnv("SMTP_USER", "user");
  vi.stubEnv("SMTP_PASS", "pass");
}

describe("email service", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    sendMailMock.mockClear();
  });

  it("sends an email through the SMTP transporter when configured", async () => {
    stubSmtpEnv();

    const result = await sendEmail({
      to: "me@example.com",
      subject: "Test subject",
      text: "Test body",
      replyTo: "visitor@example.com",
    });

    expect(result).toBe(true);
    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "me@example.com",
        subject: "Test subject",
        text: "Test body",
        replyTo: "visitor@example.com",
      }),
    );
  });

  it("falls back to console logging when SMTP is not configured", async () => {
    const result = await sendEmail({
      to: "me@example.com",
      subject: "Test subject",
      text: "Test body",
    });

    expect(result).toBe(true);
    expect(sendMailMock).not.toHaveBeenCalled();
  });

  it("returns false when sending fails", async () => {
    stubSmtpEnv();
    sendMailMock.mockRejectedValueOnce(new Error("smtp down"));

    const result = await sendEmail({
      to: "me@example.com",
      subject: "Test subject",
      text: "Test body",
    });

    expect(result).toBe(false);
  });
});