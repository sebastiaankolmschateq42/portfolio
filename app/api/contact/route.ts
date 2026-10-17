import { NextResponse } from "next/server";
import { contactRequestSchema } from "@/lib/schemas/contact";
import { verifyCaptcha } from "@/lib/captcha";
import { sendEmail } from "@/lib/email";
import { z } from "zod";

export async function POST(request: Request) {
  // validate body json is valid
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // validate body with zod
  const result = contactRequestSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ errors: z.flattenError(result.error).fieldErrors }, { status: 400 });
  }
  const contact = result.data;

  // check the captcha before anything is sent
  const captcha = verifyCaptcha(contact.captchaToken, contact.captchaAnswer);
  if (captcha !== "ok") {
    const message =
      captcha === "expired" ? "This sum has expired, try the new one" : "Wrong answer, try again";
    return NextResponse.json({ errors: { captchaAnswer: [message] } }, { status: 400 });
  }

  // send email; nothing is stored (NFR5)
  const sent = await sendEmail({
    to: process.env.CONTACT_INBOX || "portfolio@kohese.nl",
    subject: `Contact form: ${contact.subject}`,
    text: [
      `From: ${contact.firstName} ${contact.lastName}`,
      `Email: ${contact.email}`,
      `Phone: ${contact.phone}`,
      "",
      contact.message,
    ].join("\n"),
    replyTo: contact.email,
  });

  if (!sent) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
