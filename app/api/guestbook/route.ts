import { NextResponse } from "next/server";
import { z } from "zod";
import { guestbookSchema } from "@/lib/schemas/guestbook";
import { addGuestbookMessage } from "@/lib/guestbook";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = guestbookSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ errors: z.flattenError(result.error).fieldErrors }, { status: 400 });
  }

  try {
    await addGuestbookMessage(result.data);
  } catch (error) {
    console.error("Failed to store guestbook message:", error);
    return NextResponse.json({ error: "Failed to store message" }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
