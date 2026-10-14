import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/schemas/contact";
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
  const result = contactSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ errors: z.flattenError(result.error).fieldErrors }, { status: 400 });
  }

  // send email
  const sent = await sendEmail({
    to: process.env.CONTACT_INBOX || "portfolio@kohese.nl",
    subject: `Contact form: ${result.data.subject}`,
    text: `From: ${result.data.email}\n\n${result.data.message}`,
    replyTo: result.data.email,
  });

  if (!sent) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
