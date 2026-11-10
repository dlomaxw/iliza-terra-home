import "server-only";
import { createClient, type Client, type InValue } from "@libsql/client";
import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";
import { SEED_POSTS, SEED_PROPERTIES } from "./seed";

let client: Client | null = null;
let ready: Promise<void> | null = null;

function getClient() {
  if (!client) {
    const url = process.env.DATABASE_URL || "file:./data/iliza.db";
    if (url.startsWith("file:")) {
      const p = url.replace(/^file:/, "");
      fs.mkdirSync(path.dirname(path.resolve(p)), { recursive: true });
    }
    client = createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN || undefined });
  }
  return client;
}

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    listing_type TEXT NOT NULL DEFAULT 'sale',
    category TEXT NOT NULL DEFAULT 'house',
    district TEXT NOT NULL DEFAULT 'Gasabo',
    area TEXT NOT NULL DEFAULT '',
    price REAL,
    currency TEXT NOT NULL DEFAULT 'USD',
    price_period TEXT NOT NULL DEFAULT '',
    bedrooms INTEGER,
    bathrooms INTEGER,
    size_sqm REAL,
    plot_sqm REAL,
    upi TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    features TEXT NOT NULL DEFAULT '',
    images TEXT NOT NULL DEFAULT '[]',
    video_url TEXT NOT NULL DEFAULT '',
    lat REAL,
    lng REAL,
    featured INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'published',
    is_sample INTEGER NOT NULL DEFAULT 0,
    meta_title TEXT NOT NULL DEFAULT '',
    meta_description TEXT NOT NULL DEFAULT '',
    views INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL DEFAULT '',
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'editor',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL DEFAULT '')`,
  `CREATE TABLE IF NOT EXISTS media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mime TEXT NOT NULL,
    data BLOB NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
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
  const db = getClient();
  for (const sql of SCHEMA) await db.execute(sql);

  // Settings defaults
  for (const [k, v] of Object.entries(DEFAULT_SETTINGS)) {
    await db.execute({ sql: "INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)", args: [k, v] });
  }

  // First admin
  const u = await db.execute("SELECT COUNT(*) AS n FROM users");
  if (Number(u.rows[0].n) === 0) {
    const email = (process.env.ADMIN_EMAIL || "admin@ilizaterrahomes.com").toLowerCase();
    const pass = process.env.ADMIN_PASSWORD || "ChangeMe-2026!";
    await db.execute({
      sql: "INSERT INTO users (email, name, password_hash, role) VALUES (?, ?, ?, 'admin')",
      args: [email, "Administrator", bcrypt.hashSync(pass, 10)],
    });
  }

  // Sample content so the site is not empty on first launch
  const p = await db.execute("SELECT COUNT(*) AS n FROM properties");
  if (Number(p.rows[0].n) === 0) {
    for (const s of SEED_PROPERTIES) {
      await db.execute({
        sql: `INSERT INTO properties (title, slug, listing_type, category, district, area, price, currency, price_period,
              bedrooms, bathrooms, size_sqm, plot_sqm, description, features, images, featured, is_sample)
              VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1)`,
        args: [
          s.title, s.slug, s.listing_type, s.category, s.district, s.area, s.price, s.currency, s.price_period ?? "",
          s.bedrooms ?? null, s.bathrooms ?? null, s.size_sqm ?? null, s.plot_sqm ?? null, s.description,
          s.features, JSON.stringify(s.images ?? []), s.featured ? 1 : 0,
        ],
      });
    }
  }
  const b = await db.execute("SELECT COUNT(*) AS n FROM posts");
  if (Number(b.rows[0].n) === 0) {
    for (const s of SEED_POSTS) {
      await db.execute({
        sql: "INSERT INTO posts (title, slug, excerpt, content, category, is_sample, meta_description) VALUES (?,?,?,?,?,1,?)",
        args: [s.title, s.slug, s.excerpt, s.content, s.category, s.excerpt],
      });
    }
  }
}

export async function db() {
  if (!ready) ready = init().catch((e) => { ready = null; throw e; });
  await ready;
  return getClient();
}

export async function q<T = Record<string, unknown>>(sql: string, args: InValue[] = []): Promise<T[]> {
  const c = await db();
  const r = await c.execute({ sql, args });
  return r.rows.map((row) => ({ ...row }) as T);
}

export async function q1<T = Record<string, unknown>>(sql: string, args: InValue[] = []): Promise<T | null> {
  const rows = await q<T>(sql, args);
  return rows[0] ?? null;
}

export async function run(sql: string, args: InValue[] = []) {
  const c = await db();
  return c.execute({ sql, args });
}
