"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type Contact } from "@/lib/schemas/contact";
import { useState } from "react";
import Field from "./Field";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Contact>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: Contact) => {
    setStatus("idle");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.status === 201) {
        setStatus("sent");
        reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2" noValidate>
      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <input
          id="email"
          type="email"
          placeholder="Email"
          {...register("email")}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          autoComplete="email"
        />
      </Field>

      <Field label="Subject" htmlFor="subject" error={errors.subject?.message}>
        <input
          id="subject"
          type="text"
          placeholder="Subject"
          {...register("subject")}
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? "subject-error" : undefined}
          autoComplete="off"
        />
      </Field>

      <Field label="Message" htmlFor="message" error={errors.message?.message}>
        <textarea
          id="message"
          placeholder="Message"
          {...register("message")}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          autoComplete="off"
        />
      </Field>

      <button type="submit" disabled={isSubmitting} className="sm:self-end">
        {isSubmitting ? "Sending..." : "Send"}
      </button>

      {status === "sent" && <p role="status">Thanks! Your message has been sent.</p>}
      {status === "error" && <p role="alert">Something went wrong. Please try again.</p>}
    </form>
  );
}
