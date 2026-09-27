"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import {
  Clock3,
  Languages,
  MapPin,
  Menu as MenuIcon,
  Phone,
  QrCode,
  ShoppingBag,
  Sparkles,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { categories, defaultMenu, formatPrice, type Language, type MenuItem } from "@/lib/menu-data";

const copy = {
  en: {
    nav: ["Home", "Menu", "About", "Location", "Contact"],
    order: "Order / Takeaway",
    headline: "BIG MEXICAN FLAVOUR.",
    subhead: "HIDDEN IN PLAIN SIGHT.",
    intro: "Fresh ingredients. Authentic flavours. Great food, good vibes.",
    viewMenu: "View menu",
    findUs: "Find us",
    benefits: ["Authentic flavours", "Fresh ingredients", "Great atmosphere", "Everyone’s welcome"],
    ourMenu: "Our menu",
    menuNote: "Same great food, as always",
    aboutTitle: "About Hole in the Wall",
    about: "Good Mexican food doesn’t need to be complicated. We serve fresh, flavourful dishes made with quality ingredients, inspired by traditional Mexican cuisine. Whether you’re craving nachos, tacos or a hearty burrito, we’ve got you covered.",
    motto: "Small place. Big flavour.",
    story: "Our story",
    location: "Our location",
    hours: "Opening hours",
    contact: "Contact",
    qrTitle: "Scan for the menu",
    qrText: "Point your phone camera at this code to open the menu.",
    close: "Close",
    admin: "Owner menu editor",
  },
  es: {
    nav: ["Inicio", "Menú", "Nosotros", "Ubicación", "Contacto"],
    order: "Pedir / Para llevar",
    headline: "GRAN SABOR MEXICANO.",
    subhead: "A SIMPLE VISTA.",
    intro: "Ingredientes frescos. Sabores auténticos. Buena comida, buen ambiente.",
    viewMenu: "Ver menú",
    findUs: "Encuéntranos",
    benefits: ["Sabores auténticos", "Ingredientes frescos", "Gran ambiente", "Todos son bienvenidos"],
    ourMenu: "Nuestro menú",
    menuNote: "El gran sabor de siempre",
    aboutTitle: "Sobre Hole in the Wall",
    about: "La buena comida mexicana no tiene por qué ser complicada. Servimos platos frescos y llenos de sabor, preparados con ingredientes de calidad e inspirados en la cocina tradicional mexicana. Nachos, tacos o un burrito contundente: aquí lo tienes.",
    motto: "Pequeño local. Gran sabor.",
    story: "Nuestra historia",
    location: "Nuestra ubicación",
    hours: "Horario",
    contact: "Contacto",
    qrTitle: "Escanea el menú",
    qrText: "Apunta la cámara de tu móvil a este código para abrir el menú.",
    close: "Cerrar",
    admin: "Editor del propietario",
  },
};

