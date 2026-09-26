import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/contact/route";
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

const validBody = {
  email: "visitor@example.com",
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
    expect(data.errors).toHaveProperty("email");
    expect(data.errors).toHaveProperty("subject");
    expect(data.errors).toHaveProperty("message");
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("returns 500 when the email service fails", async () => {
    vi.mocked(sendEmail).mockResolvedValueOnce(false);
    const res = await POST(jsonRequest(validBody));
    expect(res.status).toBe(500);
  });

  it("sends to the fixed inbox and returns 201", async () => {
    const res = await POST(jsonRequest(validBody));
    expect(res.status).toBe(201);
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "portfolio@kohese.nl",
        replyTo: "visitor@example.com",
      }),
    );
  });
});
