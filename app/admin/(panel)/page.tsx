import Link from "next/link";
import { Building2, Inbox, FileText, Eye, Mail, AlertTriangle } from "lucide-react";
import { q, q1 } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { AdminHead, Flash, StatusPill } from "@/components/admin/Head";
import type { Inquiry, Property } from "@/lib/types";

export default async function Dashboard({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const one = async (sql: string) => Number((await q1<{ n: number }>(sql))?.n ?? 0);
  const [live, drafts, newInq, monthInq, posts, views, subs, samples] = await Promise.all([
    one("SELECT COUNT(*) n FROM properties WHERE status='published'"),
    one("SELECT COUNT(*) n FROM properties WHERE status='draft'"),
    one("SELECT COUNT(*) n FROM inquiries WHERE status='new'"),
    one("SELECT COUNT(*) n FROM inquiries WHERE created_at >= datetime('now','-30 days')"),
    one("SELECT COUNT(*) n FROM posts WHERE status='published'"),
    one("SELECT COALESCE(SUM(views),0) n FROM properties"),
    one("SELECT COUNT(*) n FROM subscribers"),
    one("SELECT (SELECT COUNT(*) FROM properties WHERE is_sample=1) + (SELECT COUNT(*) FROM posts WHERE is_sample=1) n"),
  ]);
  const recent = await q<Inquiry>("SELECT i.*, p.title AS property_title FROM inquiries i LEFT JOIN properties p ON p.id = i.property_id ORDER BY i.created_at DESC LIMIT 6");
  const top = await q<Property>("SELECT id, title, views, slug FROM properties ORDER BY views DESC LIMIT 5");
  const byInterest = await q<{ interest: string; n: number }>("SELECT COALESCE(NULLIF(interest,''),'Not specified') interest, COUNT(*) n FROM inquiries GROUP BY 1 ORDER BY n DESC LIMIT 6");
  const stats = [
    { label: "Live listings", value: live, sub: `${drafts} drafts`, icon: Building2, href: "/admin/properties", c: "bg-sky-light text-sky" },
    { label: "New enquiries", value: newInq, sub: `${monthInq} in last 30 days`, icon: Inbox, href: "/admin/inquiries?status=new", c: "bg-orange-light text-orange-dark" },
    { label: "Listing views", value: views.toLocaleString(), sub: "all time", icon: Eye, href: "/admin/properties", c: "bg-green-light text-green" },
    { label: "Articles", value: posts, sub: `${subs} subscribers`, icon: FileText, href: "/admin/posts", c: "bg-slate-200 text-navy" },
  ];
  return (
    <>
      <AdminHead title="Dashboard" sub="Overview of your website, listings and leads." action={{ href: "/admin/properties/new", label: "+ Add property" }} />
      <Flash sp={sp} />
      {samples > 0 && (
        <div className="mb-6 flex gap-3 rounded-xl border border-orange/40 bg-orange-light p-4 text-sm text-orange-dark">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <p><b>{samples} sample items</b> were added so the site isn't empty on launch. Edit them with real details and photos, or delete them, before going live. They're marked "Sample" in the lists.</p>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-2xl bg-white p-5 shadow-sm hover:shadow-md">
            <span className={`grid h-10 w-10 place-items-center rounded-xl ${s.c}`}><s.icon className="h-5 w-5" /></span>
            <p className="mt-3 text-3xl font-bold text-navy">{s.value}</p>
            <p className="text-sm font-medium text-ink">{s.label}</p>
            <p className="text-xs text-muted">{s.sub}</p>
          </Link>
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <section className="rounded-2xl bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-3 flex items-center justify-between"><h2 className="font-sans font-bold text-navy">Latest enquiries</h2><Link href="/admin/inquiries" className="text-sm text-sky">View all</Link></div>
          {recent.length ? (
            <ul className="divide-y">
              {recent.map((r) => (
                <li key={r.id}>
                  <Link href={`/admin/inquiries/${r.id}`} className="flex items-center gap-3 py-3 hover:bg-slate-50">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy text-sm font-bold text-white">{r.name[0]?.toUpperCase()}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{r.name} <span className="font-normal text-muted">· {r.interest || r.source}</span></span>
                      <span className="block truncate text-xs text-muted">{r.property_title ? `Re: ${r.property_title}` : r.message}</span>
                    </span>
                    <span className="hidden text-xs text-muted sm:block">{formatDate(r.created_at)}</span>
                    <StatusPill s={r.status} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : <p className="py-6 text-center text-sm text-muted"><Mail className="mx-auto mb-2 h-6 w-6" />No enquiries yet — they'll appear here when visitors contact you.</p>}
        </section>
        <section className="space-y-6">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 font-sans font-bold text-navy">Most viewed listings</h2>
            <ol className="space-y-2 text-sm">
              {top.map((p) => <li key={p.id} className="flex justify-between gap-2"><Link href={`/admin/properties/${p.id}`} className="truncate hover:text-sky">{p.title}</Link><span className="shrink-0 text-muted">{p.views}</span></li>)}
            </ol>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 font-sans font-bold text-navy">Enquiries by interest</h2>
            {byInterest.length ? byInterest.map((b) => {
              const max = Math.max(...byInterest.map((x) => Number(x.n)));
              return (
                <div key={b.interest} className="mb-2 text-sm">
                  <div className="flex justify-between"><span>{b.interest}</span><span className="text-muted">{b.n}</span></div>
                  <div className="mt-1 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-green" style={{ width: `${(Number(b.n) / max) * 100}%` }} /></div>
                </div>
              );
            }) : <p className="text-sm text-muted">No data yet.</p>}
          </div>
        </section>
      </div>
    </>
  );
}
