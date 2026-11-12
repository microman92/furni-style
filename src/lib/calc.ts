import {
  products,
  materials,
  facades,
  hardware,
  countertops,
  lighting,
  extras,
  servicePrices,
} from "@/data/pricing";
import type { ProductKey } from "@/data/services";
export type Item = {
  id: string;
  product: ProductKey;
  dimensions: number[];
  configuration: string;
  material: string;
  facade: string;
  hardware: string;
  countertop: string;
  lighting: string;
  extras: string[];
};
export type EstimateState = {
  items: Item[];
  services: {
    design: boolean;
    delivery: boolean;
    assembly: boolean;
    dismantle: boolean;
    urgent: boolean;
  };
};
export const round = (value: number) => Math.round(value / 1000) * 1000;
export const money = (value: number) =>
  new Intl.NumberFormat("ru-RU").format(value);
export function createItem(
  product: ProductKey = "kitchen",
  id = "first",
): Item {
  return {
    id,
    product,
    dimensions: products[product].dimensions.map((d) => d.initial),
    configuration: products[product].configurations[0].id,
    material: "ldsp",
    facade: "ldsp",
    hardware: "standard",
    countertop: "laminate",
    lighting: "none",
    extras: [],
  };
}
export function defaultState(product: ProductKey = "kitchen"): EstimateState {
  return {
    items: [createItem(product)],
    services: {
      design: false,
      delivery: true,
      assembly: true,
      dismantle: false,
      urgent: false,
    },
  };
}
function factor(options: { id: string; factor: number }[], id: string) {
  return options.find((o) => o.id === id)?.factor ?? 1;
}
export function estimateItem(item: Item) {
  const product = products[item.product];
  const quantity = product.dimensions.reduce(
    (q, d, i) =>
      q *
      Math.max(
        d.min,
        Math.min(
          d.max,
          Number.isFinite(item.dimensions[i]) ? item.dimensions[i] : d.initial,
        ),
      ),
    1,
  );
  const base = round(
    product.base *
      quantity *
      factor(product.configurations, item.configuration) *
      factor(materials, item.material) *
      factor(facades, item.facade) *
      factor(hardware, item.hardware) *
      (item.product === "kitchen" ? factor(countertops, item.countertop) : 1),
  );
  const rows = [
    {
      label: `${product.label} · ${Number(quantity.toFixed(2))} ${product.unit}`,
      amount: base,
    },
    ...extras
      .filter(
        (e) =>
          item.extras.includes(e.id) &&
          (!("kitchenOnly" in e) || item.product === "kitchen"),
      )
      .map((e) => ({ label: e.label, amount: e.price })),
  ];
  const light = lighting.find((l) => l.id === item.lighting);
  if (light?.price) rows.push({ label: light.label, amount: light.price });
  return { rows, total: rows.reduce((sum, row) => sum + row.amount, 0) };
}
export function estimate(state: EstimateState) {
  const rows = state.items.flatMap((item) => estimateItem(item).rows);
  const subtotal = rows.reduce((sum, row) => sum + row.amount, 0);
  const options: [keyof EstimateState["services"], string, number][] = [
    ["design", "Дизайн-проект", servicePrices.design],
    ["delivery", "Доставка", servicePrices.delivery],
    ["assembly", "Сборка · 8%", round(subtotal * servicePrices.assembly)],
    ["dismantle", "Демонтаж", servicePrices.dismantle],
    [
      "urgent",
      "Срочное изготовление · 20%",
      round(subtotal * servicePrices.urgent),
    ],
  ];
  for (const [key, label, amount] of options)
    if (state.services[key]) rows.push({ label, amount });
  return { rows, total: round(rows.reduce((sum, row) => sum + row.amount, 0)) };
}
export function parseEstimate(value: unknown): EstimateState {
  if (!value || typeof value !== "object")
    throw new Error("Некорректная смета");
  const state = value as EstimateState;
  if (
    !Array.isArray(state.items) ||
    state.items.length < 1 ||
    state.items.length > 20 ||
    !state.services
  )
    throw new Error("Некорректная смета");
  const ids = new Set<string>();
  for (const item of state.items) {
    if (
      !item ||
      !Object.hasOwn(products, item.product) ||
      typeof item.id !== "string" ||
      ids.has(item.id)
    )
      throw new Error("Некорректное изделие");
    ids.add(item.id);
    const product = products[item.product];
    if (
      !Array.isArray(item.dimensions) ||
      item.dimensions.length !== product.dimensions.length ||
      item.dimensions.some(
        (n, i) =>
          !Number.isFinite(n) ||
          n < product.dimensions[i].min ||
          n > product.dimensions[i].max,
      )
    )
      throw new Error("Некорректные размеры");
    const choices: [string, { id: string }[]][] = [
      [item.configuration, product.configurations],
      [item.material, materials],
      [item.facade, facades],
      [item.hardware, hardware],
      [item.countertop, countertops],
      [item.lighting, lighting],
    ];
    if (
      choices.some(([id, options]) => !options.some((o) => o.id === id)) ||
      !Array.isArray(item.extras) ||
      item.extras.some((id) => !extras.some((e) => e.id === id))
    )
      throw new Error("Некорректные опции");
  }
  for (const key of Object.keys(
    defaultState().services,
  ) as (keyof EstimateState["services"])[])
    if (typeof state.services[key] !== "boolean")
      throw new Error("Некорректные услуги");
  return {
    items: state.items.map((item) => ({ ...item }) as Item),
    services: { ...state.services },
  };
}
