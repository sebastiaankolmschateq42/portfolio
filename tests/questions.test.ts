import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { POST as create } from "@/app/api/questions/route";
import { PATCH as update, DELETE as remove } from "@/app/api/questions/[id]/route";
import { POST as answer } from "@/app/api/questions/[id]/answer/route";
import { prisma } from "@/lib/prisma";
import { signSession, type Session } from "@/lib/session";
import { listQuestions } from "@/lib/questions";

type Actor = Session & { token: string };

async function createActor(email: string, role: "USER" | "ADMIN" = "USER"): Promise<Actor> {
  const user = await prisma.user.create({
    data: {
      email,
      displayName: email.split("@")[0],
      passwordHash: "not-used-in-these-tests",
      role,
      emailVerifiedAt: new Date(),
    },
  });
  const session = { userId: user.id, role: user.role };
  return { ...session, token: await signSession(session) };
}

function request(method: string, actor: Actor | null, body?: unknown) {
  return new NextRequest("http://localhost/api/questions", {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(actor ? { Cookie: `session=${actor.token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

const ctx = (id: string) => ({ params: Promise.resolve({ id }) });

async function askAs(actor: Actor, body = "What are you working on?") {
  const res = await create(request("POST", actor, { body }));
  return (await res.json()).id as string;
}

describe("ask me anything", () => {
  let alice: Actor;
  let bob: Actor;
  let admin: Actor;

  beforeEach(async () => {
    await prisma.user.deleteMany();
    alice = await createActor("alice@example.com");
    bob = await createActor("bob@example.com");
    admin = await createActor("admin@example.com", "ADMIN");
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("asking", () => {
    it("requires a session", async () => {
      const res = await create(request("POST", null, { body: "Hello?" }));
      expect(res.status).toBe(401);
    });

    it("stores the question under the logged-in user, ignoring a spoofed author", async () => {
      const res = await create(
        request("POST", alice, { body: "How did you start?", authorId: bob.userId }),
      );
      expect(res.status).toBe(201);

      const stored = await prisma.question.findFirstOrThrow();
      expect(stored.authorId).toBe(alice.userId);
    });

    it("rejects an empty question", async () => {
      const res = await create(request("POST", alice, { body: "   " }));
      expect(res.status).toBe(400);
    });
  });

  describe("editing", () => {
    it("lets the author edit their own question", async () => {
      const id = await askAs(alice);
      const res = await update(request("PATCH", alice, { body: "Edited" }), ctx(id));
      expect(res.status).toBe(200);
      expect((await prisma.question.findUniqueOrThrow({ where: { id } })).body).toBe("Edited");
    });

    it("forbids editing someone else's question (IDOR)", async () => {
      const id = await askAs(alice);
      const res = await update(request("PATCH", bob, { body: "Hijacked" }), ctx(id));
      expect(res.status).toBe(403);
      expect((await prisma.question.findUniqueOrThrow({ where: { id } })).body).not.toBe(
        "Hijacked",
      );
    });

    it("does not allow editing after the question has been answered", async () => {
      const id = await askAs(alice);
      await answer(request("POST", admin, { answer: "Thanks!" }), ctx(id));
      const res = await update(request("PATCH", alice, { body: "Changed my mind" }), ctx(id));
      expect(res.status).toBe(409);
    });

    it("returns 404 for an id that is not a uuid", async () => {
      const res = await update(request("PATCH", alice, { body: "x" }), ctx("not-a-uuid"));
      expect(res.status).toBe(404);
    });
  });

  describe("deleting", () => {
    it("forbids deleting someone else's question", async () => {
      const id = await askAs(alice);
      const res = await remove(request("DELETE", bob), ctx(id));
      expect(res.status).toBe(403);
      expect(await prisma.question.count()).toBe(1);
    });

    it("lets the author delete their own question", async () => {
      const id = await askAs(alice);
      const res = await remove(request("DELETE", alice), ctx(id));
      expect(res.status).toBe(200);
      expect(await prisma.question.count()).toBe(0);
    });

    it("lets the admin delete any question", async () => {
      const id = await askAs(alice);
      const res = await remove(request("DELETE", admin), ctx(id));
      expect(res.status).toBe(200);
    });
  });

  describe("answering", () => {
    it("forbids a regular user from answering (privilege escalation)", async () => {
      const id = await askAs(alice);
      const res = await answer(request("POST", alice, { answer: "I answer myself" }), ctx(id));
      expect(res.status).toBe(403);
      expect((await prisma.question.findUniqueOrThrow({ where: { id } })).answer).toBeNull();
    });

    it("lets the admin answer", async () => {
      const id = await askAs(alice);
      const res = await answer(request("POST", admin, { answer: "Good question!" }), ctx(id));
      expect(res.status).toBe(200);

      const stored = await prisma.question.findUniqueOrThrow({ where: { id } });
      expect(stored.answer).toBe("Good question!");
      expect(stored.answeredAt).not.toBeNull();
    });
  });

  describe("listing", () => {
    it("never exposes email addresses and sets permissions per viewer", async () => {
      await askAs(alice);

      const forAlice = await listQuestions(alice);
      const forBob = await listQuestions(bob);
      const forAdmin = await listQuestions(admin);
      const forVisitor = await listQuestions(null);

      expect(JSON.stringify(forVisitor)).not.toContain("@example.com");
      expect(forVisitor[0].authorName).toBe("alice");
      expect(forAlice[0]).toMatchObject({ canEdit: true, canDelete: true, canAnswer: false });
      expect(forBob[0]).toMatchObject({ canEdit: false, canDelete: false, canAnswer: false });
      expect(forAdmin[0]).toMatchObject({ canEdit: false, canDelete: true, canAnswer: true });
      expect(forVisitor[0]).toMatchObject({ canEdit: false, canDelete: false, canAnswer: false });
    });
  });
});
