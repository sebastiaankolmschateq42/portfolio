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
    // EventSource reconnects by itself; this only updates the indicator.
    source.onerror = () => setConnected(false);
    source.addEventListener("question", () => router.refresh());

    return () => source.close();
  }, [router]);

  return (
    <p className="text-sm" role="status">
      {connected ? "● Live — new questions and answers appear automatically" : "○ Connecting..."}
    </p>
  );
}
