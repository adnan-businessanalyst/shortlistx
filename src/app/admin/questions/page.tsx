import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth";
import { getAllQuestions, ensureSeededQuestions } from "@/lib/questions";
import { QuestionsBuilder } from "@/components/admin/QuestionsBuilder";
import type { QuestionDoc } from "@/types/question";

export const metadata: Metadata = {
  title: "Questions Builder",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminQuestionsPage() {
  const session = await getSessionFromCookies();
  if (!session) redirect("/admin/login");

  let questions: QuestionDoc[] = [];
  try {
    await ensureSeededQuestions();
    questions = await getAllQuestions();
  } catch (err) {
    console.error(err);
  }

  return <QuestionsBuilder initialQuestions={questions} />;
}
