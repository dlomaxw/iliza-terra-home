import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone, Mail } from "lucide-react";
import { q1 } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { AdminHead, Flash } from "@/components/admin/Head";
import { ConfirmButton } from "@/components/admin/ui";
import { WhatsappIcon } from "@/components/Social";
import { updateInquiry, deleteInquiry } from "../../../actions";
import type { Inquiry } from "@/lib/types";

export default async function InquiryPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const r = await q1<Inquiry>("SELECT i.*, p.title AS property_title, p.slug AS property_slug FROM inquiries i LEFT JOIN properties p ON p.id = i.property_id WHERE i.id = ?", [Number((await params).id)]);
  if (!r) notFound();
  const wa = r.phone.replace(/\D/g, "");
  const rows: [string, React.ReactNode][] = [
    ["Email", r.email || "—"], ["Phone", r.phone || "—"], ["Country", r.country || "—"], ["Interest", r.interest || "—"], ["Budget", r.budget || "—"],
    ["Source", r.source], ["Received", formatDate(r.created_at)],
    ["Property", r.property_slug ? <a href={`/properties/${r.property_slug}`} target="_blank" className="text-sky">{r.property_title}</a> : "—"],
  ];
  return (
    <>
      <Link href="/admin/inquiries" className="text-sm text-sky">← All enquiries</Link>
      <AdminHead title={r.name} />
      <Flash sp={await searchParams} />
      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-2xl bg-white p-6 shadow-sm xl:col-span-2">
          <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            {rows.map(([k, v]) => <div key={k}><dt className="text-xs text-muted uppercase">{k}</dt><dd className="font-medium break-all">{v}</dd></div>)}
          </dl>
          <h2 className="mt-6 mb-2 text-xs text-muted uppercase">Message</h2>
          <p className="rounded-xl bg-slate-50 p-4 whitespace-pre-wrap">{r.message || "—"}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {r.phone && <a href={`tel:${r.phone}`} className="btn-ghost"><Phone className="h-4 w-4" />Call</a>}
            {wa && <a href={`https://wa.me/${wa}`} target="_blank" className="btn !bg-[#25d366] text-white"><WhatsappIcon className="h-4 w-4" />WhatsApp</a>}
            {r.email && <a href={`mailto:${r.email}?subject=${encodeURIComponent("Your enquiry with Iliza Terra Homes")}`} className="btn-ghost"><Mail className="h-4 w-4" />Email</a>}
          </div>
        </section>
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <form action={updateInquiry} className="space-y-4">
            <input type="hidden" name="id" value={r.id} />
            <label className="block"><span className="label">Status</span>
              <select name="status" defaultValue={r.status} className="input"><option value="new">New</option><option value="contacted">Contacted</option><option value="qualified">Qualified</option><option value="closed">Closed</option></select>
            </label>
            <label className="block"><span className="label">Internal notes</span><textarea name="notes" rows={6} defaultValue={r.notes} className="input" /></label>
            <button className="btn-green w-full">Save</button>
          </form>
          <form action={deleteInquiry} className="mt-6"><input type="hidden" name="id" value={r.id} /><ConfirmButton message="Delete this enquiry?">Delete enquiry</ConfirmButton></form>
        </section>
      </div>
    </>
  );
}
