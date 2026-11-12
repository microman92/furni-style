"use client";
import { useState } from "react";

export default function MaterialsStrip() {
  const [paused, setPaused] = useState(false);
  return (
    <div className="materials-strip" aria-label="Материалы и комплектующие">
      <div
        className="marquee-track"
        style={{ animationPlayState: paused ? "paused" : "running" }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1}>
            {[
              "Натуральный шпон",
              "МДФ и эмаль",
              "Фурнитура Blum",
              "Камень и дерево",
            ].map((material) => (
              <span key={material}>{material}</span>
            ))}
          </div>
        ))}
      </div>
      <button
        className="materials-pause"
        aria-pressed={paused}
        onClick={() => setPaused(!paused)}
      >
        {paused ? "Продолжить строку" : "Приостановить строку"}
      </button>
    </div>
  );
}
