"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { run, q1 } from "@/lib/db";
import { createSession, destroySession, requireUser, requireAdmin, verifyLogin } from "@/lib/auth";
import { saveImage, saveImages } from "@/lib/media";
import { slugify, parseImages } from "@/lib/format";
import { DEFAULT_SETTINGS } from "@/lib/db";

export type AState = { error?: string; ok?: string; email?: string };
const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const num = (f: FormData, k: string) => { const v = str(f, k).replace(/,/g, ""); return v === "" ? null : Number(v); };

function refreshPublic() {
  revalidatePath("/", "layout");
}

async function uniqueSlug(table: "properties" | "posts", base: string, id?: number) {
  let slug = slugify(base) || "item";
  let n = 1;
  while (await q1(`SELECT id FROM ${table} WHERE slug = ? AND id != ?`, [slug, id ?? 0])) slug = `${slugify(base)}-${++n}`;
  return slug;
}

/* ---------- Auth ---------- */
export async function loginAction(_: AState, f: FormData): Promise<AState> {
  const r = await verifyLogin(str(f, "email"), str(f, "password"));
  if ("error" in r) return { error: r.error, email: str(f, "email") };
  await createSession(r.user.id);
  redirect("/admin");
}
export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

/* ---------- Properties ---------- */
export async function saveProperty(_: AState, f: FormData): Promise<AState> {
  await requireUser();
  const id = Number(f.get("id")) || undefined;
  const title = str(f, "title");
  if (!title) return { error: "Title is required." };
  const existing = id ? await q1<{ images: string }>("SELECT images FROM properties WHERE id = ?", [id]) : null;
  let images = existing ? parseImages(existing.images) : [];
  const remove = new Set(f.getAll("remove_image").map(String));
  images = images.filter((u) => !remove.has(u));
  try {
    images.push(...(await saveImages(f.getAll("new_images") as File[])));
  } catch (e) {
    return { error: (e as Error).message || "Image upload failed." };
  }
  const cover = str(f, "cover");
  if (cover && images.includes(cover)) images = [cover, ...images.filter((u) => u !== cover)];
  const slug = await uniqueSlug("properties", str(f, "slug") || title, id);
  const vals = [
    title, slug, str(f, "listing_type") || "sale", str(f, "category") || "house", str(f, "district") || "Gasabo", str(f, "area"),
    num(f, "price"), str(f, "currency") || "USD", str(f, "price_period"), num(f, "bedrooms"), num(f, "bathrooms"),
    num(f, "size_sqm"), num(f, "plot_sqm"), str(f, "upi"), str(f, "description"), str(f, "features"), JSON.stringify(images),
    str(f, "video_url"), num(f, "lat"), num(f, "lng"), f.get("featured") ? 1 : 0, str(f, "status") || "published",
    str(f, "meta_title"), str(f, "meta_description"),
  ];
  const cols = "title, slug, listing_type, category, district, area, price, currency, price_period, bedrooms, bathrooms, size_sqm, plot_sqm, upi, description, features, images, video_url, lat, lng, featured, status, meta_title, meta_description";
  let newId = id;
  if (id) {
    await run(`UPDATE properties SET ${cols.split(", ").map((c) => `${c} = ?`).join(", ")}, is_sample = 0, updated_at = now_txt() WHERE id = ?`, [...vals, id]);
  } else {
    const r = await run(`INSERT INTO properties (${cols}) VALUES (${cols.split(", ").map(() => "?").join(",")}) RETURNING id`, vals);
    newId = r.id;
  }
  refreshPublic();
  redirect(`/admin/properties/${newId}?saved=1`);
}

export async function deleteProperty(f: FormData) {
  await requireUser();
  await run("DELETE FROM properties WHERE id = ?", [Number(f.get("id"))]);
  refreshPublic();
  redirect("/admin/properties?deleted=1");
}

export async function quickPropertyStatus(f: FormData) {
  await requireUser();
  const field = str(f, "field");
  if (field === "featured") await run("UPDATE properties SET featured = 1 - featured WHERE id = ?", [Number(f.get("id"))]);
  if (field === "status") await run("UPDATE properties SET status = ?, updated_at = now_txt() WHERE id = ?", [str(f, "value"), Number(f.get("id"))]);
  refreshPublic();
  revalidatePath("/admin/properties");
}

