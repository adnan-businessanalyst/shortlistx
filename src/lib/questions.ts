import { connectDB } from "@/lib/db";
import { Question } from "@/models/Question";
import { SEED_QUESTIONS } from "@/lib/seed-questions";
import { serializeQuestion } from "@/lib/serialize";
import type { QuestionDoc } from "@/types/question";

export async function ensureSeededQuestions(): Promise<QuestionDoc[]> {
  await connectDB();
  const count = await Question.countDocuments();
  if (count === 0) {
    await Question.insertMany(SEED_QUESTIONS);
  }
  const docs = await Question.find().sort({ order: 1 }).lean();
  return docs.map((d) => serializeQuestion(d as never));
}

export async function getActiveQuestions(): Promise<QuestionDoc[]> {
  const all = await ensureSeededQuestions();
  return all.filter((q) => q.active).sort((a, b) => a.order - b.order);
}

export async function getAllQuestions(): Promise<QuestionDoc[]> {
  await connectDB();
  const docs = await Question.find().sort({ order: 1 }).lean();
  return docs.map((d) => serializeQuestion(d as never));
}

export async function seedQuestions(force = false): Promise<number> {
  await connectDB();
  if (force) {
    await Question.deleteMany({});
  } else {
    const count = await Question.countDocuments();
    if (count > 0) return 0;
  }
  const inserted = await Question.insertMany(SEED_QUESTIONS);
  return inserted.length;
}
