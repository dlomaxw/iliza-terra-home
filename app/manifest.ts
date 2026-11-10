import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Iliza Terra Homes", short_name: "Iliza Terra", description: "Real estate, land, insurance and investment in Rwanda.",
    start_url: "/", display: "standalone", background_color: "#ffffff", theme_color: "#0b3a6e",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}
