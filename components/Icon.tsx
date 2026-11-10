import {
  Handshake, MapPin, Building2, ShieldCheck, Construction, Scale, House, Globe, Building, Waves, Leaf, Sprout, Sun, Truck,
  Landmark, TrendingUp, Map, Users, type LucideProps,
} from "lucide-react";

const MAP = {
  handshake: Handshake, pin: MapPin, building: Building2, shield: ShieldCheck, crane: Construction, scale: Scale, home: House,
  globe: Globe, city: Building, wave: Waves, leaf: Leaf, sprout: Sprout, sun: Sun, truck: Truck, dome: Landmark,
  chart: TrendingUp, map: Map, people: Users,
} as const;

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const C = MAP[name as keyof typeof MAP] ?? Building2;
  return <C {...props} />;
}
