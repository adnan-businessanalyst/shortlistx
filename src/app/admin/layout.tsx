import type { Metadata } from "next";
import { getSessionFromCookies } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionFromCookies();

  return (
    <div className="admin-shell">
      {session ? <AdminNav /> : null}
      <div className={session ? "admin-main" : undefined}>{children}</div>
    </div>
  );
}
