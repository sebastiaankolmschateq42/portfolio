import { NextResponse } from "next/server";
import { createCaptcha } from "@/lib/captcha";

// Every request gets a fresh sum; browsers must not reuse an old one.
export function GET() {
  return NextResponse.json(createCaptcha(), { headers: { "Cache-Control": "no-store" } });
}
