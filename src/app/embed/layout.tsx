import type { Metadata, Viewport } from "next";
import { DM_Sans, JetBrains_Mono, Bricolage_Grotesque } from "next/font/google";
import "../globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0f2419",
};

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Portland Civic Lab — Embed",
  description: "Embeddable civic data card from Portland Civic Lab.",
  robots: { index: false, follow: false },
};

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${jetbrainsMono.variable} ${bricolage.variable}`}>
      <body className="bg-transparent m-0 p-0">{children}</body>
    </html>
  );
}
