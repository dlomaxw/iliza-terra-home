import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import { featuredProperties, getSettings, listPosts } from "@/lib/data";
import { SERVICES, SECTORS, WHY_RWANDA, LOCATIONS } from "@/lib/content";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyFilters } from "@/components/PropertyFilters";
import { Icon } from "@/components/Icon";
import { CtaBand, SectionHead } from "@/components/Bits";
import { formatDate } from "@/lib/format";


export default async function Home() {
  const [s, props, posts] = await Promise.all([getSettings(), featuredProperties(6), listPosts(3)]);
  const [t1, t2] = splitTagline(s.tagline);
  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-navy-dark">
        <Image src="/brand/hero.jpg" alt="Luxury villa with infinity pool overlooking Lake Kivu at sunset, Rwanda" fill priority sizes="100vw" className="-z-10 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-dark/95 via-navy/75 to-navy/10" />
        <div className="container-x pt-16 pb-36 sm:pt-24 lg:pt-28 lg:pb-44">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-white uppercase backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-green" /> Real Estate · Land · Insurance · Investment — Rwanda
          </p>
          <h1 className="max-w-3xl text-4xl leading-[1.1] font-bold text-white italic sm:text-6xl lg:text-7xl">
            {t1} <span className="text-orange">{t2}</span>
          </h1>
          <p className="mt-6 max-w-xl border-l-4 border-orange pl-4 text-lg text-white/90">{s.hero_subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/properties" className="btn-primary">Explore properties <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/invest-in-rwanda" className="btn-outline">Invest in Rwanda</Link>
          </div>
        </div>
      </section>
      <div className="container-x relative z-10 -mt-24 lg:-mt-28">
        <PropertyFilters sp={{}} hero />
      </div>

      {/* SERVICES */}
      <section className="container-x py-20">
        <SectionHead center eyebrow="What we do" title="One Partner for Every Step of Your Rwanda Investment"
          text="From finding land to building, insuring and managing it — Iliza Terra Homes brings every service together under one roof." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((sv, i) => (
            <Link key={sv.slug} href={`/services/${sv.slug}`} className="group card p-6 transition hover:-translate-y-1 hover:border-green hover:shadow-lg">
              <span className={`grid h-12 w-12 place-items-center rounded-xl ${["bg-green-light text-green", "bg-orange-light text-orange-dark", "bg-sky-light text-sky"][i % 3]}`}>
                <Icon name={sv.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-sans text-base font-bold text-navy">{sv.title}</h3>
              <p className="mt-2 text-sm text-muted">{sv.short}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-green group-hover:gap-2 transition-all">Learn more <ArrowRight className="h-4 w-4" /></span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section className="bg-slate-50 py-20">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHead eyebrow="Featured listings" title="Properties & Land Across Rwanda" />
            <Link href="/properties" className="btn-ghost mb-10">View all properties <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {props.map((p) => <PropertyCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* OPPORTUNITIES */}
      <section className="container-x py-20">
        <SectionHead center eyebrow="Explore" title="Rwanda's Most Promising Opportunities" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SECTORS.map((sc, i) => (
            <Link key={sc.slug} href={`/invest-in-rwanda#${sc.slug}`}
              className={`group relative overflow-hidden rounded-2xl p-6 text-white transition hover:-translate-y-1 ${i === 0 ? "sm:col-span-2 lg:row-span-2" : i >= 5 ? "lg:col-span-2" : ""} ${["bg-navy", "bg-sky", "bg-green", "bg-green-dark", "bg-orange-dark", "bg-navy-dark", "bg-[#0d5a8f]"][i % 7]}`}>
              <Icon name={sc.icon} className={`text-white/90 ${i === 0 ? "h-12 w-12" : "h-8 w-8"}`} />
              <h3 className={`mt-4 font-bold ${i === 0 ? "text-3xl" : "font-sans text-lg"}`}>{sc.title}</h3>
              <p className={`mt-2 text-white/85 ${i === 0 ? "max-w-md text-base" : "text-sm"}`}>{sc.text}</p>
              <Icon name={sc.icon} className="absolute -right-6 -bottom-6 h-32 w-32 text-white/10 transition group-hover:scale-110" />
            </Link>
          ))}
        </div>
      </section>

      {/* WHY RWANDA */}
      <section className="brand-gradient py-20 text-white">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow !text-orange">Why Rwanda</p>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Invest. Develop. Own. Insure — in Rwanda.</h2>
            <p className="mt-4 text-white/85">Rwanda combines political stability, a business-friendly environment and a fast-growing economy with some of Africa's most beautiful landscapes. We help you turn that potential into a secure, well-managed investment.</p>
            <Link href="/invest-in-rwanda" className="btn-primary mt-8">Why invest in Rwanda <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {WHY_RWANDA.map((w) => (
              <li key={w.title} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <Icon name={w.icon} className="h-7 w-7 text-orange" />
                <h3 className="mt-3 font-sans font-bold">{w.title}</h3>
                <p className="mt-1 text-sm text-white/75">{w.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* LOCATIONS */}
      <section className="container-x py-20">
        <SectionHead center eyebrow="Where we work" title="Property & Land by Location" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {LOCATIONS.map((l) => (
            <Link key={l.slug} href={`/locations/${l.slug}`} className="group card flex items-center gap-3 p-5 hover:border-sky hover:shadow-md">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sky-light text-sky"><MapPin className="h-5 w-5" /></span>
              <span><span className="block font-semibold text-navy group-hover:text-sky">{l.name}</span><span className="text-xs text-muted">{l.districts.slice(0, 3).join(", ")}{l.districts.length > 3 ? "…" : ""}</span></span>
            </Link>
          ))}
        </div>
      </section>

      {/* DIASPORA */}
      <section className="bg-green-light py-20">
        <div className="container-x grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Diaspora & international investors</p>
            <h2 className="section-title mt-2">Your Trusted Team on the Ground in Rwanda</h2>
            <p className="mt-4 text-muted">Buying, building or managing property from abroad? We are your eyes and hands in Rwanda — with verified listings, licensed lawyers and transparent reporting.</p>
            <ul className="mt-6 space-y-3">
              {["Video viewings and verified listings", "Secure transactions with licensed lawyers", "Construction supervision with photo & video updates", "Rent collection and full property management"].map((t) => (
                <li key={t} className="flex gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-green" />{t}</li>
              ))}
            </ul>
            <Link href="/services/diaspora-international" className="btn-green mt-8">Diaspora services <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[["8", "Integrated services under one roof"], ["5", "Provinces we source across"], ["Local", "Team based in Kigali"], ["Global", "Clients at home and abroad"]].map(([n, l], i) => (
              <div key={l} className={`rounded-2xl p-6 ${i % 3 === 0 ? "bg-navy text-white" : i % 3 === 1 ? "bg-white text-navy" : "bg-orange text-navy-dark"}`}>
                <p className="font-serif text-4xl font-bold">{n}</p>
                <p className="mt-1 text-sm font-medium opacity-85">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INSIGHTS */}
      {posts.length > 0 && (
        <section className="container-x py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHead eyebrow="Insights" title="Guides for Investing in Rwanda" />
            <Link href="/insights" className="btn-ghost mb-10">All articles <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((p) => (
              <Link key={p.id} href={`/insights/${p.slug}`} className="group card p-6 hover:shadow-lg">
                <p className="text-xs font-semibold text-green uppercase">{p.category} · {formatDate(p.created_at)}</p>
                <h3 className="mt-2 font-sans text-lg font-bold text-navy group-hover:text-sky">{p.title}</h3>
                <p className="mt-2 text-sm text-muted">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <CtaBand phone={s.phone} />
    </>
  );
}

function splitTagline(t: string): [string, string] {
  const m = t.match(/^(.*?\b(?:Meet|meets))\s+(.*)$/);
  if (m) return [m[1], m[2]];
  const words = t.split(" ");
  const half = Math.ceil(words.length / 2);
  return [words.slice(0, half).join(" "), words.slice(half).join(" ")];
}
