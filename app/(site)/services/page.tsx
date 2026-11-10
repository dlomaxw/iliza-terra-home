import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/content";
import { getSettings } from "@/lib/data";
import { Icon } from "@/components/Icon";
import { PageHero, CtaBand } from "@/components/Bits";

export const metadata: Metadata = {
  title: "Real Estate, Land, Insurance & Construction Services in Rwanda",
  description: "Property brokerage, land sourcing, insurance brokerage, project development, legal support, property management and diaspora services in Kigali and across Rwanda.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const s = await getSettings();
  return (
    <>
      <PageHero eyebrow="Our services" title="Everything You Need to Invest, Build, Own and Insure in Rwanda" crumbs={[{ name: "Services", href: "/services" }]}
        intro="Eight integrated services delivered by one accountable team — so your investment moves from idea to income without the usual headaches." />
      <section className="container-x grid gap-6 py-16 md:grid-cols-2">
        {SERVICES.map((sv, i) => (
          <Link key={sv.slug} href={`/services/${sv.slug}`} className="group card flex gap-5 p-7 transition hover:border-green hover:shadow-lg">
            <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${["bg-green-light text-green", "bg-orange-light text-orange-dark", "bg-sky-light text-sky"][i % 3]}`}><Icon name={sv.icon} className="h-7 w-7" /></span>
            <div>
              <h2 className="font-sans text-xl font-bold text-navy group-hover:text-sky">{sv.title}</h2>
              <p className="mt-2 text-muted">{sv.short}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-green">Read more <ArrowRight className="h-4 w-4" /></span>
            </div>
          </Link>
        ))}
      </section>
      <CtaBand phone={s.phone} />
    </>
  );
}
