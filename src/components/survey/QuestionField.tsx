"use client";

import type { AnswersMap, QuestionDoc } from "@/types/question";
import { resolveLabel } from "@/lib/conditions";

interface QuestionFieldProps {
  question: QuestionDoc;
  index: number;
  value: string | string[] | number | null | undefined;
  answers: AnswersMap;
  error?: string;
  onChange: (key: string, value: string | string[]) => void;
  highlight?: boolean;
  disabled?: boolean;
  namePrefix?: string;
  selectPlaceholder?: string;
}

export function QuestionField({
  question,
  index,
  value,
  answers,
  error,
  onChange,
  highlight,
  disabled,
  namePrefix = "",
  selectPlaceholder = "Select…",
}: QuestionFieldProps) {
  const label = resolveLabel(question, answers);
  const id = `${namePrefix}${question.key}`;
  const strVal = Array.isArray(value) ? "" : value == null ? "" : String(value);
  const arrVal = Array.isArray(value) ? value : [];

  return (
    <div
      className={`field${highlight ? " field-highlight" : ""}`}
      data-question-key={question.key}
    >
      <span className="fnum">
        Q{index + 1} · {question.key}
      </span>
      <div className="fbody">
        {question.type === "select" ||
        question.type === "text" ||
        question.type === "email" ||
        question.type === "number" ||
        question.type === "textarea" ? (
          <>
            <label className="q" htmlFor={id}>
              {label}
              {question.required ? " *" : ""}
            </label>
            {question.hint ? <p className="hint">{question.hint}</p> : null}
          </>
        ) : (
          <fieldset disabled={disabled}>
            <legend className="q">
              {label}
              {question.required ? " *" : ""}
            </legend>
            {question.hint ? <p className="hint">{question.hint}</p> : null}
            {question.type === "single_choice" ? (
              <div className="chips" role="radiogroup" aria-labelledby={undefined}>
                {(question.options ?? []).map((opt) => (
                  <label className="chip" key={opt.value}>
                    <input
                      type="radio"
                      name={id}
                      value={opt.value}
                      checked={strVal === opt.value}
                      disabled={disabled}
                      onChange={() => onChange(question.key, opt.value)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="chips">
                {(question.options ?? []).map((opt) => {
                  const checked = arrVal.includes(opt.value);
                  return (
                    <label className="chip" key={opt.value}>
                      <input
                        type="checkbox"
                        name={`${id}[]`}
                        value={opt.value}
                        checked={checked}
                        disabled={disabled}
                        onChange={() => {
                          const next = checked
                            ? arrVal.filter((v) => v !== opt.value)
                            : [...arrVal, opt.value];
                          onChange(question.key, next);
                        }}
                      />
                      <span>{opt.label}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </fieldset>
        )}

        {question.type === "select" ? (
          <select
            id={id}
            name={id}
            required={question.required}
            value={strVal}
            disabled={disabled}
            onChange={(e) => onChange(question.key, e.target.value)}
          >
            <option value="" disabled>
              {question.placeholder || selectPlaceholder}
            </option>
            {(question.options ?? []).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : null}

        {question.type === "text" ||
        question.type === "email" ||
        question.type === "number" ? (
          <input
            id={id}
            name={id}
            type={
              question.type === "email"
                ? "email"
                : question.type === "number"
                  ? "number"
                  : "text"
            }
            required={question.required}
            placeholder={question.placeholder}
            value={strVal}
            disabled={disabled}
            autoComplete={question.type === "email" ? "email" : undefined}
            onChange={(e) => onChange(question.key, e.target.value)}
          />
        ) : null}

        {question.type === "textarea" ? (
          <textarea
            id={id}
            name={id}
            required={question.required}
            placeholder={question.placeholder}
            value={strVal}
            disabled={disabled}
            onChange={(e) => onChange(question.key, e.target.value)}
          />
        ) : null}

        {error ? (
          <p className="field-error" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
