"use client";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import {
  products,
  materials,
  facades,
  hardware,
  countertops,
  lighting,
  extras,
} from "@/data/pricing";
import type { ProductKey } from "@/data/services";
import {
  createItem,
  defaultState,
  estimate,
  estimateItem,
  money,
  type Item,
  type EstimateState,
} from "@/lib/calc";
import { encodeEstimate, useEstimateStore } from "@/lib/calcStore";
import { AnimatedPrice } from "./Motion";
import LeadForm from "./LeadForm";
export default function Calculator({ product }: { product?: ProductKey }) {
  const store = useEstimateStore();
  const [localState, setLocalState] = useState(() => defaultState(product));
  const state = product ? localState : store.state;
  const setState = product ? setLocalState : store.setState;
  const [expanded, setExpanded] = useState<string | null>("first");
  const [copied, setCopied] = useState("");
  const [addProduct, setAddProduct] = useState<ProductKey>("kitchen");
  const total = useMemo(() => estimate(state), [state]);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(""), 4000);
    return () => clearTimeout(timer);
  }, [copied]);
  function update(id: string, patch: Partial<Item>) {
    setState({
      ...state,
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    });
  }
  async function copy() {
    const url = `${location.origin}/kalkulyator#estimate=${encodeEstimate(state)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied("Ссылка скопирована");
    } catch {
      setCopied("Не удалось скопировать. Ссылка открыта в адресной строке.");
      history.replaceState(
        null,
        "",
        `/kalkulyator#estimate=${encodeEstimate(state)}`,
      );
    }
  }
  const select = (
    item: Item,
    key:
      | "configuration"
      | "material"
      | "facade"
      | "hardware"
      | "countertop"
      | "lighting",
    label: string,
    options: { id: string; label: string }[],
  ) => (
    <label className="field" key={key}>
      {label}
      <select
        value={item[key]}
        onChange={(e) => update(item.id, { [key]: e.target.value })}
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
  return (
    <div className="calculator" id="calculator">
      <div className="calc-grid">
        <div className="calc-items">
          {!product && store.warning && (
            <p role="status" className="form-message">
              {store.warning}
            </p>
          )}
          <AnimatePresence initial={false}>
            {state.items.map((item, index) => (
              <m.article
                className="calc-item"
                key={item.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="calc-item-head">
                  <button
                    onClick={() =>
                      setExpanded(expanded === item.id ? null : item.id)
                    }
                    aria-expanded={expanded === item.id}
                    aria-controls={`item-${item.id}`}
                  >
                    <span className="item-index">0{index + 1}</span>
                    <span>
                      {products[item.product].label}
                      <small>{money(estimateItem(item).total)} UZS</small>
                    </span>
                    <span aria-hidden="true">
                      {expanded === item.id ? "−" : "+"}
                    </span>
                  </button>
                  {state.items.length > 1 && (
                    <button
                      className="remove-item"
                      onClick={() =>
                        setState({
                          ...state,
                          items: state.items.filter((i) => i.id !== item.id),
                        })
                      }
                      aria-label={`Удалить ${products[item.product].label}`}
                    >
                      Удалить
                    </button>
                  )}
                </div>
                <AnimatePresence initial={false}>
                  {expanded === item.id && (
                    <m.div
                      id={`item-${item.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="calc-item-body"
                    >
                      <div className="dimension-fields">
                        {products[item.product].dimensions.map((d, i) => (
                          <label className="range-field" key={d.label}>
                            <span>
                              {d.label}
                              <strong>{item.dimensions[i].toFixed(1)} м</strong>
                            </span>
                            <input
                              aria-label={`${d.label}, изделие ${index + 1}`}
                              type="range"
                              min={d.min}
                              max={d.max}
                              step={d.step}
                              value={item.dimensions[i]}
                              onChange={(e) =>
                                update(item.id, {
                                  dimensions: item.dimensions.map((v, j) =>
                                    j === i ? Number(e.target.value) : v,
                                  ),
                                })
                              }
                            />
                            <small>
                              {d.min} м <span>{d.max} м</span>
                            </small>
                          </label>
                        ))}
                      </div>
                      <div className="fields-grid">
                        {select(
                          item,
                          "configuration",
                          "Конфигурация",
                          products[item.product].configurations,
                        )}
                        {select(
                          item,
                          "material",
                          "Материал корпуса",
                          materials,
                        )}
                        {select(item, "facade", "Фасады", facades)}
                        {select(item, "hardware", "Фурнитура", hardware)}
                        {item.product === "kitchen" &&
                          select(item, "countertop", "Столешница", countertops)}
                        {select(item, "lighting", "Подсветка", lighting)}
                      </div>
                      <fieldset className="extras">
                        <legend>Дополнительные опции</legend>
                        {extras
                          .filter(
                            (e) =>
                              !("kitchenOnly" in e) ||
                              item.product === "kitchen",
                          )
                          .map((e) => (
                            <label key={e.id}>
                              <input
                                type="checkbox"
                                checked={item.extras.includes(e.id)}
                                onChange={(event) =>
                                  update(item.id, {
                                    extras: event.target.checked
                                      ? [...item.extras, e.id]
                                      : item.extras.filter((id) => id !== e.id),
                                  })
                                }
                              />
                              <span>
                                {e.label}
                                <small>+{money(e.price)} UZS</small>
                              </span>
                            </label>
                          ))}
                      </fieldset>
                    </m.div>
                  )}
                </AnimatePresence>
              </m.article>
            ))}
          </AnimatePresence>
          {!product && (
            <div className="add-product">
              <label className="field">
                Ещё одно изделие
                <select
                  value={addProduct}
                  onChange={(e) => setAddProduct(e.target.value as ProductKey)}
                >
                  {Object.entries(products).map(([key, p]) => (
                    <option key={key} value={key}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="button outline"
                disabled={state.items.length >= 20}
                onClick={() => {
                  const item = createItem(addProduct, crypto.randomUUID());
                  setState({ ...state, items: [...state.items, item] });
                  setExpanded(item.id);
                }}
              >
                Добавить +
              </button>
            </div>
          )}
          <fieldset className="extras services-options">
            <legend>Услуги</legend>
            {(
              [
                ["design", "Дизайн-проект"],
                ["delivery", "Доставка"],
                ["assembly", "Сборка · 8%"],
                ["dismantle", "Демонтаж"],
                ["urgent", "Срочное изготовление · +20%"],
              ] as const
            ).map(([key, label]) => (
              <label key={key}>
                <input
                  type="checkbox"
                  checked={state.services[key]}
                  onChange={(e) =>
                    setState({
                      ...state,
                      services: { ...state.services, [key]: e.target.checked },
                    })
                  }
                />
                {label}
              </label>
            ))}
          </fieldset>
        </div>
        <aside className="estimate-summary">
          <p className="eyebrow">Ваша предварительная смета</p>
          <AnimatedPrice value={total.total} />
          <p>
            Ориентировочная стоимость. Точную цену зафиксируем после замера и
            согласования материалов.
          </p>
          <details className="estimate-lines" open>
            <summary>Что входит в расчёт</summary>
            {total.rows.map((row, i) => (
              <div key={`${row.label}-${i}`}>
                <span>{row.label}</span>
                <span>{money(row.amount)}</span>
              </div>
            ))}
          </details>
          <a href="#estimate-lead" className="button">
            Отправить менеджеру <span>↗︎</span>
          </a>
          <button className="copy-button" onClick={copy}>
            {copied === "Ссылка скопирована"
              ? "✓ Скопировано"
              : "Скопировать ссылку ↗︎"}
          </button>
          <p role="status" aria-live="polite">
            {copied}
          </p>
        </aside>
      </div>
      <div id="estimate-lead" className="calc-lead">
        <h2>Обсудим ваш проект?</h2>
        <LeadForm estimate={state} />
      </div>
    </div>
  );
}
