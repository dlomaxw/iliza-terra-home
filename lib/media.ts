import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

type R2 = {
  put(key: string, value: ArrayBuffer, opts?: { httpMetadata?: { contentType?: string; cacheControl?: string } }): Promise<unknown>;
};

const MAX = 10 * 1024 * 1024;

/** Store an uploaded image in Cloudflare R2 and return its public URL on this site. */
export async function saveImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Only image files can be uploaded.");
  if (file.size > MAX) throw new Error(`"${file.name}" is larger than 10 MB. Please use a smaller photo.`);
  const env = getCloudflareContext().env as unknown as { MEDIA?: R2 };
  if (!env.MEDIA) throw new Error("R2 binding MEDIA is missing (see wrangler.jsonc).");
  const ext = file.type === "image/webp" ? "webp" : file.type === "image/png" ? "png" : file.type === "image/gif" ? "gif" : "jpg";
  const base = file.name.replace(/\.[^.]+$/, "").replace(/[^a-z0-9-]+/gi, "-").toLowerCase().slice(0, 40) || "image";
  const key = `uploads/${new Date().toISOString().slice(0, 7)}/${base}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  await env.MEDIA.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type, cacheControl: "public, max-age=31536000, immutable" },
  });
  return `/media/${key}`;
}

export async function saveImages(files: File[]) {
  const urls: string[] = [];
  for (const f of files) if (f && f.size > 0) urls.push(await saveImage(f));
  return urls;
}
