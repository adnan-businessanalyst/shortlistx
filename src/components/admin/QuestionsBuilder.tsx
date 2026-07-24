"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  AnswersMap,
  QuestionDoc,
  QuestionOption,
  QuestionType,
  ShowIf,
  LabelWhenRule,
} from "@/types/question";
import { summarizeShowIf } from "@/lib/conditions";
import { slugifyKey, slugifyOption } from "@/lib/validation";
import { FormRenderer } from "@/components/survey/SurveyForm";

type Tab = "basics" | "options" | "logic" | "labels" | "advanced";

const TYPES: QuestionType[] = [
  "text",
  "email",
  "textarea",
  "select",
  "single_choice",
  "multi_choice",
  "number",
];

const OPERATORS = [
  { value: "equals", label: "equals" },
  { value: "not_equals", label: "not equals" },
  { value: "includes", label: "includes" },
  { value: "not_includes", label: "not includes" },
  { value: "answered", label: "is answered" },
  { value: "not_answered", label: "is not answered" },
] as const;

function blankQuestion(order: number): QuestionDoc {
  const stamp = Date.now().toString(36);
  return {
    key: `question_${order}_${stamp}`,
    order,
    type: "text",
    label: "New question",
    required: false,
    active: true,
    options: [],
  };
}

function needsOptions(type: QuestionType) {
  return type === "select" || type === "single_choice" || type === "multi_choice";
}

interface QuestionsBuilderProps {
  initialQuestions: QuestionDoc[];
}

