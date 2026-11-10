import Link from "next/link";
export function Pagination({ page, pages, base, sp }: { page: number; pages: number; base: string; sp: Record<string, string | undefined> }) {
  if (pages <= 1) return null;
  const href = (p: number) => {
    const u = new URLSearchParams(Object.entries(sp).filter(([k, v]) => v && k !== "page") as [string, string][]);
    if (p > 1) u.set("page", String(p));
    const qs = u.toString();
    return qs ? `${base}?${qs}` : base;
  };
  return (
    <nav className="mt-12 flex justify-center gap-2" aria-label="Pagination">
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <Link key={p} href={href(p)} aria-current={p === page ? "page" : undefined}
          className={`grid h-10 w-10 place-items-center rounded-full text-sm font-semibold ${p === page ? "bg-navy text-white" : "bg-white text-navy ring-1 ring-slate-200 hover:ring-navy"}`}>{p}</Link>
      ))}
    </nav>
  );
}
