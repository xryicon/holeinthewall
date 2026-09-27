export type Language = "en" | "es";

export type MenuItem = {
  id: string;
  category: string;
  order: number;
  nameEn: string;
  nameEs: string;
  descriptionEn: string;
  descriptionEs: string;
  priceCents: number;
};

export const categories = [
  { id: "nachos", en: "Nachos", es: "Nachos" },
  { id: "quesadillas", en: "Quesadillas", es: "Quesadillas" },
  { id: "tacos", en: "Tacos", es: "Tacos" },
  { id: "burritos", en: "Burritos", es: "Burritos" },
  { id: "bowls", en: "Bowls", es: "Bowls" },
  { id: "sides", en: "Sides", es: "Acompañamientos" },
] as const;

const fillings = [
  ["Supreme", "Supremo", "Seasoned beef, black beans, pico, jalapeño, cheese & lime crema", "Carne sazonada, frijoles, pico, jalapeño, queso y crema de lima", 1090],
  ["Charred chicken", "Pollo a la brasa", "Citrus chicken, salsa verde, onions, coriander & queso", "Pollo cítrico, salsa verde, cebolla, cilantro y queso", 1050],
  ["Pork cheek", "Carrillera", "Slow-cooked pork, mango salsa, pickled onion & crema", "Cerdo cocido lento, salsa de mango, cebolla encurtida y crema", 1150],
  ["Mushroom & black bean", "Setas y frijol negro", "Roasted mushrooms, black beans, garlic crema & coriander", "Setas asadas, frijoles negros, crema de ajo y cilantro", 990],
  ["Chickpea & carrot", "Garbanzo y zanahoria", "Smoky chickpeas, roast carrot, jalapeño & avocado crema", "Garbanzos ahumados, zanahoria asada, jalapeño y crema de aguacate", 950],
] as const;

export const defaultMenu: MenuItem[] = categories.flatMap((category, categoryIndex) =>
  fillings.map((filling, index) => ({
    id: `${category.id}-${index + 1}`,
    category: category.id,
    order: categoryIndex * 10 + index,
    nameEn: filling[0],
    nameEs: filling[1],
    descriptionEn: filling[2],
    descriptionEs: filling[3],
    priceCents: filling[4] + (categoryIndex === 0 ? -150 : categoryIndex === 5 ? -300 : categoryIndex * 25),
  })),
);

export function formatPrice(cents: number, language: Language) {
  return new Intl.NumberFormat(language === "es" ? "es-ES" : "en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}
