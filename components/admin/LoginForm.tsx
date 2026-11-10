"use client";
import { useActionState, useState, startTransition } from "react";
import { loginAction, type AState } from "@/app/admin/actions";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [state, action, pending] = useActionState<AState, FormData>(loginAction, {});
  return (
    <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); startTransition(() => action(fd)); }} className="mt-6 space-y-4">
      {state.error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">{state.error}</p>}
      <div><label className="label" htmlFor="email">Email</label><input id="email" name="email" type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="input" /></div>
      <div><label className="label" htmlFor="password">Password</label><input id="password" name="password" type="password" required autoComplete="current-password" className="input" /></div>
      <button disabled={pending} className="btn-primary w-full">{pending ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
