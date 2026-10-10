import { HOME_TITLE, HOME_DESCRIPTION } from "@/lib/home-metadata";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { DM_Sans, JetBrains_Mono, Bricolage_Grotesque } from "next/font/google";

import { ldJson, organizationNode, websiteNode } from "@/lib/structured-data";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-JRGVM4XLGV";

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

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.portlandciviclab.org"),
  title: {
    default: HOME_TITLE,
    template: "%s · Portland Civic Lab",
  },
  description:
    HOME_DESCRIPTION,
  applicationName: "Portland Civic Lab",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    shortcut: ["/favicon.png"],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png" }],
  },
  keywords: [
    "Portland voter guide",
    "Portland Oregon",
    "Portland civic dashboard",
    "Portland data",
    "Multnomah County data",
    "Portland housing",
    "Portland homelessness",
    "Portland public safety",
    "Portland budget",
    "Portland climate",
    "Portland education",
    "Portland economy",
    "Portland accountability",
    "civic transparency",
    "open data",
  ],
  authors: [{ name: "Portland Civic Lab" }],
  creator: "Portland Civic Lab",
  publisher: "Portland Civic Lab",
  // Only what is true of every page. Every route inherits these, so a URL,
  // title or description here would be claimed by pages that set none of
  // their own; the homepage sets its own through pageMeta.
  openGraph: {
    siteName: "Portland Civic Lab",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@portlandciviclab",
  },
  // index/follow is the default and is not declared, so a route's own
  // `noindex` (the 404 page, the print edition) is the only robots tag it emits.
  robots: {
    googleBot: {
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // No site-wide canonical: an inherited one told Google that pages without
  // their own were copies of the homepage. Each page sets its own.
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${jetbrainsMono.variable} ${bricolage.variable}`}>
      {/* next/font self-hosts every family, so no preconnect to Google Fonts is needed. */}
      <body className="min-h-screen">
        {/* First focusable element on every page: a paper-colored ring on the canopy surface. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-sm focus:bg-[var(--color-canopy)] focus:px-4 focus:py-3 focus:text-[15px] focus:font-medium focus:text-white focus:outline-2 focus:outline-offset-2 focus:outline-[var(--color-paper)]"
        >
          Skip to content
        </a>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_location: location.href.split('#')[0]
            });
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: ldJson(organizationNode(), websiteNode()) }}
        />
        {children}
      </body>
    </html>
  );
}
