import type { Metadata, Viewport } from "next";
import { Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SerwistProvider } from "@serwist/next/react";
import Script from "next/script";
import "./globals.css";
import { SiteChrome } from "@/components/SiteChrome";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { NotificationPrompt } from "@/components/pwa/NotificationPrompt";
import { getActiveTicker } from "@/lib/cms/ticker";

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

/** Exact brand logo (Supabase public Storage). */
const BRAND_LOGO_URL =
  "https://uhkmgirkogzmnkkidcgm.supabase.co/storage/v1/object/public/logo/logo.jpeg";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — If it's health, it's here`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  // Do not set root canonical or openGraph.url to "/" — that forces every
  // child page to inherit homepage URLs. Homepage sets its own in page.tsx.
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — If it's health, it's here`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — If it's health, it's here`,
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: BRAND_LOGO_URL, type: "image/jpeg" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [{ url: BRAND_LOGO_URL, sizes: "180x180", type: "image/jpeg" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Joseph Mmwa",
      jobTitle: "Health journalist",
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

// 6 hours — public pages stay cached longer; publishing still calls revalidatePath.
// Longer interval = less Fluid Active CPU and fewer ISR writes on free tier.
export const revalidate = 21600;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const ticker = await getActiveTicker();
  // Read on the server so the key is available even when the client bundle
  // does not inline process.env.NEXT_PUBLIC_* (which was blocking the prompt).
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

  return (
    <html lang="en" className={`h-full antialiased ${displaySerif.variable}`}>
      <head>
        {/* Bing Webmaster Tools Verification */}
        <meta name="msvalidate.01" content="247FF23E5CD84F2D25422610639BE5BF" />

        {/* Google AdSense Meta Tag Verification */}
        <meta name="google-adsense-account" content="ca-pub-7003579645111885" />

        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-0237X6C4K5"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-0237X6C4K5');
            `,
          }}
        />

        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href={BRAND_LOGO_URL} type="image/jpeg" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="apple-touch-icon" sizes="180x180" href={BRAND_LOGO_URL} />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
        <link rel="manifest" href="/site.webmanifest" />
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
        <SerwistProvider
          swUrl="/sw.js"
          disable={process.env.NODE_ENV !== "production"}
          reloadOnOnline={false}
        >
          {/* Slim notification tab — top of viewport, first visit only */}
          <NotificationPrompt vapidPublicKey={vapidPublicKey} />
          <SiteChrome ticker={ticker}>{children}</SiteChrome>
          <div className="fixed inset-x-0 bottom-0 z-40">
            <InstallPrompt />
          </div>
        </SerwistProvider>
        <Analytics />
      </body>
    </html>
  );
}
