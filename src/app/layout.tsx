import type { Metadata, Viewport } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import AuthProvider from "@/components/providers/AuthProvider";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
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

export const metadata: Metadata = {
  metadataBase: new URL("https://www.portlandciviclab.org"),
  title: {
    default: "Portland Civic Lab — Open Data for Portland's Recovery",
    template: "%s | Portland Civic Lab",
  },
  description:
    "Open civic data dashboard for Portland, Oregon. Real-time metrics on housing, public safety, budget, homelessness, transportation, education, climate, and more — sourced from public records and government APIs.",
  keywords: [
    "Portland Oregon",
    "civic dashboard",
    "city budget",
    "Portland data",
    "General Fund",
    "public safety",
    "housing",
    "homelessness",
    "PCEF",
    "Portland Civic Lab",
  ],
  authors: [{ name: "Portland Civic Lab" }],
  creator: "Portland Civic Lab",
  openGraph: {
    title: "Portland Civic Lab — Open Data for Portland's Recovery",
    description:
      "Ten questions that drive Portland's story, answered with real data. Housing, safety, budget, climate, and more.",
    url: "https://www.portlandciviclab.org",
    siteName: "Portland Civic Lab",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portland Civic Lab — Open Data for Portland's Recovery",
    description:
      "Ten questions that drive Portland's story, answered with real data.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.portlandciviclab.org",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Instrument Serif is not available in next/font, load via Google Fonts */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Portland Civic Lab",
              url: "https://www.portlandciviclab.org",
              description:
                "Open civic data dashboard for Portland, Oregon. Real-time metrics on housing, public safety, budget, homelessness, climate, and more.",
              areaServed: {
                "@type": "City",
                name: "Portland",
                containedInPlace: { "@type": "State", name: "Oregon" },
              },
              sameAs: ["https://github.com/ekrolewicz6/portland-dashboard"],
            }),
          }}
        />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
