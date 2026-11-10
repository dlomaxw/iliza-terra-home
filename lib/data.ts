import "server-only";
import { cache } from "react";
import { q, q1, DEFAULT_SETTINGS } from "./db";
import type { Property, Post } from "./types";

export const getSettings = cache(async () => {
  const rows = await q<{ key: string; value: string }>("SELECT key, value FROM settings");
  const s: Record<string, string> = { ...DEFAULT_SETTINGS };
  for (const r of rows) s[r.key] = r.value;
  return s;
});

export type PropertyFilter = {
  type?: string; category?: string; district?: string; districts?: string[]; q?: string;
  min?: number; max?: number; beds?: number; sort?: string; page?: number; perPage?: number;
};

export async function listProperties(f: PropertyFilter = {}) {
  const where = ["status IN ('published','sold')"];
  const args: (string | number)[] = [];
  if (f.type) { where.push("listing_type = ?"); args.push(f.type); }
  if (f.category) { where.push("category = ?"); args.push(f.category); }
  if (f.district) { where.push("district = ?"); args.push(f.district); }
  if (f.districts?.length) { where.push(`district IN (${f.districts.map(() => "?").join(",")})`); args.push(...f.districts); }
  if (f.q) { where.push("(title ILIKE ? OR area ILIKE ? OR district ILIKE ? OR description ILIKE ?)"); const like = `%${f.q}%`; args.push(like, like, like, like); }
  if (f.beds) { where.push("bedrooms >= ?"); args.push(f.beds); }
  // Price filters are in USD; RWF prices are converted using the admin-set rate.
  const s = await getSettings();
  const rate = Number(s.usd_to_rwf) || 1450;
  const usd = `(CASE WHEN currency='RWF' THEN price / ${rate} ELSE price END)`;
  if (f.min) { where.push(`${usd} >= ?`); args.push(f.min); }
  if (f.max) { where.push(`${usd} <= ?`); args.push(f.max); }
  const order =
    f.sort === "price-asc" ? `${usd} ASC` : f.sort === "price-desc" ? `${usd} DESC` : "featured DESC, created_at DESC";
  const per = f.perPage ?? 12;
  const page = Math.max(1, f.page ?? 1);
  const w = where.join(" AND ");
  const total = await q1<{ n: number }>(`SELECT COUNT(*) AS n FROM properties WHERE ${w}`, args);
  const items = await q<Property>(
    `SELECT * FROM properties WHERE ${w} ORDER BY (status='sold') ASC, ${order} LIMIT ? OFFSET ?`,
    [...args, per, (page - 1) * per]
  );
  return { items, total: Number(total?.n ?? 0), page, pages: Math.max(1, Math.ceil(Number(total?.n ?? 0) / per)) };
}

export const getProperty = cache(async (slug: string) =>
  q1<Property>("SELECT * FROM properties WHERE slug = ? AND status IN ('published','sold')", [slug])
);

export async function featuredProperties(n = 6) {
  return q<Property>("SELECT * FROM properties WHERE status='published' ORDER BY featured DESC, created_at DESC LIMIT ?", [n]);
}

export async function similarProperties(p: Property, n = 3) {
  return q<Property>(
    "SELECT * FROM properties WHERE status='published' AND id != ? ORDER BY (district = ?) DESC, (category = ?) DESC, created_at DESC LIMIT ?",
    [p.id, p.district, p.category, n]
  );
}

export async function listPosts(limit = 50) {
  return q<Post>("SELECT * FROM posts WHERE status='published' ORDER BY created_at DESC LIMIT ?", [limit]);
}
export const getPost = cache(async (slug: string) => q1<Post>("SELECT * FROM posts WHERE slug = ? AND status='published'", [slug]));
