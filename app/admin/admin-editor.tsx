"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { categories, defaultMenu, type MenuItem } from "@/lib/menu-data";

export function AdminEditor() {
  const [items, setItems] = useState<MenuItem[]>(defaultMenu);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/menu")
      .then((response) => response.json())
      .then((data) => data?.items?.length && setItems(data.items))
      .catch(() => setStatus("Using the starter menu. Save when you are ready."));
  }, []);

  useEffect(() => {
    const context = (document as Document & {
      modelContext?: {
        registerTool: (tool: {
          name: string;
          title: string;
          description: string;
          inputSchema: object;
          annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
          execute: () => Promise<object>;
        }, options?: { signal?: AbortSignal }) => void | Promise<void>;
      };
    }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.resolve(context.registerTool({
      name: "save_current_menu",
      title: "Save current menu",
      description: "Save the menu items currently visible in the owner menu editor.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: async () => save(),
    }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, [items]);

  function update(id: string, field: keyof MenuItem, value: string | number) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  }

  function addItem(category: string) {
    setItems((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        category,
        order: current.filter((item) => item.category === category).length + categories.findIndex((entry) => entry.id === category) * 10,
        nameEn: "New item",
        nameEs: "Nuevo plato",
        descriptionEn: "",
        descriptionEs: "",
        priceCents: 900,
      },
    ]);
  }

  async function save() {
    setSaving(true);
    setStatus("");
    try {
      const response = await fetch("/api/menu", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Save failed");
      const message = `Saved ${data.count} menu items. The public menu is now updated.`;
      setStatus(message);
      return { ok: true, count: data.count, message };
    } catch (error) {
      const message = error instanceof Error ? error.message : "The menu could not be saved.";
      setStatus(message);
      return { ok: false, message };
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="admin-actions mb-5">
        <button className="green-button" onClick={save} disabled={saving}><Save size={18} />{saving ? "Saving…" : "Save menu"}</button>
      </div>
      <div className="admin-card">
        {categories.map((category) => {
          const categoryItems = items.filter((item) => item.category === category.id);
          return (
            <section className="admin-category" key={category.id}>
              <div className="admin-category-head">
                <h2>{category.en}</h2>
                <button className="green-button" onClick={() => addItem(category.id)}><Plus size={17} />Add item</button>
              </div>
              {categoryItems.map((item) => (
                <div className="admin-item" key={item.id}>
                  <label>English name<input value={item.nameEn} onChange={(event) => update(item.id, "nameEn", event.target.value)} /></label>
                  <label>Spanish name<input value={item.nameEs} onChange={(event) => update(item.id, "nameEs", event.target.value)} /></label>
                  <label>Price (€)<input type="number" min="0" step="0.01" value={(item.priceCents / 100).toFixed(2)} onChange={(event) => update(item.id, "priceCents", Math.round(Number(event.target.value) * 100))} /></label>
                  <button className="icon-button" onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))} aria-label={`Delete ${item.nameEn}`}><Trash2 size={18} /></button>
                  <label className="description-input">English description<input value={item.descriptionEn} onChange={(event) => update(item.id, "descriptionEn", event.target.value)} /></label>
                  <label className="description-input">Spanish description<input value={item.descriptionEs} onChange={(event) => update(item.id, "descriptionEs", event.target.value)} /></label>
                </div>
              ))}
            </section>
          );
        })}
      </div>
      {status && <p className="status-message" role="status">{status}</p>}
    </>
  );
}
