export type Property = {
  id: number; title: string; slug: string; listing_type: string; category: string; district: string; area: string;
  price: number | null; currency: string; price_period: string; bedrooms: number | null; bathrooms: number | null;
  size_sqm: number | null; plot_sqm: number | null; upi: string; description: string; features: string; images: string;
  video_url: string; lat: number | null; lng: number | null; featured: number; status: string; is_sample: number;
  meta_title: string; meta_description: string; views: number; created_at: string; updated_at: string;
};
export type Post = {
  id: number; title: string; slug: string; excerpt: string; content: string; cover: string; category: string;
  status: string; is_sample: number; meta_title: string; meta_description: string; created_at: string; updated_at: string;
};
export type Inquiry = {
  id: number; name: string; email: string; phone: string; country: string; interest: string; budget: string;
  message: string; property_id: number | null; source: string; status: string; notes: string; created_at: string;
  property_title?: string | null; property_slug?: string | null;
};
export type User = { id: number; email: string; name: string; role: string; created_at: string };
