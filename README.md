# Iliza Terra Homes — Website & Admin Dashboard

A real-estate, land, insurance and investment website for **Iliza Terra Homes (Kigali, Rwanda)**. It has a full admin dashboard and Rwanda-focused SEO.

Built with Next.js 16, React 19 and Tailwind CSS 4. Hosted on **Cloudflare Workers**, with a **D1** database and **R2** photo storage.

**Live:** https://iliza-terra-homes.despotic62.workers.dev Brand colours (green, orange, blue and white) and the logo come from the company flyer.

---

## What's included

### Public website
| Page | URL |
|---|---|
| Home (hero, search, services, featured listings, sectors, why Rwanda, locations, diaspora, insights) | `/` |
| Property search with filters (buy/rent/lease, type, district, price, bedrooms, sort) | `/properties` |
| Property detail (gallery, facts, features, video tour, map, enquiry form, WhatsApp, similar listings) | `/properties/[slug]` |
| 8 service pages (brokerage, land, insurance, construction, legal, management, diaspora, investor connections) | `/services/...` |
| Invest in Rwanda (why Rwanda, 7 sectors, investment journey) | `/invest-in-rwanda` |
| Location landing pages (Kigali, Lake Kivu, Musanze, Bugesera, rest of Rwanda) | `/locations/...` |
| Insights / blog | `/insights` |
| About, Contact (form + map) | `/about`, `/contact` |

Also included: a floating WhatsApp button, opportunity-alert newsletter signup, a mobile menu, all 30 Rwandan districts, and prices in USD or RWF.

### Admin dashboard (`/admin`)
- **Dashboard** – live listings, new enquiries, listing views, most viewed listings and enquiries by interest
- **Properties** – add, edit and delete listings; upload several photos (resized automatically to WebP); choose the cover photo; mark as featured; set Draft, Published or Sold/Let; add the UPI, a YouTube tour, a map pin and SEO fields
- **Insights / Blog** – write articles in Markdown, with a cover image and SEO fields
- **Enquiries (CRM)** – every form submission, with status (new → contacted → qualified → closed), internal notes, one-click call/WhatsApp/email and CSV export
- **Subscribers** – the newsletter list, with CSV export
- **Site settings & SEO** – phone, WhatsApp, email, address, hours, homepage headline, default SEO title and description, Google Search Console code, Google Analytics ID, social links and the USD→RWF rate
- **Users** – admin and editor roles; **My account** – change your password
- Security: hashed passwords, signed http-only session cookies, protection against repeated login attempts, a spam honeypot on public forms, and a search-engine `noindex` on admin pages

### SEO (Rwanda-focused)
- A unique title, description and canonical URL on every page, built around search phrases such as "houses for sale in Kigali", "land for sale in Rwanda" and "Lake Kivu land"
- Structured data (JSON-LD): `RealEstateAgent` + `InsuranceAgency` with a Kigali address and Rwanda as the service area, `RealEstateListing` for each property, `Service`, `Article`, `BreadcrumbList` and `ItemList`
- An automatic `sitemap.xml` (including listing images) and `robots.txt`
- Open Graph and Twitter share images for WhatsApp, Facebook and LinkedIn previews
- Geo meta tags for Kigali, `lang="en-RW"`, and a web app manifest with icons
- Location and service landing pages, plus crawlable filter URLs (`/properties?district=Gasabo`)
- Fast: static pages are regenerated in the background, images are optimised and fonts are self-hosted

---

## Run it on your computer

```bash
npm install
cp .env.example .dev.vars      # then edit the values
npm run db:migrate:local       # create the local D1 tables
npm run preview                # http://localhost:8787 (Cloudflare runtime)
```

On first start the app creates the database, the first admin account (from `ADMIN_EMAIL` / `ADMIN_PASSWORD`), 8 sample listings and 3 articles.
**The samples are labelled "Sample" in the admin — replace them with real listings and photos before launch.**

---

## Deploy

### Cloudflare (current setup)
| Resource | Name |
|---|---|
| Worker | `iliza-terra-homes` |
| D1 database | `iliza-terra-homes-db` (binding `DB`) |
| R2 bucket | `iliza-terra-homes-media` (binding `MEDIA`), photos served at `/media/...` |
| Variables | `SITE_URL`, `ADMIN_EMAIL` (in `wrangler.jsonc`) |
| Secrets | `ADMIN_PASSWORD`, `SESSION_SECRET` (set with `wrangler secret put`) |

To deploy changes, set `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`, then run:
```bash
npm run db:migrate   # only when there are new files in migrations/
npm run deploy
```
Photos are resized to WebP in the browser before upload, so uploads stay small.

**Custom domain:** add the domain to Cloudflare, open Workers & Pages → `iliza-terra-homes` → Settings → Domains & Routes → Add custom domain, then change `SITE_URL` in `wrangler.jsonc` and redeploy.

### Optional: enquiry emails
Add `RESEND_API_KEY` (from resend.com) as a Worker secret and `NOTIFY_FROM` as a variable. Each new enquiry will then be emailed to the address set in **Site settings**.

---

## After launch — SEO checklist
1. Log in at `/admin`, open **My account**, and change the password.
2. **Site settings**: check the contact details and add your social media links.
3. **Google Search Console**: add your domain, paste the verification code into Settings, then submit `https://yourdomain/sitemap.xml`.
4. **Google Business Profile**: create or claim "Iliza Terra Homes" in Kigali using the same name, address and phone as the website. This matters most for local searches.
5. **Google Analytics 4**: paste the `G-…` ID into Settings.
6. Add real listings with good photos. Use the area and district in titles, e.g. "3-Bedroom House for Sale in Kicukiro".
7. Publish an article every 2–4 weeks (buying guides, Lake Kivu, diaspora investing, insurance).
8. Review the sample articles before relying on them. They are general overviews, not legal advice.

## Where to edit things
- Services, sectors, locations and districts: `lib/content.ts`
- Colours and fonts: `app/globals.css`
- Logo and hero image: `public/brand/`; share image: `public/og.jpg`
