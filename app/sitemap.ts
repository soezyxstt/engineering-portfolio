import type { MetadataRoute } from "next";
import { projects } from "@/data/portfolio";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://adihnursyam.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/work", "/robotics", "/software", "/leadership", "/about", "/archive", "/resume", "/contact"];
  return [
    ...staticRoutes.map((route, index) => ({
      url: `${baseUrl}${route}`,
      changeFrequency: index === 0 ? ("monthly" as const) : ("yearly" as const),
      priority: index === 0 ? 1 : route === "/work" ? 0.9 : 0.7,
    })),
    ...projects.map((project) => ({
      url: `${baseUrl}/work/${project.slug}`,
      changeFrequency: "yearly" as const,
      priority: project.flagship ? 0.9 : 0.7,
    })),
  ];
}

