import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "Sergio Avedian - Build Wealth Without a Financial Advisor",
    template: "%s | Sergio Avedian",
  },
  description: "Expert financial guidance for building wealth independently.",
  keywords: ["wealth building", "financial advisor", "wall street", "investment guidance", "financial independence", "wealth management", "trading", "investing"],
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
