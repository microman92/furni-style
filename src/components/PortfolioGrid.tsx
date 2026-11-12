"use client";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { projects, services } from "@/data/services";
import { Photo } from "./ui";
export default function PortfolioGrid() {
  const [filter, setFilter] = useState("all");
  const visible = projects.filter((p) => filter === "all" || p.key === filter);
  return (
    <>
      <div className="portfolio-filters" role="group" aria-label="Тип мебели">
        {[{ key: "all", name: "Все проекты" }, ...services].map((s) => (
          <button
            key={s.key}
            aria-pressed={filter === s.key}
            className={filter === s.key ? "selected" : ""}
            onClick={() => setFilter(s.key)}
          >
            {s.name}
          </button>
        ))}
      </div>
      <div className="portfolio-grid">
        <AnimatePresence mode="popLayout">
          {visible.map((p) => (
            <m.article
              key={p.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Photo id={p.photo} alt={p.name} />
              <p className="project-meta">{p.location}</p>
              <h3>{p.name}</h3>
              <p>{p.description}</p>
            </m.article>
          ))}
        </AnimatePresence>
      </div>
      {visible.length === 0 && (
        <div className="empty-state">
          <h3>Этот раздел ещё наполняется</h3>
          <p>Пока посмотрите примеры других направлений.</p>
          <button className="button outline" onClick={() => setFilter("all")}>
            Все проекты ↗︎
          </button>
        </div>
      )}
    </>
  );
}
