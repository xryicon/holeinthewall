import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { categories, defaultMenu, type MenuItem } from "@/lib/menu-data";

type MenuRow = {
  id: string;
  category: string;
  sort_order: number;
  name_en: string;
  name_es: string;
  description_en: string;
  description_es: string;
  price_cents: number;
};

export async function GET() {
  try {
    const result = await env.DB.prepare(
      `SELECT id, category, sort_order, name_en, name_es, description_en, description_es, price_cents
       FROM menu_items ORDER BY sort_order ASC`,
    ).all<MenuRow>();
    if (!result.results.length) {
      return NextResponse.json({ items: defaultMenu, source: "default" });
    }
    return NextResponse.json({
      items: result.results.map((row) => ({
        id: row.id,
        category: row.category,
        order: row.sort_order,
        nameEn: row.name_en,
        nameEs: row.name_es,
        descriptionEn: row.description_en,
        descriptionEs: row.description_es,
        priceCents: row.price_cents,
      })),
      source: "database",
    });
  } catch (error) {
    console.error("Menu load failed", error);
    return NextResponse.json({ items: defaultMenu, source: "fallback" });
  }
}

export async function PUT(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  try {
    const body = (await request.json()) as { items?: MenuItem[] };
    if (!Array.isArray(body.items) || body.items.length > 100) {
      return NextResponse.json({ error: "Invalid menu" }, { status: 400 });
    }
    const allowedCategories = new Set(categories.map((category) => category.id));
    const items = body.items.map((item, index) => ({
      id: String(item.id || crypto.randomUUID()).slice(0, 100),
      category: String(item.category),
      order: Number.isInteger(item.order) ? item.order : index,
      nameEn: String(item.nameEn || "").trim().slice(0, 100),
      nameEs: String(item.nameEs || "").trim().slice(0, 100),
      descriptionEn: String(item.descriptionEn || "").trim().slice(0, 400),
      descriptionEs: String(item.descriptionEs || "").trim().slice(0, 400),
      priceCents: Math.max(0, Math.min(100000, Math.round(Number(item.priceCents)))),
    }));
    if (items.some((item) => !allowedCategories.has(item.category as never) || !item.nameEn || !item.nameEs || !Number.isFinite(item.priceCents))) {
      return NextResponse.json({ error: "Every item needs a category, both names and a valid price" }, { status: 400 });
    }
    const statements = [
      env.DB.prepare("DELETE FROM menu_items"),
      ...items.map((item) =>
        env.DB.prepare(
          `INSERT INTO menu_items
           (id, category, sort_order, name_en, name_es, description_en, description_es, price_cents)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        ).bind(item.id, item.category, item.order, item.nameEn, item.nameEs, item.descriptionEn, item.descriptionEs, item.priceCents),
      ),
    ];
    await env.DB.batch(statements);
    return NextResponse.json({ ok: true, count: items.length });
  } catch (error) {
    console.error("Menu save failed", error);
    return NextResponse.json({ error: "The menu could not be saved. Please try again." }, { status: 503 });
  }
}
