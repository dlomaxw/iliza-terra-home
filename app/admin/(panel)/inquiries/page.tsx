import Link from "next/link";
import { Download } from "lucide-react";
import { q } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { AdminHead, Flash, StatusPill } from "@/components/admin/Head";
import type { Inquiry } from "@/lib/types";

const STATUSES = ["new", "contacted", "qualified", "closed"];

export default async function AdminInquiries({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const where: string[] = []; const args: string[] = [];
  if (sp.status) { where.push("i.status = ?"); args.push(sp.status); }
  if (sp.q) { where.push("(i.name ILIKE ? OR i.email ILIKE ? OR i.phone ILIKE ? OR i.message ILIKE ?)"); args.push(...Array(4).fill(`%${sp.q}%`)); }
  const rows = await q<Inquiry>(`SELECT i.*, p.title AS property_title FROM inquiries i LEFT JOIN properties p ON p.id = i.property_id ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY i.created_at DESC LIMIT 500`, args);
  return (
    <>
      <AdminHead title="Enquiries" sub="Leads from the contact form, property pages and service pages." />
      <Flash sp={sp} />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {["", ...STATUSES].map((s) => (
          <Link key={s} href={s ? `/admin/inquiries?status=${s}` : "/admin/inquiries"}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${(sp.status ?? "") === s ? "bg-navy text-white" : "bg-white text-navy shadow-sm"}`}>{s || "All"}</Link>
        ))}
        <form className="ml-auto flex gap-2"><input name="q" defaultValue={sp.q} placeholder="Search…" className="input !py-1.5" /></form>
        <a href="/admin/export?type=inquiries" className="btn-ghost !rounded-lg !px-3 !py-1.5"><Download className="h-4 w-4" />CSV</a>
      </div>
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs text-muted uppercase"><tr><th className="p-3">Contact</th><th className="p-3">Interest / property</th><th className="p-3">Received</th><th className="p-3">Status</th></tr></thead>
          <tbody className="divide-y">
            {rows.map((r) => (
              <tr key={r.id} className={`hover:bg-slate-50 ${r.status === "new" ? "font-medium" : ""}`}>
                <td className="p-3"><Link href={`/admin/inquiries/${r.id}`} className="text-navy hover:text-sky">{r.name}</Link><div className="text-xs font-normal text-muted">{[r.phone, r.email, r.country].filter(Boolean).join(" · ")}</div></td>
                <td className="p-3 text-xs font-normal">{r.interest || "—"}{r.property_title && <div className="text-muted">Re: {r.property_title}</div>}</td>
                <td className="p-3 text-xs font-normal whitespace-nowrap">{formatDate(r.created_at)}</td>
                <td className="p-3"><StatusPill s={r.status} /></td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={4} className="p-10 text-center text-muted">No enquiries.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
