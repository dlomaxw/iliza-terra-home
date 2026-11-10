import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/data";
import { AdminHead } from "@/components/admin/Head";
import { ActionForm, Submit } from "@/components/admin/ui";
import { saveSettings } from "../../actions";

const GROUPS: { title: string; note?: string; fields: [string, string, ("text" | "area")?, string?][] }[] = [
  { title: "Company & contact", fields: [["company_name", "Company name"], ["phone", "Phone"], ["whatsapp", "WhatsApp number (digits, with country code)", "text", "250788300630"], ["email", "Email (enquiry notifications go here)"], ["address", "Address"], ["hours", "Opening hours"]] },
  { title: "Home page", fields: [["tagline", "Headline"], ["hero_subtitle", "Intro text", "area"]] },
  { title: "SEO & Google", note: "These control how your site appears in Google search results and when shared on WhatsApp/Facebook.", fields: [
    ["seo_title", "Default page title (max ~60 characters)"], ["seo_description", "Default meta description (max ~160 characters)", "area"],
    ["google_verification", "Google Search Console verification code", "text", "the content=\"…\" value only"], ["ga_id", "Google Analytics 4 measurement ID", "text", "G-XXXXXXXXXX"],
  ] },
  { title: "Social media links", note: "Leave empty to hide an icon.", fields: [["facebook", "Facebook URL"], ["instagram", "Instagram URL"], ["linkedin", "LinkedIn URL"], ["x", "X (Twitter) URL"], ["youtube", "YouTube URL"], ["tiktok", "TikTok URL"]] },
  { title: "Search filters", fields: [["usd_to_rwf", "Exchange rate used for price filters (RWF per 1 USD)"]] },
];

export default async function SettingsPage() {
  await requireAdmin();
  const s = await getSettings();
  return (
    <>
      <AdminHead title="Site settings & SEO" sub="Changes appear on the website immediately." />
      <ActionForm action={saveSettings} className="max-w-3xl space-y-6">
        {GROUPS.map((g) => (
          <section key={g.title} className="space-y-4 rounded-2xl bg-white p-5 shadow-sm">
            <div><h2 className="font-sans font-bold text-navy">{g.title}</h2>{g.note && <p className="text-xs text-muted">{g.note}</p>}</div>
            {g.fields.map(([key, label, type, ph]) => (
              <label key={key} className="block"><span className="label">{label}</span>
                {type === "area" ? <textarea name={key} rows={3} defaultValue={s[key]} className="input" /> : <input name={key} defaultValue={s[key]} placeholder={ph} className="input" />}
              </label>
            ))}
          </section>
        ))}
        <Submit className="btn-green">Save settings</Submit>
      </ActionForm>
    </>
  );
}
