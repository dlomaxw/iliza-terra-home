import Script from "next/script";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { JsonLd } from "@/components/JsonLd";
import { getSettings } from "@/lib/data";
import { siteUrl, absUrl } from "@/lib/format";
import { SERVICES } from "@/lib/content";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const sameAs = [s.facebook, s.instagram, s.linkedin, s.x, s.youtube, s.tiktok].filter(Boolean);
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded focus:bg-white focus:px-3 focus:py-2">Skip to content</a>
      <Header phone={s.phone} email={s.email} address={s.address} />
      <main id="main">{children}</main>
      <Footer s={s} />
      <WhatsAppFloat number={s.whatsapp} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["RealEstateAgent", "InsuranceAgency"],
        "@id": siteUrl() + "/#organization",
        name: s.company_name,
        slogan: s.tagline,
        description: s.seo_description,
        url: siteUrl(),
        logo: absUrl("/brand/logo-dark.png"),
        image: absUrl("/og.jpg"),
        telephone: s.phone,
        email: s.email,
        address: { "@type": "PostalAddress", streetAddress: "St KN 87", addressLocality: "Kigali", addressCountry: "RW" },
        geo: { "@type": "GeoCoordinates", latitude: -1.9441, longitude: 30.0619 },
        areaServed: { "@type": "Country", name: "Rwanda" },
        knowsLanguage: ["en", "rw", "fr"],
        sameAs: sameAs.length ? sameAs : undefined,
        hasOfferCatalog: {
          "@type": "OfferCatalog", name: "Real estate, land, insurance and investment services in Rwanda",
          itemListElement: SERVICES.map((sv) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: sv.title, url: absUrl(`/services/${sv.slug}`) } })),
        },
      }} />
      {s.ga_id && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${s.ga_id}`} strategy="afterInteractive" />
          <Script id="ga" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${s.ga_id.replace(/[^A-Z0-9-]/gi, "")}');`}</Script>
        </>
      )}
    </>
  );
}
