import { PageHeading, Photo, Steps, Button } from "@/components/ui";
import { photoIds } from "@/data/services";
import { site } from "@/data/site";
import { AnimatedNumber } from "@/components/Motion";
import { seo } from "@/lib/seo";
export const metadata = seo(
  "О фабрике",
  "Furni Style — мебельная фабрика в Ташкенте. Индивидуальное проектирование, изготовление и установка мебели.",
  "/o-kompanii",
);
export default function AboutPage() {
  return (
    <>
      <PageHeading
        title="Мебельная фабрика Furni Style"
        text="Furni Style — мебельная фабрика в Ташкенте. Создаём мебель вокруг пространства и людей, которые в нём живут."
      />
      <section className="wrap about-page">
        <Photo
          id={photoIds.detail}
          alt="Пример интерьера с натуральными фактурами"
          priority
        />
        <div className="section prose">
          <h2>
            От замера <em>до установки.</em>
          </h2>
          <p>
            Удобная мебель начинается с правильных вопросов. Где вы готовите
            завтрак? Сколько места нужно для хранения? Какие материалы хочется
            чувствовать каждый день?
          </p>
          <p>
            Ответы становятся планировкой, чертежами и образцами. Мы согласуем
            детали до производства, чтобы итоговый предмет был понятен ещё на
            этапе проекта.
          </p>
          <div className="stats">
            <div>
              <strong>
                <AnimatedNumber value={site.years} suffix="+" countOnView />
              </strong>
              <span>лет на рынке*</span>
            </div>
            <div>
              <strong>
                <AnimatedNumber value={site.projects} suffix="+" countOnView />
              </strong>
              <span>проектов*</span>
            </div>
            <div>
              <strong>{site.warranty}</strong>
              <span>года гарантии*</span>
            </div>
          </div>
          <p className="demo-note">
            * Демонстрационные показатели, требующие подтверждения фабрикой.
          </p>
          <Button href="/kontakty">Обсудить проект</Button>
        </div>
      </section>
      <Steps />
    </>
  );
}
