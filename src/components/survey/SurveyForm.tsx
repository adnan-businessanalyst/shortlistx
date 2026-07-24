"use client";

import { useMemo, useState, useTransition } from "react";
import type { AnswersMap, QuestionDoc } from "@/types/question";
import {
  getVisibleQuestions,
  pruneHiddenAnswers,
} from "@/lib/conditions";
import { QuestionField } from "./QuestionField";
import { useLanguage } from "@/i18n/LanguageProvider";

interface SurveyFormProps {
  questions: QuestionDoc[];
  highlightKey?: string;
  simulator?: boolean;
  onSimulatorChange?: (answers: AnswersMap) => void;
  initialAnswers?: AnswersMap;
  namePrefix?: string;
}

export function SurveyForm({
  questions,
  highlightKey,
  simulator = false,
  onSimulatorChange,
  initialAnswers = {},
  namePrefix = "",
}: SurveyFormProps) {
  const { t, localizeQuestion } = useLanguage();
  const [answers, setAnswers] = useState<AnswersMap>(initialAnswers);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const localizedQuestions = useMemo(
    () => questions.map((q) => localizeQuestion(q)),
    [questions, localizeQuestion]
  );

  const visible = useMemo(
    () =>
      getVisibleQuestions(localizedQuestions, answers, {
        activeOnly: !simulator,
      }),
    [localizedQuestions, answers, simulator]
  );

  function updateAnswer(key: string, value: string | string[]) {
    setAnswers((prev) => {
      const next = pruneHiddenAnswers(
        localizedQuestions,
        { ...prev, [key]: value },
        { activeOnly: !simulator }
      );
      onSimulatorChange?.(next);
      return next;
    });
    setErrors((e) => {
      if (!e[key]) return e;
      const copy = { ...e };
      delete copy[key];
      return copy;
    });
  }

  function resetSimulator() {
    setAnswers({});
    setErrors({});
    onSimulatorChange?.({});
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (simulator) return;
    setSubmitError(null);

    startTransition(async () => {
      try {
        const res = await fetch("/api/submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            answers,
            pageUrl: typeof window !== "undefined" ? window.location.href : "",
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          if (data.errors) {
            const mapped: Record<string, string> = {};
            for (const [k, v] of Object.entries(
              data.errors as Record<string, string>
            )) {
              mapped[k] = v === "This field is required" ? t.requiredField : v;
            }
            setErrors(mapped);
          }
          setSubmitError(data.error || t.submitError);
          return;
        }
        setDone(true);
      } catch {
        setSubmitError(t.submitErrorNetwork);
      }
    });
  }

  const waHref =
    typeof window !== "undefined"
      ? `https://wa.me/?text=${encodeURIComponent(t.shareText + window.location.href)}`
      : "https://wa.me/";

  if (done && !simulator) {
    return (
      <div className="success" role="status" style={{ display: "block" }}>
        <span className="stamp">{t.successStamp}</span>
        <h3>{t.successH}</h3>
        <p>{t.successP}</p>
        <a
          className="btn btn-wa"
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.shareWa}
        </a>
      </div>
    );
  }

  return (
    <>
      {simulator ? (
        <div className="sim-toolbar">
          <button type="button" className="btn btn-ghost" onClick={resetSimulator}>
            {t.resetSimulator}
          </button>
          <a
            className="btn btn-ghost"
            href="/#survey"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.openPublicForm}
          </a>
        </div>
      ) : null}
      <form
        id={simulator ? "sim-intake" : "intake"}
        onSubmit={handleSubmit}
        noValidate
      >
        {visible.length === 0 ? (
          <div className="field">
            <div className="fbody">
              <p className="hint">{t.noVisibleQuestions}</p>
            </div>
          </div>
        ) : (
          visible.map((q, i) => (
            <QuestionField
              key={q.key}
              question={q}
              index={i}
              value={answers[q.key]}
              answers={answers}
              error={errors[q.key]}
              onChange={updateAnswer}
              highlight={highlightKey === q.key}
              namePrefix={namePrefix}
              selectPlaceholder={t.selectPlaceholder}
            />
          ))
        )}

        {!simulator ? (
          <div className="submit-row">
            <button className="btn btn-ink" type="submit" disabled={pending}>
              {pending ? t.sending : t.submit}
            </button>
            <p className="privacy">{t.privacy}</p>
            {submitError ? (
              <p className="field-error" role="alert">
                {submitError}
              </p>
            ) : null}
          </div>
        ) : null}
      </form>
    </>
  );
}

/** Alias used by builder preview */
export function FormRenderer(props: SurveyFormProps) {
  return <SurveyForm {...props} />;
}
