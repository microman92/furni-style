import Link from "next/link";
import { services, photoIds, projects } from "@/data/services";
import { products } from "@/data/pricing";
import { site, reviews } from "@/data/site";
import { Button, Photo, Steps, FAQ } from "@/components/ui";
import { AnimatedNumber, Parallax } from "@/components/Motion";
import QuickCalc from "@/components/QuickCalc";
import LeadForm from "@/components/LeadForm";
import MaterialsStrip from "@/components/MaterialsStrip";
import { money } from "@/lib/calc";
import { JsonLd, faqSchema, seo } from "@/lib/seo";
export const metadata = seo(
  "Мебель на заказ в Ташкенте",
  "Кухни, шкафы и мебель по индивидуальным размерам. Проектирование, производство и монтаж Furni Style.",
);
export default function Home() {
  return (
    <>
      <section className="hero" data-enter>
        <Photo
          id={photoIds.kitchen}
          alt="Современная кухня с деревянными фасадами и каменной столешницей"
          priority
          className="hero-photo"
        />
        <div className="hero-shade" />
        <div className="hero-content wrap">
          <p className="eyebrow">Мебельная фабрика · Ташкент</p>
          <h1>
            Мебель на заказ
            <br />
            <em>в Ташкенте.</em>
          </h1>
          <p className="hero-description">
            Кухни, шкафы и мебель для всего дома.
            <br />
            От проекта по вашим размерам до установки.
          </p>
          <Button href="/kalkulyator">Рассчитать проект</Button>
        </div>
        <Link className="price-plate" href="/uslugi/kuhni">
          <span>Кухня под ваш ритм жизни</span>
          <strong>
            от {money(products.kitchen.base)} <small>UZS / пог. м</small>
          </strong>
          <span>Смотреть направление ↗︎</span>
        </Link>
      </section>
      <MaterialsStrip />
      <section className="section wrap directions">
        <div className="section-title">
          <h2>
            Мебель
            <br />
            <em>для каждой комнаты.</em>
          </h2>
          <Link href="/uslugi" className="text-link">
            Все направления ↗︎
          </Link>
        </div>
        <div className="service-bento">
          {services.map((s, i) => (
            <Link
              href={`/uslugi/${s.slug}`}
              className={`service-card service-${i}`}
              key={s.key}
            >
              <Photo id={s.photos[0]} alt={s.name} />
              <div className="service-card-caption">
                <div>
                  <span>0{i + 1}</span>
                  <h3>{s.name}</h3>
                </div>
                <span className="circle-arrow">↗︎</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="on-paper section quick-section">
        <div className="wrap quick-layout">
          <div>
            <h2>
              Стоимость
              <br />
              <em>вашей мебели.</em>
            </h2>
            <p>
              Три простых шага, чтобы узнать порядок бюджета. Без звонков и
              обязательств.
            </p>
            <Link className="text-link" href="/kalkulyator">
              Полный калькулятор ↗︎
            </Link>
          </div>
          <QuickCalc />
        </div>
      </section>
      <section className="about-section wrap section">
        <div className="about-copy">
          <h2>
            Проект начинается
            <br />
            <em>с ваших привычек.</em>
          </h2>
          <p>
            Учтём высоту рабочей поверхности, место для техники и объём
            хранения. Согласуем планировку и образцы материалов до запуска в
            производство.
          </p>
          <Link href="/o-kompanii" className="text-link">
            Познакомиться с фабрикой ↗︎
          </Link>
        </div>
        <Parallax>
          <Photo
            id={photoIds.detail}
            alt="Тёплые натуральные материалы в современном интерьере"
          />
        </Parallax>
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
            <strong>
              <AnimatedNumber value={site.warranty} countOnView />
            </strong>
            <span>года гарантии*</span>
          </div>
          <small>* Демонстрационные показатели</small>
        </div>
      </section>
      <Steps />
      <section className="portfolio-section on-paper section">
        <div className="wrap">
          <div className="section-title">
            <h2>
              Интерьеры <em>и решения.</em>
            </h2>
            <Link href="/portfolio" className="text-link">
              Наши работы ↗︎
            </Link>
          </div>
          <div className="selected-projects">
            {projects.map((p, i) => (
              <Link
                href="/portfolio"
                key={p.id}
                className={`selected-project project-${i}`}
              >
                <Photo id={p.photo} alt={p.name} />
                <div>
                  <span>{p.location}</span>
                  <h3>{p.name}</h3>
                  <span className="project-arrow">↗︎</span>
                </div>
              </Link>
            ))}
          </div>
          <p className="demo-note">
            Фото Unsplash. Примеры оформления портфолио; заменить реальными
            работами.
          </p>
        </div>
      </section>
      <section className="section wrap reviews-section">
        <h2>
          Отзывы <em>о мебели.</em>
        </h2>
        <div className="reviews">
          {reviews.map((r) => (
            <figure key={r.name}>
              <span aria-hidden="true" className="quote-mark">
                “
              </span>
              <blockquote>{r.text}</blockquote>
              <figcaption>
                {r.name}
                <small>Демонстрационный отзыв</small>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section className="section wrap final-section">
        <div>
          <h2>Остались вопросы?</h2>
          <FAQ />
        </div>
        <div className="contact-card" id="lead">
          <h3>
            Обсудим
            <br />
            <em>ваш проект.</em>
          </h3>
          <LeadForm />
        </div>
      </section>
      <JsonLd data={faqSchema(services[0].faq)} />
    </>
  );
}
