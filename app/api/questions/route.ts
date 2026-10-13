import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { questionSchema } from "@/lib/schemas/questions";
import { createQuestion } from "@/lib/questions";
import { getSessionFromRequest } from "@/lib/session";
import { readJson, unauthorized } from "@/lib/api-responses";

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) return unauthorized();

  const json = await readJson(request);
  if (!json.ok) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });

  const result = questionSchema.safeParse(json.body);
  if (!result.success) {
    return NextResponse.json({ errors: z.flattenError(result.error).fieldErrors }, { status: 400 });
  }

  // The author always comes from the session, never from the request body.
  const question = await createQuestion(session, result.data);
  return NextResponse.json({ id: question.id }, { status: 201 });
}
