import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/app/components/LoginForm";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to ask me a question",
};

export default function LoginPage() {
  return (
    <div className="flex flex-col">
      <h1 className="mb-2">Log in</h1>
      <p className="mb-8">Log in to ask me a question.</p>
      <LoginForm />
      <p>
        No account yet?{" "}
        <Link className="underline" href="/register">
          Register
        </Link>
      </p>
    </div>
  );
}
