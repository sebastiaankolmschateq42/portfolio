import "server-only";
import { prisma } from "@/lib/prisma";
import { publishQuestionEvent } from "@/lib/events";
import type { Session } from "@/lib/session";
import type { AnswerInput, QuestionInput } from "@/lib/schemas/questions";

/** What the page and API may show about a question. Never contains email addresses. */
export type QuestionView = {
  id: string;
  body: string;
  answer: string | null;
  answeredAt: Date | null;
  createdAt: Date;
  authorName: string;
  canEdit: boolean;
  canDelete: boolean;
  canAnswer: boolean;
};

export type MutationResult =
  { ok: true } | { ok: false; reason: "not_found" | "forbidden" | "already_answered" };

const isAdmin = (viewer: Session | null) => viewer?.role === "ADMIN";

export async function listQuestions(viewer: Session | null): Promise<QuestionView[]> {
  const questions = await prisma.question.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      body: true,
      answer: true,
      answeredAt: true,
      createdAt: true,
      authorId: true,
      author: { select: { displayName: true } },
    },
  });

  return questions.map(({ authorId, author, ...question }) => {
    const isOwn = viewer?.userId === authorId;
    return {
      ...question,
      authorName: author.displayName,
      canEdit: isOwn && question.answer === null,
      canDelete: isOwn || isAdmin(viewer),
      canAnswer: isAdmin(viewer),
    };
  });
}

export async function createQuestion(session: Session, input: QuestionInput) {
  const question = await prisma.question.create({
    data: { authorId: session.userId, body: input.body },
    select: { id: true },
  });
  publishQuestionEvent({ type: "created", id: question.id });
  return question;
}

export async function updateQuestion(
  session: Session,
  id: string,
  input: QuestionInput,
): Promise<MutationResult> {
  const question = await prisma.question.findUnique({ where: { id } });
  if (!question) return { ok: false, reason: "not_found" };
  if (question.authorId !== session.userId) return { ok: false, reason: "forbidden" };
  if (question.answer !== null) return { ok: false, reason: "already_answered" };

  await prisma.question.update({ where: { id }, data: { body: input.body } });
  publishQuestionEvent({ type: "updated", id });
  return { ok: true };
}

export async function deleteQuestion(session: Session, id: string): Promise<MutationResult> {
  const question = await prisma.question.findUnique({ where: { id } });
  if (!question) return { ok: false, reason: "not_found" };
  if (question.authorId !== session.userId && !isAdmin(session)) {
    return { ok: false, reason: "forbidden" };
  }

  await prisma.question.delete({ where: { id } });
  publishQuestionEvent({ type: "deleted", id });
  return { ok: true };
}

export async function answerQuestion(
  session: Session,
  id: string,
  input: AnswerInput,
): Promise<MutationResult> {
  if (!isAdmin(session)) return { ok: false, reason: "forbidden" };

  const question = await prisma.question.findUnique({ where: { id } });
  if (!question) return { ok: false, reason: "not_found" };

  await prisma.question.update({
    where: { id },
    data: { answer: input.answer, answeredAt: new Date() },
  });
  publishQuestionEvent({ type: "answered", id });
  return { ok: true };
}
