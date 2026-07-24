import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { getAllQuestions } from "@/lib/questions";
import { serializeQuestion } from "@/lib/serialize";
import { questionInputSchema } from "@/lib/validation";
import { Question } from "@/models/Question";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;
  try {
    const questions = await getAllQuestions();
    return NextResponse.json({ questions });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const parsed = questionInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid question", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();
    const existing = await Question.findOne({ key: parsed.data.key });
    if (existing) {
      return NextResponse.json(
        { error: "Key already exists" },
        { status: 409 }
      );
    }

    const maxOrder = await Question.findOne().sort({ order: -1 }).lean();
    const order = parsed.data.order ?? ((maxOrder?.order ?? 0) + 1);

    const needsOptions = [
      "select",
      "single_choice",
      "multi_choice",
    ].includes(parsed.data.type);
    if (needsOptions && (!parsed.data.options || parsed.data.options.length === 0)) {
      return NextResponse.json(
        { error: "Options required for this question type" },
        { status: 400 }
      );
    }

    const doc = await Question.create({
      ...parsed.data,
      order,
      hint: parsed.data.hint || undefined,
      placeholder: parsed.data.placeholder || undefined,
      showIf: parsed.data.showIf || undefined,
      labelWhen: parsed.data.labelWhen || undefined,
    });

    return NextResponse.json(
      { question: serializeQuestion(doc.toObject() as never) },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
