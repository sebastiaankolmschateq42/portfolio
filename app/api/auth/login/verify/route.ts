import { NextResponse } from "next/server";
import { z } from "zod";
import { verifySchema } from "@/lib/schemas/auth";
import { completeLogin } from "@/lib/accounts";
import { setSessionCookie, signSession } from "@/lib/session";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = verifySchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ errors: z.flattenError(result.error).fieldErrors }, { status: 400 });
  }

  const session = await completeLogin(result.data.email, result.data.code);
  if (!session) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
  }

  const response = NextResponse.json({ success: true }, { status: 200 });
  setSessionCookie(response, await signSession(session));
  return response;
}
