import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { questionIdSchema, questionSchema } from "@/lib/schemas/questions";
import { deleteQuestion, updateQuestion } from "@/lib/questions";
import { getSessionFromRequest } from "@/lib/session";
import { mutationResponse, notFound, readJson, unauthorized } from "@/lib/api-responses";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Context) {
  const session = await getSessionFromRequest(request);
  if (!session) return unauthorized();

  const id = questionIdSchema.safeParse((await params).id);
  if (!id.success) return notFound();

  const json = await readJson(request);
  if (!json.ok) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });

  const result = questionSchema.safeParse(json.body);
  if (!result.success) {
    return NextResponse.json({ errors: z.flattenError(result.error).fieldErrors }, { status: 400 });
  }

  return mutationResponse(await updateQuestion(session, id.data, result.data));
}

export async function DELETE(request: NextRequest, { params }: Context) {
  const session = await getSessionFromRequest(request);
  if (!session) return unauthorized();

  const id = questionIdSchema.safeParse((await params).id);
  if (!id.success) return notFound();

  return mutationResponse(await deleteQuestion(session, id.data));
}