export function HomePage() {
  const [language, setLanguage] = useState<Language>("en");
  const [menu, setMenu] = useState<MenuItem[]>(defaultMenu);
  const [activeCategory, setActiveCategory] = useState("nachos");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [qrSrc, setQrSrc] = useState("");
  const t = copy[language];

  useEffect(() => {
    fetch("/api/menu")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => data?.items?.length && setMenu(data.items))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!qrOpen) return;
    QRCode.toDataURL(window.location.origin, {
      width: 320,
      margin: 2,
      color: { dark: "#111111", light: "#fffdf7" },
    }).then(setQrSrc);
  }, [qrOpen]);

  const items = useMemo(
    () => menu.filter((item) => item.category === activeCategory).sort((a, b) => a.order - b.order),
    [menu, activeCategory],
  );
  const split = Math.ceil(items.length / 2);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f5f0e6] text-[#151515]">
      <header className="sticky top-0 z-50 bg-[#f7f3ea]/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-[86px] max-w-[1380px] items-center justify-between px-5 lg:px-10">
          <a className="brand-lockup" href="#home" aria-label="Hole in the Wall home">
            <span className="brand-stack">HOLE<br />IN THE<br />WALL</span>
            <span className="brand-sub">Mexican cuisine</span>
            <span className="brand-taco" aria-hidden="true">◒</span>
          </a>
          <nav className="hidden items-center gap-9 text-[14px] lg:flex" aria-label="Main navigation">
            {t.nav.map((label, index) => (
              <a key={label} href={["#home", "#menu", "#about", "#location", "#contact"][index]}>{label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button className="language-button" onClick={() => setLanguage(language === "en" ? "es" : "en")} aria-label="Switch language">
              <Languages size={17} /> {language === "en" ? "ES" : "EN"}
            </button>
            <a className="order-button hidden sm:inline-flex" href="tel:+35312345678"><ShoppingBag size={18} />{t.order}</a>
            <button className="mobile-toggle lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Open navigation">
              {mobileOpen ? <X /> : <MenuIcon />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <nav className="mobile-nav lg:hidden">
            {t.nav.map((label, index) => <a key={label} onClick={() => setMobileOpen(false)} href={["#home", "#menu", "#about", "#location", "#contact"][index]}>{label}</a>)}
            <a className="order-button" href="tel:+35312345678">{t.order}</a>
          </nav>
        )}
      </header>

      <section id="home" className="hero-section">
        <div className="restaurant-storefront" role="img" aria-label="Hole in the Wall restaurant storefront from the supplied photograph" />
        <div className="hero-shade" />
        <div className="relative z-10 mx-auto flex min-h-[520px] max-w-[1380px] items-center px-6 py-20 lg:px-16">
          <div className="max-w-[680px] text-white">
            <div className="eyebrow-sparks" aria-hidden="true">✦</div>
            <h1 className="brush-title text-[clamp(3rem,6.8vw,6.8rem)] leading-[.87]">{t.headline}</h1>
            <p className="brush-sub mt-5 text-[clamp(1.55rem,3vw,2.8rem)]">{t.subhead}</p>
            <p className="mt-5 max-w-[480px] text-lg leading-relaxed text-white/90">{t.intro}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a className="green-button" href="#menu">{t.viewMenu}</a>
              <a className="outline-button" href="#location"><MapPin size={19} />{t.findUs}</a>
            </div>
          </div>
        </div>
      </section>

      <section className="paper-strip" aria-label="Our values">
        <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-7 px-6 py-8 md:grid-cols-4">
          {[UtensilsCrossed, Sparkles, Clock3, Languages].map((Icon, index) => (
            <div className="benefit" key={t.benefits[index]}><Icon /><span>{t.benefits[index]}</span></div>
          ))}
        </div>
      </section>

      <section id="menu" className="menu-section">
        <Image src="/images/menu-spread.png" alt="Nachos and quesadillas" fill sizes="100vw" className="object-cover" />
        <div className="menu-overlay" />
        <div className="relative z-10 mx-auto max-w-[1180px] px-4 py-20 sm:px-7">
          <div className="relative mb-8 text-center text-white">
            <h2 className="brush-title text-6xl md:text-7xl">{t.ourMenu}</h2>
            <span className="menu-note">{t.menuNote}</span>
          </div>
          <div className="category-tabs" role="tablist" aria-label="Menu categories">
            {categories.map((category) => (
              <button key={category.id} role="tab" aria-selected={activeCategory === category.id} className={activeCategory === category.id ? "active" : ""} onClick={() => setActiveCategory(category.id)}>
                {category[language]}
              </button>
            ))}
          </div>
          <div className="menu-card">
            <div className="menu-column">
              <h3 className="brush-heading">{categories.find((c) => c.id === activeCategory)?.[language]}</h3>
              {items.slice(0, split).map((item) => <MenuRow key={item.id} item={item} language={language} />)}
            </div>
            <div className="menu-column">
              <h3 className="brush-heading hidden md:block">{language === "en" ? "Choose your filling" : "Elige tu relleno"}</h3>
              {items.slice(split).map((item) => <MenuRow key={item.id} item={item} language={language} />)}
            </div>
          </div>
          <div className="mt-7 flex justify-center">
            <button className="order-button" onClick={() => setQrOpen(true)}><QrCode size={19} />{t.qrTitle}</button>
          </div>
        </div>
      </section>

      <section id="about" className="paper-strip">
        <div className="mx-auto grid max-w-[1380px] lg:grid-cols-[1fr_1fr_1fr]">
          <div className="relative min-h-[360px]">
            <Image src="/images/burrito-closeup.png" alt="Fresh Mexican burrito" fill sizes="(max-width: 1024px) 100vw, 34vw" className="object-cover" />
            <span className="food-caption">REAL<br />MEXICAN<br />FOOD</span>
          </div>
          <div className="about-panel">
            <h2 className="brush-heading text-white">{t.aboutTitle}</h2>
            <p>{t.about}</p>
            <strong>{t.motto}</strong>
            <a className="outline-button mt-7 self-start" href="#home">{t.story}</a>
          </div>
          <div id="location" className="info-panel">
            <Info icon={<MapPin />} title={t.location}><p>Hole in the Wall<br />18 Market Lane<br />Dublin 2, Ireland</p></Info>
            <Info icon={<Clock3 />} title={t.hours}><p>Mon – Sat&nbsp;&nbsp; 11:00 – 22:00<br />Sunday&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 12:00 – 21:00</p></Info>
            <Info icon={<Phone />} title={t.contact}><p>+353 1 234 5678<br />hello@holeinthewall.ie</p></Info>
          </div>
        </div>
      </section>

      <footer id="contact" className="site-footer">
        <div className="mx-auto grid max-w-[1200px] items-center gap-8 px-6 py-10 md:grid-cols-[1fr_2fr_1fr]">
          <div className="brand-stack text-white">HOLE<br />IN THE<br />WALL</div>
          <div className="text-center"><p className="brush-sub text-2xl text-white">Good food brings people together</p><div className="footer-links">{t.nav.map((label, index) => <a key={label} href={["#home", "#menu", "#about", "#location", "#contact"][index]}>{label}</a>)}</div></div>
          <div className="flex flex-col items-center gap-4 md:items-end"><div className="flex gap-4 text-xl font-black" aria-label="Social media"><span aria-label="Instagram">◎</span><span aria-label="Facebook">f</span></div><a className="order-button" href="tel:+35312345678">{t.order}</a></div>
        </div>
        <div className="border-t border-white/10 px-6 py-4 text-center text-xs text-white/55">© 2026 Hole in the Wall · <Link href="/admin" className="hover:text-white">{t.admin}</Link></div>
      </footer>

      {qrOpen && <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="qr-title" onClick={() => setQrOpen(false)}><div className="qr-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setQrOpen(false)} aria-label={t.close}><X /></button><h2 id="qr-title" className="brush-heading">{t.qrTitle}</h2><p>{t.qrText}</p>{qrSrc && <img src={qrSrc} alt="QR code for this menu" className="mx-auto mt-5 w-64" />}<button className="green-button mt-5" onClick={() => setQrOpen(false)}>{t.close}</button></div></div>}
    </main>
  );
}

function MenuRow({ item, language }: { item: MenuItem; language: Language }) {
  const name = language === "en" ? item.nameEn : item.nameEs;
  const description = language === "en" ? item.descriptionEn : item.descriptionEs;
  return <article className="menu-row"><div className="menu-row-title"><h4>{name}</h4><span className="dots" /><strong>{formatPrice(item.priceCents, language)}</strong></div><p>{description}</p></article>;
}

function Info({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return <div className="info-row"><span className="info-icon">{icon}</span><div><h3>{title}</h3>{children}</div></div>;
}
