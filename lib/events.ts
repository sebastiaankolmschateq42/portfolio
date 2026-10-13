import "server-only";
import { EventEmitter } from "node:events";

export type QuestionEvent = {
  type: "created" | "updated" | "answered" | "deleted";
  id: string;
};

// One emitter per server process. Kept on globalThis so the SSE route and the
// data access layer share it, also after module reloads in development.
// Works because the app runs as a single long-lived Node process.
const globalForEvents = globalThis as unknown as { questionEvents?: EventEmitter };

const emitter = globalForEvents.questionEvents ?? new EventEmitter();
// Every open browser tab adds a listener; the default limit of 10 would log warnings.
emitter.setMaxListeners(0);
globalForEvents.questionEvents = emitter;

export function publishQuestionEvent(event: QuestionEvent): void {
  emitter.emit("question", event);
}

/** Returns a function that removes the listener again. */
export function subscribeToQuestionEvents(listener: (event: QuestionEvent) => void): () => void {
  emitter.on("question", listener);
  return () => emitter.off("question", listener);
}
