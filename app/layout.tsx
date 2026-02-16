import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Sergio Avedian - Build Wealth Without a Financial Advisor",
    template: "%s | Sergio Avedian",
  },
  description: "Practical, no‑hype guidance and insights from Sergio Avedian — 35+ years on Wall Street — focused on building wealth without a financial advisor.",
  keywords: ["wealth building", "financial advisor", "wall street", "investment guidance", "financial independence", "wealth management", "trading", "investing"],
  authors: [{ name: "Sergio Avedian" }],
  openGraph: {
    type: "website",
    siteName: "Sergio Avedian",
    title: "Sergio Avedian - Build Wealth Without a Financial Advisor",
    description: "Practical, no‑hype guidance and insights from Sergio Avedian — 35+ years on Wall Street — focused on building wealth without a financial advisor.",
    url: "https://sergioavedian.com/",
    images: [
      {
        url: "https://sergioavedian.com/sergio-hero-main.png",
        alt: "Sergio Avedian - Wall Street Veteran",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@sergioaved",
    creator: "@sergioaved",
    title: "Sergio Avedian - Build Wealth Without a Financial Advisor",
    description: "Practical, no‑hype guidance and insights from Sergio Avedian — 35+ years on Wall Street — focused on building wealth without a financial advisor.",
    images: ["https://sergioavedian.com/sergio-hero-main.png"],
  },
  metadataBase: new URL("https://sergioavedian.com"),
  icons: {
    icon: "/sergio-avedian-logo.svg",
    shortcut: "/sergio-avedian-logo.svg",
    apple: "/sergio-avedian-logo.svg",
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
        <link rel="alternate" hrefLang="en" href="https://sergioavedian.com" />
        <link rel="alternate" hrefLang="es" href="https://es.sergioavedian.com" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
        <Script
          src="https://cdn.weglot.com/weglot.min.js"
          strategy="beforeInteractive"
        />
        <Script
          id="weglot-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              Weglot.initialize({
                api_key: '${process.env.NEXT_PUBLIC_WEGLOT_API_KEY}',
                hide_switcher: true,
                auto_switch: false,
                dynamics: [{ value: 'body', property: 'textContent' }],
                wait_transition: true,
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
