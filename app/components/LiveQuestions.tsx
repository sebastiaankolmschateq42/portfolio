"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LiveQuestions() {
  const router = useRouter();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const source = new EventSource("/api/questions/stream");

    source.onopen = () => setConnected(true);
    source.onerror = () => setConnected(false);
    source.addEventListener("question", () => router.refresh());

    return () => source.close();
  }, [router]);

  return (
    <p className="sr-only" role="status">
      {connected ? "Live updates on" : "Connecting to live updates"}
    </p>
  );
}
