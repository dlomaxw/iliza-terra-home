import { Download } from "lucide-react";
import { q } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { AdminHead } from "@/components/admin/Head";
import { deleteSubscriber } from "../../actions";

export default async function Subscribers() {
  const rows = await q<{ id: number; email: string; created_at: string }>("SELECT * FROM subscribers ORDER BY created_at DESC");
  return (
    <>
      <AdminHead title="Subscribers" sub={`${rows.length} people signed up for opportunity alerts.`} />
      <a href="/admin/export?type=subscribers" className="btn-ghost mb-4 !rounded-lg"><Download className="h-4 w-4" />Export CSV</a>
      <div className="rounded-2xl bg-white shadow-sm">
        <ul className="divide-y">
          {rows.map((r) => (
            <li key={r.id} className="flex items-center justify-between p-4 text-sm">
              <span>{r.email}</span>
              <span className="flex items-center gap-4 text-muted">{formatDate(r.created_at)}
                <form action={deleteSubscriber}><input type="hidden" name="id" value={r.id} /><button className="text-red-600">Remove</button></form>
              </span>
            </li>
          ))}
          {!rows.length && <li className="p-10 text-center text-muted">No subscribers yet.</li>}
        </ul>
      </div>
    </>
  );
}
