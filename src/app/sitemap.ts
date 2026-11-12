import type { MetadataRoute } from "next";
import { services } from "@/data/services";
import { site } from "@/data/site";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "/",
    "/uslugi",
    "/kalkulyator",
    "/portfolio",
    "/o-kompanii",
    "/kontakty",
    "/politika",
    ...services.map((s) => `/uslugi/${s.slug}`),
  ].map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
