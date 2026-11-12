import Image from "next/image";
import Link from "next/link";
import { steps } from "@/data/site";
import { services } from "@/data/services";
export function Photo({
  id,
  alt,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: {
  id: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div className={`photo ${className}`}>
      <Image
        src={id.startsWith('/') ? id : `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1800&q=85`}
        alt={alt}
        fill
        sizes={priority ? "100vw" : sizes}
        priority={priority}
        data-source="stand-in"
        data-subject={alt}
      />
    </div>
  );
}
export function Arrow() {
  return <span aria-hidden="true">↗︎</span>;
}
export function Button({
  href,
  children,
  outline = false,
}: {
  href: string;
  children: React.ReactNode;
  outline?: boolean;
}) {
  return (
    <Link className={`button ${outline ? "outline" : ""}`} href={href}>
      {children}
      <Arrow />
    </Link>
  );
}
export function PageHeading({ title, text }: { title: string; text?: string }) {
  return (
    <div className="page-heading wrap">
      <p className="eyebrow">Furni Style · Ташкент</p>
      <h1>{title}</h1>
      {text && <p className="lead">{text}</p>}
    </div>
  );
}
export function Steps() {
  return (
    <section className="section wrap">
      <h2>От идеи до последнего штриха</h2>
      <div className="steps">
        {steps.map(([name, text], i) => (
          <div key={name}>
            <span className="step-number">0{i + 1}</span>
            <h3>{name}</h3>
            <p>{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
export function FAQ({ items = services[0].faq }: { items?: string[][] }) {
  return (
    <div className="faq">
      {items.map(([q, a]) => (
        <details key={q}>
          <summary>
            {q}
            <span aria-hidden="true">+</span>
          </summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}
