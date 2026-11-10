import type { Metadata } from "next";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { getSettings } from "@/lib/data";
import { PageHero, CtaBand, SectionHead } from "@/components/Bits";

export const metadata: Metadata = {
  title: "About Iliza Terra Homes — Your Trusted Real Estate & Investment Partner in Rwanda",
  description: "Iliza Terra Homes is a Kigali-based real estate, land, insurance and investment company connecting investors, landowners and developers to Rwanda's most strategic opportunities.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  ["Integrity", "Every listing and partner is verified before we present it."],
  ["Transparency", "Clear fees, clear documents and regular reporting."],
  ["Local expertise", "Deep knowledge of Rwanda's land, property and regulations."],
  ["Long-term partnership", "We stay with you from first visit to steady income."],
];

export default async function AboutPage() {
  const s = await getSettings();
  return (
    <>
      <PageHero eyebrow="About us" title="Your Trusted Partner in Rwanda" crumbs={[{ name: "About", href: "/about" }]} intro={s.hero_subtitle} />
      <section className="container-x grid items-center gap-12 py-16 lg:grid-cols-2">
        <div>
          <SectionHead eyebrow="Who we are" title="Connecting Capital to Rwanda's Best Opportunities" />
          <div className="space-y-4 text-slate-700">
            <p>Iliza Terra Homes is a Kigali-based real estate and investment company. We bring together property brokerage, land sourcing, insurance brokerage, project development, legal support and property management, so investors have one accountable partner from start to finish.</p>
            <p>Our clients include Rwandan families, the Rwandan diaspora and international investors looking for secure, well-structured opportunities — from a family home in Kigali to lakefront land on Lake Kivu or a hospitality project near Volcanoes National Park.</p>
            <p>The name reflects our promise: to bring light (<em>iliza</em>) to land and homes (<em>terra homes</em>) — making every opportunity clear, verified and ready for investment.</p>
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
          <Image src="/brand/hero.jpg" alt="Lakefront villa overlooking Lake Kivu at sunset" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
        </div>
      </section>
      <section className="bg-green-light py-16">
        <div className="container-x">
          <SectionHead center eyebrow="Our values" title="How We Work" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(([t, d]) => (
              <div key={t} className="rounded-2xl bg-white p-6 shadow-sm">
                <CheckCircle2 className="h-7 w-7 text-green" />
                <h3 className="mt-3 font-sans text-lg font-bold text-navy">{t}</h3>
                <p className="mt-1 text-sm text-muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaBand phone={s.phone} />
    </>
  );
}
