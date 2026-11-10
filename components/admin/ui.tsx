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
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = await compressImages(new FormData(e.currentTarget));
        startTransition(() => formAction(fd));
      }}
    >
      {state.error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700 xl:col-span-3" role="alert">{state.error}</p>}
      {state.ok && <p className="mb-4 rounded-lg bg-green-light px-4 py-3 text-sm font-medium text-green-dark xl:col-span-3" role="status">{state.ok}</p>}
      <Pending.Provider value={pending}>{children}</Pending.Provider>
    </form>
  );
}

/** Resize photos in the browser (max 1800px, WebP) so uploads are fast and small. */
async function compressImages(fd: FormData) {
  const out = new FormData();
  for (const [k, v] of fd.entries()) {
    if (v instanceof File && v.size > 0 && /^image\/(jpeg|png|webp|heic|heif)$/.test(v.type)) {
      try {
        const bmp = await createImageBitmap(v);
        const scale = Math.min(1, 1800 / Math.max(bmp.width, bmp.height));
        const c = document.createElement("canvas");
        c.width = Math.round(bmp.width * scale);
        c.height = Math.round(bmp.height * scale);
        c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
        const blob = await new Promise<Blob | null>((r) => c.toBlob(r, "image/webp", 0.82));
        if (blob && blob.size < v.size) {
          out.append(k, new File([blob], v.name.replace(/\.[^.]+$/, "") + ".webp", { type: "image/webp" }));
          continue;
        }
      } catch {
        /* fall back to the original file */
      }
    }
    out.append(k, v);
  }
  return out;
}
