import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sendEmail } from "@/lib/email";

const sendMailMock = vi.fn().mockResolvedValue({});
const fetchMock = vi.fn();

vi.mock("nodemailer", () => ({
  default: { createTransport: () => ({ sendMail: sendMailMock }) },
}));

const message = {
  to: "me@example.com",
  subject: "Test subject",
  text: "Test body",
  replyTo: "visitor@example.com",
};

function stubSmtpEnv() {
  vi.stubEnv("SMTP_HOST", "smtp.test");
  vi.stubEnv("SMTP_PORT", "2525");
  vi.stubEnv("SMTP_USER", "user");
  vi.stubEnv("SMTP_PASS", "pass");
}

function stubMailtrapEnv() {
  vi.stubEnv("MAILTRAP_API_TOKEN", "test-token");
  vi.stubEnv("MAILTRAP_INBOX_ID", "12345");
}

describe("email service", () => {
  beforeEach(() => {
    // Start every test without any transport, regardless of the local .env.local.
    vi.stubEnv("MAILTRAP_API_TOKEN", "");
    vi.stubEnv("MAILTRAP_INBOX_ID", "");
    vi.stubEnv("SMTP_HOST", "");
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockResolvedValue(new Response("{}", { status: 200 }));
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    sendMailMock.mockClear();
    fetchMock.mockReset();
  });

  describe("Mailtrap API", () => {
    it("posts the message to the sandbox inbox with the token", async () => {
      stubMailtrapEnv();

      expect(await sendEmail(message)).toBe(true);

      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe("https://sandbox.api.mailtrap.io/api/send/12345");
      expect(init.method).toBe("POST");
      expect(init.headers.Authorization).toBe("Bearer test-token");
      expect(JSON.parse(init.body)).toMatchObject({
        to: [{ email: "me@example.com" }],
        subject: "Test subject",
        text: "Test body",
        reply_to: { email: "visitor@example.com" },
      });
    });

    it("is preferred over SMTP when both are configured", async () => {
      stubMailtrapEnv();
      stubSmtpEnv();

      await sendEmail(message);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(sendMailMock).not.toHaveBeenCalled();
    });

    it("returns false when the API responds with an error", async () => {
      stubMailtrapEnv();
      fetchMock.mockResolvedValueOnce(new Response("unauthorized", { status: 401 }));

      expect(await sendEmail(message)).toBe(false);
    });

    it("returns false when the inbox id is missing", async () => {
      vi.stubEnv("MAILTRAP_API_TOKEN", "test-token");

      expect(await sendEmail(message)).toBe(false);
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe("SMTP", () => {
    it("sends through the SMTP transporter when configured", async () => {
      stubSmtpEnv();

      expect(await sendEmail(message)).toBe(true);
      expect(sendMailMock).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "me@example.com",
          subject: "Test subject",
          replyTo: "visitor@example.com",
        }),
      );
    });

    it("returns false when sending fails", async () => {
      stubSmtpEnv();
      sendMailMock.mockRejectedValueOnce(new Error("smtp down"));

      expect(await sendEmail(message)).toBe(false);
    });
  });

  it("falls back to console logging when nothing is configured", async () => {
    expect(await sendEmail(message)).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(sendMailMock).not.toHaveBeenCalled();
  });

  it("fails in production when nothing is configured", async () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(await sendEmail(message)).toBe(false);
  });

  it("allows console logging in production only when asked for (CI)", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("MAIL_CONSOLE", "1");
    expect(await sendEmail(message)).toBe(true);
  });
});
