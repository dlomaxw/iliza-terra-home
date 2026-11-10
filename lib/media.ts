import "server-only";
import sharp from "sharp";
import { run } from "./db";

/** Resize, convert to WebP and store an uploaded image. Returns a public URL. */
export async function saveImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Only image files can be uploaded.");
  const input = Buffer.from(await file.arrayBuffer());
  const out = await sharp(input).rotate().resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const name = file.name.replace(/\.[^.]+$/, "").replace(/[^a-z0-9-]+/gi, "-").toLowerCase().slice(0, 50) || "image";
    const blob = await put(`properties/${name}.webp`, out, { access: "public", contentType: "image/webp", addRandomSuffix: true });
    return blob.url;
  }
  const r = await run("INSERT INTO media (mime, data) VALUES (?, ?)", ["image/webp", out]);
  return `/media/${Number(r.lastInsertRowid)}`;
}

export async function saveImages(files: File[]) {
  const urls: string[] = [];
  for (const f of files) if (f && f.size > 0) urls.push(await saveImage(f));
  return urls;
}
