import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { hashPassword } from "./password";
import { SEED_POSTS, SEED_PROPERTIES } from "./seed";

// Cloudflare D1 (SQLite). Tables are created by migrations/0001_init.sql;
// first-run content (settings, first admin, samples) is added here.

export type InValue = string | number | null | ArrayBuffer;

type D1 = {
  prepare(sql: string): { bind(...v: unknown[]): D1Stmt } & D1Stmt;
  batch(stmts: D1Stmt[]): Promise<unknown[]>;
};
type D1Stmt = {
  all<T>(): Promise<{ results: T[]; meta: { last_row_id?: number; changes?: number } }>;
  run(): Promise<{ meta: { last_row_id?: number; changes?: number } }>;
};

function d1(): D1 {
  const env = getCloudflareContext().env as unknown as { DB?: D1 };
  if (!env.DB) throw new Error("D1 binding DB is missing (see wrangler.jsonc).");
  return env.DB;
}

export const DEFAULT_SETTINGS: Record<string, string> = {
  company_name: "Iliza Terra Homes",
  tagline: "Where Opportunities Meet Investment.",
  hero_subtitle:
    "Your trusted partner in connecting investors, landowners and developers to Rwanda's most strategic opportunities.",
  phone: "+250 788 300 630",
  whatsapp: "250788300630",
  email: "ilizaterrahomes@gmail.com",
  address: "St KN 87, Kigali – Rwanda",
  hours: "Mon – Fri 8:00 – 18:00, Sat 9:00 – 14:00",
  facebook: "",
  instagram: "",
  linkedin: "",
  x: "",
  youtube: "",
  tiktok: "",
  usd_to_rwf: "1450",
  ga_id: "",
  google_verification: "",
  seo_title: "Iliza Terra Homes | Real Estate, Land & Investment in Rwanda",
  seo_description:
    "Iliza Terra Homes connects investors, landowners and developers to Rwanda's best opportunities: houses, apartments and land for sale or rent in Kigali, Lake Kivu land and islands, insurance brokerage, construction and property management.",
};

let ready: Promise<void> | null = null;

async function init() {
  const db = d1();
  const c = await db
    .prepare(
      "SELECT (SELECT COUNT(*) FROM settings) s, (SELECT COUNT(*) FROM users) u, (SELECT COUNT(*) FROM properties) p, (SELECT COUNT(*) FROM posts) b"
    )
    .all<{ s: number; u: number; p: number; b: number }>();
  const n = c.results[0];
  const stmts: D1Stmt[] = [];

  if (n.s < Object.keys(DEFAULT_SETTINGS).length) {
    for (const [k, v] of Object.entries(DEFAULT_SETTINGS))
      stmts.push(db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)").bind(k, v));
  }
  if (n.u === 0) {
    const env = getCloudflareContext().env as unknown as Record<string, string | undefined>;
    const email = (env.ADMIN_EMAIL || process.env.ADMIN_EMAIL || "admin@ilizaterrahomes.com").toLowerCase();
    const pass = env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || "ChangeMe-2026!";
    stmts.push(
      db.prepare("INSERT OR IGNORE INTO users (email, name, password_hash, role) VALUES (?, ?, ?, 'admin')").bind(email, "Administrator", await hashPassword(pass))
    );
  }
  if (n.p === 0) {
    for (const s of SEED_PROPERTIES) {
      stmts.push(
        db.prepare(
          `INSERT INTO properties (title, slug, listing_type, category, district, area, price, currency, price_period,
           bedrooms, bathrooms, size_sqm, plot_sqm, description, features, images, featured, is_sample)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1)`
        ).bind(
          s.title, s.slug, s.listing_type, s.category, s.district, s.area, s.price, s.currency, s.price_period ?? "",
          s.bedrooms ?? null, s.bathrooms ?? null, s.size_sqm ?? null, s.plot_sqm ?? null, s.description,
          s.features, JSON.stringify(s.images ?? []), s.featured ? 1 : 0
        )
      );
    }
  }
  if (n.b === 0) {
    for (const s of SEED_POSTS)
      stmts.push(
        db.prepare("INSERT INTO posts (title, slug, excerpt, content, category, is_sample, meta_description) VALUES (?,?,?,?,?,1,?)")
          .bind(s.title, s.slug, s.excerpt, s.content, s.category, s.excerpt)
      );
  }
  if (stmts.length) await db.batch(stmts);
}

async function db() {
  if (!ready) ready = init().catch((e) => { ready = null; throw e; });
  await ready;
  return d1();
}

export async function q<T = Record<string, unknown>>(sql: string, args: InValue[] = []): Promise<T[]> {
  const r = await (await db()).prepare(sql).bind(...args).all<T>();
  return r.results;
}

export async function q1<T = Record<string, unknown>>(sql: string, args: InValue[] = []): Promise<T | null> {
  const rows = await q<T>(sql, args);
  return rows[0] ?? null;
}

/** Run a statement. For INSERTs add `RETURNING id` and read `.id`. */
export async function run(sql: string, args: InValue[] = []) {
  const r = await (await db()).prepare(sql).bind(...args).all<{ id?: number }>();
  return { rows: r.results, rowCount: r.meta.changes ?? 0, id: (r.results[0]?.id ?? r.meta.last_row_id) as number | undefined };
}
