export type Language = "en" | "es";
export type MenuItem = {
  id: string; category: string; order: number;
  nameEn: string; nameEs: string;
  descriptionEn: string; descriptionEs: string; priceCents: number;
};
export const categories = [
  {id: "nachos", en: "Nachos", es: "Nachos"},
  {id: "quesadillas", en: "Quesadillas", es: "Quesadillas"},
  {id: "tacos", en: "Tacos", es: "Tacos"},
  {id: "enchiladas", en: "Enchiladas", es: "Enchiladas"},
  {id: "burritos", en: "Burritos", es: "Burritos"},
  {id: "fajitas", en: "Fajitas", es: "Fajitas"},
] as const;
const fillings = [
  ["mince-beef", "Mince beef", "Carne picada", "salsa roja", "salsa roja"],
  ["chicken", "Chicken", "Pollo", "salsa verde", "salsa verde"],
  ["pork-cheek", "Pork cheek", "Carrillera de cerdo", "mango crema", "crema de mango"],
  ["white-fish", "White fish", "Pescado blanco", "cilantro avocado crema", "crema de cilantro y aguacate"],
  ["mushroom-blackbean", "Mushroom & blackbean", "Setas y frijoles negros", "garlic lime crema", "crema de ajo y lima"],
  ["chickpea-carrot", "Chickpea & carrot", "Garbanzos y zanahoria", "cilantro jalapeño crema", "crema de cilantro y jalapeño"],
] as const;
export const defaultMenu: MenuItem[] = categories.flatMap((category, categoryIndex) => {
  const rows = fillings.filter((f) => category.id !== "nachos" || f[0] !== "white-fish").map((f, index) => {
    let sauceEn: string = f[3], sauceEs: string = f[4];
    if (category.id === "burritos" && f[0] === "white-fish") {
      sauceEn = "salsa roja"; sauceEs = "salsa roja";
    }
    const descriptions = {
      nachos: ["Freshly made nachos with melted cheese, jalapeños and " + sauceEn, "Nachos recién hechos con queso fundido, jalapeños y " + sauceEs],
      quesadillas: ["Crispy tortilla with cheese, onion, tomato and " + sauceEn, "Tortilla crujiente con queso, cebolla, tomate y " + sauceEs],
      tacos: ["3 soft tortillas with lettuce, onion, tomato and " + sauceEn, "3 tortillas suaves con lechuga, cebolla, tomate y " + sauceEs],
      enchiladas: ["3 crispy tortillas with melted cheese and a rich tomato sauce", "3 tortillas crujientes con queso fundido y una rica salsa de tomate"],
      burritos: ["Stuffed tortilla wrap with Mexican rice, corn, tomato, lettuce, avocado crema and " + sauceEn, "Tortilla rellena de arroz mexicano, maíz, tomate, lechuga, crema de aguacate y " + sauceEs],
      fajitas: ["3 soft tortillas with salad, cheese, fried onions, garlic lime crema, avocado crema and salsa roja", "3 tortillas suaves con ensalada, queso, cebolla frita, crema de ajo y lima, crema de aguacate y salsa roja"],
    };
    return {id: category.id + "-" + f[0], category: category.id, order: categoryIndex * 10 + index + 1,
      nameEn: f[1], nameEs: f[2], descriptionEn: descriptions[category.id][0], descriptionEs: descriptions[category.id][1],
      priceCents: {nachos:450, quesadillas:500, tacos:800, enchiladas:750, burritos:800, fajitas:900}[category.id]};
  });
  if (category.id === "nachos") rows.unshift({
    id: "nachos-supreme", category: "nachos", order: 0,
    nameEn: "Supreme", nameEs: "Supremo",
    descriptionEn: "Freshly made nachos with jalapeños, avocado crema, garlic lime crema and salsa roja",
    descriptionEs: "Nachos recién hechos con jalapeños, crema de aguacate, crema de ajo y lima y salsa roja",
    priceCents: 400,
  } as typeof rows[number]);
  return rows;
});
export function formatPrice(cents: number, language: Language) {
  return new Intl.NumberFormat(language === "es" ? "es-ES" : "en-IE", {style: "currency", currency: "EUR"}).format(cents / 100);
}
