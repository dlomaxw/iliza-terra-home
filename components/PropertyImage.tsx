import Image from "next/image";
import { Icon } from "./Icon";

const CAT_ICON: Record<string, string> = {
  house: "home", apartment: "city", land: "pin", lakefront: "wave", commercial: "building", hospitality: "leaf",
  farm: "sprout", industrial: "truck",
};

/** Shows the property photo, or a branded placeholder if none has been uploaded yet. */
export function PropertyImage({ src, alt, category, className = "", sizes, priority }: {
  src?: string; alt: string; category: string; className?: string; sizes?: string; priority?: boolean;
}) {
  if (src)
    return <Image src={src} alt={alt} fill sizes={sizes ?? "(max-width:768px) 100vw, 33vw"} priority={priority} className={`object-cover ${className}`} />;
  return (
    <div className={`absolute inset-0 grid place-items-center bg-gradient-to-br from-navy via-[#0d5a8f] to-green ${className}`} role="img" aria-label={alt}>
      <div className="flex flex-col items-center gap-2 text-white/80">
        <Icon name={CAT_ICON[category] ?? "building"} className="h-12 w-12" strokeWidth={1.3} />
        <span className="text-xs font-medium tracking-wider uppercase">Photos coming soon</span>
      </div>
    </div>
  );
}
