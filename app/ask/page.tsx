import type { Metadata } from "next";
import Link from "next/link";
import QuestionForm from "@/app/components/QuestionForm";
import QuestionItem from "@/app/components/QuestionItem";
import LiveQuestions from "@/app/components/LiveQuestions";
import { listQuestions } from "@/lib/questions";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Ask me anything",
  description: "Ask Sebastiaan Henri Kolmschate a question about his work",
};

export const dynamic = "force-dynamic";

export default async function AskPage() {
  const session = await getSession();
  const questions = await listQuestions(session);

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-2">
        <h1>Ask me anything</h1>
        <p>Curious about a project, how I work or what I am up to? Ask away.</p>
        {session ? (
          <QuestionForm />
        ) : (
          <p>
            <Link className="underline" href="/login">
              Log in
            </Link>{" "}
            or{" "}
            <Link className="underline" href="/register">
              create an account
            </Link>{" "}
            to ask a question.
          </p>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-semibold border-b">Questions</h2>
        <LiveQuestions />
        {questions.length === 0 ? (
          <p>No questions yet. Be the first to ask one.</p>
        ) : (
          <ul className="flex flex-col gap-6">
            {questions.map((question) => (
              <QuestionItem key={question.id} question={question} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
