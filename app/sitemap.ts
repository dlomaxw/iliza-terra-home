import type { MetadataRoute } from "next";
import { q } from "@/lib/db";
import { SERVICES, LOCATIONS, CATEGORIES, LISTING_TYPES } from "@/lib/content";
import { siteUrl } from "@/lib/format";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();
  const props = await q<{ slug: string; updated_at: string; images: string }>("SELECT slug, updated_at, images FROM properties WHERE status IN ('published','sold')");
  const posts = await q<{ slug: string; updated_at: string }>("SELECT slug, updated_at FROM posts WHERE status='published'");
  const toDate = (s: string) => new Date(s.replace(" ", "T") + "Z");
  const abs = (u: string) => (u.startsWith("http") ? u : base + u);
  return [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/properties`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    ...LISTING_TYPES.map((t) => ({ url: `${base}/properties?type=${t.value}`, lastModified: now, changeFrequency: "daily" as const, priority: 0.8 })),
    ...CATEGORIES.map((c) => ({ url: `${base}/properties?category=${c.value}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 })),
    { url: `${base}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...SERVICES.map((s) => ({ url: `${base}/services/${s.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${base}/invest-in-rwanda`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/locations`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ...LOCATIONS.map((l) => ({ url: `${base}/locations/${l.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 })),
    { url: `${base}/insights`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    ...props.map((p) => {
      let images: string[] = [];
      try { images = JSON.parse(p.images).map(abs); } catch {}
      return { url: `${base}/properties/${p.slug}`, lastModified: toDate(p.updated_at), changeFrequency: "weekly" as const, priority: 0.8, images };
    }),
    ...posts.map((p) => ({ url: `${base}/insights/${p.slug}`, lastModified: toDate(p.updated_at), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
