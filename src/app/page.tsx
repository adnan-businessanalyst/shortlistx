import { HomeClient } from "@/components/landing/HomeClient";
import { JsonLd } from "@/components/landing/JsonLd";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { getActiveQuestions } from "@/lib/questions";
import type { QuestionDoc } from "@/types/question";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shortlist — HR SaaS for AI CV screening & video interviewing",
  description:
    "Shortlist is HR SaaS for recruiting teams: AI CV screening, ranked shortlists with reasons, and AI-assisted video interviewing. Join the pilot.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  let questions: QuestionDoc[] = [];
  let loadError: string | null = null;
  try {
    questions = await getActiveQuestions();
  } catch {
    loadError = "unavailable";
  }

  return (
    <>
      <JsonLd />
      <LanguageProvider>
        <HomeClient questions={questions} loadError={loadError} />
      </LanguageProvider>
    </>
  );
}
