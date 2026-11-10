// Static business content: services, investment sectors, locations, districts.
// Edit here to change copy that is not managed in the admin dashboard.

export type Service = {
  slug: string;
  title: string;
  short: string;
  icon: string;
  intro: string;
  points: string[];
  keywords: string[];
};

export const SERVICES: Service[] = [
  {
    slug: "investor-connections",
    title: "Investor Connections & Partnerships",
    short: "We connect local and international investors with vetted landowners, developers and joint-venture partners in Rwanda.",
    icon: "handshake",
    intro:
      "Finding the right partner is the hardest part of investing in a new market. Iliza Terra Homes introduces investors to credible landowners, developers and operators across Rwanda, and supports every step from first meeting to signed agreement.",
    points: [
      "Matching investors with landowners, developers and operators",
      "Joint-venture and partnership structuring support",
      "Introductions to banks, insurers, architects and contractors",
      "Site visits and investor tours across Kigali and the provinces",
      "Guidance on registering your investment with the Rwanda Development Board (RDB)",
    ],
    keywords: ["invest in Rwanda", "real estate investment Rwanda", "joint venture Rwanda", "investor partnerships Kigali"],
  },
  {
    slug: "land-sourcing",
    title: "Premium Land Sourcing & Acquisition",
    short: "Prime plots in Kigali, lakefront land on Lake Kivu and island opportunities — sourced, verified and secured for you.",
    icon: "pin",
    intro:
      "We source residential, commercial, agricultural and lakefront land across Rwanda, including rare island opportunities on Lake Kivu. Every plot is checked against its UPI (Unique Parcel Identifier) and land title before we present it to you.",
    points: [
      "Residential and commercial plots in Kigali and secondary cities",
      "Lakefront and island land on Lake Kivu",
      "Agricultural land for agribusiness and agro-processing",
      "Title and UPI verification, zoning and master-plan checks",
      "Negotiation, transfer and registration support",
    ],
    keywords: ["land for sale in Rwanda", "plots for sale Kigali", "Lake Kivu land for sale", "island for sale Rwanda"],
  },
  {
    slug: "property-brokerage",
    title: "Property Brokerage — Buy, Sell & Lease",
    short: "Houses, apartments, villas and commercial space to buy, sell or lease in Kigali and across Rwanda.",
    icon: "building",
    intro:
      "Whether you are buying your first home in Kigali, selling a commercial building or leasing office space, our brokers handle the search, viewings, negotiation and paperwork so the transaction is smooth and secure.",
    points: [
      "Houses, villas and apartments for sale and rent",
      "Commercial buildings, offices and warehouses",
      "Market valuation and pricing advice for sellers",
      "Professional marketing of your property to local and diaspora buyers",
      "Lease negotiation and tenant screening",
    ],
    keywords: ["houses for sale in Kigali", "apartments for rent Kigali", "real estate agent Rwanda", "property for sale Rwanda"],
  },
  {
    slug: "insurance-brokerage",
    title: "Insurance Brokerage",
    short: "Property, business, construction and travel insurance arranged with reputable insurers in Rwanda.",
    icon: "shield",
    intro:
      "Protect your investment from day one. As insurance brokers we compare cover from reputable insurers operating in Rwanda and arrange the policy that fits your property, business or project.",
    points: [
      "Property and home insurance",
      "Business and commercial insurance",
      "Construction and contractor's all-risk cover",
      "Travel insurance for investors and visitors",
      "Claims support and annual policy reviews",
    ],
    keywords: ["insurance broker Rwanda", "property insurance Kigali", "construction insurance Rwanda", "travel insurance Rwanda"],
  },
  {
    slug: "project-development",
    title: "Project Development & Construction",
    short: "From feasibility and design to permits and construction management — we deliver your project in Rwanda.",
    icon: "crane",
    intro:
      "We manage residential, hospitality and commercial projects end-to-end: feasibility, architectural design, building permits, contractor selection and site supervision, with clear reporting for investors who are not on the ground.",
    points: [
      "Feasibility studies and investment appraisals",
      "Architectural design and building permit applications",
      "Contractor tendering and construction management",
      "Budget, quality and timeline reporting for remote investors",
      "Hospitality, residential estates and mixed-use developments",
    ],
    keywords: ["construction company Rwanda", "real estate development Kigali", "build a house in Rwanda", "project management Rwanda"],
  },
  {
    slug: "legal-transaction-support",
    title: "Legal & Transaction Support",
    short: "Due diligence, contracts and title transfer handled with licensed lawyers and notaries.",
    icon: "scale",
    intro:
      "We work with licensed Rwandan lawyers and notaries to make sure every transaction is clean: from due diligence and contracts to land title transfer and company registration.",
    points: [
      "Due diligence on land titles and properties",
      "Sale, lease and partnership agreements",
      "Land title transfer and registration",
      "Company registration and investment certificates",
      "Notarisation and power of attorney for buyers abroad",
    ],
    keywords: ["property lawyer Rwanda", "land title transfer Rwanda", "due diligence Kigali", "buy property in Rwanda legally"],
  },
  {
    slug: "asset-property-management",
    title: "Asset & Property Management",
    short: "Tenant management, rent collection, maintenance and reporting for owners at home and abroad.",
    icon: "home",
    intro:
      "Your property, professionally run. We manage residential and commercial properties for owners who want steady income without the day-to-day work — ideal for diaspora and international owners.",
    points: [
      "Tenant sourcing, screening and lease management",
      "Rent collection and monthly owner statements",
      "Maintenance, repairs and regular inspections",
      "Short-stay and serviced-apartment management",
      "Asset performance reviews and value-add advice",
    ],
    keywords: ["property management Kigali", "rental management Rwanda", "Airbnb management Kigali", "asset management Rwanda"],
  },
  {
    slug: "diaspora-international",
    title: "Diaspora & International Services",
    short: "Invest, build and own in Rwanda from anywhere in the world — we are your trusted team on the ground.",
    icon: "globe",
    intro:
      "Many of our clients are Rwandans in the diaspora and international investors. We act as your eyes and hands in Rwanda: sourcing, verifying, buying, building and managing, with video updates and transparent reporting.",
    points: [
      "Remote property search with video viewings",
      "Verified listings and documented due diligence",
      "Secure transaction process with licensed lawyers",
      "Construction supervision with photo and video reports",
      "Ongoing management of your property and tenants",
    ],
    keywords: ["diaspora investment Rwanda", "buy property in Rwanda from abroad", "Rwandan diaspora real estate", "foreign investors Rwanda property"],
  },
];

