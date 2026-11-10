"use client";
import { useActionState, startTransition } from "react";
import { submitInquiry, subscribe, type FormState } from "@/app/actions";
import { INTERESTS } from "@/lib/content";
import { CheckCircle2, Send } from "lucide-react";

export function ContactForm({
  propertyId, source = "contact", defaultInterest = "", defaultMessage = "", compact = false,
}: { propertyId?: number; source?: string; defaultInterest?: string; defaultMessage?: string; compact?: boolean }) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitInquiry, {});
  if (state.ok)
    return (
      <div className="flex items-start gap-3 rounded-xl bg-green-light p-5 text-green-dark" role="status">
        <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0" />
        <p className="font-medium">{state.message}</p>
      </div>
    );
  return (
    <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); startTransition(() => action(fd)); }} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="source" value={source} />
      {propertyId && <input type="hidden" name="property_id" value={propertyId} />}
      {compact && defaultInterest && <input type="hidden" name="interest" value={defaultInterest} />}
      <div className="hidden" aria-hidden="true"><label>Website<input name="company_website" tabIndex={-1} autoComplete="off" /></label></div>
      <div className={compact ? "sm:col-span-2" : ""}>
        <label className="label" htmlFor="cf-name">Full name *</label>
        <input id="cf-name" name="name" required className="input" autoComplete="name" />
      </div>
      <div className={compact ? "sm:col-span-2" : ""}>
        <label className="label" htmlFor="cf-phone">Phone / WhatsApp</label>
        <input id="cf-phone" name="phone" className="input" autoComplete="tel" placeholder="+250 7xx xxx xxx" />
      </div>
      <div className={compact ? "sm:col-span-2" : ""}>
        <label className="label" htmlFor="cf-email">Email</label>
        <input id="cf-email" name="email" type="email" className="input" autoComplete="email" />
      </div>
      {!compact && (
        <div>
          <label className="label" htmlFor="cf-country">Country of residence</label>
          <input id="cf-country" name="country" className="input" autoComplete="country-name" placeholder="Rwanda" />
        </div>
      )}
      {!compact && (
        <>
          <div>
            <label className="label" htmlFor="cf-interest">I'm interested in</label>
            <select id="cf-interest" name="interest" className="input" defaultValue={defaultInterest}>
              <option value="">Select…</option>
              {INTERESTS.map((i) => <option key={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="cf-budget">Budget (optional)</label>
            <select id="cf-budget" name="budget" className="input" defaultValue="">
              <option value="">Select…</option>
              <option>Under $50,000</option><option>$50,000 – $150,000</option><option>$150,000 – $500,000</option>
              <option>$500,000 – $1M</option><option>Over $1M</option>
            </select>
          </div>
        </>
      )}
      <div className="sm:col-span-2">
        <label className="label" htmlFor="cf-message">Message</label>
        <textarea id="cf-message" name="message" rows={compact ? 4 : 5} className="input" defaultValue={defaultMessage} />
      </div>
      {state.error && <p className="text-sm font-medium text-red-600 sm:col-span-2" role="alert">{state.error}</p>}
      <div className="sm:col-span-2">
        <button disabled={pending} className="btn-primary w-full sm:w-auto"><Send className="h-4 w-4" />{pending ? "Sending…" : "Send enquiry"}</button>
      </div>
    </form>
  );
}

export function NewsletterForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(subscribe, {});
  if (state.ok) return <p className="text-sm text-green-light">{state.message}</p>;
  return (
    <form action={action} className="flex gap-2">
      <label htmlFor="nl-email" className="sr-only">Email address</label>
      <input id="nl-email" name="email" type="email" required placeholder="Your email" className="w-full rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder:text-white/50 focus:border-orange focus:outline-none" />
      <button disabled={pending} className="shrink-0 rounded-full bg-orange px-4 text-sm font-semibold text-navy-dark hover:bg-[#f5ab48]">Join</button>
      {state.error && <p className="text-xs text-orange">{state.error}</p>}
    </form>
  );
}
