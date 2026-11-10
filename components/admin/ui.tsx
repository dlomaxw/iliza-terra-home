"use client";
import { createContext, useContext, useActionState, startTransition } from "react";
import { useFormStatus } from "react-dom";
import type { AState } from "@/app/admin/actions";

const Pending = createContext(false);

export function Submit({ children, className = "btn-green" }: { children: React.ReactNode; className?: string }) {
  const fromCtx = useContext(Pending);
  const { pending: fromForm } = useFormStatus();
  const pending = fromCtx || fromForm;
  return <button disabled={pending} className={className}>{pending ? "Saving…" : children}</button>;
}

export function ConfirmButton({ children, message, className = "text-sm font-medium text-red-600 hover:underline" }: { children: React.ReactNode; message: string; className?: string }) {
  return <button className={className} onClick={(e) => { if (!confirm(message)) e.preventDefault(); }}>{children}</button>;
}

/**
 * Form bound to a server action that returns {error|ok}.
 * Uses onSubmit (not the action prop) so React doesn't clear what was typed if saving fails.
 */
export function ActionForm({ action, children, className }: {
  action: (s: AState, f: FormData) => Promise<AState>; children: React.ReactNode; className?: string;
}) {
  const [state, formAction, pending] = useActionState<AState, FormData>(action, {});
  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => formAction(fd));
      }}
    >
      {state.error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700 xl:col-span-3" role="alert">{state.error}</p>}
      {state.ok && <p className="mb-4 rounded-lg bg-green-light px-4 py-3 text-sm font-medium text-green-dark xl:col-span-3" role="status">{state.ok}</p>}
      <Pending.Provider value={pending}>{children}</Pending.Provider>
    </form>
  );
}
