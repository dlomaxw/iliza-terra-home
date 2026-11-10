import Link from "next/link";
export default function NotFound() {
  return (
    <section className="container-x py-28 text-center">
      <p className="eyebrow">404</p>
      <h1 className="section-title mt-2">We couldn't find that page</h1>
      <p className="mt-3 text-muted">The listing may have been sold or moved.</p>
      <div className="mt-8 flex justify-center gap-3"><Link href="/properties" className="btn-primary">Browse properties</Link><Link href="/" className="btn-ghost">Home</Link></div>
    </section>
  );
}
