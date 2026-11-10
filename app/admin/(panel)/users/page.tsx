import { requireAdmin } from "@/lib/auth";
import { q } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { AdminHead } from "@/components/admin/Head";
import { ActionForm, Submit, ConfirmButton } from "@/components/admin/ui";
import { addUser, deleteUser } from "../../actions";
import type { User } from "@/lib/types";

export default async function UsersPage() {
  const me = await requireAdmin();
  const rows = await q<User>("SELECT id, email, name, role, created_at FROM users ORDER BY id");
  return (
    <>
      <AdminHead title="Users" sub="Admins can change settings and manage users. Editors can manage listings, articles and enquiries." />
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl bg-white shadow-sm xl:col-span-2">
          <ul className="divide-y">
            {rows.map((u) => (
              <li key={u.id} className="flex items-center justify-between gap-3 p-4 text-sm">
                <span><b className="text-navy">{u.name || u.email}</b><span className="block text-muted">{u.email} · {u.role} · since {formatDate(u.created_at)}</span></span>
                {u.id !== me.id && <form action={deleteUser}><input type="hidden" name="id" value={u.id} /><ConfirmButton message={`Remove ${u.email}?`}>Remove</ConfirmButton></form>}
              </li>
            ))}
          </ul>
        </div>
        <ActionForm action={addUser} className="space-y-4 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-sans font-bold text-navy">Add a user</h2>
          <label className="block"><span className="label">Name</span><input name="name" className="input" /></label>
          <label className="block"><span className="label">Email</span><input name="email" type="email" required className="input" /></label>
          <label className="block"><span className="label">Temporary password (min 8)</span><input name="password" type="text" minLength={8} required className="input" /></label>
          <label className="block"><span className="label">Role</span><select name="role" className="input"><option value="editor">Editor</option><option value="admin">Admin</option></select></label>
          <Submit className="btn-green w-full">Add user</Submit>
        </ActionForm>
      </div>
    </>
  );
}
