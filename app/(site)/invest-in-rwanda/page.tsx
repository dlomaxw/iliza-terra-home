import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SECTORS, WHY_RWANDA } from "@/lib/content";
import { getSettings } from "@/lib/data";
import { Icon } from "@/components/Icon";
import { PageHero, CtaBand, SectionHead } from "@/components/Bits";

export const metadata: Metadata = {
  title: "Invest in Rwanda — Real Estate, Tourism, Agribusiness & Energy Opportunities",
  description: "Why invest in Rwanda and where: Kigali real estate, Lake Kivu and islands, tourism and hospitality, agribusiness, renewable energy, logistics and MICE. Partner with Iliza Terra Homes.",
  alternates: { canonical: "/invest-in-rwanda" },
};

const STEPS = [
  ["Discovery call", "We learn your goals, budget, timeline and risk appetite."],
  ["Opportunity shortlist", "We source and pre-verify suitable properties, land or partners."],
  ["Site visits & due diligence", "In person or by video, with title, UPI, zoning and legal checks."],
  ["Structure & transact", "Agreements, company set-up, financing and insurance, with licensed lawyers."],
  ["Build & manage", "Construction management, then leasing and property management for income."],
];

export default async function InvestPage() {
  const s = await getSettings();
  return (
    <>
      <PageHero eyebrow="Invest in Rwanda" title="Where Opportunities Meet Investment" crumbs={[{ name: "Invest in Rwanda", href: "/invest-in-rwanda" }]}
        intro="Rwanda offers stability, security and growth in the heart of East Africa. We connect investors, landowners and developers to the country's most strategic opportunities." />
      <section className="container-x py-16">
        <SectionHead eyebrow="Why Rwanda" title="Five Reasons Investors Choose Rwanda" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {WHY_RWANDA.map((w, i) => (
            <div key={w.title} className="card p-6">
              <span className={`grid h-12 w-12 place-items-center rounded-xl ${["bg-green-light text-green", "bg-orange-light text-orange-dark", "bg-sky-light text-sky"][i % 3]}`}><Icon name={w.icon} className="h-6 w-6" /></span>
              <h3 className="mt-4 font-sans font-bold text-navy">{w.title}</h3>
              <p className="mt-2 text-sm text-muted">{w.text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-slate-50 py-16">
        <div className="container-x">
          <SectionHead eyebrow="Sectors" title="Rwanda's Most Promising Opportunities" />
          <div className="space-y-5">
            {SECTORS.map((sc, i) => (
              <article id={sc.slug} key={sc.slug} className="card flex scroll-mt-32 flex-col gap-5 p-7 sm:flex-row sm:items-center">
                <span className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-white ${["bg-navy", "bg-sky", "bg-green", "bg-green-dark", "bg-orange-dark", "bg-navy-dark", "bg-[#0d5a8f]"][i]}`}><Icon name={sc.icon} className="h-8 w-8" /></span>
                <div className="flex-1">
                  <h3 className="font-sans text-xl font-bold text-navy">{sc.title}</h3>
                  <p className="mt-1 text-muted">{sc.text}</p>
                </div>
                <Link href={`/contact?interest=Investment%20partnership`} className="btn-ghost shrink-0">Discuss <ArrowRight className="h-4 w-4" /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="container-x py-16">
        <SectionHead eyebrow="How it works" title="Your Investment Journey with Iliza Terra Homes" />
        <ol className="grid gap-5 md:grid-cols-5">
          {STEPS.map(([t, d], i) => (
            <li key={t} className="relative rounded-2xl border-t-4 border-orange bg-white p-6 shadow-sm">
              <span className="font-serif text-4xl font-bold text-green">{i + 1}</span>
              <h3 className="mt-2 font-sans font-bold text-navy">{t}</h3>
              <p className="mt-1 text-sm text-muted">{d}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-sm text-muted">Investors can also find official information on incentives and business registration from the <a className="text-sky underline" href="https://rdb.rw" target="_blank" rel="noopener noreferrer">Rwanda Development Board</a>.</p>
      </section>
      <CtaBand phone={s.phone} />
    </>
  );
}
