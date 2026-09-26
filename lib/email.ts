import nodemailer from "nodemailer";

type EmailInput = {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
};

export async function sendEmail(input: EmailInput): Promise<boolean> {
  if (!process.env.SMTP_HOST) {
    console.log("=== MAIL (no SMTP configured) ===");
    console.log(`To: ${input.to}\nSubject: ${input.subject}\n${input.text}`);
    return true;
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: '"Sebastiaan Henri Kolmschate" <noreply@kohese.nl>',
      ...input,
    });
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}
