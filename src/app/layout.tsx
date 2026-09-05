import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SiteChrome } from "@/components/SiteChrome";
import { getActiveTickerHeadline } from "@/lib/cms/ticker";

const displaySerif = Playfair_Display({
  variable: "--brand-font-serif-display",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  display: "swap",
});

const SITE_URL = "https://josephmmwa.com";
const SITE_NAME = "JOSEPH MMWA";
const SITE_DESCRIPTION =
  "The world's biggest health and medical news explained as they happen.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — If it's health, it's here`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — If it's health, it's here`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — If it's health, it's here`,
    description: SITE_DESCRIPTION,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Joseph Mmwa",
      jobTitle: "Health & Medical Journalist",
      url: SITE_URL,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      publisher: { "@id": `${SITE_URL}/#person` },
      author: { "@id": `${SITE_URL}/#person` },
    },
  ],
};

// Ticker headline is read with the cookie-free public client, so this can
// revalidate on a timer instead of forcing every page to render dynamically.
export const revalidate = 30;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const tickerHeadline = await getActiveTickerHeadline();

  return (
    <html lang="en" className={`h-full antialiased ${displaySerif.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-black text-offwhite">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-black"
        >
          Skip to main content
        </a>
        <SiteChrome tickerHeadline={tickerHeadline}>{children}</SiteChrome>
        <Analytics />
      </body>
    </html>
  );
}
