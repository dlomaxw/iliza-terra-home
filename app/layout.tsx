import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/700-italic.css";
import "./globals.css";
import { getSettings } from "@/lib/data";
import { siteUrl } from "@/lib/format";

export const viewport: Viewport = { themeColor: "#0b3a6e", width: "device-width", initialScale: 1 };

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: s.seo_title, template: `%s | ${s.company_name}` },
    description: s.seo_description,
    applicationName: s.company_name,
    keywords: [
      "real estate Rwanda", "property for sale Kigali", "houses for sale in Kigali", "land for sale in Rwanda",
      "apartments for rent Kigali", "Lake Kivu land", "invest in Rwanda", "insurance broker Rwanda",
      "property management Kigali", "Rwanda diaspora investment", "Iliza Terra Homes",
    ],
    alternates: { canonical: "/" },
    openGraph: {
      type: "website", locale: "en_RW", siteName: s.company_name, title: s.seo_title, description: s.seo_description,
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: s.company_name }],
    },
    twitter: { card: "summary_large_image", title: s.seo_title, description: s.seo_description, images: ["/og.jpg"] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
    verification: s.google_verification ? { google: s.google_verification } : undefined,
    other: { "geo.region": "RW-01", "geo.placename": "Kigali", "geo.position": "-1.9441;30.0619", ICBM: "-1.9441, 30.0619" },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-RW">
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
