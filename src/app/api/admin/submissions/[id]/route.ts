import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Submission } from "@/models/Submission";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;
  await connectDB();
  const doc = await Submission.findById(id).lean();
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    submission: { ...doc, _id: doc._id.toString() },
  });
}

const patchSchema = z.object({
  status: z.enum(["new", "reviewed", "invited", "rejected"]).optional(),
  notes: z.string().max(5000).optional(),
});

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;

  const parsed = patchSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await connectDB();
  const doc = await Submission.findByIdAndUpdate(
    id,
    { $set: parsed.data },
    { new: true }
  ).lean();
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    submission: { ...doc, _id: doc._id.toString() },
  });
}
