import type { Metadata } from "next";
import { listProperties, getSettings } from "@/lib/data";
import { LISTING_TYPES, CATEGORIES, labelOf } from "@/lib/content";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyFilters } from "@/components/PropertyFilters";
import { PageHero, CtaBand } from "@/components/Bits";
import { Pagination } from "@/components/Pagination";
import { JsonLd } from "@/components/JsonLd";
import { absUrl } from "@/lib/format";

type SP = Promise<Record<string, string | undefined>>;

function heading(sp: Record<string, string | undefined>) {
  const cat = sp.category ? labelOf(CATEGORIES, sp.category).replace(" / ", " & ") : "Property & Land";
  const type = sp.type ? labelOf(LISTING_TYPES, sp.type) : "for Sale & Rent";
  const where = sp.district ? `in ${sp.district}, Rwanda` : "in Rwanda";
  return `${cat} ${type} ${where}`;
}

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const sp = await searchParams;
  const title = heading(sp);
  const canon = new URLSearchParams();
  for (const k of ["type", "category", "district"]) if (sp[k]) canon.set(k, sp[k]!);
  const qs = canon.toString();
  return {
    title,
    description: `Browse ${title.toLowerCase()} with Iliza Terra Homes — verified houses, apartments, land, lakefront and commercial property in Kigali, Lake Kivu and across Rwanda.`,
    alternates: { canonical: `/properties${qs ? `?${qs}` : ""}` },
    robots: sp.q || sp.sort || sp.page || sp.min || sp.max || sp.beds ? { index: false, follow: true } : undefined,
  };
}

export default async function PropertiesPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const s = await getSettings();
  const r = await listProperties({
    type: sp.type, category: sp.category, district: sp.district, q: sp.q, sort: sp.sort,
    min: Number(sp.min) || undefined, max: Number(sp.max) || undefined, beds: Number(sp.beds) || undefined, page: Number(sp.page) || 1,
  });
  return (
    <>
      <PageHero eyebrow="Listings" title={heading(sp)} crumbs={[{ name: "Properties", href: "/properties" }]}
        intro="Verified houses, apartments, land, lakefront, hospitality and commercial property across Rwanda." />
      <div className="container-x relative z-10 -mt-8"><PropertyFilters sp={sp} /></div>
      <section className="container-x py-12">
        <p className="mb-6 text-sm text-muted">{r.total} {r.total === 1 ? "property" : "properties"} found</p>
        {r.items.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{r.items.map((p) => <PropertyCard key={p.id} p={p} />)}</div>
        ) : (
          <div className="card p-10 text-center">
            <h2 className="text-2xl font-bold text-navy">No listings match your search yet</h2>
            <p className="mt-2 text-muted">Many of our best opportunities are off-market. Tell us what you are looking for and we'll source it for you.</p>
            <a href="/contact" className="btn-primary mt-6">Request a property search</a>
          </div>
        )}
        <Pagination page={r.page} pages={r.pages} base="/properties" sp={sp} />
      </section>
      <CtaBand phone={s.phone} title="Can't find what you're looking for?" text="Tell us your budget and goals — we source verified on- and off-market opportunities across Rwanda." />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "ItemList", name: heading(sp),
        itemListElement: r.items.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: absUrl(`/properties/${p.slug}`), name: p.title })),
      }} />
    </>
  );
}