export const SECTORS = [
  { slug: "kigali-urban", title: "Kigali & Urban Centres", icon: "city", text: "Residential estates, apartments, offices and mixed-use developments in Africa's cleanest and fastest-modernising capital, plus growing secondary cities." },
  { slug: "lake-kivu-islands", title: "Lake Kivu & Islands", icon: "wave", text: "Lakefront land, boutique resorts and private island opportunities around Rubavu, Karongi and Rusizi." },
  { slug: "tourism-hospitality", title: "Tourism & Hospitality", icon: "leaf", text: "Hotels, eco-lodges and serviced apartments serving gorilla trekking, conference and leisure travellers." },
  { slug: "agribusiness", title: "Agribusiness & Agro-Processing", icon: "sprout", text: "Agricultural land and agro-processing projects in coffee, tea, horticulture and value-added food production." },
  { slug: "green-energy", title: "Green & Renewable Energy", icon: "sun", text: "Solar, e-mobility and clean-energy projects aligned with Rwanda's green growth agenda." },
  { slug: "logistics", title: "Logistics & Trade Hub", icon: "truck", text: "Warehousing, logistics parks and trade infrastructure serving Rwanda and the wider East African market." },
  { slug: "mice-events", title: "MICE & Events", icon: "dome", text: "Conference, exhibition and sports-tourism related real estate as Kigali grows as a regional events destination." },
];

export const WHY_RWANDA = [
  { title: "High Returns & Stable Economy", icon: "chart", text: "A stable, fast-growing economy with strong demand for quality housing, hospitality and commercial space." },
  { title: "Strategic Location & Regional Access", icon: "map", text: "A gateway to the East African Community and wider regional markets." },
  { title: "Investor-Friendly Policies", icon: "people", text: "Streamlined business registration and investor support through the Rwanda Development Board." },
  { title: "Growing Tourism & Hospitality", icon: "leaf", text: "World-class attractions — from mountain gorillas to Lake Kivu — and a busy conference calendar." },
  { title: "Safe, Green & Innovative", icon: "shield", text: "Known for safety, cleanliness, digital government services and a commitment to green growth." },
];

