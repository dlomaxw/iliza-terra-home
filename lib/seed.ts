// Sample content created on first launch so the site is not empty.
// Every sample is flagged `is_sample` and labelled in the admin dashboard — replace or delete before going live.

type SeedProperty = {
  title: string; slug: string; listing_type: string; category: string; district: string; area: string;
  price: number; currency: string; price_period?: string; bedrooms?: number; bathrooms?: number;
  size_sqm?: number; plot_sqm?: number; description: string; features: string; images?: string[]; featured?: boolean;
};

export const SEED_PROPERTIES: SeedProperty[] = [
  {
    title: "Modern Lakeview Villa with Infinity Pool",
    slug: "modern-lakeview-villa-infinity-pool-rubavu",
    listing_type: "sale", category: "house", district: "Rubavu", area: "Gisenyi Lakeside",
    price: 650000, currency: "USD", bedrooms: 5, bathrooms: 5, size_sqm: 420, plot_sqm: 1800,
    description:
      "A contemporary stone-and-glass villa overlooking Lake Kivu, with an infinity pool, open-plan living areas that open onto a sunset terrace, and landscaped tropical gardens.\n\nIdeal as a family residence, a boutique guest house or a premium short-stay rental for visitors to Rubavu.",
    features: "Infinity pool, Lake view, Sunset terrace, Fully fitted kitchen, Staff quarters, Parking for 4 cars, Backup generator, Water tank",
    images: ["/brand/hero.jpg"], featured: true,
  },
  {
    title: "4-Bedroom Family Home in Kibagabaga",
    slug: "4-bedroom-family-home-kibagabaga-kigali",
    listing_type: "sale", category: "house", district: "Gasabo", area: "Kibagabaga",
    price: 285000, currency: "USD", bedrooms: 4, bathrooms: 3, size_sqm: 260, plot_sqm: 600,
    description: "A well-finished family home in a quiet, secure neighbourhood close to international schools, supermarkets and the Kigali Convention Centre road.",
    features: "Garden, Gated compound, Guest wing, Tarmac road access, Water tank, Close to schools",
    featured: true,
  },
  {
    title: "Furnished 2-Bedroom Apartment in Kimihurura",
    slug: "furnished-2-bedroom-apartment-kimihurura",
    listing_type: "rent", category: "apartment", district: "Gasabo", area: "Kimihurura",
    price: 1400, currency: "USD", price_period: "month", bedrooms: 2, bathrooms: 2, size_sqm: 110,
    description: "A bright, fully furnished apartment with city views, ideal for expatriates, diplomats and business travellers. Minutes from the city centre and Kigali Convention Centre.",
    features: "Fully furnished, Balcony, Fibre internet, 24/7 security, Lift, Backup generator, Parking",
    featured: true,
  },
  {
    title: "Lakefront Resort Land on Lake Kivu",
    slug: "lakefront-resort-land-lake-kivu-karongi",
    listing_type: "sale", category: "lakefront", district: "Karongi", area: "Kibuye",
    price: 420000, currency: "USD", plot_sqm: 12000,
    description: "A gently sloping lakefront parcel with private shoreline and panoramic views of the islands — suited to an eco-lodge, boutique hotel or private retreat.",
    features: "Private shoreline, Island views, Road access, Electricity nearby, Suitable for hospitality",
    featured: true,
  },
  {
    title: "Residential Plot in Rebero",
    slug: "residential-plot-rebero-kicukiro",
    listing_type: "sale", category: "land", district: "Kicukiro", area: "Rebero",
    price: 95000000, currency: "RWF", plot_sqm: 800,
    description: "A residential plot on Rebero hill with views over Kigali, in an area of new high-quality homes. Title and UPI available for verification.",
    features: "City views, Residential zoning, Water and electricity on site, Title available",
  },
  {
    title: "Grade A Office Space, Kigali City Centre",
    slug: "grade-a-office-space-kigali-city-centre",
    listing_type: "lease", category: "commercial", district: "Nyarugenge", area: "City Centre",
    price: 18, currency: "USD", price_period: "sqm / month", size_sqm: 350,
    description: "Open-plan office floor in a modern building in Kigali's central business district, with lift access, backup power and ample parking.",
    features: "Open plan, Lift, Backup power, Fibre ready, Parking, Reception and security",
  },
  {
    title: "Hotel Development Site near Volcanoes National Park",
    slug: "hotel-development-site-musanze",
    listing_type: "sale", category: "hospitality", district: "Musanze", area: "Kinigi",
    price: 350000, currency: "USD", plot_sqm: 20000,
    description: "A large parcel with volcano views close to the Volcanoes National Park headquarters — an exceptional site for an eco-lodge or boutique hotel serving gorilla-trekking visitors.",
    features: "Volcano views, Close to park HQ, Road access, Hospitality potential",
  },
  {
    title: "Logistics & Warehouse Land in Bugesera",
    slug: "logistics-warehouse-land-bugesera",
    listing_type: "sale", category: "industrial", district: "Bugesera", area: "Nyamata",
    price: 180000, currency: "USD", plot_sqm: 10000,
    description: "Flat, accessible land on the Bugesera growth corridor, suited to warehousing, logistics or light industry.",
    features: "Flat terrain, Main road access, Growth corridor, Industrial potential",
  },
];

