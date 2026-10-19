"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Listens to the question stream and re-renders the page when something changes.
 * The page itself is rendered on the server, so every viewer keeps their own permissions.
 */
export default function LiveQuestions() {
  const router = useRouter();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const source = new EventSource("/api/questions/stream");

    source.onopen = () => setConnected(true);
    // EventSource reconnects by itself; this only updates the status text.
    source.onerror = () => setConnected(false);
    source.addEventListener("question", () => router.refresh());

    return () => source.close();
  }, [router]);

  return (
    // Not shown on screen; screen readers still hear when live updates are on.
    <p className="sr-only" role="status">
      {connected ? "Live updates on" : "Connecting to live updates"}
    </p>
  );
}
