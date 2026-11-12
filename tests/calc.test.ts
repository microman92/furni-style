import test from "node:test";
import assert from "node:assert/strict";
import {
  createItem,
  defaultState,
  estimate,
  estimateItem,
  parseEstimate,
} from "../src/lib/calc";
import { products } from "../src/data/pricing";
import type { ProductKey } from "../src/data/services";
test("базовая кухня: 3 × 3 200 000 + доставка 250 000 + сборка 768 000", () => {
  assert.equal(estimate(defaultState()).total, 10618000);
});
test("шкаф считается по площади, не по погонным метрам", () => {
  assert.equal(estimateItem(createItem("wardrobe")).total, 9120000);
});
test("несколько изделий, услуги начисляются один раз", () => {
  const state = defaultState();
  state.items.push(createItem("wardrobe", "second"));
  state.services.design = true;
  state.services.dismantle = true;
  state.services.urgent = true;
  assert.equal(estimate(state).total, 25112000);
});
test("опции кухни не начисляются другим изделиям", () => {
  const item = createItem("wardrobe");
  item.extras = ["appliances"];
  item.countertop = "quartz";
  assert.equal(estimateItem(item).total, 9120000);
});
test("добавки начисляются отдельными строками", () => {
  const item = createItem();
  item.lighting = "work";
  item.extras = ["closers", "push"];
  assert.equal(estimateItem(item).total, 11050000);
});
test("все 7 изделий дают конечную сумму, округлённую до тысячи", () => {
  for (const product of Object.keys(products) as ProductKey[]) {
    const value = estimate(defaultState(product)).total;
    assert.ok(Number.isFinite(value) && value > 0);
    assert.equal(value % 1000, 0);
  }
});
test("невалидные ссылки и сметы отвергаются", () => {
  assert.throws(() => parseEstimate({ items: [], services: {} }));
  const bad = defaultState();
  bad.items[0].dimensions = [-5];
  assert.throws(() => parseEstimate(bad));
  const foreign = defaultState();
  foreign.items[0].product = "__proto__" as ProductKey;
  assert.throws(() => parseEstimate(foreign));
  const invalid = defaultState();
  invalid.items[0].facade = "unknown";
  assert.throws(() => parseEstimate(invalid));
});
test("смета переживает JSON и base64 без потерь", () => {
  const state = defaultState("wardrobe");
  state.items.push(createItem("kitchen", "second"));
  assert.deepEqual(
    parseEstimate(JSON.parse(atob(btoa(JSON.stringify(state))))),
    state,
  );
});
