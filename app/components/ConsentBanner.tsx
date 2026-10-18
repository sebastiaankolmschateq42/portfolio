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
      aria-label="Privacy banner"
      className="fixed inset-x-0 bottom-0 border-t bg-background py-4"
    >
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-2 px-4">
        <p>
          This website uses cookies to improve your experience. By continuing to use this website,
          you consent to our use of cookies.
        </p>
        <button type="button" onClick={() => choose("accepted")}>
          Accept
        </button>
        <button type="button" onClick={() => choose("declined")}>
          Decline
        </button>
      </div>
    </section>
  );
}
