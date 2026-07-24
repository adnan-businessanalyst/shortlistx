import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { serializeQuestion } from "@/lib/serialize";
import { questionInputSchema } from "@/lib/validation";
import { Question } from "@/models/Question";
import { Submission } from "@/models/Submission";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;
  await connectDB();
  const doc = await Question.findById(id).lean();
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ question: serializeQuestion(doc as never) });
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;

  try {
    const raw = await req.json();
    // Drop empty branching rows before validation
    if (raw?.showIf?.conditions) {
      raw.showIf.conditions = raw.showIf.conditions.filter(
        (c: { questionKey?: string }) => c?.questionKey?.trim()
      );
      if (!raw.showIf.conditions.length) raw.showIf = null;
    }
    if (Array.isArray(raw?.labelWhen)) {
      raw.labelWhen = raw.labelWhen.filter(
        (r: { when?: { questionKey?: string }; label?: string }) =>
          r?.when?.questionKey?.trim() && r?.label?.trim()
      );
      if (!raw.labelWhen.length) raw.labelWhen = null;
    }
    if (
      raw?.type &&
      !["select", "single_choice", "multi_choice"].includes(raw.type)
    ) {
      delete raw.options;
    }

    const parsed = questionInputSchema.partial().safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid question", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();
    const existing = await Question.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (parsed.data.key && parsed.data.key !== existing.key) {
      const used = await Submission.exists({ "answers.key": existing.key });
      if (used) {
        return NextResponse.json(
          {
            error:
              "Key is locked because submissions already reference it. Duplicate instead.",
          },
          { status: 409 }
        );
      }
      const clash = await Question.findOne({ key: parsed.data.key });
      if (clash) {
        return NextResponse.json(
          { error: "Key already exists" },
          { status: 409 }
        );
      }
    }

    const type = parsed.data.type ?? existing.type;
    const options = parsed.data.options ?? existing.options;
    const needsOptions = ["select", "single_choice", "multi_choice"].includes(
      type
    );
    if (needsOptions && (!options || options.length === 0)) {
      return NextResponse.json(
        { error: "Options required for this question type" },
        { status: 400 }
      );
    }

    Object.assign(existing, {
      ...parsed.data,
      hint: parsed.data.hint === null ? undefined : parsed.data.hint ?? existing.hint,
      placeholder:
        parsed.data.placeholder === null
          ? undefined
          : parsed.data.placeholder ?? existing.placeholder,
      showIf:
        parsed.data.showIf === null
          ? undefined
          : parsed.data.showIf ?? existing.showIf,
      labelWhen:
        parsed.data.labelWhen === null
          ? undefined
          : parsed.data.labelWhen ?? existing.labelWhen,
    });

    await existing.save();
    return NextResponse.json({
      question: serializeQuestion(existing.toObject() as never),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;

  await connectDB();
  const existing = await Question.findById(id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const used = await Submission.exists({ "answers.key": existing.key });
  if (used) {
    return NextResponse.json(
      {
        error:
          "Cannot delete: submissions reference this key. Deactivate instead.",
        referenced: true,
      },
      { status: 409 }
    );
  }

  await Question.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
