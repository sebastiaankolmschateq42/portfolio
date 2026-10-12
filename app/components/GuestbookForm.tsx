"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { guestbookSchema, type GuestbookInput } from "@/lib/schemas/guestbook";
import Field from "./Field";

export default function GuestbookForm() {
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GuestbookInput>({ resolver: zodResolver(guestbookSchema) });

  const onSubmit = async (data: GuestbookInput) => {
    setStatus("idle");
    try {
      const res = await fetch("/api/guestbook", {
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
      <Field label="Name" htmlFor="name" error={errors.name?.message}>
        <input
          id="name"
          type="text"
          placeholder="Name"
          {...register("name")}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          autoComplete="name"
        />
      </Field>

      <Field label="Message" htmlFor="message" error={errors.message?.message}>
        <textarea
          id="message"
          placeholder="Message"
          rows={4}
          {...register("message")}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
      </Field>

      <button type="submit" disabled={isSubmitting} className="sm:self-end">
        {isSubmitting ? "Sending..." : "Sign the guestbook"}
      </button>

      {status === "sent" && (
        <p role="status">
          Thank you for your message! It will be reviewed by the administrator before it appears in
          the guestbook.
        </p>
      )}
      {status === "error" && <p role="alert">Something went wrong. Please try again.</p>}
    </form>
  );
}
