import { requireUser } from "@/lib/auth";
import { AdminHead } from "@/components/admin/Head";
import { ActionForm, Submit } from "@/components/admin/ui";
import { changePassword } from "../../actions";

export default async function Account() {
  const me = await requireUser();
  return (
    <>
      <AdminHead title="My account" sub={me.email} />
      <ActionForm action={changePassword} className="max-w-md space-y-4 rounded-2xl bg-white p-5 shadow-sm">
        <label className="block"><span className="label">Display name</span><input name="name" defaultValue={me.name} className="input" /></label>
        <label className="block"><span className="label">Current password</span><input name="current" type="password" required className="input" autoComplete="current-password" /></label>
        <label className="block"><span className="label">New password (min 8)</span><input name="next" type="password" required minLength={8} className="input" autoComplete="new-password" /></label>
        <label className="block"><span className="label">Confirm new password</span><input name="confirm" type="password" required className="input" autoComplete="new-password" /></label>
        <Submit className="btn-green w-full">Update password</Submit>
      </ActionForm>
    </>
  );
}
