"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { QuestionView } from "@/lib/questions";
import { answerSchema, questionSchema } from "@/lib/schemas/questions";

type Mode = "view" | "edit" | "answer";

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function QuestionItem({ question }: { question: QuestionView }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("view");
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function send(url: string, method: string, body?: object) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(url, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      if (res.ok) {
        setMode("view");
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => ({}));
      const fieldErrors = Object.values(data.errors ?? {}).flat() as string[];
      setError(data.error ?? fieldErrors[0] ?? "Something went wrong.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function startEditing(next: Mode, initial: string) {
    setText(initial);
    setError(null);
    setMode(next);
  }

  return (
    <li className="flex flex-col gap-2">
      <div>
        <p className="whitespace-pre-line break-words">{question.body}</p>
        <p className="text-sm break-words">
          {question.authorName} ·{" "}
          <time dateTime={new Date(question.createdAt).toISOString()}>
            {formatDate(question.createdAt)}
          </time>
        </p>
      </div>

      {question.answer && (
        <div className="border-l border-black pl-4">
          <p className="whitespace-pre-line break-words">{question.answer}</p>
          {question.answeredAt && (
            <p className="text-sm">
              Answered on{" "}
              <time dateTime={new Date(question.answeredAt).toISOString()}>
                {formatDate(question.answeredAt)}
              </time>
            </p>
          )}
        </div>
      )}

      {mode !== "view" && (
        <form
          method="post"
          className="flex flex-col gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            const check =
              mode === "edit"
                ? questionSchema.safeParse({ body: text })
                : answerSchema.safeParse({ answer: text });
            if (!check.success) {
              setError(check.error.issues[0].message);
              return;
            }
            if (mode === "edit") {
              send(`/api/questions/${question.id}`, "PATCH", check.data);
            } else {
              send(`/api/questions/${question.id}/answer`, "POST", check.data);
            }
          }}
        >
          <label htmlFor={`text-${question.id}`} className="font-semibold">
            {mode === "edit" ? "Edit your question" : "Your answer"}
          </label>
          <textarea
            id={`text-${question.id}`}
            rows={3}
            aria-invalid={!!error}
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
          <div className="flex flex-row gap-2 sm:self-end">
            <button type="button" className="underline" onClick={() => setMode("view")}>
              Cancel
            </button>
            <button type="submit" disabled={busy}>
              {busy ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}

      {mode === "view" && (question.canEdit || question.canDelete || question.canAnswer) && (
        <div className="flex flex-row gap-2 text-sm">
          {question.canEdit && (
            <button
              type="button"
              className="underline"
              onClick={() => startEditing("edit", question.body)}
            >
              Edit
            </button>
          )}
          {question.canAnswer && (
            <button
              type="button"
              className="underline"
              onClick={() => startEditing("answer", question.answer ?? "")}
            >
              {question.answer ? "Edit answer" : "Answer"}
            </button>
          )}
          {question.canDelete && (
            <button
              type="button"
              className="underline"
              disabled={busy}
              onClick={() => send(`/api/questions/${question.id}`, "DELETE")}
            >
              Delete
            </button>
          )}
        </div>
      )}

      {error && (
        <p role="alert" className="text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
    </li>
  );
}
