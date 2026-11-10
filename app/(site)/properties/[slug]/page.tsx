import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BedDouble, Bath, Ruler, LandPlot, MapPin, CheckCircle2, Phone, Hash } from "lucide-react";
import { getProperty, getSettings, similarProperties } from "@/lib/data";
import { run } from "@/lib/db";
import { formatPrice, parseImages, splitList, absUrl } from "@/lib/format";
import { LISTING_TYPES, CATEGORIES, labelOf } from "@/lib/content";
import { PageHero } from "@/components/Bits";
import { Gallery } from "@/components/Gallery";
import { ContactForm } from "@/components/Forms";
import { PropertyCard } from "@/components/PropertyCard";
import { JsonLd } from "@/components/JsonLd";
import { WhatsappIcon } from "@/components/Social";

type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const p = await getProperty((await params).slug);
  if (!p) return { title: "Property not found" };
  const img = parseImages(p.images)[0];
  const desc = p.meta_description || `${labelOf(CATEGORIES, p.category)} ${labelOf(LISTING_TYPES, p.listing_type).toLowerCase()} in ${p.area ? p.area + ", " : ""}${p.district}, Rwanda — ${formatPrice(p.price, p.currency, p.price_period)}. ${p.description.slice(0, 110)}`;
  return {
    title: p.meta_title || `${p.title} — ${p.area ? p.area + ", " : ""}${p.district}`,
    description: desc.slice(0, 160),
    alternates: { canonical: `/properties/${p.slug}` },
    openGraph: { title: p.title, description: desc.slice(0, 160), type: "website", images: img ? [{ url: absUrl(img) }] : undefined },
  };
}

