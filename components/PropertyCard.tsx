import Link from "next/link";
import { BedDouble, Bath, Ruler, MapPin } from "lucide-react";
import type { Property } from "@/lib/types";
import { formatPrice, parseImages } from "@/lib/format";
import { LISTING_TYPES, CATEGORIES, labelOf } from "@/lib/content";
import { PropertyImage } from "./PropertyImage";

export function PropertyCard({ p }: { p: Property }) {
  const img = parseImages(p.images)[0];
  const size = p.size_sqm ? `${p.size_sqm.toLocaleString()} m²` : p.plot_sqm ? `${p.plot_sqm.toLocaleString()} m² plot` : null;
  return (
    <Link href={`/properties/${p.slug}`} className="group card flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden">
        <PropertyImage src={img} alt={p.title} category={p.category} className="transition duration-500 group-hover:scale-105" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${p.listing_type === "sale" ? "bg-orange text-navy-dark" : "bg-green text-white"}`}>
            {labelOf(LISTING_TYPES, p.listing_type)}
          </span>
          {p.status === "sold" && <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">{p.listing_type === "sale" ? "Sold" : "Let"}</span>}
        </div>
        <span className="absolute right-3 bottom-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-navy">{labelOf(CATEGORIES, p.category)}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-1 text-xs font-medium text-muted"><MapPin className="h-3.5 w-3.5 text-green" />{[p.area, p.district].filter(Boolean).join(", ")}</p>
        <h3 className="mt-1.5 font-sans text-lg leading-snug font-semibold text-navy group-hover:text-sky">{p.title}</h3>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
          {p.bedrooms != null && <span className="flex items-center gap-1"><BedDouble className="h-4 w-4" />{p.bedrooms} bed</span>}
          {p.bathrooms != null && <span className="flex items-center gap-1"><Bath className="h-4 w-4" />{p.bathrooms} bath</span>}
          {size && <span className="flex items-center gap-1"><Ruler className="h-4 w-4" />{size}</span>}
        </div>
        <p className="mt-auto pt-4 text-xl font-bold text-orange-dark">{formatPrice(p.price, p.currency, p.price_period)}</p>
      </div>
    </Link>
  );
}
