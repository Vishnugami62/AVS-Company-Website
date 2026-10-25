"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { login } from "@/app/actions/auth-actions";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await login({ email, password });
    if (!res.ok) {
      setBusy(false);
      setError(res.error);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div className="space-y-4">
        <div>
          <label className="field-label">Email</label>
          <input
            type="email"
            className="field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@avscompany.in"
            autoFocus
            autoComplete="username"
          />
        </div>
        <div>
          <label className="field-label">Password</label>
          <input
            type="password"
            className="field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={busy} className="btn btn-gold mt-5 w-full">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : (<><Lock className="h-4 w-4" /> Sign in</>)}
      </button>
    </form>
  );
}
