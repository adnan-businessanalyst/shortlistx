"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  if (pathname === "/admin/login") return null;

  const links = [
    { href: "/admin/submissions", label: "Submissions" },
    { href: "/admin/questions", label: "Questions Builder" },
  ];

  return (
    <nav className="admin-nav" aria-label="Admin">
      <div className="admin-brand">
        <BrandLogo href="/admin/submissions" height={32} />
        <span className="admin-brand-label mono">Admin</span>
      </div>
      <div className="admin-nav-links">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={pathname.startsWith(l.href) ? "page" : undefined}
          >
            {l.label}
          </Link>
        ))}
        <Link href="/" target="_blank" rel="noopener noreferrer">
          Public site
        </Link>
        <button type="button" className="linkish" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
