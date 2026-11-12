import Link from "next/link";
import { notFound } from "next/navigation";
import { services } from "@/data/services";
import { tiers } from "@/data/pricing";
import { site } from "@/data/site";
import { defaultState, estimateItem, money } from "@/lib/calc";
import { seo, JsonLd, faqSchema, breadcrumbs } from "@/lib/seo";
import { Photo, Button, FAQ, Steps } from "@/components/ui";
import Calculator from "@/components/Calculator";
export const dynamicParams = false;
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = services.find((s) => s.slug === slug);
  return s ? seo(s.title, s.description, `/uslugi/${slug}`) : {};
}
export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = services.find((s) => s.slug === slug);
  if (!s) notFound();
  const prices = tiers.map((t) => {
    const item = defaultState(s.key).items[0];
    return estimateItem({ ...item, facade: t.facade, hardware: t.hardware })
      .total;
  });
  return (
    <>
      <section className="service-hero wrap">
        <div>
          <Link className="text-link" href="/uslugi">
            ← Все направления
          </Link>
          <h1>{s.h1}</h1>
          <p className="lead">{s.lead}</p>
          <Button href="#calculator">Рассчитать проект</Button>
        </div>
        <Photo id={s.photos[0]} alt={s.name} priority />
      </section>
      <section className="on-paper section">
        <div className="wrap">
          <h2>
            {s.name},<br />
            <em>продуманные для вас.</em>
          </h2>
          <div className="intro-text">
            {s.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="features">
            {s.features.map(([title, text]) => (
              <div key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
          <h3>Что входит в заказ</h3>
          <div className="included">
            {s.included.map((text) => (
              <span key={text}>✓ {text}</span>
            ))}
          </div>
        </div>
      </section>
      <section className="wrap section">
        <h2>
          Материалы. Свет. <em>Детали.</em>
        </h2>
        <div className="service-gallery">
          {s.photos.map((id, i) => (
            <Photo
              key={`${id}-${i}`}
              id={id}
              alt={`${s.name} — пример интерьера ${i + 1}`}
            />
          ))}
        </div>
      </section>
      <section className="section on-paper">
        <div className="wrap">
          <h2>Три подхода к отделке</h2>
          <p>
            Примеры стоимости при начальных размерах калькулятора, без доставки
            и сборки. Итог зависит от вашего проекта.
          </p>
          <div className="price-tiers">
            {tiers.map((t, i) => (
              <div key={t.label}>
                <span>0{i + 1}</span>
                <h3>{t.label}</h3>
                <p>{t.description}</p>
                <strong>
                  от {money(prices[i])} <small>UZS</small>
                </strong>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="wrap section">
        <h2>
          Ваш проект <em>в цифрах.</em>
        </h2>
        <Calculator product={s.key} />
      </section>
      <Steps />
      <section className="wrap section">
        <h2>Частые вопросы</h2>
        <FAQ items={s.faq} />
        <h3 className="also-heading">Для остальных комнат</h3>
        <div className="related-links">
          {services
            .filter((other) => other.key !== s.key)
            .map((other) => (
              <Link key={other.key} href={`/uslugi/${other.slug}`}>
                {other.name} ↗︎
              </Link>
            ))}
        </div>
      </section>
      <JsonLd
        data={[
          faqSchema(s.faq),
          breadcrumbs([
            { name: "Направления", path: "/uslugi" },
            { name: s.name, path: `/uslugi/${slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: s.name,
            description: s.description,
            provider: { "@type": "Organization", name: site.fullName },
            areaServed: site.region,
            offers: {
              "@type": "Offer",
              priceCurrency: "UZS",
              price: prices[0],
              url: `${site.url}/uslugi/${slug}`,
            },
          },
        ]}
      />
    </>
  );
}
