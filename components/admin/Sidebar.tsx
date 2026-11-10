"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Building2, FileText, Inbox, Mail, Settings, Users, UserCircle, ExternalLink, LogOut, Menu, X } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";

export function Sidebar({ role, name, newCount }: { role: string; name: string; newCount: number }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const items = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/properties", label: "Properties", icon: Building2 },
    { href: "/admin/posts", label: "Insights / Blog", icon: FileText },
    { href: "/admin/inquiries", label: "Enquiries", icon: Inbox, badge: newCount },
    { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
    ...(role === "admin" ? [{ href: "/admin/settings", label: "Site settings & SEO", icon: Settings }, { href: "/admin/users", label: "Users", icon: Users }] : []),
    { href: "/admin/account", label: "My account", icon: UserCircle },
  ];
  const nav = (
    <nav className="flex flex-1 flex-col gap-1 p-3">
      {items.map((it) => {
        const active = it.exact ? path === it.href : path.startsWith(it.href);
        return (
          <Link key={it.href} href={it.href} onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${active ? "bg-white/15 text-white" : "text-white/75 hover:bg-white/10 hover:text-white"}`}>
            <it.icon className="h-4.5 w-4.5" />{it.label}
            {!!it.badge && <span className="ml-auto rounded-full bg-orange px-2 py-0.5 text-xs font-bold text-navy-dark">{it.badge}</span>}
          </Link>
        );
      })}
      <div className="mt-auto space-y-1 border-t border-white/10 pt-3">
        <a href="/" target="_blank" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/75 hover:bg-white/10 hover:text-white"><ExternalLink className="h-4.5 w-4.5" />View website</a>
        <form action={logoutAction}><button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/75 hover:bg-white/10 hover:text-white"><LogOut className="h-4.5 w-4.5" />Sign out</button></form>
        <p className="px-3 pt-2 text-xs text-white/50">Signed in as {name} ({role})</p>
      </div>
    </nav>
  );
  return (
    <>
      <div className="flex items-center justify-between bg-navy px-4 py-3 lg:hidden">
        <Image src="/brand/logo.png" alt="Iliza Terra Homes" width={417} height={198} className="h-9 w-auto" />
        <button onClick={() => setOpen(!open)} className="text-white" aria-label="Menu">{open ? <X /> : <Menu />}</button>
      </div>
      {open && <div className="flex flex-col bg-navy lg:hidden">{nav}</div>}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-navy lg:flex">
        <div className="wave-divider" />
        <div className="p-5"><Image src="/brand/logo.png" alt="Iliza Terra Homes" width={417} height={198} className="h-14 w-auto" /></div>
        {nav}
      </aside>
    </>
  );
}
