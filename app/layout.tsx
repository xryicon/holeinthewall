import type { Metadata } from "next";
import "./globals.css";
import "./reference.css";
import "./header-hd.css";

export const metadata: Metadata = {
  title: "Hole in the Wall | Mexican Cuisine",
  description: "Fresh Mexican food, big flavour and good vibes. Explore our bilingual menu.",
  icons: {
    icon: { url: "/images/restaurant-logo.jpg", type: "image/jpeg" },
    shortcut: "/images/restaurant-logo.jpg",
    apple: "/images/restaurant-logo.jpg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
