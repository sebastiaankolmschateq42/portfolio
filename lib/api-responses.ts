import { NextResponse } from "next/server";
import type { MutationResult } from "@/lib/questions";

export const unauthorized = () =>
  NextResponse.json({ error: "You need to be logged in" }, { status: 401 });

export const notFound = () => NextResponse.json({ error: "Question not found" }, { status: 404 });

export async function readJson(
  request: Request,
): Promise<{ ok: true; body: unknown } | { ok: false }> {
  try {
    return { ok: true, body: await request.json() };
  } catch {
    return { ok: false };
  }
}

export function mutationResponse(result: MutationResult) {
  if (result.ok) {
    return NextResponse.json({ success: true }, { status: 200 });
  }
  switch (result.reason) {
    case "not_found":
      return notFound();
    case "forbidden":
      return NextResponse.json({ error: "You are not allowed to do this" }, { status: 403 });
    case "already_answered":
      return NextResponse.json(
        { error: "This question has already been answered" },
        { status: 409 },
      );
  }
}
