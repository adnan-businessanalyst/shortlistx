import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { seedQuestions } from "@/lib/questions";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function seedErrorMessage(err: unknown): string {
  if (!(err instanceof Error)) return "Seed failed";
  const msg = err.message || "Seed failed";
  if (msg.includes("MONGODB_URI")) {
    return "MONGODB_URI is not set. Add it in Vercel → Project → Settings → Environment Variables, then redeploy.";
  }
  if (/authentication failed|bad auth|SCRAM/i.test(msg)) {
    return "MongoDB authentication failed. Check the username/password in MONGODB_URI.";
  }
  if (/ENOTFOUND|querySrv|server selection|timed out|ECONNREFUSED/i.test(msg)) {
    return "Could not reach MongoDB. Check Atlas Network Access (allow 0.0.0.0/0) and MONGODB_URI host.";
  }
  if (/duplicate key|E11000/i.test(msg)) {
    return "Duplicate question keys. Use Force reseed to wipe and reload defaults.";
  }
  return msg.slice(0, 300);
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdminSession();
    if (!auth.ok) return auth.response;

    const body = await req.json().catch(() => ({}));
    const force = Boolean(body?.force);
    const count = await seedQuestions(force);
    return NextResponse.json({
      ok: true,
      inserted: count,
      message:
        count === 0
          ? "Questions already exist. Pass force:true to wipe and reseed."
          : `Seeded ${count} questions.`,
    });
  } catch (err) {
    console.error("[seed]", err);
    return NextResponse.json(
      { error: seedErrorMessage(err) },
      { status: 500 }
    );
  }
}
