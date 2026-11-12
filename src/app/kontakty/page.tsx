import { PageHeading } from "@/components/ui";
import LeadForm from "@/components/LeadForm";
import { site } from "@/data/site";
import { seo } from "@/lib/seo";
export const metadata = seo(
  "Контакты",
  "Обсудите мебель на заказ с Furni Style в Ташкенте. Консультация по планировке, материалам и бюджету.",
  "/kontakty",
);
export default function ContactsPage() {
  return (
    <>
      <PageHeading
        title="Контакты Furni Style"
        text="Расскажите, каким вы представляете свой дом. Найдём решение вместе."
      />
      <section className="wrap section contact-layout">
        <div className="contact-details">
          <h2>Ташкент</h2>
          <a className="contact-phone" href={`tel:${site.phoneHref}`}>
            {site.phone}
          </a>
          <p>{site.hours}</p>
          <h3>Шоурум</h3>
          <p>
            {site.address}
            <br />
            Обслуживаем: {site.region}
          </p>
          <h3>Почта</h3>
          <p>{site.email}</p>
          <p className="demo-note">
            Контакты — заглушки. Telegram, WhatsApp и карта появятся после
            подтверждения настоящих реквизитов.
          </p>
        </div>
        <div className="contact-card">
          <h2>Обсудить проект</h2>
          <LeadForm />
        </div>
      </section>
    </>
  );
}
