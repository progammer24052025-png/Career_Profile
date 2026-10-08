import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CareerProfile — Student career map",
    short_name: "CareerProfile",
    description: "See how your skills compare with your target career and track your progress by semester.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#EEF3F9",
    theme_color: "#EEF3F9",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
    ]
  };
}
