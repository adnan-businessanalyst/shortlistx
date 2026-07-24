"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  usernameHint: string;
  passwordHint: string;
}

export function LoginForm({ usernameHint, passwordHint }: LoginFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState(usernameHint);
  const [password, setPassword] = useState(passwordHint);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Login failed");
        setPending(false);
        return;
      }
      router.push("/admin/submissions");
      router.refresh();
    } catch {
      setError("Network error");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="form-row">
        <label htmlFor="admin-username">Username ({usernameHint})</label>
        <input
          id="admin-username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="form-row">
        <label htmlFor="admin-password">Password ({passwordHint})</label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : null}
      <button className="btn btn-ink" type="submit" disabled={pending} style={{ marginTop: 8 }}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
      <p className="login-note">
        Pre-prod only — credentials are shown on purpose.
      </p>
    </form>
  );
}
