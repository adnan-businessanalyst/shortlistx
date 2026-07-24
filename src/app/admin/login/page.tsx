import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionFromCookies, getAdminCredentials } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";
import { BrandLogo } from "@/components/BrandLogo";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await getSessionFromCookies();
  if (session) redirect("/admin/submissions");
  const creds = getAdminCredentials();

  return (
    <div className="login-wrap">
      <div className="admin-card">
        <div style={{ marginBottom: 20 }}>
          <BrandLogo href="/" height={40} />
          <p className="mono" style={{ marginTop: 8, fontSize: "0.75rem", color: "var(--muted)" }}>
            Admin
          </p>
        </div>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 8 }}>
          Sign in
        </h1>
        <p style={{ color: "var(--muted)", marginBottom: 20, fontSize: "0.95rem" }}>
          Control panel for the discovery survey and Questions Builder.
        </p>
        <LoginForm
          usernameHint={creds.username}
          passwordHint={creds.password}
        />
      </div>
    </div>
  );
}
