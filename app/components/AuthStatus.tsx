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
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-2 items-baseline">
      <span className="inline-block max-w-[16ch] truncate align-bottom" title={user.displayName}>
        {user.displayName}
      </span>
      {user.role === "ADMIN" && <span>(admin)</span>}
      <button
        type="button"
        className="cursor-pointer border-0 p-0 whitespace-nowrap underline"
        onClick={logout}
      >
        Log out
      </button>
    </div>
  );
}
