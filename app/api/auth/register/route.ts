import { NextResponse } from "next/server";
import { z } from "zod";
import { registerSchema } from "@/lib/schemas/auth";
import { registerAccount } from "@/lib/accounts";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = registerSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ errors: z.flattenError(result.error).fieldErrors }, { status: 400 });
  }

  try {
    await registerAccount(result.data);
  } catch (error) {
    console.error("Registration failed:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }

  // Same response whether or not the address already had an account.
  return NextResponse.json(
    { message: "If this address can be used, we have sent a verification code to it." },
    { status: 202 },
  );
}