/* ---------- Posts ---------- */
export async function savePost(_: AState, f: FormData): Promise<AState> {
  await requireUser();
  const id = Number(f.get("id")) || undefined;
  const title = str(f, "title");
  if (!title) return { error: "Title is required." };
  let cover = str(f, "cover_existing");
  if (f.get("remove_cover")) cover = "";
  const file = f.get("cover") as File | null;
  if (file && file.size > 0) {
    try { cover = await saveImage(file); } catch (e) { return { error: (e as Error).message }; }
  }
  const slug = await uniqueSlug("posts", str(f, "slug") || title, id);
  const vals = [title, slug, str(f, "excerpt"), str(f, "content"), cover, str(f, "category") || "Guides", str(f, "status") || "published", str(f, "meta_title"), str(f, "meta_description")];
  let newId = id;
  if (id) {
    await run("UPDATE posts SET title=?, slug=?, excerpt=?, content=?, cover=?, category=?, status=?, meta_title=?, meta_description=?, is_sample=0, updated_at=now_txt() WHERE id=?", [...vals, id]);
  } else {
    const r = await run("INSERT INTO posts (title, slug, excerpt, content, cover, category, status, meta_title, meta_description) VALUES (?,?,?,?,?,?,?,?,?) RETURNING id", vals);
    newId = r.id;
  }
  refreshPublic();
  redirect(`/admin/posts/${newId}?saved=1`);
}
export async function deletePost(f: FormData) {
  await requireUser();
  await run("DELETE FROM posts WHERE id = ?", [Number(f.get("id"))]);
  refreshPublic();
  redirect("/admin/posts?deleted=1");
}

/* ---------- Inquiries ---------- */
export async function updateInquiry(f: FormData) {
  await requireUser();
  await run("UPDATE inquiries SET status = ?, notes = ? WHERE id = ?", [str(f, "status"), str(f, "notes"), Number(f.get("id"))]);
  revalidatePath("/admin", "layout");
  redirect(`/admin/inquiries/${Number(f.get("id"))}?saved=1`);
}
export async function deleteInquiry(f: FormData) {
  await requireUser();
  await run("DELETE FROM inquiries WHERE id = ?", [Number(f.get("id"))]);
  revalidatePath("/admin", "layout");
  redirect("/admin/inquiries?deleted=1");
}
export async function deleteSubscriber(f: FormData) {
  await requireUser();
  await run("DELETE FROM subscribers WHERE id = ?", [Number(f.get("id"))]);
  revalidatePath("/admin/subscribers");
}

/* ---------- Settings ---------- */
export async function saveSettings(_: AState, f: FormData): Promise<AState> {
  await requireAdmin();
  for (const key of Object.keys(DEFAULT_SETTINGS)) {
    if (f.has(key)) await run("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value", [key, str(f, key)]);
  }
  refreshPublic();
  return { ok: "Settings saved." };
}

/* ---------- Users ---------- */
export async function addUser(_: AState, f: FormData): Promise<AState> {
  await requireAdmin();
  const email = str(f, "email").toLowerCase();
  const pass = str(f, "password");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email." };
  if (pass.length < 8) return { error: "Password must be at least 8 characters." };
  if (await q1("SELECT id FROM users WHERE email = ?", [email])) return { error: "A user with that email already exists." };
  await run("INSERT INTO users (email, name, password_hash, role) VALUES (?,?,?,?)", [email, str(f, "name"), bcrypt.hashSync(pass, 10), str(f, "role") === "admin" ? "admin" : "editor"]);
  revalidatePath("/admin/users");
  return { ok: `User ${email} added.` };
}
export async function deleteUser(f: FormData) {
  const me = await requireAdmin();
  const id = Number(f.get("id"));
  if (id !== me.id) await run("DELETE FROM users WHERE id = ?", [id]);
  revalidatePath("/admin/users");
}
export async function changePassword(_: AState, f: FormData): Promise<AState> {
  const me = await requireUser();
  const row = await q1<{ password_hash: string }>("SELECT password_hash FROM users WHERE id = ?", [me.id]);
  if (!row || !bcrypt.compareSync(str(f, "current"), row.password_hash)) return { error: "Current password is incorrect." };
  const next = str(f, "next");
  if (next.length < 8) return { error: "New password must be at least 8 characters." };
  if (next !== str(f, "confirm")) return { error: "New passwords do not match." };
  await run("UPDATE users SET password_hash = ?, name = ? WHERE id = ?", [bcrypt.hashSync(next, 10), str(f, "name") || me.name, me.id]);
  return { ok: "Password updated." };
}
