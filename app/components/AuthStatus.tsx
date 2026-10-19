"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CurrentUser = { displayName: string; role: "USER" | "ADMIN" };

export default function AuthStatus() {
  const [user, setUser] = useState<CurrentUser | null | undefined>(undefined);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.assign("/");
  }

  if (user === undefined) {
    return null;
  }

  if (!user) {
    return (
      <div className="flex flex-row gap-2">
        <Link className="underline" href="/login">
          Log in
        </Link>
        <Link className="underline" href="/register">
          Register
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-2 items-baseline">
      <span>
        {user.displayName}
        {user.role === "ADMIN" && " (admin)"}
      </span>
      <button type="button" className="underline" onClick={logout}>
        Log out
      </button>
    </div>
  );
}
