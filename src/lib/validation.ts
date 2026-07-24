import { z } from "zod";
import type {
  AnswersMap,
  AnswerRecord,
  QuestionDoc,
  QuestionType,
} from "@/types/question";
import {
  getVisibleQuestions,
  pruneHiddenAnswers,
  resolveLabel,
} from "@/lib/conditions";

const MAX_TEXT = 2000;
const MAX_TEXTAREA = 5000;
const MAX_EMAIL = 254;

export function sanitizeString(input: unknown, max = MAX_TEXT): string {
  if (typeof input !== "string") return "";
  return input.replace(/\0/g, "").trim().slice(0, max);
}

export function sanitizeValue(
  type: QuestionType,
  value: unknown
): string | string[] {
  if (type === "multi_choice") {
    if (!Array.isArray(value)) {
      if (typeof value === "string" && value) return [sanitizeString(value, 200)];
      return [];
    }
    return value
      .map((v) => sanitizeString(v, 200))
      .filter(Boolean)
      .slice(0, 50);
  }
  if (type === "textarea") {
    return sanitizeString(value, MAX_TEXTAREA);
  }
  if (type === "email") {
    return sanitizeString(value, MAX_EMAIL).toLowerCase();
  }
  if (type === "number") {
    const n = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(n)) return "";
    return String(n);
  }
  return sanitizeString(value, MAX_TEXT);
}

const optionSchema = z.object({
  id: z.string().optional(),
  value: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9][a-z0-9_]*$/i, "option value must be slug-like"),
  label: z.string().min(1).max(300),
});

const conditionSchema = z.object({
  questionKey: z.string().min(1).max(100),
  operator: z.enum([
    "equals",
    "not_equals",
    "includes",
    "not_includes",
    "answered",
    "not_answered",
  ]),
  value: z.union([z.string(), z.array(z.string())]).optional(),
});

export const showIfSchema = z
  .object({
    logic: z.enum(["and", "or"]),
    conditions: z.array(conditionSchema).max(20),
  })
  .optional()
  .nullable();

export const questionInputSchema = z.object({
  key: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z][a-z0-9_]*$/, "key must be snake_case"),
  order: z.number().int().min(0).max(10000).optional(),
  type: z.enum([
    "text",
    "email",
    "textarea",
    "select",
    "single_choice",
    "multi_choice",
    "number",
  ]),
  label: z.string().min(1).max(500),
  hint: z.string().max(500).optional().nullable(),
  placeholder: z.string().max(300).optional().nullable(),
  required: z.boolean(),
  options: z.array(optionSchema).max(50).optional(),
  active: z.boolean(),
  showIf: showIfSchema,
  labelWhen: z
    .array(
      z.object({
        when: conditionSchema,
        label: z.string().min(1).max(500),
      })
    )
    .max(10)
    .optional()
    .nullable(),
});

export const submissionBodySchema = z.object({
  answers: z.record(
    z.string(),
    z.union([z.string(), z.array(z.string()), z.number(), z.null()])
  ),
  pageUrl: z.string().max(2000).optional(),
});

function isValidForType(
  question: QuestionDoc,
  value: string | string[]
): boolean {
  const optionValues = new Set((question.options ?? []).map((o) => o.value));

  if (question.type === "multi_choice") {
    if (!Array.isArray(value) || value.length === 0) return !question.required;
    return value.every((v) => optionValues.has(v));
  }

  const str = Array.isArray(value) ? value[0] ?? "" : value;

  if (question.required && !str) return false;
  if (!str) return true;

  if (
    question.type === "select" ||
    question.type === "single_choice"
  ) {
    return optionValues.has(str);
  }

  if (question.type === "email") {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  }

  if (question.type === "number") {
    return Number.isFinite(Number(str));
  }

  return true;
}

export interface ValidationResult {
  ok: boolean;
  errors: Record<string, string>;
  visible: QuestionDoc[];
  prunedAnswers: AnswersMap;
  answerRecords: AnswerRecord[];
  email?: string;
}

export function validateSubmissionAnswers(
  questions: QuestionDoc[],
  rawAnswers: AnswersMap
): ValidationResult {
  const active = questions.filter((q) => q.active);
  const pruned = pruneHiddenAnswers(active, rawAnswers, { activeOnly: true });
  const visible = getVisibleQuestions(active, pruned, { activeOnly: true });
  const errors: Record<string, string> = {};
  const answerRecords: AnswerRecord[] = [];
  let email: string | undefined;

  // Reject answers for questions that shouldn't be visible
  for (const key of Object.keys(rawAnswers)) {
    if (rawAnswers[key] == null || rawAnswers[key] === "") continue;
    if (Array.isArray(rawAnswers[key]) && (rawAnswers[key] as string[]).length === 0)
      continue;
    const q = active.find((x) => x.key === key);
    if (!q) {
      errors[key] = "Unknown question";
      continue;
    }
    if (!visible.find((x) => x.key === key)) {
      errors[key] = "Question not visible for this answer path";
    }
  }

  for (const q of visible) {
    const sanitized = sanitizeValue(q.type, pruned[q.key]);
    const empty =
      sanitized === "" ||
      (Array.isArray(sanitized) && sanitized.length === 0);

    if (q.required && empty) {
      errors[q.key] = "This field is required";
      continue;
    }

    if (!empty && !isValidForType(q, sanitized)) {
      errors[q.key] = "Invalid value";
      continue;
    }

    if (!empty) {
      const label = resolveLabel(q, pruned);
      answerRecords.push({
        questionId: String(q._id ?? q.key),
        key: q.key,
        labelSnapshot: label,
        type: q.type,
        value: sanitized,
      });
      if (q.key === "email" && typeof sanitized === "string") {
        email = sanitized;
      }
      if (q.type === "email" && !email && typeof sanitized === "string") {
        email = sanitized;
      }
    }
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    visible,
    prunedAnswers: pruned,
    answerRecords,
    email,
  };
}

export function slugifyKey(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_")
    .slice(0, 60) || "question";
}

export function slugifyOption(label: string): string {
  return (
    label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .replace(/_+/g, "_")
      .slice(0, 80) || "option"
  );
}
