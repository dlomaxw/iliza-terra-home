import { Search } from "lucide-react";
import { LISTING_TYPES, CATEGORIES, DISTRICTS } from "@/lib/content";

type SP = Record<string, string | undefined>;

/** Plain GET form — works without JavaScript and produces crawlable, shareable URLs. */
export function PropertyFilters({ sp, action = "/properties", hero = false }: { sp: SP; action?: string; hero?: boolean }) {
  return (
    <form action={action} method="get"
      className={`grid gap-3 rounded-2xl bg-white p-4 shadow-xl ${hero ? "sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]" : "sm:grid-cols-2 lg:grid-cols-6"}`}>
      <div className={hero ? "" : "lg:col-span-2"}>
        <label className="label !text-xs !text-muted" htmlFor="f-q">Keyword</label>
        <input id="f-q" name="q" defaultValue={sp.q} placeholder="e.g. Nyarutarama, villa, lake" className="input" />
      </div>
      <div>
        <label className="label !text-xs !text-muted" htmlFor="f-type">Looking to</label>
        <select id="f-type" name="type" defaultValue={sp.type ?? ""} className="input">
          <option value="">Buy, rent or lease</option>
          {LISTING_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>
      <div>
        <label className="label !text-xs !text-muted" htmlFor="f-cat">Property type</label>
        <select id="f-cat" name="category" defaultValue={sp.category ?? ""} className="input">
          <option value="">All types</option>
          {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>
      <div>
        <label className="label !text-xs !text-muted" htmlFor="f-district">District</label>
        <select id="f-district" name="district" defaultValue={sp.district ?? ""} className="input">
          <option value="">All of Rwanda</option>
          {Object.entries(DISTRICTS).map(([prov, ds]) => (
            <optgroup key={prov} label={prov}>{ds.map((d) => <option key={d}>{d}</option>)}</optgroup>
          ))}
        </select>
      </div>
      {!hero && (
        <>
          <div>
            <label className="label !text-xs !text-muted" htmlFor="f-max">Max price (USD)</label>
            <select id="f-max" name="max" defaultValue={sp.max ?? ""} className="input">
              <option value="">Any</option>
              {[1000, 2500, 50000, 100000, 250000, 500000, 1000000].map((v) => <option key={v} value={v}>${v.toLocaleString()}</option>)}
            </select>
          </div>
          <div>
            <label className="label !text-xs !text-muted" htmlFor="f-beds">Bedrooms</label>
            <select id="f-beds" name="beds" defaultValue={sp.beds ?? ""} className="input">
              <option value="">Any</option>
              {[1, 2, 3, 4, 5].map((v) => <option key={v} value={v}>{v}+</option>)}
            </select>
          </div>
          <div>
            <label className="label !text-xs !text-muted" htmlFor="f-sort">Sort by</label>
            <select id="f-sort" name="sort" defaultValue={sp.sort ?? ""} className="input">
              <option value="">Featured first</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </div>
        </>
      )}
      <div className={`flex items-end ${hero ? "" : "lg:col-span-3 lg:justify-end"}`}>
        <button className="btn-green w-full !rounded-lg lg:w-auto"><Search className="h-4 w-4" />Search</button>
      </div>
    </form>
  );
}
