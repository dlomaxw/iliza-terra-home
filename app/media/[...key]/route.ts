import { getCloudflareContext } from "@opennextjs/cloudflare";

type R2Obj = { body: ReadableStream; httpEtag: string; writeHttpMetadata(h: Headers): void };
type R2 = { get(key: string): Promise<R2Obj | null> };

export async function GET(_: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const key = (await params).key.join("/");
  if (!key.startsWith("uploads/") || key.includes("..")) return new Response("Not found", { status: 404 });
  const env = getCloudflareContext().env as unknown as { MEDIA: R2 };
  const obj = await env.MEDIA.get(key);
  if (!obj) return new Response("Not found", { status: 404 });
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("etag", obj.httpEtag);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  return new Response(obj.body, { headers });
}
