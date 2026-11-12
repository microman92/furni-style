import type { MetadataRoute } from "next";
import { site } from "@/data/site";
// Убрать запрет после замены демо-данных и подключения рабочего домена.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
