"use client";

import { useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "privacy-consent";

type Choice = "accepted" | "declined";

function readChoice(): Choice | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "accepted" || value === "declined" ? value : null;
  } catch {
    return null;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

export default function ConsentBanner() {
  const storedChoice = useSyncExternalStore(subscribe, readChoice, () => "unknown" as const);
  const [chosenNow, setChosenNow] = useState(false);

  if (storedChoice !== null || chosenNow) return null;

  function choose(choice: Choice) {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {}
    setChosenNow(true);
  }

  return (
    <section
      aria-label="Privacy"
      className="fixed inset-x-0 bottom-0 border-t border-foreground bg-background px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-3">
        <p className="text-base">
          This site only uses what it needs to work: a session cookie when you log in. Messages sent
          through the contact form are emailed to me and not stored. Nothing is used for tracking.
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button type="button" onClick={() => choose("accepted")}>
            Accept
          </button>
          <button type="button" onClick={() => choose("declined")}>
            Decline
          </button>
        </div>
      </div>
    </section>
  );
}
