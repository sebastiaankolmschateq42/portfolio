import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { answerSchema, questionIdSchema } from "@/lib/schemas/questions";
import { answerQuestion } from "@/lib/questions";
import { getSessionFromRequest } from "@/lib/session";
import { mutationResponse, notFound, readJson, unauthorized } from "@/lib/api-responses";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(request);
  if (!session) return unauthorized();

  const id = questionIdSchema.safeParse((await params).id);
  if (!id.success) return notFound();

  const json = await readJson(request);
  if (!json.ok) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });

  const result = answerSchema.safeParse(json.body);
  if (!result.success) {
    return NextResponse.json({ errors: z.flattenError(result.error).fieldErrors }, { status: 400 });
  }

  return mutationResponse(await answerQuestion(session, id.data, result.data));
}
