import type { ProductKey } from "./services";
export type Option = { id: string; label: string; factor: number };
// Все суммы и коэффициенты — демонстрационные; заменить перед публикацией.
export const products: Record<
  ProductKey,
  {
    label: string;
    base: number;
    unit: string;
    dimensions: {
      label: string;
      min: number;
      max: number;
      step: number;
      initial: number;
    }[];
    configurations: Option[];
  }
> = {
  kitchen: {
    label: "Кухня",
    base: 3200000,
    unit: "пог. м",
    dimensions: [{ label: "Длина", min: 1, max: 10, step: 0.1, initial: 3 }],
    configurations: [
      { id: "straight", label: "Прямая", factor: 1 },
      { id: "corner", label: "Угловая", factor: 1.15 },
      { id: "island", label: "С островом", factor: 1.4 },
    ],
  },
  wardrobe: {
    label: "Шкаф",
    base: 1900000,
    unit: "м²",
    dimensions: [
      { label: "Ширина", min: 1, max: 6, step: 0.1, initial: 2 },
      { label: "Высота", min: 1.8, max: 3.5, step: 0.1, initial: 2.4 },
    ],
    configurations: [
      { id: "hinged", label: "Распашной", factor: 1 },
      { id: "sliding", label: "Купе", factor: 1.2 },
      { id: "walk-in", label: "Гардеробная", factor: 1.35 },
    ],
  },
  bedroom: {
    label: "Спальня",
    base: 4000000,
    unit: "пог. м",
    dimensions: [
      { label: "Ширина комплекта", min: 2, max: 6, step: 0.1, initial: 3 },
    ],
    configurations: [
      { id: "base", label: "Кровать и тумбы", factor: 1 },
      { id: "full", label: "С комодом", factor: 1.3 },
    ],
  },
  living: {
    label: "Гостиная",
    base: 2400000,
    unit: "пог. м",
    dimensions: [{ label: "Длина", min: 1, max: 8, step: 0.1, initial: 3 }],
    configurations: [
      { id: "tv", label: "ТВ-зона", factor: 1 },
      { id: "shelves", label: "Со стеллажом", factor: 1.25 },
    ],
  },
  hallway: {
    label: "Прихожая",
    base: 2100000,
    unit: "пог. м",
    dimensions: [{ label: "Длина", min: 1, max: 5, step: 0.1, initial: 2 }],
    configurations: [
      { id: "open", label: "Открытая", factor: 1 },
      { id: "closed", label: "Закрытая", factor: 1.2 },
    ],
  },
  nursery: {
    label: "Детская",
    base: 3000000,
    unit: "пог. м",
    dimensions: [
      { label: "Длина комплекта", min: 2, max: 7, step: 0.1, initial: 3 },
    ],
    configurations: [
      { id: "study", label: "Учебная зона", factor: 1 },
      { id: "full", label: "С кроватью", factor: 1.4 },
    ],
  },
  office: {
    label: "Офисная мебель",
    base: 1800000,
    unit: "пог. м",
    dimensions: [
      { label: "Длина комплекта", min: 1, max: 12, step: 0.1, initial: 3 },
    ],
    configurations: [
      { id: "desk", label: "Рабочее место", factor: 1 },
      { id: "cabinet", label: "Кабинет", factor: 1.5 },
    ],
  },
};
export const materials: Option[] = [
  { id: "ldsp", label: "ЛДСП", factor: 1 },
  { id: "waterproof", label: "Влагостойкая плита", factor: 1.15 },
  { id: "mdf", label: "МДФ", factor: 1.3 },
  { id: "plywood", label: "Фанера", factor: 1.6 },
];
export const facades: Option[] = [
  { id: "ldsp", label: "ЛДСП", factor: 1 },
  { id: "film", label: "МДФ / плёнка", factor: 1.2 },
  { id: "enamel", label: "Эмаль", factor: 1.5 },
  { id: "veneer", label: "Шпон", factor: 1.8 },
  { id: "wood", label: "Массив", factor: 2.3 },
];
export const hardware: Option[] = [
  { id: "standard", label: "Стандарт", factor: 1 },
  { id: "blum", label: "Blum", factor: 1.25 },
  { id: "premium", label: "Премиум", factor: 1.5 },
];
export const countertops: Option[] = [
  { id: "laminate", label: "Влагостойкая / HPL", factor: 1 },
  { id: "acrylic", label: "Акриловый камень", factor: 1.3 },
  { id: "quartz", label: "Кварц", factor: 1.6 },
];
export const lighting = [
  { id: "none", label: "Без подсветки", price: 0 },
  { id: "work", label: "Рабочая зона", price: 450000 },
  { id: "led", label: "Полная LED", price: 950000 },
  { id: "sensor", label: "С датчиками", price: 1400000 },
];
export const extras = [
  { id: "closers", label: "Доводчики", price: 350000 },
  { id: "push", label: "Push-to-open", price: 650000 },
  { id: "glass", label: "Стеклянные секции", price: 800000 },
  { id: "mirror", label: "Зеркала", price: 700000 },
  {
    id: "appliances",
    label: "Встройка техники",
    price: 900000,
    kitchenOnly: true,
  },
];
export const servicePrices = {
  design: 500000,
  delivery: 250000,
  assembly: 0.08,
  dismantle: 400000,
  urgent: 0.2,
};
export const tiers = [
  {
    label: "Практичный",
    facade: "ldsp",
    hardware: "standard",
    description: "ЛДСП и надёжная базовая фурнитура.",
  },
  {
    label: "Комфорт",
    facade: "enamel",
    hardware: "blum",
    description: "Окрашенные фасады и механизмы Blum.",
  },
  {
    label: "Премиум",
    facade: "veneer",
    hardware: "premium",
    description: "Натуральный шпон и премиальная фурнитура.",
  },
];
