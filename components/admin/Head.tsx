import Link from "next/link";
export function AdminHead({ title, sub, action }: { title: string; sub?: string; action?: { href: string; label: string } }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-serif text-3xl font-bold text-navy">{title}</h1>
        {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
      </div>
      {action && <Link href={action.href} className="btn-primary">{action.label}</Link>}
    </div>
  );
}
export function Flash({ sp }: { sp: Record<string, string | undefined> }) {
  const msg = sp.saved ? "Saved successfully." : sp.deleted ? "Deleted." : sp.error === "forbidden" ? "Only administrators can open that page." : null;
  if (!msg) return null;
  return <p className={`mb-5 rounded-lg px-4 py-3 text-sm font-medium ${sp.error ? "bg-red-50 text-red-700" : "bg-green-light text-green-dark"}`}>{msg}</p>;
}
export function StatusPill({ s }: { s: string }) {
  const c: Record<string, string> = {
    published: "bg-green-light text-green-dark", draft: "bg-slate-200 text-slate-700", sold: "bg-red-100 text-red-700",
    new: "bg-orange-light text-orange-dark", contacted: "bg-sky-light text-sky", qualified: "bg-green-light text-green-dark", closed: "bg-slate-200 text-slate-600",
  };
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${c[s] ?? "bg-slate-100"}`}>{s}</span>;
}
