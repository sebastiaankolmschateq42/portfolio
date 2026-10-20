"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/schemas/auth";
import Field from "./Field";
import CodeForm from "./CodeForm";

export default function LoginForm() {
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginInput) => {
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.status === 202) {
        setEmail(data.email);
        return;
      }
      setError(
        res.status === 401
          ? "Invalid email or password."
          : "Something went wrong. Please try again.",
      );
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  if (email) {
    return (
      <CodeForm
        email={email}
        endpoint="/api/auth/login/verify"
        onStartOver={() => setEmail(null)}
      />
    );
  }

  return (
    <form
      method="post"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-2"
      noValidate
    >
      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
      </Field>

      <Field label="Password" htmlFor="password" error={errors.password?.message}>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
        />
      </Field>

      <button type="submit" disabled={isSubmitting} className="sm:self-end">
        {isSubmitting ? "Checking..." : "Log in"}
      </button>

      {error && (
        <p role="alert" className="text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
    </form>
  );
}
