import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { SERVICES, LOCATIONS } from "@/lib/content";
import { FacebookIcon, InstagramIcon, LinkedinIcon, XIcon, YoutubeIcon, TiktokIcon } from "./Social";
import { NewsletterForm } from "./Forms";

export function Footer({ s }: { s: Record<string, string> }) {
  const socials = [
    { url: s.facebook, label: "Facebook", Icon: FacebookIcon },
    { url: s.instagram, label: "Instagram", Icon: InstagramIcon },
    { url: s.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
    { url: s.x, label: "X", Icon: XIcon },
    { url: s.youtube, label: "YouTube", Icon: YoutubeIcon },
    { url: s.tiktok, label: "TikTok", Icon: TiktokIcon },
  ].filter((x) => x.url);
  return (
    <footer className="brand-gradient text-white/80">
      <div className="wave-divider" />
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image src="/brand/logo.png" alt="Iliza Terra Homes" width={417} height={198} className="h-16 w-auto" />
          <p className="mt-4 text-sm leading-relaxed">{s.hero_subtitle}</p>
          {socials.length > 0 && (
            <div className="mt-5 flex gap-3">
              {socials.map(({ url, label, Icon }) => (
                <a key={label} href={url} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition hover:bg-orange hover:text-navy-dark">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>
        <div>
          <h2 className="mb-4 font-sans text-sm font-bold uppercase tracking-wider text-orange">Our Services</h2>
          <ul className="space-y-2 text-sm">
            {SERVICES.map((sv) => (
              <li key={sv.slug}><Link href={`/services/${sv.slug}`} className="hover:text-white">{sv.title.replace(" — Buy, Sell & Lease", "")}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-4 font-sans text-sm font-bold uppercase tracking-wider text-orange">Explore</h2>
          <ul className="space-y-2 text-sm">
            <li><Link href="/properties?type=sale" className="hover:text-white">Property for Sale in Rwanda</Link></li>
            <li><Link href="/properties?type=rent" className="hover:text-white">Houses & Apartments for Rent</Link></li>
            <li><Link href="/properties?category=land" className="hover:text-white">Land & Plots for Sale</Link></li>
            {LOCATIONS.map((l) => (
              <li key={l.slug}><Link href={`/locations/${l.slug}`} className="hover:text-white">Property in {l.name}</Link></li>
            ))}
            <li><Link href="/invest-in-rwanda" className="hover:text-white">Invest in Rwanda</Link></li>
            <li><Link href="/insights" className="hover:text-white">Insights & Guides</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-4 font-sans text-sm font-bold uppercase tracking-wider text-orange">Contact Us</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2.5"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-orange" /><a href={`tel:${s.phone.replace(/\s/g, "")}`} className="hover:text-white">{s.phone}</a></li>
            <li className="flex gap-2.5"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-orange" /><a href={`mailto:${s.email}`} className="break-all hover:text-white">{s.email}</a></li>
            <li className="flex gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange" />{s.address}</li>
            <li className="flex gap-2.5"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-orange" />{s.hours}</li>
          </ul>
          <h2 className="mt-6 mb-2 font-sans text-sm font-bold uppercase tracking-wider text-orange">Opportunity alerts</h2>
          <NewsletterForm />
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} {s.company_name}. All rights reserved. Kigali, Rwanda.</p>
          <p className="font-semibold tracking-wider text-white/90">INVEST · DEVELOP · OWN · <span className="text-orange">INSURE IN RWANDA</span></p>
        </div>
      </div>
    </footer>
  );
}
