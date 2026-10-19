import "server-only";
import { EventEmitter } from "node:events";

export type QuestionEvent = {
  type: "created" | "updated" | "answered" | "deleted";
  id: string;
};

const globalForEvents = globalThis as unknown as { questionEvents?: EventEmitter };

const emitter = globalForEvents.questionEvents ?? new EventEmitter();
emitter.setMaxListeners(0);
globalForEvents.questionEvents = emitter;

export function publishQuestionEvent(event: QuestionEvent): void {
  emitter.emit("question", event);
}

export function subscribeToQuestionEvents(listener: (event: QuestionEvent) => void): () => void {
  emitter.on("question", listener);
  return () => emitter.off("question", listener);
}
