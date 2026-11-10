import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { q } from "@/lib/db";
import { formatPrice, parseImages } from "@/lib/format";
import { CATEGORIES, LISTING_TYPES, labelOf } from "@/lib/content";
import { AdminHead, Flash, StatusPill } from "@/components/admin/Head";
import { quickPropertyStatus } from "../../actions";
import type { Property } from "@/lib/types";

export default async function AdminProperties({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const where: string[] = []; const args: string[] = [];
  if (sp.status) { where.push("status = ?"); args.push(sp.status); }
  if (sp.q) { where.push("(title LIKE ? OR area LIKE ? OR district LIKE ?)"); args.push(`%${sp.q}%`, `%${sp.q}%`, `%${sp.q}%`); }
  const rows = await q<Property>(`SELECT * FROM properties ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY updated_at DESC`, args);
  return (
    <>
      <AdminHead title="Properties" sub={`${rows.length} listings`} action={{ href: "/admin/properties/new", label: "+ Add property" }} />
      <Flash sp={sp} />
      <form className="mb-4 flex flex-wrap gap-2">
        <input name="q" defaultValue={sp.q} placeholder="Search title, area, district…" className="input max-w-xs" />
        <select name="status" defaultValue={sp.status ?? ""} className="input max-w-[10rem]">
          <option value="">All statuses</option><option value="published">Published</option><option value="draft">Draft</option><option value="sold">Sold / Let</option>
        </select>
        <button className="btn-ghost !rounded-lg !py-2">Filter</button>
      </form>
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs text-muted uppercase"><tr><th className="p-3">Property</th><th className="p-3">Type</th><th className="p-3">Price</th><th className="p-3">Status</th><th className="p-3 text-center">Featured</th><th className="p-3 text-right">Views</th><th className="p-3"></th></tr></thead>
          <tbody className="divide-y">
            {rows.map((p) => {
              const img = parseImages(p.images)[0];
              return (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="p-3">
                    <Link href={`/admin/properties/${p.id}`} className="flex items-center gap-3">
                      <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-navy to-green">{img && <Image src={img} alt="" fill sizes="64px" className="object-cover" />}</span>
                      <span><span className="block font-medium text-navy hover:text-sky">{p.title}</span><span className="text-xs text-muted">{[p.area, p.district].filter(Boolean).join(", ")}{p.is_sample ? <b className="ml-2 rounded bg-orange-light px-1.5 text-orange-dark">Sample</b> : null}</span></span>
                    </Link>
                  </td>
                  <td className="p-3 text-xs">{labelOf(CATEGORIES, p.category)}<br /><span className="text-muted">{labelOf(LISTING_TYPES, p.listing_type)}</span></td>
                  <td className="p-3 whitespace-nowrap">{formatPrice(p.price, p.currency, p.price_period)}</td>
                  <td className="p-3">
                    <form action={quickPropertyStatus} className="flex items-center gap-1">
                      <input type="hidden" name="id" value={p.id} /><input type="hidden" name="field" value="status" />
                      <StatusPill s={p.status} />
                      <select name="value" defaultValue={p.status} className="rounded border-slate-200 text-xs">
                        <option value="published">Publish</option><option value="draft">Draft</option><option value="sold">Sold/Let</option>
                      </select>
                      <button className="text-xs text-sky">Set</button>
                    </form>
                  </td>
                  <td className="p-3 text-center">
                    <form action={quickPropertyStatus}><input type="hidden" name="id" value={p.id} /><input type="hidden" name="field" value="featured" />
                      <button aria-label="Toggle featured"><Star className={`h-5 w-5 ${p.featured ? "fill-orange text-orange" : "text-slate-300"}`} /></button>
                    </form>
                  </td>
                  <td className="p-3 text-right">{p.views}</td>
                  <td className="p-3 text-right whitespace-nowrap"><Link href={`/admin/properties/${p.id}`} className="font-medium text-sky">Edit</Link>{p.status !== "draft" && <a href={`/properties/${p.slug}`} target="_blank" className="ml-3 text-muted">View</a>}</td>
                </tr>
              );
            })}
            {!rows.length && <tr><td colSpan={7} className="p-10 text-center text-muted">No properties found.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