export const SEED_POSTS = [
  {
    title: "How to Buy Property in Rwanda: A Step-by-Step Guide for Investors",
    slug: "how-to-buy-property-in-rwanda",
    category: "Guides",
    excerpt: "A clear, practical overview of buying a house or land in Rwanda — from defining your goals to verifying the title and registering the transfer.",
    content: `Rwanda has one of the most organised land administration systems in Africa, which makes buying property here more transparent than in many markets. Here is how the process typically works.

## 1. Define your goal and budget
Are you buying a home, a rental investment, land to build on or a site for a hotel? Your goal decides the right location — Kigali, Lake Kivu, Musanze or a growth corridor such as Bugesera.

## 2. Work with a trusted local partner
A licensed broker with local knowledge saves time and protects you from unverified listings. At Iliza Terra Homes every property we present has been checked before you see it.

## 3. Verify the title and UPI
Every registered parcel in Rwanda has a **UPI (Unique Parcel Identifier)**. Use it to confirm the registered owner, the size of the parcel, its permitted land use and whether there are any restrictions or charges on it.

## 4. Check zoning and the master plan
Make sure what you plan to build is permitted on the plot under the applicable master plan.

## 5. Agree terms and sign the sale agreement
Price, payment schedule and handover conditions are set out in a written agreement, ideally reviewed by a lawyer.

## 6. Transfer and registration
The transfer is notarised and registered with the land authority, and the new title is issued in the buyer's name.

## 7. Plan for what comes next
Insurance, construction, furnishing or finding tenants — plan these early so your investment starts working for you.

*This article is a general overview, not legal advice. Requirements can change and depend on your situation — speak to our team and our partner lawyers before you buy.*`,
  },
  {
    title: "Why Lake Kivu Is One of Rwanda's Most Exciting Investment Destinations",
    slug: "why-invest-in-lake-kivu",
    category: "Market Insights",
    excerpt: "Beaches, islands, sunsets and a growing tourism economy: why lakefront land around Rubavu, Karongi and Rusizi attracts investors.",
    content: `Lake Kivu, on Rwanda's western border, is one of the country's most beautiful regions — and one of its most promising for real estate and hospitality.

## A natural tourism magnet
Sandy beaches in Rubavu, island-dotted bays around Karongi and the Congo Nile Trail draw local, regional and international visitors throughout the year.

## Three distinct hubs
- **Rubavu (Gisenyi):** a lively lakeside town with beaches, hotels and easy access from Kigali.
- **Karongi (Kibuye):** calm waters, dramatic hills and islands — ideal for boutique resorts.
- **Rusizi:** the southern gateway, close to Nyungwe National Park.

## Opportunities we see
Boutique hotels and eco-lodges, holiday villas and short-stay rentals, lakefront residential plots and — rarely — whole islands.

## Do your homework
Lakefront land needs careful checks: the shoreline buffer zone, land use, access roads and services. Our team verifies each of these before we recommend a site.

Interested? Browse our Lake Kivu listings or contact us for off-market opportunities.`,
  },
  {
    title: "Investing in Rwanda from the Diaspora: How to Do It Safely",
    slug: "diaspora-investing-in-rwanda-safely",
    category: "Diaspora",
    excerpt: "Buying or building at home while living abroad? Here is how to protect your money and get your project done right.",
    content: `For many Rwandans abroad, owning property at home is a dream — but managing it from a distance can be stressful. These principles keep your investment safe.

## Verify before you pay
Never send money for a property you have not verified. Ask for the UPI and confirm the owner and parcel details first.

## Use proper agreements
Every payment should be covered by a written agreement. Where you cannot travel, a properly drafted power of attorney allows a trusted representative to act for you.

## Insist on regular reporting
If you are building, ask for photo and video updates at each stage, with costs tracked against the agreed budget.

## Plan for management
Who will find tenants, collect rent and handle maintenance? A professional property manager turns a house into reliable income.

## How we help
Iliza Terra Homes acts as your team on the ground — sourcing, verifying, buying, building and managing — with licensed lawyers and transparent reporting at every step.`,
  },
];
