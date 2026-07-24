import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Submission } from "@/models/Submission";

export const dynamic = "force-dynamic";

function csvEscape(val: unknown): string {
  const s = val == null ? "" : Array.isArray(val) ? val.join("; ") : String(val);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  await connectDB();
  const status = new URL(req.url).searchParams.get("status");
  const filter: Record<string, unknown> = {};
  if (status && status !== "all") filter.status = status;

  const rows = await Submission.find(filter).sort({ submittedAt: -1 }).lean();

  const allKeys = new Set<string>();
  for (const r of rows) {
    for (const a of r.answers) allKeys.add(a.key);
  }
  const keys = [...allKeys].sort();

  const header = [
    "id",
    "submittedAt",
    "email",
    "status",
    "visiblePath",
    "notes",
    ...keys,
  ];

  const lines = [header.join(",")];
  for (const r of rows) {
    const map = new Map(
      r.answers.map((a: { key: string; value: unknown }) => [a.key, a.value])
    );
    const cells = [
      csvEscape(r._id.toString()),
      csvEscape(r.submittedAt ? new Date(r.submittedAt).toISOString() : ""),
      csvEscape(r.email ?? ""),
      csvEscape(r.status),
      csvEscape((r.visiblePath ?? []).join(">")),
      csvEscape(r.notes ?? ""),
      ...keys.map((k) => csvEscape(map.get(k))),
    ];
    lines.push(cells.join(","));
  }

  const csv = lines.join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="shortlist-submissions.csv"`,
    },
  });
}
