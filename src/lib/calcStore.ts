"use client";
import { useSyncExternalStore } from "react";
import { defaultState, parseEstimate, type EstimateState } from "./calc";

const storageKey = "furni-style-estimate-v1";
const initial = defaultState();
let current = initial;
let initialized = false;
let warning = "";
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());
export function encodeEstimate(state: EstimateState) {
  return btoa(JSON.stringify(state));
}
export function decodeEstimate(hash: string) {
  return parseEstimate(JSON.parse(atob(hash)));
}
function readLocation() {
  try {
    const hash = window.location.hash;
    if (hash.startsWith("#estimate=")) current = decodeEstimate(hash.slice(10));
    else {
      const saved = localStorage.getItem(storageKey);
      if (saved) current = parseEstimate(JSON.parse(saved));
    }
    warning = "";
  } catch {
    warning = "Не удалось восстановить смету. Вы можете создать новую.";
  }
  notify();
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!initialized) {
    initialized = true;
    readLocation();
  }
  const onHash = () => readLocation();
  const onStorage = (event: StorageEvent) => {
    if (event.key === storageKey) readLocation();
  };
  window.addEventListener("hashchange", onHash);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("hashchange", onHash);
    window.removeEventListener("storage", onStorage);
  };
}
export function setEstimate(state: EstimateState) {
  current = state;
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
    warning = "";
  } catch {
    warning =
      "Браузер запретил сохранение. Скопируйте ссылку, чтобы сохранить смету.";
  }
  if (window.location.hash.startsWith("#estimate="))
    history.replaceState(null, "", `${location.pathname}${location.search}`);
  notify();
}
export function useEstimateStore() {
  const state = useSyncExternalStore(
    subscribe,
    () => current,
    () => initial,
  );
  return { state, setState: setEstimate, warning };
}
