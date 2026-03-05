import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  title: {
    default: "Sergio Avedian - Build Wealth Without a Financial Advisor",
    template: "%s | Sergio Avedian",
  },
  description: "Learn how to build wealth without a financial advisor. Practical investing guides for beginners, retirement strategies, and stock market education from a 35-year Wall Street veteran.",
  keywords: ["how to start investing", "investing for beginners", "first time investor", "build wealth", "stock market basics", "retirement planning", "index funds", "financial independence", "wall street", "wealth building"],
  authors: [{ name: "Sergio Avedian" }],
  openGraph: {
    type: "website",
    siteName: "Sergio Avedian",
    title: "Sergio Avedian - Build Wealth Without a Financial Advisor",
    description: "Expert financial guidance for building wealth independently.",
    url: "https://sergioavedian.com",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sergio Avedian",
    description: "Build wealth without a financial advisor.",
    creator: "@SergioAvedian",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/kbh0ngu.css" />

        {/* ── Google Consent Mode v2 — must run BEFORE any GA/GTM script ── */}
        <Script
          id="ga-consent-default"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                wait_for_update: 500
              });
            `,
          }}
        />

        {/* ── Google Tag Manager ── */}
        <Script
          id="gtm-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WP2CM2VN');`,
          }}
        />

        <Script
          strategy="beforeInteractive"
          src="https://cdn.weglot.com/weglot.min.js"
        />
        <Script
          id="weglot-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof Weglot !== 'undefined') {
                Weglot.initialize({
                  api_key: '${process.env.NEXT_PUBLIC_WEGLOT_API_KEY || "wg_c4ae80572886756857187428414407b4d"}',
                  hide_switcher: true,
                  auto_switch: false
                });
              } else {
                document.addEventListener('DOMContentLoaded', function() {
                  if (typeof Weglot !== 'undefined') {
                    Weglot.initialize({
                      api_key: '${process.env.NEXT_PUBLIC_WEGLOT_API_KEY || "wg_c4ae80572886756857187428414407b4d"}',
                      hide_switcher: true,
                      auto_switch: false
                    });
                  }
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`antialiased min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary`}
        style={
          {
            "--font-sans": '"parabolica", sans-serif',
            "--font-display": '"oaks-semiexpanded", sans-serif',
          } as React.CSSProperties
        }
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WP2CM2VN"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <Providers>{children}</Providers>
        <GoogleAnalytics />
        <CookieConsentBanner />
      </body>
    </html>
  );
}
