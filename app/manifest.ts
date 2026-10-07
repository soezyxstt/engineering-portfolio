import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Adi Haditya Nursyam",
    short_name: "Adi H. Nursyam",
    description: "Software engineering, AI products, robotics, and engineering work by Adi Haditya Nursyam.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f6f2",
    theme_color: "#f7f6f2",
    icons: [
      { src: "/brand/ahn-pwa-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/ahn-pwa-512.png", sizes: "512x512", type: "image/png" },
      { src: "/brand/ahn-pwa-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
