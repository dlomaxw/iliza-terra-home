import { requireUser } from "@/lib/auth";
import { q1 } from "@/lib/db";
import { Sidebar } from "@/components/admin/Sidebar";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const u = await requireUser();
  const n = await q1<{ n: number }>("SELECT COUNT(*) AS n FROM inquiries WHERE status = 'new'");
  return (
    <div className="lg:flex">
      <Sidebar role={u.role} name={u.name || u.email} newCount={Number(n?.n ?? 0)} />
      <div className="min-w-0 flex-1 p-4 sm:p-8">{children}</div>
    </div>
  );
}
