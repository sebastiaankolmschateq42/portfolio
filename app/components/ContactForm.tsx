"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, type ContactForm as ContactFormValues } from "@/lib/schemas/contact";
import { useEffect, useState } from "react";
import Field from "./Field";

type Captcha = { question: string; token: string };
type Status = "idle" | "sent" | "error";

const FLASH_MS = 6000;

const fields = [
  { name: "firstName", label: "First name", type: "text", autoComplete: "given-name" },
  { name: "lastName", label: "Last name", type: "text", autoComplete: "family-name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone number", type: "tel", autoComplete: "tel" },
  { name: "subject", label: "Subject", type: "text", autoComplete: "off" },
] as const;

export default function ContactForm({ initialCaptcha }: { initialCaptcha: Captcha }) {
  const [status, setStatus] = useState<Status>("idle");
  const [captcha, setCaptcha] = useState<Captcha | null>(initialCaptcha);

  const {
    register,
    handleSubmit,
    reset,
    resetField,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: "onChange",
  });

  async function loadCaptcha() {
    try {
      const res = await fetch("/api/contact/captcha", { cache: "no-store" });
      setCaptcha(await res.json());
    } catch {
      setCaptcha(null);
    }
  }

  useEffect(() => {
    if (status === "idle") return;
    const timer = setTimeout(() => setStatus("idle"), FLASH_MS);
    return () => clearTimeout(timer);
  }, [status]);

  const onSubmit = async (data: ContactFormValues) => {
    if (!captcha) return;
    setStatus("idle");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, captchaToken: captcha.token }),
      });
      resetField("captchaAnswer");
      if (res.status === 201) {
        setStatus("sent");
        reset();
      } else {
        const body = await res.json().catch(() => ({}));
        showServerErrors(body.errors);
        setStatus("error");
      }
    } catch {
      resetField("captchaAnswer");
      setStatus("error");
    }
    await loadCaptcha();
  };

  function showServerErrors(serverErrors: Record<string, string[]> | undefined) {
    if (!serverErrors) return;
    for (const [name, messages] of Object.entries(serverErrors)) {
      if (name in contactFormSchema.shape) {
        setError(name as keyof ContactFormValues, { message: messages[0] });
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2" noValidate>
      {fields.map((field) => (
        <Field
          key={field.name}
          label={field.label}
          htmlFor={field.name}
          error={errors[field.name]?.message}
        >
          <input
            id={field.name}
            type={field.type}
            {...register(field.name)}
            aria-invalid={!!errors[field.name]}
            aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
            autoComplete={field.autoComplete}
          />
        </Field>
      ))}

      <Field label="Message" htmlFor="message" error={errors.message?.message}>
        <textarea
          id="message"
          rows={6}
          {...register("message")}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          autoComplete="off"
        />
      </Field>

      <Field
        label={captcha ? `What is ${captcha.question}?` : "Loading question…"}
        htmlFor="captchaAnswer"
        error={errors.captchaAnswer?.message}
      >
        <input
          id="captchaAnswer"
          type="text"
          inputMode="numeric"
          {...register("captchaAnswer")}
          aria-invalid={!!errors.captchaAnswer}
          aria-describedby={errors.captchaAnswer ? "captchaAnswer-error" : undefined}
          autoComplete="off"
          disabled={!captcha}
        />
      </Field>

      <button
        type="submit"
        disabled={!isValid || !captcha || isSubmitting}
        className="flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50 sm:self-end"
      >
        {isSubmitting && (
          <span
            aria-hidden="true"
            className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
        )}
        {isSubmitting ? "Sending..." : "Send"}
      </button>

      {status === "sent" && <p role="status">Thanks! Your message has been sent.</p>}
      {status === "error" && <p role="alert">Your message was not sent. Please try again.</p>}
    </form>
  );
}
