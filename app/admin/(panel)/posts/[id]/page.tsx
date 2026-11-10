import { notFound } from "next/navigation";
import { q1 } from "@/lib/db";
import { AdminHead, Flash } from "@/components/admin/Head";
import { PostForm } from "../form";
import type { Post } from "@/lib/types";
export default async function EditPost({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const p = await q1<Post>("SELECT * FROM posts WHERE id = ?", [Number((await params).id)]);
  if (!p) notFound();
  return <><AdminHead title="Edit article" /><Flash sp={await searchParams} /><PostForm p={p} /></>;
}
