import Image from "next/image";
import { ActionForm, Submit, ConfirmButton } from "@/components/admin/ui";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { savePost, deletePost } from "../../actions";
import type { Post } from "@/lib/types";

export function PostForm({ p }: { p?: Post }) {
  return (
    <>
      <ActionForm action={savePost} className="grid gap-6 xl:grid-cols-3">
        {p && <input type="hidden" name="id" value={p.id} />}
        <input type="hidden" name="cover_existing" value={p?.cover ?? ""} />
        <section className="space-y-4 rounded-2xl bg-white p-5 shadow-sm xl:col-span-2">
          <label className="block"><span className="label">Title *</span><input name="title" required defaultValue={p?.title} className="input" /></label>
          <label className="block"><span className="label">Summary (shown in lists and Google results)</span><textarea name="excerpt" rows={2} defaultValue={p?.excerpt} className="input" /></label>
          <label className="block"><span className="label">Article</span>
            <textarea name="content" rows={22} defaultValue={p?.content} className="input font-mono text-[13px]" placeholder={"Write in Markdown:\n## Heading\n**bold**, *italic*, - bullet list, [link](https://...)"} />
          </label>
          <p className="text-xs text-muted">Formatting: <code>## Heading</code>, <code>**bold**</code>, <code>- list item</code>, <code>[link text](https://…)</code>. Leave a blank line between paragraphs.</p>
        </section>
        <div className="space-y-6">
          <section className="space-y-4 rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="font-sans font-bold text-navy">Publish</h2>
            <label className="block"><span className="label">Status</span><select name="status" defaultValue={p?.status ?? "published"} className="input"><option value="published">Published</option><option value="draft">Draft</option></select></label>
            <label className="block"><span className="label">Category</span><input name="category" list="post-cats" defaultValue={p?.category ?? "Guides"} className="input" />
              <datalist id="post-cats"><option>Guides</option><option>Market Insights</option><option>Diaspora</option><option>Insurance</option><option>Construction</option><option>News</option></datalist>
            </label>
            <Submit className="btn-green w-full">{p ? "Save changes" : "Publish article"}</Submit>
            {p && p.status === "published" && <a href={`/insights/${p.slug}`} target="_blank" className="block text-center text-sm text-sky">View on website ↗</a>}
          </section>
          <section className="space-y-3 rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="font-sans font-bold text-navy">Cover image</h2>
            {p?.cover && (
              <div>
                <div className="relative aspect-[16/9] overflow-hidden rounded-xl"><Image src={p.cover} alt="" fill sizes="300px" className="object-cover" /></div>
                <label className="mt-2 flex items-center gap-2 text-xs text-red-600"><input type="checkbox" name="remove_cover" />Remove cover</label>
              </div>
            )}
            <ImagePicker name="cover" multiple={false} />
          </section>
          <section className="space-y-3 rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="font-sans font-bold text-navy">SEO (optional)</h2>
            <label className="block"><span className="label">URL slug</span><input name="slug" defaultValue={p?.slug} className="input" placeholder="auto from title" /></label>
            <label className="block"><span className="label">SEO title</span><input name="meta_title" maxLength={70} defaultValue={p?.meta_title} className="input" /></label>
            <label className="block"><span className="label">Meta description</span><textarea name="meta_description" maxLength={160} rows={3} defaultValue={p?.meta_description} className="input" /></label>
          </section>
        </div>
      </ActionForm>
      {p && <form action={deletePost} className="mt-6"><input type="hidden" name="id" value={p.id} /><ConfirmButton message="Delete this article permanently?">Delete this article</ConfirmButton></form>}
    </>
  );
}
