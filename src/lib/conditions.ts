import type {
  AnswerValue,
  AnswersMap,
  LabelWhenRule,
  QuestionDoc,
  ShowIf,
  ShowIfCondition,
} from "@/types/question";

function asArray(value: AnswerValue): string[] {
  if (value == null || value === "") return [];
  if (Array.isArray(value)) return value.map(String);
  return [String(value)];
}

function isAnswered(value: AnswerValue): boolean {
  if (value == null) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
}

export function evaluateCondition(
  condition: ShowIfCondition,
  answers: AnswersMap
): boolean {
  const answer = answers[condition.questionKey];
  const expected = condition.value;

  switch (condition.operator) {
    case "answered":
      return isAnswered(answer);
    case "not_answered":
      return !isAnswered(answer);
    case "equals": {
      if (Array.isArray(expected)) {
        const vals = asArray(answer);
        return expected.some((e) => vals.includes(String(e)));
      }
      const vals = asArray(answer);
      return vals.includes(String(expected ?? ""));
    }
    case "not_equals": {
      if (Array.isArray(expected)) {
        const vals = asArray(answer);
        return !expected.some((e) => vals.includes(String(e)));
      }
      const vals = asArray(answer);
      return !vals.includes(String(expected ?? ""));
    }
    case "includes": {
      const vals = asArray(answer);
      if (Array.isArray(expected)) {
        return expected.some((e) => vals.includes(String(e)));
      }
      return vals.includes(String(expected ?? ""));
    }
    case "not_includes": {
      const vals = asArray(answer);
      if (Array.isArray(expected)) {
        return expected.every((e) => !vals.includes(String(e)));
      }
      return !vals.includes(String(expected ?? ""));
    }
    default:
      return false;
  }
}

export function evaluateShowIf(
  showIf: ShowIf | undefined | null,
  answers: AnswersMap
): boolean {
  if (!showIf || !showIf.conditions || showIf.conditions.length === 0) {
    return true;
  }
  const results = showIf.conditions.map((c) => evaluateCondition(c, answers));
  return showIf.logic === "or" ? results.some(Boolean) : results.every(Boolean);
}

export function resolveLabel(
  question: Pick<QuestionDoc, "label" | "labelWhen">,
  answers: AnswersMap
): string {
  if (question.labelWhen?.length) {
    for (const rule of question.labelWhen) {
      if (evaluateCondition(rule.when, answers)) {
        return rule.label;
      }
    }
  }
  return question.label;
}

/**
 * Returns visible questions in order. Clears answers for hidden questions
 * when `pruneAnswers` is true (mutates a copy of answers).
 */
export function getVisibleQuestions(
  questions: QuestionDoc[],
  answers: AnswersMap,
  options?: { activeOnly?: boolean }
): QuestionDoc[] {
  const sorted = [...questions]
    .filter((q) => (options?.activeOnly === false ? true : q.active !== false))
    .sort((a, b) => a.order - b.order);

  const visible: QuestionDoc[] = [];
  // Evaluate sequentially so later questions can depend on earlier answers
  const working: AnswersMap = { ...answers };

  for (const q of sorted) {
    if (evaluateShowIf(q.showIf, working)) {
      visible.push(q);
    }
  }
  return visible;
}

/**
 * Remove answers for questions that are no longer visible.
 */
export function pruneHiddenAnswers(
  questions: QuestionDoc[],
  answers: AnswersMap,
  options?: { activeOnly?: boolean }
): AnswersMap {
  const visible = getVisibleQuestions(questions, answers, options);
  const visibleKeys = new Set(visible.map((q) => q.key));
  const next: AnswersMap = {};
  for (const [key, value] of Object.entries(answers)) {
    if (visibleKeys.has(key)) {
      next[key] = value;
    }
  }
  return next;
}

export function summarizeShowIf(
  showIf: ShowIf | undefined | null,
  questions: QuestionDoc[]
): string {
  if (!showIf?.conditions?.length) return "";
  const keyToLabel = new Map(questions.map((q) => [q.key, q.key]));
  const parts = showIf.conditions.map((c) => {
    const qKey = keyToLabel.get(c.questionKey) ?? c.questionKey;
    const val = Array.isArray(c.value)
      ? c.value.join(" | ")
      : (c.value ?? "");
    if (c.operator === "answered") return `${qKey} is answered`;
    if (c.operator === "not_answered") return `${qKey} is not answered`;
    return `${qKey} ${c.operator.replace(/_/g, " ")} ${val}`.trim();
  });
  const joiner = showIf.logic === "or" ? " OR " : " AND ";
  return `Shown when ${parts.join(joiner)}`;
}

export function formatLabelWhenSummary(rules: LabelWhenRule[] | undefined): string {
  if (!rules?.length) return "";
  return `${rules.length} alternate label${rules.length === 1 ? "" : "s"}`;
}
