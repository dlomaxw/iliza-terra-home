import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyPassword } from "./password";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { q1 } from "./db";
import type { User } from "./types";

const COOKIE = "itl_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret() {
  const s = process.env.SESSION_SECRET || (getCloudflareContext().env as unknown as Record<string, string | undefined>).SESSION_SECRET;
  if (!s || s.length < 16) {
    if (process.env.NODE_ENV === "production") throw new Error("SESSION_SECRET must be set (32+ random characters).");
    return "dev-only-insecure-secret-change-me";
  }
  return s;
}
function sign(data: string) {
  return crypto.createHmac("sha256", secret()).update(data).digest("base64url");
}

export async function createSession(userId: number) {
  const payload = Buffer.from(JSON.stringify({ uid: userId, exp: Date.now() + MAX_AGE * 1000 })).toString("base64url");
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: MAX_AGE,
  });
}
export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function currentUser(): Promise<User | null> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  const [payload, sig] = raw.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const { uid, exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (Date.now() > exp) return null;
    return await q1<User>("SELECT id, email, name, role, created_at FROM users WHERE id = ?", [uid]);
  } catch {
    return null;
  }
}

export async function requireUser() {
  const u = await currentUser();
  if (!u) redirect("/admin/login");
  return u;
}
export async function requireAdmin() {
  const u = await requireUser();
  if (u.role !== "admin") redirect("/admin?error=forbidden");
  return u;
}

// Basic brute-force protection (per server instance)
const attempts = new Map<string, { n: number; until: number }>();
export async function verifyLogin(email: string, password: string) {
  const key = email.toLowerCase();
  const a = attempts.get(key);
  if (a && a.n >= 5 && Date.now() < a.until) return { error: "Too many attempts. Try again in 15 minutes." } as const;
  const row = await q1<User & { password_hash: string }>("SELECT * FROM users WHERE email = ?", [key]);
  if (!row || !(await verifyPassword(password, row.password_hash))) {
    const n = (a && Date.now() < a.until ? a.n : 0) + 1;
    attempts.set(key, { n, until: Date.now() + 15 * 60 * 1000 });
    return { error: "Incorrect email or password." } as const;
  }
  attempts.delete(key);
  return { user: row } as const;
}
