import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getActiveQuestions } from "@/lib/questions";
import {
  submissionBodySchema,
  validateSubmissionAnswers,
} from "@/lib/validation";
import { Submission } from "@/models/Submission";
import type { AnswersMap } from "@/types/question";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = submissionBodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const questions = await getActiveQuestions();
    const rawAnswers = parsed.data.answers as AnswersMap;
    const result = validateSubmissionAnswers(questions, rawAnswers);

    if (!result.ok) {
      return NextResponse.json(
        { error: "Validation failed", errors: result.errors },
        { status: 400 }
      );
    }

    await connectDB();
    const doc = await Submission.create({
      answers: result.answerRecords,
      answeredKeys: result.answerRecords.map((a) => a.key),
      visiblePath: result.visible.map((q) => q.key),
      email: result.email,
      submittedAt: new Date(),
      pageUrl: parsed.data.pageUrl?.slice(0, 2000),
      userAgent: req.headers.get("user-agent")?.slice(0, 500),
      status: "new",
    });

    return NextResponse.json(
      { id: doc._id.toString(), ok: true },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/submissions", err);
    return NextResponse.json(
      { error: "Failed to save submission" },
      { status: 500 }
    );
  }
}
