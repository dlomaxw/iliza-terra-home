"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Phone, Mail, MapPin } from "lucide-react";

const NAV = [
  { href: "/properties", label: "Properties" },
  { href: "/services", label: "Services" },
  { href: "/invest-in-rwanda", label: "Invest in Rwanda" },
  { href: "/locations", label: "Locations" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header({ phone, email, address }: { phone: string; email: string; address: string }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  useEffect(() => setOpen(false), [path]);
  return (
    <header className="sticky top-0 z-50">
      <div className="hidden bg-navy-dark text-xs text-white/85 md:block">
        <div className="container-x flex h-9 items-center justify-between">
          <div className="flex items-center gap-6">
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-center gap-1.5 hover:text-orange"><Phone className="h-3.5 w-3.5 text-orange" />{phone}</a>
            <a href={`mailto:${email}`} className="flex items-center gap-1.5 hover:text-orange"><Mail className="h-3.5 w-3.5 text-orange" />{email}</a>
          </div>
          <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-orange" />{address}</span>
        </div>
      </div>
      <div className="bg-navy shadow-lg shadow-navy/20">
        <div className="wave-divider" />
        <div className="container-x flex h-16 items-center justify-between lg:h-20">
          <Link href="/" aria-label="Iliza Terra Homes — home" className="shrink-0">
            <Image src="/brand/logo.png" alt="Iliza Terra Homes logo" width={417} height={198} priority className="h-12 w-auto lg:h-16" />
          </Link>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {NAV.map((n) => {
              const active = path === n.href || path.startsWith(n.href + "/");
              return (
                <Link key={n.href} href={n.href}
                  className={`rounded-full px-3 py-2 text-sm font-medium transition ${active ? "text-orange" : "text-white/90 hover:text-orange"}`}>
                  {n.label}
                </Link>
              );
            })}
            <Link href="/contact?interest=Investment%20partnership" className="btn-primary ml-3 !py-2.5">Talk to an Advisor</Link>
          </nav>
          <button className="rounded-lg p-2 text-white lg:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {open && (
          <nav className="border-t border-white/10 bg-navy lg:hidden" aria-label="Mobile">
            <div className="container-x flex flex-col py-3">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="rounded-lg px-3 py-3 text-base font-medium text-white hover:bg-white/10">{n.label}</Link>
              ))}
              <Link href="/contact" className="btn-primary mt-3 mb-2">Talk to an Advisor</Link>
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="px-3 py-2 text-sm text-white/80">{phone}</a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
