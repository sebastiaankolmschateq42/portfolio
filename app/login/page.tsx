import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/app/components/LoginForm";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to ask me a question",
};

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1>Log in</h1>
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
