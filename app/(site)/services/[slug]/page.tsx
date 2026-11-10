import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { SERVICES } from "@/lib/content";
import { getSettings } from "@/lib/data";
import { Icon } from "@/components/Icon";
import { PageHero, CtaBand } from "@/components/Bits";
import { ContactForm } from "@/components/Forms";
import { JsonLd } from "@/components/JsonLd";
import { absUrl } from "@/lib/format";

type P = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return SERVICES.map((s) => ({ slug: s.slug })); }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const slug = (await params).slug;
  const s = SERVICES.find((x) => x.slug === slug);
  if (!s) return {};
  return { title: `${s.title} in Rwanda`, description: s.short, keywords: s.keywords, alternates: { canonical: `/services/${s.slug}` } };
}

export default async function ServicePage({ params }: P) {
  const slug = (await params).slug;
  const sv = SERVICES.find((x) => x.slug === slug);
  if (!sv) notFound();
  const st = await getSettings();
  const interestMap: Record<string, string> = {
    "investor-connections": "Investment partnership", "land-sourcing": "Land acquisition", "property-brokerage": "Buying property",
    "insurance-brokerage": "Insurance", "project-development": "Project development & construction", "legal-transaction-support": "Legal & transaction support",
    "asset-property-management": "Property management", "diaspora-international": "Buying property",
  };
  return (
    <>
      <PageHero eyebrow="Services" title={sv.title} intro={sv.short} crumbs={[{ name: "Services", href: "/services" }, { name: sv.title, href: `/services/${sv.slug}` }]} />
      <section className="container-x grid gap-12 py-16 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-green-light text-green"><Icon name={sv.icon} className="h-8 w-8" /></span>
          <p className="mt-6 text-lg leading-relaxed text-slate-700">{sv.intro}</p>
          <h2 className="mt-10 text-2xl font-bold text-navy">How we help</h2>
          <ul className="mt-4 space-y-3">
            {sv.points.map((pt) => <li key={pt} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green" />{pt}</li>)}
          </ul>
          <h2 className="mt-10 text-2xl font-bold text-navy">Other services</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {SERVICES.filter((x) => x.slug !== sv.slug).map((x) => (
              <Link key={x.slug} href={`/services/${x.slug}`} className="rounded-full bg-sky-light px-4 py-2 text-sm font-medium text-navy hover:bg-navy hover:text-white">{x.title}</Link>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="card p-6 lg:sticky lg:top-32">
            <h2 className="font-serif text-2xl font-bold text-navy">Talk to our team</h2>
            <p className="mt-1 mb-5 text-sm text-muted">Tell us about your plans — we reply within one business day.</p>
            <ContactForm compact source={`service:${sv.slug}`} defaultInterest={interestMap[sv.slug]} />
          </div>
        </div>
      </section>
      <CtaBand phone={st.phone} />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "Service", name: sv.title, description: sv.intro, url: absUrl(`/services/${sv.slug}`),
        provider: { "@id": absUrl("/#organization") }, areaServed: { "@type": "Country", name: "Rwanda" }, serviceType: sv.title,
      }} />
    </>
  );
}
