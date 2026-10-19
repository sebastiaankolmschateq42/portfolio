import nodemailer from "nodemailer";

type EmailInput = {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
};

const FROM = { email: "noreply@kohese.nl", name: "Sebastiaan Henri Kolmschate" };

const TIMEOUT_MS = 10_000;

export async function sendEmail(input: EmailInput): Promise<boolean> {
  try {
    if (process.env.MAILTRAP_API_TOKEN) {
      await sendViaMailtrapApi(input);
    } else if (process.env.SMTP_HOST) {
      await sendViaSmtp(input);
    } else if (process.env.NODE_ENV === "production" && process.env.MAIL_CONSOLE !== "1") {
      throw new Error("No mail transport configured");
    } else {
      console.log("=== MAIL (no transport configured) ===");
      console.log(`To: ${input.to}\nSubject: ${input.subject}\n${input.text}`);
    }
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

async function sendViaMailtrapApi(input: EmailInput): Promise<void> {
  const inboxId = process.env.MAILTRAP_INBOX_ID;
  if (!inboxId) {
    throw new Error("MAILTRAP_INBOX_ID is not set");
  }

  const response = await fetch(
    `https://sandbox.api.mailtrap.io/api/send/${encodeURIComponent(inboxId)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MAILTRAP_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [{ email: input.to }],
        subject: input.subject,
        text: input.text,
        ...(input.replyTo ? { reply_to: { email: input.replyTo } } : {}),
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    },
  );

  if (!response.ok) {
    throw new Error(`Mailtrap API responded with ${response.status}`);
  }
}

async function sendViaSmtp(input: EmailInput): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: TIMEOUT_MS,
    greetingTimeout: TIMEOUT_MS,
    socketTimeout: TIMEOUT_MS,
  });

  await transporter.sendMail({ from: `"${FROM.name}" <${FROM.email}>`, ...input });
}
