import Link from "next/link";
import { q } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { AdminHead, Flash, StatusPill } from "@/components/admin/Head";
import type { Post } from "@/lib/types";

export default async function AdminPosts({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const rows = await q<Post>("SELECT * FROM posts ORDER BY created_at DESC");
  return (
    <>
      <AdminHead title="Insights / Blog" sub="Articles help you rank on Google for searches like 'how to buy land in Rwanda'." action={{ href: "/admin/posts/new", label: "+ New article" }} />
      <Flash sp={await searchParams} />
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <ul className="divide-y">
          {rows.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-3 p-4 hover:bg-slate-50">
              <Link href={`/admin/posts/${p.id}`} className="min-w-0 flex-1">
                <span className="block font-medium text-navy hover:text-sky">{p.title}{p.is_sample ? <b className="ml-2 rounded bg-orange-light px-1.5 text-xs text-orange-dark">Sample</b> : null}</span>
                <span className="text-xs text-muted">{p.category} · {formatDate(p.created_at)}</span>
              </Link>
              <StatusPill s={p.status} />
              <Link href={`/admin/posts/${p.id}`} className="text-sm font-medium text-sky">Edit</Link>
            </li>
          ))}
          {!rows.length && <li className="p-10 text-center text-muted">No articles yet.</li>}
        </ul>
      </div>
    </>
  );
}
