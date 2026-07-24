import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { serializeQuestion } from "@/lib/serialize";
import { Question } from "@/models/Question";

export const dynamic = "force-dynamic";

const schema = z.object({ id: z.string() });

export async function POST(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    await connectDB();
    const source = await Question.findById(parsed.data.id).lean();
    if (!source) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    let newKey = `${source.key}_copy`;
    let n = 2;
    while (await Question.exists({ key: newKey })) {
      newKey = `${source.key}_copy_${n++}`;
    }

    const maxOrder = await Question.findOne().sort({ order: -1 }).lean();
    const doc = await Question.create({
      key: newKey,
      order: (maxOrder?.order ?? 0) + 1,
      type: source.type,
      label: `${source.label} (copy)`,
      hint: source.hint,
      placeholder: source.placeholder,
      required: source.required,
      options: source.options,
      active: false,
      showIf: source.showIf,
      labelWhen: source.labelWhen,
    });

    return NextResponse.json(
      { question: serializeQuestion(doc.toObject() as never) },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Duplicate failed" }, { status: 500 });
  }
}
