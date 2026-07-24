import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth";

export default async function AdminIndexPage() {
  const session = await getSessionFromCookies();
  if (!session) redirect("/admin/login");
  redirect("/admin/submissions");
}
