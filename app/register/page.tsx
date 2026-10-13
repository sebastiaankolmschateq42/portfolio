import type { Metadata } from "next";
import Link from "next/link";
import RegisterForm from "@/app/components/RegisterForm";

export const metadata: Metadata = {
  title: "Register",
  description: "Create an account to ask me a question",
};

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1>Register</h1>
      <p>Create an account to ask me a question.</p>
      <RegisterForm />
      <p>
        Already have an account?{" "}
        <Link className="underline" href="/login">
          Log in
        </Link>
      </p>
    </div>
  );
}
