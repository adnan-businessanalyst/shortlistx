import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { getAllQuestions } from "@/lib/questions";
import { serializeQuestion } from "@/lib/serialize";
import { questionInputSchema } from "@/lib/validation";
import { Question } from "@/models/Question";

export const dynamic = "force-dynamic";

function cleanQuestionInput(data: Record<string, unknown>) {
  const next: Record<string, unknown> = { ...data };

  if (next.showIf && typeof next.showIf === "object") {
    const showIf = next.showIf as {
      logic?: string;
      conditions?: Array<{ questionKey?: string }>;
    };
    const conditions = (showIf.conditions ?? []).filter(
      (c) => c.questionKey && String(c.questionKey).trim()
    );
    next.showIf = conditions.length
      ? { logic: showIf.logic === "or" ? "or" : "and", conditions }
      : null;
  }

  if (Array.isArray(next.labelWhen)) {
    const labelWhen = (
      next.labelWhen as Array<{ when?: { questionKey?: string }; label?: string }>
    ).filter((r) => r?.when?.questionKey && r?.label);
    next.labelWhen = labelWhen.length ? labelWhen : null;
  }

  const type = String(next.type ?? "");
  const needsOptions = ["select", "single_choice", "multi_choice"].includes(type);
  if (!needsOptions) {
    delete next.options;
  }

  return next;
}

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
    const body = cleanQuestionInput(await req.json());
    const parsed = questionInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid question",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    await connectDB();

    let key = parsed.data.key;
    const baseKey = key;
    let suffix = 2;
    while (await Question.exists({ key })) {
      key = `${baseKey}_${suffix++}`;
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
      key,
      order,
      type: parsed.data.type,
      label: parsed.data.label,
      required: parsed.data.required,
      active: parsed.data.active,
      hint: parsed.data.hint || undefined,
      placeholder: parsed.data.placeholder || undefined,
      options: needsOptions ? parsed.data.options : undefined,
      showIf: parsed.data.showIf || undefined,
      labelWhen: parsed.data.labelWhen || undefined,
    });

    return NextResponse.json(
      { question: serializeQuestion(doc.toObject() as never) },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/admin/questions", err);
    const message =
      err instanceof Error ? err.message : "Create failed";
    return NextResponse.json(
      { error: "Create failed", details: message },
      { status: 500 }
    );
  }
}
