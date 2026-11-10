import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LOCATIONS } from "@/lib/content";
import { listProperties, getSettings } from "@/lib/data";
import { PropertyCard } from "@/components/PropertyCard";
import { PageHero, CtaBand } from "@/components/Bits";

type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const slug = (await params).slug;
  const l = LOCATIONS.find((x) => x.slug === slug);
  if (!l) return {};
  return { title: l.title, description: l.intro.slice(0, 160), alternates: { canonical: `/locations/${l.slug}` } };
}

export default async function LocationPage({ params }: P) {
  const slug = (await params).slug;
  const l = LOCATIONS.find((x) => x.slug === slug);
  if (!l) notFound();
  const [r, s] = await Promise.all([listProperties({ districts: l.districts, perPage: 24 }), getSettings()]);
  return (
    <>
      <PageHero eyebrow={`Location · ${l.name}`} title={l.title} intro={l.intro} crumbs={[{ name: "Locations", href: "/locations" }, { name: l.name, href: `/locations/${l.slug}` }]} />
      <section className="container-x py-12">
        <div className="mb-8 flex flex-wrap gap-2">
          {l.districts.map((d) => (
            <Link key={d} href={`/properties?district=${encodeURIComponent(d)}`} className="rounded-full bg-sky-light px-4 py-2 text-sm font-medium text-navy hover:bg-navy hover:text-white">{d}</Link>
          ))}
        </div>
        {r.items.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{r.items.map((p) => <PropertyCard key={p.id} p={p} />)}</div>
        ) : (
          <div className="card p-10 text-center">
            <h2 className="text-2xl font-bold text-navy">New {l.name} listings coming soon</h2>
            <p className="mt-2 text-muted">We source off-market opportunities in {l.name}. Tell us what you need.</p>
            <Link href="/contact" className="btn-primary mt-6">Request a search</Link>
          </div>
        )}
      </section>
      <CtaBand phone={s.phone} title={`Looking for property in ${l.name}?`} />
    </>
  );
}
