"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface SubmissionDetail {
  _id: string;
  email?: string;
  status: string;
  notes?: string;
  submittedAt: string;
  pageUrl?: string;
  userAgent?: string;
  visiblePath?: string[];
  answeredKeys?: string[];
  answers: {
    key: string;
    labelSnapshot: string;
    type: string;
    value: string | string[];
  }[];
}

export function SubmissionDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const [doc, setDoc] = useState<SubmissionDetail | null>(null);
  const [status, setStatus] = useState("new");
  const [notes, setNotes] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/submissions/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.submission) {
          setDoc(data.submission);
          setStatus(data.submission.status);
          setNotes(data.submission.notes ?? "");
        }
      });
  }, [id]);

  async function save() {
    const res = await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, notes }),
    });
    if (res.ok) {
      setToast("Saved");
      setTimeout(() => setToast(null), 2000);
      router.refresh();
    } else {
      setToast("Save failed");
    }
  }

  if (!doc) return <p className="hint">Loading…</p>;

  return (
    <div>
      <p style={{ marginBottom: 12 }}>
        <Link href="/admin/submissions">← Back to submissions</Link>
      </p>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 8 }}>
        Submission
      </h1>
      <p className="mono" style={{ color: "var(--muted)", fontSize: "0.8rem", marginBottom: 20 }}>
        {doc._id} · {new Date(doc.submittedAt).toLocaleString()}
      </p>

      <div className="stats-row">
        <div className="stat">
          <div className="n" style={{ fontSize: "1rem" }}>
            {doc.email || "—"}
          </div>
          <div className="l">Email</div>
        </div>
        <div className="stat">
          <div className="n" style={{ fontSize: "1rem" }}>
            {doc.status}
          </div>
          <div className="l">Status</div>
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: "1rem", marginBottom: 12 }}>Status & notes</h2>
        <div className="form-row">
          <label htmlFor="st">Status</label>
          <select id="st" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="new">new</option>
            <option value="reviewed">reviewed</option>
            <option value="invited">invited</option>
            <option value="rejected">rejected</option>
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <button type="button" className="btn btn-ink" onClick={save}>
          Save
        </button>
      </div>

      {doc.visiblePath?.length ? (
        <div className="admin-card" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: "1rem", marginBottom: 8 }}>Branch path</h2>
          <p className="mono" style={{ fontSize: "0.8rem" }}>
            {doc.visiblePath.join(" → ")}
          </p>
        </div>
      ) : null}

      <div className="admin-card">
        <h2 style={{ fontSize: "1rem", marginBottom: 12 }}>Answers</h2>
        {doc.answers.map((a) => (
          <div
            key={a.key}
            style={{
              padding: "12px 0",
              borderBottom: "1px solid var(--line)",
            }}
          >
            <div className="mono" style={{ fontSize: "0.7rem", color: "var(--muted)" }}>
              {a.key} · {a.type}
            </div>
            <div style={{ fontWeight: 650, margin: "4px 0" }}>{a.labelSnapshot}</div>
            <div>
              {Array.isArray(a.value) ? a.value.join(", ") : String(a.value)}
            </div>
          </div>
        ))}
        {doc.pageUrl ? (
          <p className="hint" style={{ marginTop: 16 }}>
            Page: {doc.pageUrl}
          </p>
        ) : null}
        {doc.userAgent ? (
          <p className="hint" style={{ marginTop: 4, wordBreak: "break-all" }}>
            UA: {doc.userAgent}
          </p>
        ) : null}
      </div>

      {toast ? <div className="toast">{toast}</div> : null}
    </div>
  );
}
