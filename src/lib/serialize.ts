import type { QuestionDoc } from "@/types/question";

export function serializeQuestion(doc: {
  _id: { toString(): string };
  key: string;
  order: number;
  type: QuestionDoc["type"];
  label: string;
  hint?: string | null;
  placeholder?: string | null;
  required: boolean;
  options?: QuestionDoc["options"];
  active: boolean;
  showIf?: QuestionDoc["showIf"] | null;
  labelWhen?: QuestionDoc["labelWhen"] | null;
  createdAt?: Date;
  updatedAt?: Date;
}): QuestionDoc {
  return {
    _id: doc._id.toString(),
    key: doc.key,
    order: doc.order,
    type: doc.type,
    label: doc.label,
    hint: doc.hint ?? undefined,
    placeholder: doc.placeholder ?? undefined,
    required: doc.required,
    options: doc.options?.map((o) => ({
      id: o.id,
      value: o.value,
      label: o.label,
    })),
    active: doc.active,
    showIf: doc.showIf
      ? {
          logic: doc.showIf.logic,
          conditions: doc.showIf.conditions.map((c) => ({
            questionKey: c.questionKey,
            operator: c.operator,
            value: c.value as string | string[] | undefined,
          })),
        }
      : undefined,
    labelWhen: doc.labelWhen?.map((r) => ({
      when: {
        questionKey: r.when.questionKey,
        operator: r.when.operator,
        value: r.when.value as string | string[] | undefined,
      },
      label: r.label,
    })),
    createdAt: doc.createdAt?.toISOString?.() ?? doc.createdAt,
    updatedAt: doc.updatedAt?.toISOString?.() ?? doc.updatedAt,
  };
}

export function siteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.VERCEL_URL?.trim() ||
    "http://localhost:3000";

  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withProtocol.replace(/\/$/, "");
}
