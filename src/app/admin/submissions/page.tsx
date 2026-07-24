import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth";
import { SubmissionsAdmin } from "@/components/admin/SubmissionsAdmin";

export const metadata: Metadata = {
  title: "Submissions",
  robots: { index: false, follow: false },
};

export default async function AdminSubmissionsPage() {
  const session = await getSessionFromCookies();
  if (!session) redirect("/admin/login");
  return <SubmissionsAdmin />;
}
