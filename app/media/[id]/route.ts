import { q1 } from "@/lib/db";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!id) return new Response("Not found", { status: 404 });
  const m = await q1<{ mime: string; data: ArrayBuffer }>("SELECT mime, data FROM media WHERE id = ?", [id]);
  if (!m) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(m.data), {
    headers: { "Content-Type": m.mime, "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
