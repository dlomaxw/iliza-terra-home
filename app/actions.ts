"use server";
import { run, q1 } from "@/lib/db";
import { getSettings } from "@/lib/data";
import { notifyNewInquiry } from "@/lib/notify";
import { siteUrl } from "@/lib/format";

export type FormState = { ok?: boolean; error?: string; message?: string };

const str = (f: FormData, k: string, max = 2000) => String(f.get(k) ?? "").trim().slice(0, max);

export async function submitInquiry(_: FormState, f: FormData): Promise<FormState> {
  if (str(f, "company_website")) return { ok: true, message: "Thank you!" }; // honeypot
  const name = str(f, "name", 120);
  const email = str(f, "email", 160);
  const phone = str(f, "phone", 40);
  if (!name) return { error: "Please enter your name." };
  if (!email && !phone) return { error: "Please give us an email address or phone number so we can reply." };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Please check your email address." };
  const propertyId = Number(f.get("property_id")) || null;
  const data = {
    country: str(f, "country", 80), interest: str(f, "interest", 80), budget: str(f, "budget", 80),
    message: str(f, "message", 4000), source: str(f, "source", 40) || "contact",
  };
  await run(
    "INSERT INTO inquiries (name, email, phone, country, interest, budget, message, property_id, source) VALUES (?,?,?,?,?,?,?,?,?)",
    [name, email, phone, data.country, data.interest, data.budget, data.message, propertyId, data.source]
  );
  const s = await getSettings();
  const prop = propertyId ? await q1<{ title: string; slug: string }>("SELECT title, slug FROM properties WHERE id = ?", [propertyId]) : null;
  await notifyNewInquiry(s.email, `New enquiry from ${name}${prop ? ` — ${prop.title}` : ""}`, [
    `Name: ${name}`, `Email: ${email}`, `Phone: ${phone}`, `Country: ${data.country}`, `Interest: ${data.interest}`,
    `Budget: ${data.budget}`, prop ? `Property: ${prop.title} (${siteUrl()}/properties/${prop.slug})` : "", "", data.message,
    "", `Manage enquiries: ${siteUrl()}/admin/inquiries`,
  ]);
  return { ok: true, message: "Thank you! Our team will get back to you within one business day." };
}

export async function subscribe(_: FormState, f: FormData): Promise<FormState> {
  const email = str(f, "email", 160).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email." };
  await run("INSERT OR IGNORE INTO subscribers (email) VALUES (?)", [email]);
  return { ok: true, message: "Subscribed — we'll send you new opportunities." };
}
