import "server-only";
import { Pool, types } from "pg";
import bcrypt from "bcryptjs";
import { SEED_POSTS, SEED_PROPERTIES } from "./seed";

export type InValue = string | number | boolean | null | Buffer;

// Return COUNT()/bigint and numeric values as JS numbers.
types.setTypeParser(20, (v) => Number(v));
types.setTypeParser(1700, (v) => Number(v));

let ready: Promise<void> | null = null;
const g = globalThis as unknown as { __ilizaPool?: Pool };

function connectionString() {
  // Vercel Postgres / Neon and Prisma Postgres integrations set one of these.
  const url = [process.env.DATABASE_URL, process.env.POSTGRES_URL, process.env.POSTGRES_PRISMA_URL]
    .find((u) => u && /^postgres(ql)?:\/\//.test(u));
  if (!url) throw new Error("No Postgres connection string found. Set DATABASE_URL (postgres://…).");
  return url;
}

function pool() {
  if (!g.__ilizaPool) {
    const url = connectionString();
    const local = /@(localhost|127\.0\.0\.1)[:/]/.test(url);
    g.__ilizaPool = new Pool({
      connectionString: url.replace(/[?&]sslmode=[^&]*/, (m) => (m.startsWith("?") ? "?" : "")).replace(/\?$/, ""),
      ssl: local ? false : { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 10_000,
    });
  }
  return g.__ilizaPool;
}

/** Convert SQLite-style `?` placeholders to Postgres `$1, $2…`. */
function toPg(sql: string) {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

const SCHEMA = [
  `CREATE OR REPLACE FUNCTION now_txt() RETURNS text LANGUAGE sql STABLE AS $$ SELECT to_char(now() AT TIME ZONE 'utc', 'YYYY-MM-DD HH24:MI:SS') $$`,
  `CREATE OR REPLACE FUNCTION ago_txt(days int) RETURNS text LANGUAGE sql STABLE AS $$ SELECT to_char((now() AT TIME ZONE 'utc') - make_interval(days => days), 'YYYY-MM-DD HH24:MI:SS') $$`,
  `CREATE TABLE IF NOT EXISTS properties (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    listing_type TEXT NOT NULL DEFAULT 'sale',
    category TEXT NOT NULL DEFAULT 'house',
    district TEXT NOT NULL DEFAULT 'Gasabo',
    area TEXT NOT NULL DEFAULT '',
    price DOUBLE PRECISION,
    currency TEXT NOT NULL DEFAULT 'USD',
    price_period TEXT NOT NULL DEFAULT '',
    bedrooms INTEGER,
    bathrooms INTEGER,
    size_sqm DOUBLE PRECISION,
    plot_sqm DOUBLE PRECISION,
    upi TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    features TEXT NOT NULL DEFAULT '',
    images TEXT NOT NULL DEFAULT '[]',
    video_url TEXT NOT NULL DEFAULT '',
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    featured INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'published',
    is_sample INTEGER NOT NULL DEFAULT 0,
    meta_title TEXT NOT NULL DEFAULT '',
    meta_description TEXT NOT NULL DEFAULT '',
    views INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT now_txt(),
    updated_at TEXT NOT NULL DEFAULT now_txt()
  )`,
  `CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    cover TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT 'Guides',
    status TEXT NOT NULL DEFAULT 'published',
    is_sample INTEGER NOT NULL DEFAULT 0,
    meta_title TEXT NOT NULL DEFAULT '',
    meta_description TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT now_txt(),
    updated_at TEXT NOT NULL DEFAULT now_txt()
  )`,
  `CREATE TABLE IF NOT EXISTS inquiries (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    country TEXT NOT NULL DEFAULT '',
    interest TEXT NOT NULL DEFAULT '',
    budget TEXT NOT NULL DEFAULT '',
    message TEXT NOT NULL DEFAULT '',
    property_id INTEGER,
    source TEXT NOT NULL DEFAULT 'contact',
    status TEXT NOT NULL DEFAULT 'new',
    notes TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT now_txt()
  )`,
  `CREATE TABLE IF NOT EXISTS subscribers (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT now_txt()
  )`,
  `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL DEFAULT '',
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'editor',
    created_at TEXT NOT NULL DEFAULT now_txt()
  )`,
  `CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL DEFAULT '')`,
  `CREATE TABLE IF NOT EXISTS media (
    id SERIAL PRIMARY KEY,
    mime TEXT NOT NULL,
    data BYTEA NOT NULL,
    created_at TEXT NOT NULL DEFAULT now_txt()
  )`,
  `CREATE INDEX IF NOT EXISTS idx_prop_status ON properties(status, featured)`,
  `CREATE INDEX IF NOT EXISTS idx_post_status ON posts(status)`,
  `CREATE INDEX IF NOT EXISTS idx_inq_status ON inquiries(status)`,
];

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

async function init() {
  const client = await pool().connect();
  const exec = (sql: string, args: InValue[] = []) => client.query(toPg(sql), args);
  try {
    // Serverless functions can start in parallel: serialise first-run setup.
    await client.query("SELECT pg_advisory_lock(727274)");
    for (const sql of SCHEMA) await exec(sql);

    for (const [k, v] of Object.entries(DEFAULT_SETTINGS)) {
      await exec("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT (key) DO NOTHING", [k, v]);
    }

    const u = await exec("SELECT COUNT(*) AS n FROM users");
    if (Number(u.rows[0].n) === 0) {
      const email = (process.env.ADMIN_EMAIL || "admin@ilizaterrahomes.com").toLowerCase();
      const pass = process.env.ADMIN_PASSWORD || "ChangeMe-2026!";
      await exec("INSERT INTO users (email, name, password_hash, role) VALUES (?, ?, ?, 'admin')", [email, "Administrator", bcrypt.hashSync(pass, 10)]);
    }

    const p = await exec("SELECT COUNT(*) AS n FROM properties");
    if (Number(p.rows[0].n) === 0) {
      for (const s of SEED_PROPERTIES) {
        await exec(
          `INSERT INTO properties (title, slug, listing_type, category, district, area, price, currency, price_period,
           bedrooms, bathrooms, size_sqm, plot_sqm, description, features, images, featured, is_sample)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1)`,
          [
            s.title, s.slug, s.listing_type, s.category, s.district, s.area, s.price, s.currency, s.price_period ?? "",
            s.bedrooms ?? null, s.bathrooms ?? null, s.size_sqm ?? null, s.plot_sqm ?? null, s.description,
            s.features, JSON.stringify(s.images ?? []), s.featured ? 1 : 0,
          ]
        );
      }
    }
    const b = await exec("SELECT COUNT(*) AS n FROM posts");
    if (Number(b.rows[0].n) === 0) {
      for (const s of SEED_POSTS) {
        await exec("INSERT INTO posts (title, slug, excerpt, content, category, is_sample, meta_description) VALUES (?,?,?,?,?,1,?)",
          [s.title, s.slug, s.excerpt, s.content, s.category, s.excerpt]);
      }
    }
  } finally {
    await client.query("SELECT pg_advisory_unlock(727274)").catch(() => {});
    client.release();
  }
}

export async function db() {
  if (!ready) ready = init().catch((e) => { ready = null; throw e; });
  await ready;
  return pool();
}

export async function q<T = Record<string, unknown>>(sql: string, args: InValue[] = []): Promise<T[]> {
  const p = await db();
  const r = await p.query(toPg(sql), args);
  return r.rows as T[];
}

export async function q1<T = Record<string, unknown>>(sql: string, args: InValue[] = []): Promise<T | null> {
  const rows = await q<T>(sql, args);
  return rows[0] ?? null;
}

/** Run a statement. For INSERTs add `RETURNING id` and read `.id`. */
export async function run(sql: string, args: InValue[] = []) {
  const p = await db();
  const r = await p.query(toPg(sql), args);
  return { rows: r.rows, rowCount: r.rowCount ?? 0, id: r.rows[0]?.id as number | undefined };
}
