"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { questionSchema, type QuestionInput } from "@/lib/schemas/questions";
import Field from "./Field";

export default function QuestionForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuestionInput>({ resolver: zodResolver(questionSchema) });

  const onSubmit = async (data: QuestionInput) => {
    setError(null);
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.status === 201) {
        reset();
        router.refresh();
        return;
      }
      setError(
        res.status === 401
          ? "Your session has expired. Please log in again."
          : "Something went wrong.",
      );
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2" noValidate>
      <Field label="Your question" htmlFor="body" error={errors.body?.message}>
        <textarea
          id="body"
          rows={3}
          placeholder="Ask me anything about my work..."
          {...register("body")}
          aria-invalid={!!errors.body}
          aria-describedby={errors.body ? "body-error" : undefined}
        />
      </Field>
      <button type="submit" disabled={isSubmitting} className="sm:self-end">
        {isSubmitting ? "Sending..." : "Ask"}
      </button>
      {error && (
        <p role="alert" className="text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
    </form>
  );
}
