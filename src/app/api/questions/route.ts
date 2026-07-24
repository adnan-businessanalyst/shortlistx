import { NextResponse } from "next/server";
import { getActiveQuestions } from "@/lib/questions";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const questions = await getActiveQuestions();
    return NextResponse.json({ questions });
  } catch (err) {
    console.error("GET /api/questions", err);
    return NextResponse.json(
      { error: "Failed to load questions" },
      { status: 500 }
    );
  }
}
