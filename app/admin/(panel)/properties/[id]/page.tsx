import { notFound } from "next/navigation";
import { q1 } from "@/lib/db";
import { AdminHead, Flash } from "@/components/admin/Head";
import { PropertyForm } from "../form";
import type { Property } from "@/lib/types";
export default async function EditProperty({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const p = await q1<Property>("SELECT * FROM properties WHERE id = ?", [Number((await params).id)]);
  if (!p) notFound();
  return <><AdminHead title="Edit property" sub={`${p.views} views · last updated ${p.updated_at}`} /><Flash sp={await searchParams} /><PropertyForm p={p} /></>;
}
