export function formatPrice(price: number | null, currency: string, period = "") {
  if (price == null) return "Price on request";
  const n = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(price);
  const s = currency === "RWF" ? `RWF ${n}` : `$${n}`;
  return period ? `${s} / ${period}` : s;
}
export function parseImages(json: string): string[] {
  try { const a = JSON.parse(json); return Array.isArray(a) ? a.filter(Boolean) : []; } catch { return []; }
}
export function splitList(s: string) {
  return s.split(/[,\n]/).map((x) => x.trim()).filter(Boolean);
}
export function slugify(s: string) {
  return s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 90);
}
export function formatDate(s: string) {
  const d = new Date(s.includes("T") ? s : s.replace(" ", "T") + "Z");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
export function siteUrl() {
  return (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}
export function absUrl(p: string) {
  if (!p) return p;
  return p.startsWith("http") ? p : siteUrl() + (p.startsWith("/") ? p : "/" + p);
}
