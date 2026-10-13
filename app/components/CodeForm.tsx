"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { verifySchema } from "@/lib/schemas/auth";
import Field from "./Field";

const codeSchema = verifySchema.pick({ code: true });
type CodeInput = z.infer<typeof codeSchema>;

type CodeFormProps = {
  email: string;
  endpoint: string;
  onStartOver: () => void;
};

export default function CodeForm({ email, endpoint, onStartOver }: CodeFormProps) {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CodeInput>({ resolver: zodResolver(codeSchema) });

  const onSubmit = async ({ code }: CodeInput) => {
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      if (res.ok) {
        // Full reload so the navigation picks up the new session.
        window.location.assign("/ask");
        return;
      }
      setError("This code is invalid or has expired.");
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2" noValidate>
      <p>We sent a 6-digit code to {email}. It is valid for 5 minutes.</p>

      <Field label="Code" htmlFor="code" error={errors.code?.message}>
        <input
          id="code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          {...register("code")}
          aria-invalid={!!errors.code}
          aria-describedby={errors.code ? "code-error" : undefined}
        />
      </Field>

      <button type="submit" disabled={isSubmitting} className="sm:self-end">
        {isSubmitting ? "Checking..." : "Continue"}
      </button>

      {error && <p role="alert">{error}</p>}

      <button type="button" className="underline self-start" onClick={onStartOver}>
        Start over
      </button>
    </form>
  );
}
