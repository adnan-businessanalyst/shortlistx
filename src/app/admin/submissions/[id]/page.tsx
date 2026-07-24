import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth";
import { SubmissionDetailClient } from "@/components/admin/SubmissionDetailClient";

export const metadata: Metadata = {
  title: "Submission",
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ id: string }> };

export default async function SubmissionDetailPage({ params }: Props) {
  const session = await getSessionFromCookies();
  if (!session) redirect("/admin/login");
  const { id } = await params;
  return <SubmissionDetailClient id={id} />;
}
