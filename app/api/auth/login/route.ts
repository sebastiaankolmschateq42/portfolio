import { NextResponse } from "next/server";
import { z } from "zod";
import { loginSchema } from "@/lib/schemas/auth";
import { startLogin } from "@/lib/accounts";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = loginSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ errors: z.flattenError(result.error).fieldErrors }, { status: 400 });
  }

  let codeSent: boolean;
  try {
    codeSent = await startLogin(result.data);
  } catch (error) {
    console.error("Login failed:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }

  if (!codeSent) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }
  return NextResponse.json(
    { message: "We have sent a login code to your email." },
    { status: 202 },
  );
}
