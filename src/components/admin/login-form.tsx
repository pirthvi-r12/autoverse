"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error ?? "Login failed");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#05080f] px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8"
      >
        <h1 className="text-2xl font-bold text-white">Admin login</h1>
        <p className="mt-2 text-sm text-white/55">
          Only authorized admins can access the dashboard.
        </p>
        {params.get("error") === "auth" && (
          <p className="mt-3 text-sm text-amber-300">Please sign in with your admin account.</p>
        )}
        <div className="mt-6 space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin email"
            className="field"
            autoComplete="username"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="field"
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          className="mt-4 w-full rounded-xl bg-accent py-3 font-semibold text-black"
        >
          Sign in as admin
        </button>
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        <p className="mt-4 text-xs text-white/45">
          Credentials from <code>.env.local</code> (<code>ADMIN_DEMO_EMAIL</code> /{" "}
          <code>ADMIN_DEMO_PASSWORD</code>). Database schema lives in <code>sql/</code>.
        </p>
      </form>
    </div>
  );
}
