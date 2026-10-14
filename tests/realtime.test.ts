import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { GET as stream } from "@/app/api/questions/stream/route";
import { prisma } from "@/lib/prisma";
import { publishQuestionEvent, subscribeToQuestionEvents, type QuestionEvent } from "@/lib/events";
import { answerQuestion, createQuestion, deleteQuestion, updateQuestion } from "@/lib/questions";

async function createSession(role: "USER" | "ADMIN") {
  const user = await prisma.user.create({
    data: {
      email: `${role.toLowerCase()}@example.com`,
      displayName: role,
      passwordHash: "not-used",
      role,
      emailVerifiedAt: new Date(),
    },
  });
  return { userId: user.id, role };
}

async function readUntil(reader: ReadableStreamDefaultReader<Uint8Array>, needle: string) {
  const decoder = new TextDecoder();
  let text = "";
  while (!text.includes(needle)) {
    const { value, done } = await reader.read();
    if (done) break;
    text += decoder.decode(value);
  }
  return text;
}

describe("realtime question events", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("publishes an event for every change to a question", async () => {
    const events: QuestionEvent[] = [];
    const unsubscribe = subscribeToQuestionEvents((event) => events.push(event));

    const user = await createSession("USER");
    const admin = await createSession("ADMIN");
    const { id } = await createQuestion(user, { body: "How do you work?" });
    await updateQuestion(user, id, { body: "How do you usually work?" });
    await answerQuestion(admin, id, { answer: "Step by step." });
    await deleteQuestion(admin, id);
    unsubscribe();

    expect(events).toEqual([
      { type: "created", id },
      { type: "updated", id },
      { type: "answered", id },
      { type: "deleted", id },
    ]);
  });

  it("does not publish when a change is refused", async () => {
    const events: QuestionEvent[] = [];
    const unsubscribe = subscribeToQuestionEvents((event) => events.push(event));

    const owner = await createSession("USER");
    const { id } = await createQuestion(owner, { body: "Mine" });
    events.length = 0;
    await answerQuestion(owner, id, { answer: "Not allowed" });
    unsubscribe();

    expect(events).toEqual([]);
  });

  it("streams events to a connected client as server-sent events", async () => {
    const controller = new AbortController();
    const res = await stream(
      new Request("http://localhost/api/questions/stream", { signal: controller.signal }),
    );
    expect(res.headers.get("content-type")).toBe("text/event-stream");

    const reader = res.body!.getReader();
    publishQuestionEvent({ type: "created", id: "abc" });
    const text = await readUntil(reader, "abc");

    expect(text).toContain("event: question");
    expect(text).toContain('data: {"type":"created","id":"abc"}');
    controller.abort();
  });

  it("removes its listener when the client disconnects", async () => {
    const listenerCount = () =>
      (
        globalThis as { questionEvents?: { listenerCount(e: string): number } }
      ).questionEvents!.listenerCount("question");

    const before = listenerCount();
    const controller = new AbortController();
    await stream(
      new Request("http://localhost/api/questions/stream", { signal: controller.signal }),
    );
    expect(listenerCount()).toBe(before + 1);

    controller.abort();
    expect(listenerCount()).toBe(before);
  });
});
