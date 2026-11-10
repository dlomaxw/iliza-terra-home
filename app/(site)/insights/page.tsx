import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { listPosts } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { PageHero } from "@/components/Bits";

export const metadata: Metadata = {
  title: "Insights — Guides to Buying Property & Investing in Rwanda",
  description: "Practical guides and market insights on buying property, land, building and investing in Rwanda, for local, diaspora and international investors.",
  alternates: { canonical: "/insights" },
};

export default async function InsightsPage() {
  const posts = await listPosts();
  return (
    <>
      <PageHero eyebrow="Insights" title="Guides & Market Insights" crumbs={[{ name: "Insights", href: "/insights" }]}
        intro="Everything you need to know about buying, building and investing in Rwanda." />
      <section className="container-x grid gap-6 py-16 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <Link key={p.id} href={`/insights/${p.slug}`} className="group card overflow-hidden hover:shadow-lg">
            <div className="relative aspect-[16/9] bg-gradient-to-br from-navy to-green">
              {p.cover && <Image src={p.cover} alt="" fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover" />}
              {!p.cover && <span className="absolute bottom-4 left-5 rounded-full bg-orange px-3 py-1 text-xs font-bold text-navy-dark">{p.category}</span>}
            </div>
            <div className="p-6">
              <p className="text-xs font-semibold text-green uppercase">{p.category} · {formatDate(p.created_at)}</p>
              <h2 className="mt-2 font-sans text-xl font-bold text-navy group-hover:text-sky">{p.title}</h2>
              <p className="mt-2 text-sm text-muted">{p.excerpt}</p>
            </div>
          </Link>
        ))}
        {!posts.length && <p className="text-muted">Articles coming soon.</p>}
      </section>
    </>
  );
}
