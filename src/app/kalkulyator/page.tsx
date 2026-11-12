import Calculator from "@/components/Calculator";
import { PageHeading } from "@/components/ui";
import { seo } from "@/lib/seo";
export const metadata = seo(
  "Калькулятор мебели",
  "Рассчитайте кухню, шкаф и другие изделия в одной смете. Материалы, размеры, фурнитура, доставка и сборка. Цены в UZS.",
  "/kalkulyator",
);
export default function CalculatorPage() {
  return (
    <>
      <PageHeading
        title="Калькулятор мебели"
        text="Выберите размеры и материалы. Добавьте несколько изделий, чтобы увидеть бюджет всего интерьера."
      />
      <section className="wrap section calculator-page">
        <Calculator />
      </section>
    </>
  );
}