export function QuestionsBuilder({ initialQuestions }: QuestionsBuilderProps) {
  const [questions, setQuestions] = useState<QuestionDoc[]>(initialQuestions);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialQuestions[0]?._id ?? null
  );
  const [draft, setDraft] = useState<QuestionDoc | null>(
    initialQuestions[0] ?? null
  );
  const [dirty, setDirty] = useState(false);
  const [tab, setTab] = useState<Tab>("basics");
  const [toast, setToast] = useState<{ msg: string; error?: boolean } | null>(
    null
  );
  const [saving, setSaving] = useState(false);
  const [simAnswers, setSimAnswers] = useState<AnswersMap>({});
  const [advancedJson, setAdvancedJson] = useState("");
  const [keyLocked, setKeyLocked] = useState(false);

  const selected = questions.find((q) => q._id === selectedId) ?? null;

  const showToast = useCallback((msg: string, error = false) => {
    setToast({ msg, error });
    setTimeout(() => setToast(null), 3500);
  }, []);

  function selectQuestion(q: QuestionDoc) {
    if (dirty && !confirm("You have unsaved changes. Discard them?")) return;
    setSelectedId(q._id ?? null);
    setDraft(structuredClone(q));
    setDirty(false);
    setTab("basics");
    setAdvancedJson(
      JSON.stringify(
        { showIf: q.showIf ?? null, labelWhen: q.labelWhen ?? null },
        null,
        2
      )
    );
  }

  function patchDraft(partial: Partial<QuestionDoc>) {
    setDraft((d) => (d ? { ...d, ...partial } : d));
    setDirty(true);
  }

  async function refreshList(selectId?: string) {
    const res = await fetch("/api/admin/questions");
    if (!res.ok) throw new Error("Failed to refresh");
    const data = await res.json();
    setQuestions(data.questions);
    const id = selectId ?? selectedId;
    if (id) {
      const q = data.questions.find((x: QuestionDoc) => x._id === id);
      if (q) {
        setDraft(structuredClone(q));
        setSelectedId(q._id!);
        setDirty(false);
      }
    }
  }

  useEffect(() => {
    if (!selectedId) return;
    // Check if key is referenced by submissions (best-effort via delete API pattern — soft flag)
    setKeyLocked(false);
  }, [selectedId]);

  async function save() {
    if (!draft) return;
    if (!draft.label.trim()) {
      showToast("Label is required", true);
      return;
    }
    if (!/^[a-z][a-z0-9_]*$/.test(draft.key)) {
      showToast("Key must be snake_case (e.g. role_other)", true);
      return;
    }
    if (needsOptions(draft.type)) {
      const opts = draft.options ?? [];
      if (opts.length === 0) {
        showToast("Add at least one option", true);
        return;
      }
      const values = opts.map((o) => o.value);
      if (values.some((v) => !v) || new Set(values).size !== values.length) {
        showToast("Option values must be unique and non-empty", true);
        return;
      }
    }

    setSaving(true);
    try {
      const cleanedShowIf =
        draft.showIf?.conditions
          ?.map((c) => ({
            questionKey: c.questionKey.trim(),
            operator: c.operator,
            value:
              c.operator === "answered" || c.operator === "not_answered"
                ? undefined
                : c.value,
          }))
          .filter((c) => c.questionKey.length > 0) ?? [];

      const cleanedLabelWhen =
        draft.labelWhen
          ?.map((r) => ({
            when: {
              questionKey: r.when.questionKey.trim(),
              operator: r.when.operator,
              value:
                r.when.operator === "answered" ||
                r.when.operator === "not_answered"
                  ? undefined
                  : r.when.value,
            },
            label: r.label.trim(),
          }))
          .filter((r) => r.when.questionKey && r.label) ?? [];

      const payload = {
        key: draft.key.trim(),
        order: draft.order,
        type: draft.type,
        label: draft.label.trim(),
        hint: draft.hint?.trim() || null,
        placeholder: draft.placeholder?.trim() || null,
        required: Boolean(draft.required),
        options: needsOptions(draft.type)
          ? (draft.options ?? []).map((o) => ({
              id: o.id || o.value,
              value: o.value.trim(),
              label: o.label.trim(),
            }))
          : undefined,
        active: Boolean(draft.active),
        showIf:
          cleanedShowIf.length > 0
            ? {
                logic: draft.showIf?.logic ?? "and",
                conditions: cleanedShowIf,
              }
            : null,
        labelWhen: cleanedLabelWhen.length > 0 ? cleanedLabelWhen : null,
      };

      let res: Response;
      if (draft._id) {
        res = await fetch(`/api/admin/questions/${draft._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        const detail =
          typeof data.details === "string"
            ? data.details
            : data.details?.formErrors?.[0] ||
              (data.details?.fieldErrors
                ? Object.entries(data.details.fieldErrors as Record<string, string[]>)
                    .map(([k, v]) => `${k}: ${(v as string[]).join(", ")}`)
                    .join("; ")
                : null);
        showToast(
          [data.error || "Save failed", detail].filter(Boolean).join(" — "),
          true
        );
        return;
      }
      showToast("Saved");
      await refreshList(data.question._id);
    } catch {
      showToast("Save failed", true);
    } finally {
      setSaving(false);
    }
  }

  async function addQuestion() {
    if (dirty && !confirm("Discard unsaved changes?")) return;
    const order = (questions.at(-1)?.order ?? 0) + 1;
    const q = blankQuestion(order);
    setSelectedId(null);
    setDraft(q);
    setDirty(true);
    setTab("basics");
  }

  async function duplicate(id: string) {
    const res = await fetch("/api/admin/questions/duplicate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || "Duplicate failed", true);
      return;
    }
    showToast("Duplicated (inactive)");
    await refreshList(data.question._id);
  }

  async function toggleActive(q: QuestionDoc) {
    const res = await fetch(`/api/admin/questions/${q._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !q.active }),
    });
    if (!res.ok) {
      showToast("Update failed", true);
      return;
    }
    await refreshList(q._id);
  }

  async function remove(q: QuestionDoc) {
    if (!confirm(`Delete “${q.key}”? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/questions/${q._id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      showToast(
        data.error ||
          "Delete failed. If submissions reference this key, deactivate instead.",
        true
      );
      return;
    }
    showToast("Deleted");
    setSelectedId(null);
    setDraft(null);
    setDirty(false);
    await refreshList();
  }

  async function move(id: string, dir: -1 | 1) {
    const idx = questions.findIndex((q) => q._id === id);
    const swap = idx + dir;
    if (idx < 0 || swap < 0 || swap >= questions.length) return;
    const next = [...questions];
    [next[idx], next[swap]] = [next[swap], next[idx]];
    setQuestions(next);
    const orderedIds = next.map((q) => q._id!);
    const res = await fetch("/api/admin/questions/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds }),
    });
    if (!res.ok) {
      showToast("Reorder failed", true);
      await refreshList();
      return;
    }
    await refreshList(id);
  }

  async function loadSeed(force = false) {
    if (
      force &&
      !confirm("Wipe all questions and reseed defaults? This cannot be undone.")
    )
      return;
    const res = await fetch("/api/admin/questions/seed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ force }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      showToast(data.error || `Seed failed (${res.status})`, true);
      return;
    }
    showToast(data.message);
    const refreshed = await fetch("/api/admin/questions").then((r) => r.json());
    setQuestions(refreshed.questions ?? []);
    if (refreshed.questions?.[0]) {
      setSelectedId(refreshed.questions[0]._id);
      setDraft(structuredClone(refreshed.questions[0]));
      setDirty(false);
    }
  }

  const previewQuestions = useMemo(() => {
    // Include inactive draft for preview of current edit; merge draft into list
    const list = questions.map((q) =>
      draft && q._id && draft._id === q._id ? draft : q
    );
    if (draft && !draft._id) {
      return [...list, { ...draft, active: true }].sort(
        (a, b) => a.order - b.order
      );
    }
    // Simulator should show active + currently edited even if inactive
    return list
      .map((q) =>
        draft && q._id === draft._id ? { ...draft, active: true } : q
      )
      .filter((q) => q.active || (draft && q._id === draft._id));
  }, [questions, draft]);

  const priorQuestions = useMemo(() => {
    if (!draft) return questions;
    return questions.filter((q) => q.order < draft.order && q.key !== draft.key);
  }, [questions, draft]);

  function updateOption(i: number, partial: Partial<QuestionOption>) {
    if (!draft) return;
    const opts = [...(draft.options ?? [])];
    opts[i] = { ...opts[i], ...partial };
    patchDraft({ options: opts });
  }

  function addOption() {
    if (!draft) return;
    const opts = [...(draft.options ?? [])];
    opts.push({ value: `option_${opts.length + 1}`, label: "New option" });
    patchDraft({ options: opts });
  }

  function removeOption(i: number) {
    if (!draft) return;
    patchDraft({ options: (draft.options ?? []).filter((_, idx) => idx !== i) });
  }

  function moveOption(i: number, dir: -1 | 1) {
    if (!draft) return;
    const opts = [...(draft.options ?? [])];
    const j = i + dir;
    if (j < 0 || j >= opts.length) return;
    [opts[i], opts[j]] = [opts[j], opts[i]];
    patchDraft({ options: opts });
  }

  function ensureShowIf(): ShowIf {
    return (
      draft?.showIf ?? {
        logic: "and",
        conditions: [
          { questionKey: priorQuestions[0]?.key ?? "", operator: "equals", value: "" },
        ],
      }
    );
  }

  function applyAdvancedJson() {
    try {
      const parsed = JSON.parse(advancedJson) as {
        showIf?: ShowIf | null;
        labelWhen?: LabelWhenRule[] | null;
      };
      patchDraft({
        showIf: parsed.showIf || undefined,
        labelWhen: parsed.labelWhen || undefined,
      });
      showToast("Applied advanced JSON to draft (remember to Save)");
    } catch {
      showToast("Invalid JSON", true);
    }
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Questions Builder</h1>
          <p style={{ color: "var(--muted)", fontSize: "0.92rem" }}>
            Create and branch survey questions stored in MongoDB. Public form reads
            from here.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" className="btn btn-ghost" onClick={() => loadSeed(false)}>
            Load seed questions
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => loadSeed(true)}>
            Force reseed
          </button>
        </div>
      </div>

      {questions.length === 0 && !draft ? (
        <div className="admin-card">
          <p style={{ marginBottom: 12 }}>
            No questions yet — seed defaults or add your first question.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" className="btn btn-ink" onClick={() => loadSeed(false)}>
              Load seed questions
            </button>
            <button type="button" className="btn btn-ghost" onClick={addQuestion}>
              Add question
            </button>
          </div>
        </div>
      ) : (
        <div className="builder">
          {/* LEFT */}
          <aside className="builder-panel">
            <h2>Questions</h2>
            <div className="builder-panel-body">
              <button
                type="button"
                className="btn btn-ink"
                style={{ width: "100%", marginBottom: 12, justifyContent: "center" }}
                onClick={addQuestion}
              >
                Add question
              </button>
              {questions.map((q, i) => (
                <div key={q._id} style={{ marginBottom: 8 }}>
                  <button
                    type="button"
                    className={`q-list-item${selectedId === q._id ? " active" : ""}${
                      !q.active ? " inactive-row" : ""
                    }`}
                    onClick={() => selectQuestion(q)}
                  >
                    <span className="mono" style={{ fontSize: "0.7rem", color: "var(--muted)" }}>
                      {q.order}
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <strong className="mono" style={{ fontSize: "0.78rem" }}>
                        {q.key}
                      </strong>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {q.label}
                      </div>
                      <div>
                        <span className="pill">{q.type}</span>
                        {q.required ? <span className="pill mark">req</span> : null}
                        {q.active ? (
                          <span className="pill green">active</span>
                        ) : (
                          <span className="pill muted">inactive</span>
                        )}
                        {q.showIf?.conditions?.length ? (
                          <span className="pill mark">conditional</span>
                        ) : null}
                      </div>
                    </span>
                  </button>
                  <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                    <button type="button" className="btn btn-ghost" onClick={() => move(q._id!, -1)} disabled={i === 0}>
                      ↑
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => move(q._id!, 1)}
                      disabled={i === questions.length - 1}
                    >
                      ↓
                    </button>
                    <button type="button" className="btn btn-ghost" onClick={() => duplicate(q._id!)}>
                      Dup
                    </button>
                    <button type="button" className="btn btn-ghost" onClick={() => toggleActive(q)}>
                      {q.active ? "Off" : "On"}
                    </button>
                    <button type="button" className="btn btn-ghost" onClick={() => remove(q)}>
                      Del
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* CENTER */}
          <section className="builder-panel">
            <h2>
              Editor {dirty ? "· unsaved" : ""}{" "}
              {draft?._id ? "" : draft ? "· new" : ""}
            </h2>
            {!draft ? (
              <div className="builder-panel-body">
                <p className="hint">Select a question or add one.</p>
              </div>
            ) : (
              <>
                <div className="editor-tabs" role="tablist">
                  {(
                    [
                      ["basics", "Basics"],
                      ["options", "Options"],
                      ["logic", "Branching"],
                      ["labels", "Dynamic label"],
                      ["advanced", "Advanced JSON"],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      role="tab"
                      aria-selected={tab === id}
                      onClick={() => setTab(id)}
                      disabled={id === "options" && !needsOptions(draft.type)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="builder-panel-body">
                  {tab === "basics" ? (
                    <>
                      <div className="form-row">
                        <label htmlFor="q-label">Label (respondent-facing)</label>
                        <textarea
                          id="q-label"
                          value={draft.label}
                          rows={3}
                          onChange={(e) => {
                            const label = e.target.value;
                            if (!draft._id && !dirty) {
                              patchDraft({ label, key: slugifyKey(label) });
                            } else if (!draft._id) {
                              const auto = slugifyKey(label);
                              patchDraft({
                                label,
                                key:
                                  draft.key.startsWith("question_") ||
                                  draft.key === slugifyKey(draft.label)
                                    ? auto
                                    : draft.key,
                              });
                            } else {
                              patchDraft({ label });
                            }
                          }}
                        />
                      </div>
                      <div className="form-row">
                        <label htmlFor="q-key">Key (snake_case)</label>
                        <input
                          id="q-key"
                          className="mono"
                          value={draft.key}
                          disabled={Boolean(draft._id) && keyLocked}
                          onChange={(e) =>
                            patchDraft({
                              key: e.target.value
                                .toLowerCase()
                                .replace(/[^a-z0-9_]/g, ""),
                            })
                          }
                        />
                        {draft._id ? (
                          <p className="hint" style={{ marginTop: 6 }}>
                            Changing a key after submissions exist will be blocked
                            by the API.
                          </p>
                        ) : null}
                      </div>
                      <div className="form-row">
                        <label htmlFor="q-type">Type</label>
                        <select
                          id="q-type"
                          value={draft.type}
                          onChange={(e) =>
                            patchDraft({ type: e.target.value as QuestionType })
                          }
                        >
                          {TYPES.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-row">
                        <label htmlFor="q-hint">Hint</label>
                        <input
                          id="q-hint"
                          value={draft.hint ?? ""}
                          onChange={(e) => patchDraft({ hint: e.target.value })}
                        />
                      </div>
                      <div className="form-row">
                        <label htmlFor="q-ph">Placeholder</label>
                        <input
                          id="q-ph"
                          value={draft.placeholder ?? ""}
                          onChange={(e) =>
                            patchDraft({ placeholder: e.target.value })
                          }
                        />
                      </div>
                      <div className="form-row row-inline">
                        <label className="toggle">
                          <input
                            type="checkbox"
                            checked={draft.required}
                            onChange={(e) =>
                              patchDraft({ required: e.target.checked })
                            }
                          />
                          Required
                        </label>
                        <label className="toggle">
                          <input
                            type="checkbox"
                            checked={draft.active}
                            onChange={(e) =>
                              patchDraft({ active: e.target.checked })
                            }
                          />
                          Active
                        </label>
                      </div>
                    </>
                  ) : null}

                  {tab === "options" ? (
                    <>
                      {(draft.options ?? []).map((opt, i) => (
                        <div className="option-row" key={i}>
                          <input
                            aria-label="Option label"
                            placeholder="Label"
                            value={opt.label}
                            onChange={(e) => {
                              const label = e.target.value;
                              updateOption(i, {
                                label,
                                value:
                                  opt.value === slugifyOption(opt.label) ||
                                  opt.value.startsWith("option_")
                                    ? slugifyOption(label)
                                    : opt.value,
                              });
                            }}
                          />
                          <input
                            aria-label="Option value"
                            className="mono"
                            placeholder="value"
                            value={opt.value}
                            onChange={(e) =>
                              updateOption(i, {
                                value: e.target.value
                                  .toLowerCase()
                                  .replace(/[^a-z0-9_]/g, ""),
                              })
                            }
                          />
                          <button type="button" className="btn btn-ghost" onClick={() => moveOption(i, -1)}>
                            ↑
                          </button>
                          <button type="button" className="btn btn-ghost" onClick={() => removeOption(i)}>
                            ×
                          </button>
                        </div>
                      ))}
                      <button type="button" className="btn btn-ghost" onClick={addOption}>
                        Add option
                      </button>
                    </>
                  ) : null}

                  {tab === "logic" ? (
                    <>
                      <div className="form-row">
                        <label>Match logic</label>
                        <div className="row-inline">
                          <label className="toggle">
                            <input
                              type="radio"
                              name="logic"
                              checked={(draft.showIf?.logic ?? "and") === "and"}
                              onChange={() =>
                                patchDraft({
                                  showIf: { ...ensureShowIf(), logic: "and" },
                                })
                              }
                            />
                            Match ALL (and)
                          </label>
                          <label className="toggle">
                            <input
                              type="radio"
                              name="logic"
                              checked={draft.showIf?.logic === "or"}
                              onChange={() =>
                                patchDraft({
                                  showIf: { ...ensureShowIf(), logic: "or" },
                                })
                              }
                            />
                            Match ANY (or)
                          </label>
                        </div>
                      </div>

                      {(draft.showIf?.conditions ?? []).map((c, i) => {
                        const refQ = questions.find((q) => q.key === c.questionKey);
                        const hasOpts = (refQ?.options?.length ?? 0) > 0;
                        const needsValue =
                          c.operator !== "answered" && c.operator !== "not_answered";
                        return (
                          <div className="condition-row" key={i}>
                            <select
                              aria-label="Prior question"
                              value={c.questionKey}
                              onChange={(e) => {
                                const conditions = [...(draft.showIf?.conditions ?? [])];
                                conditions[i] = {
                                  ...conditions[i],
                                  questionKey: e.target.value,
                                  value: "",
                                };
                                patchDraft({
                                  showIf: {
                                    logic: draft.showIf?.logic ?? "and",
                                    conditions,
                                  },
                                });
                              }}
                            >
                              <option value="">When…</option>
                              {(priorQuestions.length
                                ? priorQuestions
                                : questions.filter((q) => q.key !== draft.key)
                              ).map((q) => (
                                <option key={q.key} value={q.key}>
                                  {q.key}
                                </option>
                              ))}
                            </select>
                            <select
                              aria-label="Operator"
                              value={c.operator}
                              onChange={(e) => {
                                const conditions = [...(draft.showIf?.conditions ?? [])];
                                conditions[i] = {
                                  ...conditions[i],
                                  operator: e.target.value as typeof c.operator,
                                };
                                patchDraft({
                                  showIf: {
                                    logic: draft.showIf?.logic ?? "and",
                                    conditions,
                                  },
                                });
                              }}
                            >
                              {OPERATORS.map((o) => (
                                <option key={o.value} value={o.value}>
                                  {o.label}
                                </option>
                              ))}
                            </select>
                            {needsValue ? (
                              hasOpts ? (
                                <select
                                  aria-label="Value"
                                  value={
                                    Array.isArray(c.value)
                                      ? c.value[0] ?? ""
                                      : (c.value as string) ?? ""
                                  }
                                  onChange={(e) => {
                                    const conditions = [
                                      ...(draft.showIf?.conditions ?? []),
                                    ];
                                    conditions[i] = {
                                      ...conditions[i],
                                      value: e.target.value,
                                    };
                                    patchDraft({
                                      showIf: {
                                        logic: draft.showIf?.logic ?? "and",
                                        conditions,
                                      },
                                    });
                                  }}
                                >
                                  <option value="">Value…</option>
                                  {refQ?.options?.map((o) => (
                                    <option key={o.value} value={o.value}>
                                      {o.label}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  aria-label="Value"
                                  value={
                                    Array.isArray(c.value)
                                      ? c.value.join(",")
                                      : (c.value as string) ?? ""
                                  }
                                  onChange={(e) => {
                                    const conditions = [
                                      ...(draft.showIf?.conditions ?? []),
                                    ];
                                    conditions[i] = {
                                      ...conditions[i],
                                      value: e.target.value,
                                    };
                                    patchDraft({
                                      showIf: {
                                        logic: draft.showIf?.logic ?? "and",
                                        conditions,
                                      },
                                    });
                                  }}
                                />
                              )
                            ) : (
                              <span className="hint">—</span>
                            )}
                            <button
                              type="button"
                              className="btn btn-ghost"
                              onClick={() => {
                                const conditions = (draft.showIf?.conditions ?? []).filter(
                                  (_, idx) => idx !== i
                                );
                                patchDraft({
                                  showIf: conditions.length
                                    ? {
                                        logic: draft.showIf?.logic ?? "and",
                                        conditions,
                                      }
                                    : undefined,
                                });
                              }}
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}

                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => {
                          const base = ensureShowIf();
                          patchDraft({
                            showIf: {
                              ...base,
                              conditions: [
                                ...base.conditions,
                                {
                                  questionKey: priorQuestions[0]?.key ?? "",
                                  operator: "equals",
                                  value: "",
                                },
                              ],
                            },
                          });
                        }}
                      >
                        Add condition
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost"
                        style={{ marginLeft: 8 }}
                        onClick={() => patchDraft({ showIf: undefined })}
                      >
                        Clear logic
                      </button>

                      {draft.showIf?.conditions?.length ? (
                        <div className="summary-chip">
                          {summarizeShowIf(draft.showIf, questions)}
                        </div>
                      ) : (
                        <p className="hint" style={{ marginTop: 12 }}>
                          No branching — always shown (when active).
                        </p>
                      )}
                    </>
                  ) : null}

                  {tab === "labels" ? (
                    <>
                      <p className="hint" style={{ marginBottom: 12 }}>
                        Optional alternate labels based on a prior answer.
                      </p>
                      {(draft.labelWhen ?? []).map((rule, i) => (
                        <div
                          key={i}
                          style={{
                            border: "1px solid var(--line)",
                            borderRadius: 10,
                            padding: 12,
                            marginBottom: 10,
                          }}
                        >
                          <div className="form-row">
                            <label>Alternate label</label>
                            <input
                              value={rule.label}
                              onChange={(e) => {
                                const labelWhen = [...(draft.labelWhen ?? [])];
                                labelWhen[i] = {
                                  ...labelWhen[i],
                                  label: e.target.value,
                                };
                                patchDraft({ labelWhen });
                              }}
                            />
                          </div>
                          <div className="condition-row">
                            <select
                              value={rule.when.questionKey}
                              onChange={(e) => {
                                const labelWhen = [...(draft.labelWhen ?? [])];
                                labelWhen[i] = {
                                  ...labelWhen[i],
                                  when: {
                                    ...labelWhen[i].when,
                                    questionKey: e.target.value,
                                  },
                                };
                                patchDraft({ labelWhen });
                              }}
                            >
                              <option value="">When…</option>
                              {questions
                                .filter((q) => q.key !== draft.key)
                                .map((q) => (
                                  <option key={q.key} value={q.key}>
                                    {q.key}
                                  </option>
                                ))}
                            </select>
                            <select
                              value={rule.when.operator}
                              onChange={(e) => {
                                const labelWhen = [...(draft.labelWhen ?? [])];
                                labelWhen[i] = {
                                  ...labelWhen[i],
                                  when: {
                                    ...labelWhen[i].when,
                                    operator: e.target
                                      .value as typeof rule.when.operator,
                                  },
                                };
                                patchDraft({ labelWhen });
                              }}
                            >
                              {OPERATORS.map((o) => (
                                <option key={o.value} value={o.value}>
                                  {o.label}
                                </option>
                              ))}
                            </select>
                            <input
                              value={
                                Array.isArray(rule.when.value)
                                  ? rule.when.value.join(",")
                                  : (rule.when.value as string) ?? ""
                              }
                              onChange={(e) => {
                                const labelWhen = [...(draft.labelWhen ?? [])];
                                labelWhen[i] = {
                                  ...labelWhen[i],
                                  when: {
                                    ...labelWhen[i].when,
                                    value: e.target.value,
                                  },
                                };
                                patchDraft({ labelWhen });
                              }}
                            />
                            <button
                              type="button"
                              className="btn btn-ghost"
                              onClick={() =>
                                patchDraft({
                                  labelWhen: (draft.labelWhen ?? []).filter(
                                    (_, idx) => idx !== i
                                  ),
                                })
                              }
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() =>
                          patchDraft({
                            labelWhen: [
                              ...(draft.labelWhen ?? []),
                              {
                                when: {
                                  questionKey: priorQuestions[0]?.key ?? "",
                                  operator: "equals",
                                  value: "",
                                },
                                label: "",
                              },
                            ],
                          })
                        }
                      >
                        Add alternate label
                      </button>
                    </>
                  ) : null}

                  {tab === "advanced" ? (
                    <>
                      <p className="hint" style={{ marginBottom: 8 }}>
                        Power users: edit showIf / labelWhen JSON, then Apply to
                        draft.
                      </p>
                      <textarea
                        className="mono"
                        rows={16}
                        value={advancedJson}
                        onChange={(e) => setAdvancedJson(e.target.value)}
                        onFocus={() =>
                          setAdvancedJson(
                            JSON.stringify(
                              {
                                showIf: draft.showIf ?? null,
                                labelWhen: draft.labelWhen ?? null,
                              },
                              null,
                              2
                            )
                          )
                        }
                      />
                      <button
                        type="button"
                        className="btn btn-ghost"
                        style={{ marginTop: 8 }}
                        onClick={applyAdvancedJson}
                      >
                        Apply JSON to draft
                      </button>
                    </>
                  ) : null}

                  <div
                    style={{
                      marginTop: 20,
                      paddingTop: 16,
                      borderTop: "1px solid var(--line)",
                      display: "flex",
                      gap: 8,
                    }}
                  >
                    <button
                      type="button"
                      className="btn btn-ink"
                      onClick={save}
                      disabled={saving || !dirty}
                    >
                      {saving ? "Saving…" : "Save"}
                    </button>
                    {dirty ? (
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => {
                          if (selected) {
                            setDraft(structuredClone(selected));
                            setDirty(false);
                          }
                        }}
                      >
                        Discard
                      </button>
                    ) : null}
                  </div>
                </div>
              </>
            )}
          </section>

          {/* RIGHT */}
          <aside className="builder-panel">
            <h2>Live preview / simulator</h2>
            <div className="builder-panel-body">
              <p className="hint" style={{ marginBottom: 10 }}>
                Fill answers to test branching. Highlighted field is the one you
                are editing.
              </p>
              <FormRenderer
                key={JSON.stringify(previewQuestions.map((q) => q.key + q.order))}
                questions={previewQuestions.map((q) => ({ ...q, active: true }))}
                highlightKey={draft?.key}
                simulator
                namePrefix="sim_"
                onSimulatorChange={setSimAnswers}
              />
              <p className="mono" style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: 12 }}>
                Simulator keys answered: {Object.keys(simAnswers).join(", ") || "—"}
              </p>
            </div>
          </aside>
        </div>
      )}

      {toast ? (
        <div className={`toast${toast.error ? " error" : ""}`} role="status">
          {toast.msg}
        </div>
      ) : null}
    </div>
  );
}
