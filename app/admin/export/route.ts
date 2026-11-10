import { currentUser } from "@/lib/auth";
import { q } from "@/lib/db";

const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

export async function GET(req: Request) {
  if (!(await currentUser())) return new Response("Unauthorized", { status: 401 });
  const type = new URL(req.url).searchParams.get("type");
  let rows: Record<string, unknown>[] = [];
  if (type === "inquiries") rows = await q("SELECT i.id, i.created_at, i.name, i.email, i.phone, i.country, i.interest, i.budget, i.status, i.source, p.title AS property, i.message, i.notes FROM inquiries i LEFT JOIN properties p ON p.id = i.property_id ORDER BY i.created_at DESC");
  else if (type === "subscribers") rows = await q("SELECT email, created_at FROM subscribers ORDER BY created_at DESC");
  else return new Response("Unknown export", { status: 400 });
  const cols = rows[0] ? Object.keys(rows[0]) : ["empty"];
  const csv = "﻿" + [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
  return new Response(csv, {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="iliza-${type}-${new Date().toISOString().slice(0, 10)}.csv"` },
  });
}