export default async function PropertyPage({ params }: P) {
  const p = await getProperty((await params).slug);
  if (!p) notFound();
  run("UPDATE properties SET views = views + 1 WHERE id = ?", [p.id]).catch(() => {});
  const [s, similar] = await Promise.all([getSettings(), similarProperties(p)]);
  const images = parseImages(p.images);
  const features = splitList(p.features);
  const facts = [
    p.bedrooms != null && { icon: BedDouble, label: "Bedrooms", value: p.bedrooms },
    p.bathrooms != null && { icon: Bath, label: "Bathrooms", value: p.bathrooms },
    p.size_sqm && { icon: Ruler, label: "Built area", value: `${p.size_sqm.toLocaleString()} m²` },
    p.plot_sqm && { icon: LandPlot, label: "Plot size", value: `${p.plot_sqm.toLocaleString()} m²` },
    p.upi && { icon: Hash, label: "UPI", value: p.upi },
  ].filter(Boolean) as { icon: typeof Ruler; label: string; value: string | number }[];
  const wa = `https://wa.me/${s.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello, I'm interested in "${p.title}" (${absUrl(`/properties/${p.slug}`)})`)}`;

  return (
    <>
      <PageHero eyebrow={`${labelOf(CATEGORIES, p.category)} · ${labelOf(LISTING_TYPES, p.listing_type)}`} title={p.title}
        crumbs={[{ name: "Properties", href: "/properties" }, { name: p.district, href: `/properties?district=${encodeURIComponent(p.district)}` }, { name: p.title, href: `/properties/${p.slug}` }]} />
      <section className="container-x grid gap-10 py-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Gallery images={images} title={p.title} category={p.category} />
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="flex items-center gap-1.5 text-muted"><MapPin className="h-5 w-5 text-green" />{[p.area, p.district, "Rwanda"].filter(Boolean).join(", ")}</p>
            <p className="text-3xl font-bold text-orange-dark">{formatPrice(p.price, p.currency, p.price_period)}{p.status === "sold" && <span className="ml-3 rounded-full bg-red-600 px-3 py-1 align-middle text-sm text-white">{p.listing_type === "sale" ? "Sold" : "Let"}</span>}</p>
          </div>
          {facts.length > 0 && (
            <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {facts.map((f) => (
                <div key={f.label} className="rounded-xl bg-sky-light p-4">
                  <f.icon className="h-5 w-5 text-sky" />
                  <dt className="mt-2 text-xs text-muted">{f.label}</dt>
                  <dd className="font-bold text-navy">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <h2 className="mt-10 text-2xl font-bold text-navy">About this property</h2>
          <div className="prose-iliza mt-2">{p.description.split(/\n\n+/).map((para, i) => <p key={i}>{para}</p>)}</div>
          {features.length > 0 && (
            <>
              <h2 className="mt-10 text-2xl font-bold text-navy">Features</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {features.map((f) => <li key={f} className="flex gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-green" />{f}</li>)}
              </ul>
            </>
          )}
          {p.video_url && (
            <>
              <h2 className="mt-10 text-2xl font-bold text-navy">Video tour</h2>
              <div className="mt-4 aspect-video overflow-hidden rounded-2xl">
                <iframe src={toEmbed(p.video_url)} title={`${p.title} video tour`} className="h-full w-full" allowFullScreen loading="lazy" />
              </div>
            </>
          )}
          {p.lat != null && p.lng != null && (
            <>
              <h2 className="mt-10 text-2xl font-bold text-navy">Location</h2>
              <div className="mt-4 aspect-video overflow-hidden rounded-2xl">
                <iframe title="Map" loading="lazy" className="h-full w-full" src={`https://www.google.com/maps?q=${p.lat},${p.lng}&z=14&output=embed`} />
              </div>
            </>
          )}
        </div>
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <div className="card overflow-hidden">
            <div className="bg-navy p-5 text-white">
              <p className="text-sm text-white/75">Interested in this property?</p>
              <p className="font-serif text-xl font-bold">Book a viewing or ask a question</p>
            </div>
            <div className="p-5">
              <div className="mb-5 grid grid-cols-2 gap-2">
                <a href={`tel:${s.phone.replace(/\s/g, "")}`} className="btn-ghost !px-3"><Phone className="h-4 w-4" />Call</a>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="btn !bg-[#25d366] !px-3 text-white"><WhatsappIcon className="h-4 w-4" />WhatsApp</a>
              </div>
              <ContactForm compact propertyId={p.id} source="property" defaultInterest={p.listing_type === "sale" ? "Buying property" : "Renting / leasing"}
                defaultMessage={`I'm interested in "${p.title}". Please send me more details.`} />
            </div>
          </div>
        </aside>
      </section>
      {similar.length > 0 && (
        <section className="bg-slate-50 py-16">
          <div className="container-x">
            <h2 className="section-title mb-8">Similar opportunities</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{similar.map((x) => <PropertyCard key={x.id} p={x} />)}</div>
          </div>
        </section>
      )}
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        name: p.title,
        url: absUrl(`/properties/${p.slug}`),
        description: p.description.slice(0, 500),
        datePosted: p.created_at.slice(0, 10),
        image: images.map(absUrl),
        offers: p.price != null ? {
          "@type": "Offer", price: p.price, priceCurrency: p.currency,
          availability: p.status === "sold" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
          businessFunction: p.listing_type === "sale" ? "http://purl.org/goodrelations/v1#Sell" : "http://purl.org/goodrelations/v1#LeaseOut",
          seller: { "@id": absUrl("/#organization") },
        } : undefined,
        about: {
          "@type": p.category === "apartment" ? "Apartment" : ["land", "lakefront", "farm"].includes(p.category) ? "Place" : p.category === "house" ? "SingleFamilyResidence" : "Place",
          address: { "@type": "PostalAddress", addressLocality: p.area || p.district, addressRegion: p.district, addressCountry: "RW" },
          ...(p.bedrooms != null ? { numberOfRooms: p.bedrooms } : {}),
          ...(p.size_sqm ? { floorSize: { "@type": "QuantitativeValue", value: p.size_sqm, unitCode: "MTK" } } : {}),
          ...(p.lat != null && p.lng != null ? { geo: { "@type": "GeoCoordinates", latitude: p.lat, longitude: p.lng } } : {}),
        },
      }} />
    </>
  );
}

function toEmbed(url: string) {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]{6,})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  return url;
}
