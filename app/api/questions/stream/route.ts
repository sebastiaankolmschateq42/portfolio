import { subscribeToQuestionEvents, type QuestionEvent } from "@/lib/events";

const HEARTBEAT_MS = 25_000;

/**
 * Server-Sent Events stream that tells open pages a question changed.
 * It only carries the event type and id, never question content, so it needs no
 * authentication: each page fetches the new state itself with its own permissions.
 */
export async function GET(request: Request) {
  const encoder = new TextEncoder();
  let cleanup = () => {};

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (chunk: string) => {
        try {
          controller.enqueue(encoder.encode(chunk));
        } catch {
          cleanup();
        }
      };

      // Tells the browser how long to wait before reconnecting after a dropped connection.
      send("retry: 3000\n\n");

      const unsubscribe = subscribeToQuestionEvents((event: QuestionEvent) => {
        send(`event: question\ndata: ${JSON.stringify(event)}\n\n`);
      });

      // A comment line now and then keeps proxies from closing an idle connection.
      const heartbeat = setInterval(() => send(": keep-alive\n\n"), HEARTBEAT_MS);

      cleanup = () => {
        clearInterval(heartbeat);
        unsubscribe();
      };

      request.signal.addEventListener("abort", () => {
        cleanup();
        try {
          controller.close();
        } catch {
          // Already closed.
        }
      });
    },
    cancel() {
      cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
