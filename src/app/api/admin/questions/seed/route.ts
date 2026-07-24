import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { seedQuestions } from "@/lib/questions";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
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
    console.error(err);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
