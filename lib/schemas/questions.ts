import { z } from "zod";

export const questionSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, { message: "Question is required" })
    .max(500, { message: "Question must be less than 500 characters" }),
});

export const answerSchema = z.object({
  answer: z
    .string()
    .trim()
    .min(1, { message: "Answer is required" })
    .max(2000, { message: "Answer must be less than 2000 characters" }),
});

export const questionIdSchema = z.uuid();

export type QuestionInput = z.infer<typeof questionSchema>;
export type AnswerInput = z.infer<typeof answerSchema>;
