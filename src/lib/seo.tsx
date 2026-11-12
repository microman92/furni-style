import type { Metadata } from "next";
import { site } from "@/data/site";
export function seo(title: string, description: string, path = "/"): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: path,
      locale: "ru_UZ",
      siteName: site.name,
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
  };
}
export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
export const organization = {
  "@context": "https://schema.org",
  "@type": "FurnitureStore",
  name: site.fullName,
  url: site.url,
  telephone: site.phoneHref,
  address: {
    "@type": "PostalAddress",
    addressLocality: site.city,
    addressCountry: "UZ",
  },
  areaServed: site.region,
  priceRange: "$$",
};
export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Главная", path: "/" }, ...items].map(
      (item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        item: `${site.url}${item.path}`,
      }),
    ),
  };
}
export function faqSchema(items: string[][]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}