export const DISTRICTS: Record<string, string[]> = {
  "Kigali City": ["Gasabo", "Kicukiro", "Nyarugenge"],
  "Northern Province": ["Burera", "Gakenke", "Gicumbi", "Musanze", "Rulindo"],
  "Southern Province": ["Gisagara", "Huye", "Kamonyi", "Muhanga", "Nyamagabe", "Nyanza", "Nyaruguru", "Ruhango"],
  "Eastern Province": ["Bugesera", "Gatsibo", "Kayonza", "Kirehe", "Ngoma", "Nyagatare", "Rwamagana"],
  "Western Province": ["Karongi", "Ngororero", "Nyabihu", "Nyamasheke", "Rubavu", "Rusizi", "Rutsiro"],
};
export const ALL_DISTRICTS = Object.values(DISTRICTS).flat();

export type LocationPage = { slug: string; name: string; districts: string[]; title: string; intro: string };
export const LOCATIONS: LocationPage[] = [
  {
    slug: "kigali",
    name: "Kigali",
    districts: ["Gasabo", "Kicukiro", "Nyarugenge"],
    title: "Property & Land for Sale and Rent in Kigali",
    intro:
      "Houses, apartments, villas, plots and commercial space across Gasabo, Kicukiro and Nyarugenge — including Nyarutarama, Kimihurura, Kacyiru, Kibagabaga, Rebero, Gacuriro and the city centre.",
  },
  {
    slug: "lake-kivu",
    name: "Lake Kivu",
    districts: ["Rubavu", "Karongi", "Rusizi", "Nyamasheke", "Rutsiro"],
    title: "Lake Kivu Land, Islands & Lakefront Property",
    intro:
      "Lakefront plots, villas, resort sites and island opportunities along Lake Kivu — in Rubavu (Gisenyi), Karongi (Kibuye), Rutsiro, Nyamasheke and Rusizi.",
  },
  {
    slug: "musanze",
    name: "Musanze",
    districts: ["Musanze", "Burera", "Nyabihu"],
    title: "Property & Land near Volcanoes National Park, Musanze",
    intro:
      "Land and hospitality opportunities in Musanze and the surrounding volcano region — the gateway to gorilla trekking and the Twin Lakes of Burera and Ruhondo.",
  },
  {
    slug: "bugesera",
    name: "Bugesera",
    districts: ["Bugesera"],
    title: "Land & Property for Sale in Bugesera",
    intro:
      "Residential, commercial and logistics land in Bugesera, a growth corridor south of Kigali that is home to the new international airport project.",
  },
  {
    slug: "rest-of-rwanda",
    name: "Rest of Rwanda",
    districts: ALL_DISTRICTS.filter(
      (d) => !["Gasabo", "Kicukiro", "Nyarugenge", "Rubavu", "Karongi", "Rusizi", "Nyamasheke", "Rutsiro", "Musanze", "Burera", "Nyabihu", "Bugesera"].includes(d)
    ),
    title: "Property, Farmland & Investment Land across Rwanda",
    intro: "Farmland, plots and commercial property in Huye, Muhanga, Rwamagana, Nyagatare and Rwanda's other growing secondary cities and districts.",
  },
];

export const LISTING_TYPES = [
  { value: "sale", label: "For Sale" },
  { value: "rent", label: "For Rent" },
  { value: "lease", label: "For Lease" },
];

export const CATEGORIES = [
  { value: "house", label: "House / Villa" },
  { value: "apartment", label: "Apartment" },
  { value: "land", label: "Land / Plot" },
  { value: "lakefront", label: "Lakefront & Island" },
  { value: "commercial", label: "Commercial / Office" },
  { value: "hospitality", label: "Hotel / Hospitality" },
  { value: "farm", label: "Farmland / Agri" },
  { value: "industrial", label: "Warehouse / Industrial" },
];

export const INTERESTS = [
  "Buying property",
  "Renting / leasing",
  "Selling my property",
  "Land acquisition",
  "Investment partnership",
  "Insurance",
  "Project development & construction",
  "Property management",
  "Legal & transaction support",
  "Other",
];

export function labelOf(list: { value: string; label: string }[], v: string) {
  return list.find((x) => x.value === v)?.label ?? v;
}
