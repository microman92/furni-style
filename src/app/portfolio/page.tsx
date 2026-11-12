import PortfolioGrid from "@/components/PortfolioGrid";
import { PageHeading } from "@/components/ui";
import { seo } from "@/lib/seo";
export const metadata = seo(
  "Наши работы",
  "Примеры кухонь, гостиных и спален. Портфолио мебели по индивидуальному проекту Furni Style.",
  "/portfolio",
);
export default function PortfolioPage() {
  return (
    <>
      <PageHeading
        title="Мебель в интерьере"
        text="Подборка демонстрационных интерьеров. Здесь появятся реальные проекты фабрики."
      />
      <section className="wrap section">
        <PortfolioGrid />
      </section>
    </>
  );
}
