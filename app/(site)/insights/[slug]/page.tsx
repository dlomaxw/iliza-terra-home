import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { getPost, getSettings, listPosts } from "@/lib/data";
import { formatDate, absUrl } from "@/lib/format";
import { PageHero, CtaBand } from "@/components/Bits";
import { JsonLd } from "@/components/JsonLd";
import Link from "next/link";

type P = { params: Promise<{ slug: string }> };
export const revalidate = 300;

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const p = await getPost((await params).slug);
  if (!p) return { title: "Article not found" };
  return {
    title: p.meta_title || p.title, description: p.meta_description || p.excerpt,
    alternates: { canonical: `/insights/${p.slug}` },
    openGraph: { type: "article", title: p.title, description: p.excerpt, publishedTime: p.created_at, images: p.cover ? [absUrl(p.cover)] : undefined },
  };
}

export default async function PostPage({ params }: P) {
  const p = await getPost((await params).slug);
  if (!p) notFound();
  const [s, more] = await Promise.all([getSettings(), listPosts(4)]);
  // Content is written by trusted admins only.
  const html = await marked.parse(p.content);
  return (
    <>
      <PageHero eyebrow={`${p.category} · ${formatDate(p.created_at)}`} title={p.title} intro={p.excerpt}
        crumbs={[{ name: "Insights", href: "/insights" }, { name: p.title, href: `/insights/${p.slug}` }]} />
      <article className="container-x max-w-3xl py-14">
        {p.cover && <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-2xl"><Image src={p.cover} alt={p.title} fill priority sizes="768px" className="object-cover" /></div>}
        <div className="prose-iliza" dangerouslySetInnerHTML={{ __html: html }} />
        <aside className="mt-12 border-t pt-8">
          <h2 className="mb-4 font-sans text-sm font-bold tracking-wider text-muted uppercase">More insights</h2>
          <ul className="space-y-2">
            {more.filter((m) => m.id !== p.id).slice(0, 3).map((m) => (
              <li key={m.id}><Link className="font-medium text-navy hover:text-sky" href={`/insights/${m.slug}`}>{m.title}</Link></li>
            ))}
          </ul>
        </aside>
      </article>
      <CtaBand phone={s.phone} />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "Article", headline: p.title, description: p.excerpt,
        datePublished: p.created_at, dateModified: p.updated_at, mainEntityOfPage: absUrl(`/insights/${p.slug}`),
        image: p.cover ? [absUrl(p.cover)] : [absUrl("/og.jpg")],
        author: { "@type": "Organization", name: s.company_name }, publisher: { "@id": absUrl("/#organization") },
      }} />
    </>
  );
}
