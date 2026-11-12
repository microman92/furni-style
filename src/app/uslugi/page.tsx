import Link from "next/link";
import { services } from "@/data/services";
import { products } from "@/data/pricing";
import { PageHeading, Photo } from "@/components/ui";
import { money } from "@/lib/calc";
import { seo, JsonLd, breadcrumbs } from "@/lib/seo";
export const metadata = seo(
  "Направления",
  "Семь направлений мебели на заказ в Ташкенте. Кухни, шкафы, спальни, гостиные, прихожие, детская и офисная мебель.",
  "/uslugi",
);
export default function ServicesPage() {
  return (
    <>
      <PageHeading
        title="Мебель по вашим размерам"
        text="Отдельный предмет или весь интерьер: начнём с того, что нужно вам."
      />
      <section className="wrap section service-list">
        {services.map((s, i) => (
          <Link key={s.key} href={`/uslugi/${s.slug}`}>
            <Photo id={s.photos[0]} alt={s.name} />
            <div>
              <span className="project-meta">0{i + 1}</span>
              <h2>{s.name}</h2>
              <p>{s.lead}</p>
              <strong>
                от {money(products[s.key].base)} UZS / {products[s.key].unit}
              </strong>
              <span className="text-link">Подробнее ↗︎</span>
            </div>
          </Link>
        ))}
      </section>
      <JsonLd data={breadcrumbs([{ name: "Направления", path: "/uslugi" }])} />
    </>
  );
}
