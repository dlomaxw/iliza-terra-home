import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { JsonLd } from "./JsonLd";
import { absUrl } from "@/lib/format";

export function PageHero({ eyebrow, title, intro, crumbs }: {
  eyebrow?: string; title: string; intro?: string; crumbs: { name: string; href: string }[];
}) {
  const all = [{ name: "Home", href: "/" }, ...crumbs];
  return (
    <section className="relative overflow-hidden brand-gradient text-white">
      <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-green/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-orange/20 blur-3xl" />
      <div className="container-x relative py-14 lg:py-20">
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex flex-wrap items-center gap-1 text-xs text-white/70">
            {all.map((c, i) => (
              <li key={c.href} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3 w-3" />}
                {i < all.length - 1 ? <Link href={c.href} className="hover:text-orange">{c.name}</Link> : <span className="text-white">{c.name}</span>}
              </li>
            ))}
          </ol>
        </nav>
        {eyebrow && <p className="mb-2 text-xs font-bold tracking-[0.18em] text-orange uppercase">{eyebrow}</p>}
        <h1 className="max-w-4xl text-3xl font-bold sm:text-5xl">{title}</h1>
        {intro && <p className="mt-4 max-w-3xl text-base text-white/85 sm:text-lg">{intro}</p>}
      </div>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: absUrl(c.href) })),
      }} />
    </section>
  );
}

export function CtaBand({ title = "Let's Build Your Next Opportunity in Rwanda.", text, phone }: { title?: string; text?: string; phone: string }) {
  return (
    <section className="container-x my-20">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-dark via-green to-[#2f8f6b] px-6 py-12 text-white sm:px-12">
        <div className="pointer-events-none absolute -right-10 -bottom-16 h-64 w-64 rounded-full bg-orange/30 blur-2xl" />
        <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-2xl font-bold italic sm:text-3xl">{title}</h2>
            <p className="mt-2 max-w-2xl text-white/90">{text ?? "Speak to our team about buying, building, investing or insuring in Rwanda — locally or from abroad."}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="btn-primary">Get in touch <ArrowRight className="h-4 w-4" /></Link>
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="btn-outline">{phone}</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, text, center = false }: { eyebrow: string; title: string; text?: string; center?: boolean }) {
  return (
    <div className={`mb-10 ${center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="section-title mt-2">{title}</h2>
      {text && <p className="mt-3 text-muted">{text}</p>}
      <div className={`mt-4 h-1 w-16 rounded-full bg-orange ${center ? "mx-auto" : ""}`} />
    </div>
  );
}
