import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import Link from "next/link";
import Header from "@/components/Header";
import { MotionProvider } from "@/components/Motion";
import { site } from "@/data/site";
import { services } from "@/data/services";
import { JsonLd, organization } from "@/lib/seo";
import "./globals.css";
const serif = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});
const sans = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Мебель на заказ в Ташкенте | FURNI STYLE",
    template: "%s | FURNI STYLE",
  },
  description:
    "Мебель по вашим размерам: кухни, шкафы, спальни и гостиные. От проекта до установки в Ташкенте.",
  robots: { index: false, follow: false },
  other: { "page-type": "product", "site-kind": "other" },
  twitter: { card: "summary_large_image" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" data-type="product">
      <body className={`${serif.variable} ${sans.variable}`}>
        <MotionProvider>
          <a className="skip-link" href="#main">
            К содержимому
          </a>
          <Header />
          <main id="main">{children}</main>
          <footer className="footer">
            <div className="wrap footer-grid">
              <div>
                <Link href="/" className="wordmark">
                  FURNI<span>STYLE</span>
                </Link>
                <p>
                  Продумано для жизни.
                  <br />
                  Создано для вас.
                </p>
              </div>
              <div>
                <h3>Направления</h3>
                {services.map((s) => (
                  <Link key={s.key} href={`/uslugi/${s.slug}`}>
                    {s.name}
                  </Link>
                ))}
              </div>
              <div>
                <h3>Фабрика</h3>
                <Link href="/o-kompanii">О нас</Link>
                <Link href="/portfolio">Наши работы</Link>
                <Link href="/kalkulyator">Калькулятор</Link>
                <Link href="/kontakty">Контакты</Link>
              </div>
              <div>
                <h3>На связи</h3>
                <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
                <p>
                  {site.hours}
                  <br />
                  {site.region}
                </p>
                <Link className="text-link" href="/kontakty">
                  Обсудить проект ↗︎
                </Link>
              </div>
            </div>
            <div className="wrap footer-bottom">
              <span>© {new Date().getFullYear()} Furni Style</span>
              <Link href="/politika">Политика конфиденциальности</Link>
              <p>{site.notice}</p>
            </div>
          </footer>
          <JsonLd data={organization} />
        </MotionProvider>
      </body>
    </html>
  );
}
