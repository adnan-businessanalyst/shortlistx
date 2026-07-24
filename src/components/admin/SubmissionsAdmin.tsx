"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface SubmissionRow {
  _id: string;
  email?: string;
  status: string;
  submittedAt: string;
  answers: { key: string; labelSnapshot: string; value: string | string[] }[];
  visiblePath?: string[];
}

export function SubmissionsAdmin() {
  const [items, setItems] = useState<SubmissionRow[]>([]);
  const [total, setTotal] = useState(0);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      status,
      q,
      page: String(page),
      limit: "25",
    });
    const res = await fetch(`/api/admin/submissions?${params}`);
    const data = await res.json();
    if (res.ok) {
      setItems(data.submissions);
      setTotal(data.total);
      setStatusCounts(data.statusCounts ?? {});
    }
    setLoading(false);
  }, [status, q, page]);

  useEffect(() => {
    load();
  }, [load]);

  function preview(row: SubmissionRow) {
    const keys = ["role", "biggest_pain", "willingness_to_pay", "pilot_interest"];
    return keys
      .map((k) => {
        const a = row.answers.find((x) => x.key === k);
        if (!a) return null;
        const v = Array.isArray(a.value) ? a.value.join(", ") : a.value;
        return `${k}: ${v}`;
      })
      .filter(Boolean)
      .join(" · ");
  }

  const totalAll = Object.values(statusCounts).reduce((a, b) => a + b, 0);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 16,
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Submissions</h1>
          <p style={{ color: "var(--muted)" }}>
            Discovery survey responses for market research.
          </p>
        </div>
        <a className="btn btn-ink" href={`/api/admin/submissions/export?status=${status}`}>
          Export CSV
        </a>
      </div>

      <div className="stats-row">
        <div className="stat">
          <div className="n">{totalAll}</div>
          <div className="l">Total</div>
        </div>
        {["new", "reviewed", "invited", "rejected"].map((s) => (
          <div className="stat" key={s}>
            <div className="n">{statusCounts[s] ?? 0}</div>
            <div className="l">{s}</div>
          </div>
        ))}
      </div>

      <div className="admin-card" style={{ marginBottom: 16 }}>
        <div className="row-inline" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
            aria-label="Filter by status"
          >
            <option value="all">All statuses</option>
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
            <option value="invited">Invited</option>
            <option value="rejected">Rejected</option>
          </select>
          <input
            type="search"
            placeholder="Search email / answers…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setPage(1);
                load();
              }
            }}
            style={{ maxWidth: 320 }}
          />
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setPage(1);
              load();
            }}
          >
            Search
          </button>
        </div>
      </div>

      <div className="admin-card table-wrap">
        {loading ? (
          <p className="hint">Loading…</p>
        ) : items.length === 0 ? (
          <p className="hint">No submissions yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Email</th>
                <th>Status</th>
                <th>Preview</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row._id}>
                  <td className="mono" style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                    {new Date(row.submittedAt).toLocaleString()}
                  </td>
                  <td>{row.email || "—"}</td>
                  <td>
                    <span className="pill">{row.status}</span>
                  </td>
                  <td style={{ maxWidth: 360, fontSize: "0.85rem", color: "var(--muted)" }}>
                    {preview(row) || "—"}
                  </td>
                  <td>
                    <Link href={`/admin/submissions/${row._id}`}>View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 16,
            alignItems: "center",
          }}
        >
          <button
            type="button"
            className="btn btn-ghost"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>
          <span className="mono" style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
            Page {page} · {total} total
          </span>
          <button
            type="button"
            className="btn btn-ghost"
            disabled={page * 25 >= total}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
