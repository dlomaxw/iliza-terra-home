import Image from "next/image";
import { ActionForm, Submit, ConfirmButton } from "@/components/admin/ui";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { saveProperty, deleteProperty } from "../../actions";
import { CATEGORIES, LISTING_TYPES, DISTRICTS } from "@/lib/content";
import { parseImages } from "@/lib/format";
import type { Property } from "@/lib/types";

const v = (x: unknown) => (x == null ? "" : String(x));

export function PropertyForm({ p }: { p?: Property }) {
  const images = p ? parseImages(p.images) : [];
  return (
    <>
      <ActionForm action={saveProperty} className="grid gap-6 xl:grid-cols-3">
        {p && <input type="hidden" name="id" value={p.id} />}
        <div className="space-y-6 xl:col-span-2">
          <Box title="Basic details">
            <div className="grid gap-4 sm:grid-cols-2">
              <F label="Title *" full><input name="title" required defaultValue={p?.title} className="input" placeholder="e.g. 4-Bedroom Villa in Nyarutarama" /></F>
              <F label="Listing type"><select name="listing_type" defaultValue={p?.listing_type ?? "sale"} className="input">{LISTING_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</select></F>
              <F label="Property type"><select name="category" defaultValue={p?.category ?? "house"} className="input">{CATEGORIES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</select></F>
              <F label="District"><select name="district" defaultValue={p?.district ?? "Gasabo"} className="input">{Object.entries(DISTRICTS).map(([pr, ds]) => <optgroup key={pr} label={pr}>{ds.map((d) => <option key={d}>{d}</option>)}</optgroup>)}</select></F>
              <F label="Neighbourhood / sector"><input name="area" defaultValue={p?.area} className="input" placeholder="e.g. Kimihurura" /></F>
              <F label="Price"><input name="price" inputMode="decimal" defaultValue={v(p?.price)} className="input" placeholder="Leave empty for 'Price on request'" /></F>
              <div className="grid grid-cols-2 gap-3">
                <F label="Currency"><select name="currency" defaultValue={p?.currency ?? "USD"} className="input"><option>USD</option><option>RWF</option></select></F>
                <F label="Per"><select name="price_period" defaultValue={p?.price_period ?? ""} className="input"><option value="">— (sale)</option><option value="month">month</option><option value="year">year</option><option value="night">night</option><option value="sqm / month">sqm / month</option></select></F>
              </div>
            </div>
          </Box>
          <Box title="Size & rooms">
            <div className="grid gap-4 sm:grid-cols-5">
              <F label="Bedrooms"><input name="bedrooms" type="number" min={0} defaultValue={v(p?.bedrooms)} className="input" /></F>
              <F label="Bathrooms"><input name="bathrooms" type="number" min={0} defaultValue={v(p?.bathrooms)} className="input" /></F>
              <F label="Built area (m²)"><input name="size_sqm" inputMode="decimal" defaultValue={v(p?.size_sqm)} className="input" /></F>
              <F label="Plot size (m²)"><input name="plot_sqm" inputMode="decimal" defaultValue={v(p?.plot_sqm)} className="input" /></F>
              <F label="UPI (parcel no.)"><input name="upi" defaultValue={p?.upi} className="input" placeholder="optional" /></F>
            </div>
          </Box>
          <Box title="Description & features">
            <F label="Description"><textarea name="description" rows={7} defaultValue={p?.description} className="input" placeholder="Leave a blank line between paragraphs." /></F>
            <F label="Features (comma or one per line)"><textarea name="features" rows={3} defaultValue={p?.features} className="input mt-1" placeholder="Swimming pool, Lake view, Backup generator" /></F>
            <F label="Video tour URL (YouTube)"><input name="video_url" defaultValue={p?.video_url} className="input" /></F>
            <div className="grid grid-cols-2 gap-4">
              <F label="Latitude (map pin)"><input name="lat" inputMode="decimal" defaultValue={v(p?.lat)} className="input" placeholder="-1.9441" /></F>
              <F label="Longitude"><input name="lng" inputMode="decimal" defaultValue={v(p?.lng)} className="input" placeholder="30.0619" /></F>
            </div>
          </Box>
          <Box title="Photos">
            {images.length > 0 && (
              <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {images.map((src, i) => (
                  <div key={src} className="overflow-hidden rounded-xl border">
                    <div className="relative aspect-[4/3]"><Image src={src} alt="" fill sizes="200px" className="object-cover" /></div>
                    <div className="space-y-1 p-2 text-xs">
                      <label className="flex items-center gap-1.5"><input type="radio" name="cover" value={src} defaultChecked={i === 0} />Cover photo</label>
                      <label className="flex items-center gap-1.5 text-red-600"><input type="checkbox" name="remove_image" value={src} />Remove</label>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <ImagePicker name="new_images" />
          </Box>
        </div>
        <div className="space-y-6">
          <Box title="Publish">
            <F label="Status"><select name="status" defaultValue={p?.status ?? "published"} className="input"><option value="published">Published</option><option value="draft">Draft (hidden)</option><option value="sold">Sold / Let (shown with badge)</option></select></F>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" defaultChecked={!!p?.featured} />Feature on home page</label>
            <Submit className="btn-green w-full">{p ? "Save changes" : "Create listing"}</Submit>
            {p && p.status !== "draft" && <a href={`/properties/${p.slug}`} target="_blank" className="block text-center text-sm text-sky">View on website ↗</a>}
          </Box>
          <Box title="SEO (optional)">
            <F label="URL slug"><input name="slug" defaultValue={p?.slug} className="input" placeholder="auto from title" /></F>
            <F label="SEO title"><input name="meta_title" defaultValue={p?.meta_title} maxLength={70} className="input" placeholder="auto" /></F>
            <F label="Meta description"><textarea name="meta_description" defaultValue={p?.meta_description} maxLength={160} rows={3} className="input" placeholder="auto from details (max 160 characters)" /></F>
            <p className="text-xs text-muted">Tip: include the area and district, e.g. "3-bedroom house for sale in Kicukiro, Kigali".</p>
          </Box>
        </div>
      </ActionForm>
      {p && (
        <form action={deleteProperty} className="mt-6"><input type="hidden" name="id" value={p.id} />
          <ConfirmButton message="Delete this property permanently?">Delete this property</ConfirmButton>
        </form>
      )}
    </>
  );
}

function Box({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="space-y-4 rounded-2xl bg-white p-5 shadow-sm"><h2 className="font-sans font-bold text-navy">{title}</h2>{children}</section>;
}
function F({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <label className={`block ${full ? "sm:col-span-2" : ""}`}><span className="label">{label}</span>{children}</label>;
}
