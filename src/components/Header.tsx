"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { usePathname } from "next/navigation";
import { services } from "@/data/services";
import { site } from "@/data/site";
import RollLink from "./RollLink";
export default function Header() {
  const [open, setOpen] = useState<"mobile" | "services" | null>(null);
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const servicesTrigger = useRef<HTMLButtonElement>(null);
  const returnFocus = () => {
    (open === "services" ? servicesTrigger : trigger).current?.focus();
  };
  useEffect(() => {
    setOpen(null);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    if (open === "mobile") document.body.style.overflow = "hidden";
    const first = panel.current?.querySelector<HTMLElement>("a");
    first?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(null);
        returnFocus();
      }
      if (event.key === "Tab") {
        const nodes = panel.current?.querySelectorAll<HTMLElement>("a,button");
        if (!nodes?.length) return;
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", key);
    };
  }, [open]);
  const links = [
    ["/portfolio", "Наши работы"],
    ["/o-kompanii", "О фабрике"],
    ["/kontakty", "Контакты"],
  ];
  return (
    <>
      <header className="header">
        <Link href="/" className="wordmark" aria-label="Furni Style — главная">
          FURNI<span>STYLE</span>
          <small>МЕБЕЛЬ С ВАШИМ ХАРАКТЕРОМ</small>
        </Link>
        <nav className="desktop-nav" aria-label="Основная навигация">
          <button
            ref={servicesTrigger}
            aria-expanded={open === "services"}
            aria-controls="service-menu"
            onClick={() => setOpen(open ? null : "services")}
          >
            Направления <span>⌄</span>
          </button>
          {links.map(([href, label]) => (
            <RollLink key={href} href={href}>
              {label}
            </RollLink>
          ))}
        </nav>
        <div className="header-right">
          <a className="header-phone" href={`tel:${site.phoneHref}`}>
            {site.phone}
          </a>
          <Link href="/kalkulyator" className="header-calc">
            Рассчитать проект <span>↗︎</span>
          </Link>
          <button
            ref={trigger}
            className={`burger ${open === "mobile" ? "is-open" : ""}`}
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open === "mobile"}
            aria-controls="mobile-menu"
            onClick={() => setOpen(open ? null : "mobile")}
          >
            <span />
            <span />
          </button>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <m.div
            className={`nav-panel ${open}`}
            id={open === "mobile" ? "mobile-menu" : "service-menu"}
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Меню сайта"
            initial={{ opacity: 0, y: reduced ? 0 : -12 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { staggerChildren: reduced ? 0 : 0.04 },
            }}
            exit={{ opacity: 0, y: reduced ? 0 : -12 }}
          >
            <button
              className="close-menu"
              onClick={() => {
                setOpen(null);
                returnFocus();
              }}
            >
              Закрыть ×
            </button>
            <Link href="/uslugi" onClick={() => setOpen(null)}>
              Все направления ↗︎
            </Link>
            {services.map((s) => (
              <m.div
                key={s.key}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                animate="visible"
                transition={{ delay: reduced ? 0 : services.indexOf(s) * 0.04 }}
              >
                <Link href={`/uslugi/${s.slug}`} onClick={() => setOpen(null)}>
                  {s.name}
                  <span>↗︎</span>
                </Link>
              </m.div>
            ))}
            {open === "mobile" &&
              links.map(([href, label]) => (
                <Link key={href} href={href} onClick={() => setOpen(null)}>
                  {label}
                </Link>
              ))}
          </m.div>
        )}
      </AnimatePresence>
      {open && (
        <button
          className="menu-backdrop"
          tabIndex={-1}
          aria-label="Закрыть меню"
          onClick={() => setOpen(null)}
        />
      )}
    </>
  );
}
