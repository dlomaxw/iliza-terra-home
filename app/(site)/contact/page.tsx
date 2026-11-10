import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { getSettings } from "@/lib/data";
import { PageHero } from "@/components/Bits";
import { ContactForm } from "@/components/Forms";
import { WhatsappIcon } from "@/components/Social";
import { INTERESTS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact Iliza Terra Homes — Kigali, Rwanda",
  description: "Contact Iliza Terra Homes in Kigali for property, land, insurance, construction and investment enquiries in Rwanda. Call, WhatsApp or send us a message.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const [s, sp] = await Promise.all([getSettings(), searchParams]);
  const interest = INTERESTS.includes(sp.interest ?? "") ? sp.interest : "";
  const items = [
    { icon: Phone, label: "Call us", value: s.phone, href: `tel:${s.phone.replace(/\s/g, "")}` },
    { icon: WhatsappIcon, label: "WhatsApp", value: s.phone, href: `https://wa.me/${s.whatsapp.replace(/\D/g, "")}` },
    { icon: Mail, label: "Email", value: s.email, href: `mailto:${s.email}` },
    { icon: MapPin, label: "Visit", value: s.address },
    { icon: Clock, label: "Hours", value: s.hours },
  ];
  return (
    <>
      <PageHero eyebrow="Contact" title="Let's Build Your Next Opportunity in Rwanda" crumbs={[{ name: "Contact", href: "/contact" }]}
        intro="Tell us what you are looking for — buying, selling, investing, building or insuring. We reply within one business day." />
      <section className="container-x grid gap-10 py-16 lg:grid-cols-3">
        <div className="space-y-4">
          {items.map((it) => {
            const inner = (
              <>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-orange-light text-orange-dark"><it.icon className="h-5 w-5" /></span>
                <span><span className="block text-xs font-semibold tracking-wider text-muted uppercase">{it.label}</span><span className="font-medium break-all text-navy">{it.value}</span></span>
              </>
            );
            return it.href ? (
              <a key={it.label} href={it.href} target={it.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="card flex items-center gap-4 p-4 hover:border-orange">{inner}</a>
            ) : (
              <div key={it.label} className="card flex items-center gap-4 p-4">{inner}</div>
            );
          })}
        </div>
        <div className="card p-6 sm:p-8 lg:col-span-2">
          <h2 className="font-serif text-2xl font-bold text-navy">Send us a message</h2>
          <p className="mt-1 mb-6 text-sm text-muted">Fields marked * are required.</p>
          <ContactForm defaultInterest={interest} />
        </div>
      </section>
      <section className="container-x pb-16">
        <div className="aspect-[21/9] overflow-hidden rounded-3xl">
          <iframe title="Iliza Terra Homes location in Kigali" loading="lazy" className="h-full w-full"
            src={`https://www.google.com/maps?q=${encodeURIComponent("KN 87 St, Kigali, Rwanda")}&z=15&output=embed`} />
        </div>
      </section>
    </>
  );
}
