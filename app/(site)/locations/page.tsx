import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { LOCATIONS } from "@/lib/content";
import { PageHero } from "@/components/Bits";

export const metadata: Metadata = {
  title: "Property & Land by Location in Rwanda — Kigali, Lake Kivu, Musanze, Bugesera",
  description: "Explore property, land and investment opportunities by location across Rwanda: Kigali, Lake Kivu (Rubavu, Karongi, Rusizi), Musanze, Bugesera and beyond.",
  alternates: { canonical: "/locations" },
};

export default function LocationsPage() {
  return (
    <>
      <PageHero eyebrow="Locations" title="Property & Land Across Rwanda" crumbs={[{ name: "Locations", href: "/locations" }]}
        intro="From the hills of Kigali to the shores of Lake Kivu and the foothills of the Virunga volcanoes." />
      <section className="container-x grid gap-6 py-16 md:grid-cols-2">
        {LOCATIONS.map((l) => (
          <Link key={l.slug} href={`/locations/${l.slug}`} className="group card p-7 hover:border-sky hover:shadow-lg">
            <MapPin className="h-7 w-7 text-green" />
            <h2 className="mt-3 text-2xl font-bold text-navy group-hover:text-sky">{l.name}</h2>
            <p className="mt-2 text-muted">{l.intro}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-green">View listings <ArrowRight className="h-4 w-4" /></span>
          </Link>
        ))}
      </section>
    </>
  );
}
