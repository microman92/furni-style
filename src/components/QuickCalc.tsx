"use client";
import { useMemo, useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { products, tiers } from "@/data/pricing";
import type { ProductKey } from "@/data/services";
import { defaultState, estimate, money } from "@/lib/calc";
import { encodeEstimate } from "@/lib/calcStore";
import { AnimatedNumber } from "./Motion";
import Link from "next/link";
export default function QuickCalc() {
  const [step, setStep] = useState(0);
  const [product, setProduct] = useState<ProductKey>("kitchen");
  const [dimensions, setDimensions] = useState([3]);
  const [tier, setTier] = useState(0);
  const state = useMemo(() => {
    const state = defaultState(product);
    state.items[0] = {
      ...state.items[0],
      dimensions,
      facade: tiers[tier].facade,
      hardware: tiers[tier].hardware,
    };
    return state;
  }, [product, dimensions, tier]);
  const total = useMemo(() => estimate(state).total, [state]);
  return (
    <div className="quick-calc">
      <div
        className="quick-steps"
        aria-label={`Шаг ${Math.min(step + 1, 3)} из 3`}
      >
        {["Изделие", "Размер", "Отделка"].map((label, i) => (
          <button
            key={label}
            className={step === i ? "active" : ""}
            onClick={() => setStep(i)}
          >
            <span>0{i + 1}</span>
            {label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={step}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.18 }}
          className="quick-content"
        >
          {step === 0 && (
            <>
              <h3>Что будем создавать?</h3>
              <div className="product-pills">
                {Object.entries(products).map(([key, p]) => (
                  <button
                    aria-pressed={product === key}
                    className={product === key ? "selected" : ""}
                    key={key}
                    onClick={() => {
                      setProduct(key as ProductKey);
                      setDimensions(
                        products[key as ProductKey].dimensions.map(
                          (d) => d.initial,
                        ),
                      );
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <h3>Какие размеры?</h3>
              {products[product].dimensions.map((d, i) => (
                <label className="range-field" key={d.label}>
                  <span>
                    {d.label}
                    <strong>{dimensions[i].toFixed(1)} м</strong>
                  </span>
                  <input
                    type="range"
                    min={d.min}
                    max={d.max}
                    step={d.step}
                    value={dimensions[i]}
                    onChange={(e) =>
                      setDimensions(
                        dimensions.map((n, j) =>
                          j === i ? Number(e.target.value) : n,
                        ),
                      )
                    }
                  />
                  <small>
                    {d.min} м <span>{d.max} м</span>
                  </small>
                </label>
              ))}
            </>
          )}
          {step === 2 && (
            <>
              <h3>Ваш уровень отделки</h3>
              <div className="tier-options">
                {tiers.map((t, i) => (
                  <button
                    key={t.label}
                    className={tier === i ? "selected" : ""}
                    aria-pressed={tier === i}
                    onClick={() => setTier(i)}
                  >
                    <strong>{t.label}</strong>
                    <span>{t.description}</span>
                  </button>
                ))}
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <h3>Первый ориентир готов</h3>
              <p>
                Можно уточнить материалы, добавить ещё изделия и сохранить смету
                в полном калькуляторе.
              </p>
            </>
          )}
        </m.div>
      </AnimatePresence>
      <div className="quick-bottom">
        <div>
          <small>Ориентировочно, с доставкой и сборкой</small>
          <strong>
            <AnimatedNumber value={total} />
            <span> UZS</span>
          </strong>
        </div>
        {step < 3 ? (
          <button className="button" onClick={() => setStep(step + 1)}>
            {step === 2 ? "Результат" : "Далее"} <span>→</span>
          </button>
        ) : (
          <Link
            className="button"
            href={`/kalkulyator#estimate=${encodeEstimate(state)}`}
          >
            Уточнить смету <span>↗︎</span>
          </Link>
        )}
      </div>
      <span className="sr-only">Стоимость: {money(total)} UZS</span>
    </div>
  );
}
