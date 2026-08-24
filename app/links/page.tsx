import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Youtube,
  Linkedin,
  Crown,
  BookOpen,
  Mail,
  GraduationCap,
  Globe,
  ArrowUpRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Links",
  description:
    "All of Sergio Avedian in one place — The Trading Desk premium community, Discord, YouTube, newsletter, and social channels.",
  openGraph: {
    title: "Sergio Avedian — Links",
    description:
      "The Trading Desk, Discord, YouTube, newsletter, and more — all in one place.",
    url: "https://sergioavedian.com/links",
  },
};

/* ── Real destinations (mirrors the rest of the site) ────────────── */
const WHOP_URL = "https://whop.com/checkout/plan_kPD5F9M8dEH34";
const DISCORD_URL = "https://discord.gg/s9nJvURcpb";
const YOUTUBE_URL = "https://www.youtube.com/@SergioAvedian/";
const X_URL = "https://x.com/TradingDeskHQ";
const LINKEDIN_URL = "https://www.linkedin.com/in/sergio-avedian-9939291/";

/* ── Brand marks not in lucide ───────────────────────────────────── */
const DiscordMark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 127.14 96.36" fill="currentColor" className={className} aria-hidden="true">
    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
  </svg>
);

const XMark = ({ className }: { className?: string }) => (
  <svg role="img" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

/* ── Link rows ───────────────────────────────────────────────────── */
type LinkRow = {
  label: string;
  sublabel: string;
  href: string;
  external: boolean;
  Icon: (p: { className?: string }) => JSX.Element;
};

const links: LinkRow[] = [
  {
    label: "Visit sergioavedian.com",
    sublabel: "Articles, videos & everything in one place",
    href: "/",
    external: false,
    Icon: ({ className }) => <Globe className={className} />,
  },
  {
    label: "Join the Discord — Free",
    sublabel: "Market talk & community channels",
    href: DISCORD_URL,
    external: true,
    Icon: DiscordMark,
  },
  {
    label: "YouTube Channel",
    sublabel: "Videos, shorts & live market streams",
    href: YOUTUBE_URL,
    external: true,
    Icon: ({ className }) => <Youtube className={className} />,
  },
  {
    label: "Free Weekly Newsletter",
    sublabel: "Markets & strategy, straight to your inbox",
    href: "/newsletter",
    external: false,
    Icon: ({ className }) => <Mail className={className} />,
  },
  {
    label: "Read the Blog",
    sublabel: "Articles on investing, trading & wealth",
    href: "/blog",
    external: false,
    Icon: ({ className }) => <BookOpen className={className} />,
  },
  {
    label: "Personal Coaching",
    sublabel: "Work with Sergio one-on-one",
    href: "/coaching",
    external: false,
    Icon: ({ className }) => <GraduationCap className={className} />,
  },
];

const socials = [
  { label: "X.com", href: X_URL, Icon: XMark },
  { label: "YouTube", href: YOUTUBE_URL, Icon: ({ className }: { className?: string }) => <Youtube className={className} /> },
  { label: "LinkedIn", href: LINKEDIN_URL, Icon: ({ className }: { className?: string }) => <Linkedin className={className} /> },
];

export default function LinksPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Atmosphere — soft gold glow, matches the hero / Trading Desk sections */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute -top-40 left-1/2 h-[32rem] w-[60rem] -translate-x-1/2 rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at center, hsl(var(--primary) / 0.35), transparent 65%)",
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[520px] flex-col items-center px-5 py-12 sm:py-16">
        {/* Wordmark → home */}
        <Link href="/" className="mb-10 transition-opacity hover:opacity-80" aria-label="Sergio Avedian home">
          <Image
            src="/sergio-avedian-logo.png"
            alt="Sergio Avedian"
            width={240}
            height={72}
            className="h-14 w-auto"
            priority
          />
        </Link>

        {/* Avatar */}
        <div className="relative mb-5">
          <div
            className="absolute -inset-1 rounded-full opacity-70 blur-md"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.6), transparent 60%)" }}
            aria-hidden="true"
          />
          <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-primary/50 shadow-large">
            <Image
              src="/sergio-sf.png"
              alt="Sergio Avedian"
              fill
              sizes="112px"
              className="object-cover"
              style={{ objectPosition: "50% 20%" }}
              priority
            />
          </div>
        </div>

        {/* Name + tagline */}
        <h1 className="text-center font-display text-3xl tracking-tight text-text-primary">
          Sergio Avedian
        </h1>
        <p className="mt-2 max-w-xs text-center text-sm leading-relaxed text-text-secondary">
          35+ years on Wall Street. Build wealth without a financial advisor.
        </p>

        {/* Social icon row */}
        <div className="mt-6 flex items-center gap-4">
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/25 bg-surface text-text-primary shadow-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-surface-secondary hover:text-primary"
            >
              <Icon className="h-6 w-6" />
            </a>
          ))}
        </div>

        {/* ── Premium — The Trading Desk (the hero link) ───────────── */}
        <div className="mt-10 w-full">
          <a
            href={WHOP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join The Trading Desk — Premium"
            className="group relative block overflow-hidden rounded-xl p-5 transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(160deg, hsl(145 18% 19%) 0%, hsl(145 20% 13%) 100%)",
              border: "1px solid hsl(var(--primary) / 0.55)",
              boxShadow: "0 0 44px hsl(var(--primary) / 0.14), inset 0 1px 0 hsl(45 80% 70% / 0.12)",
            }}
          >
            <span
              className="absolute left-6 right-6 top-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, hsl(45 85% 65% / 0.8), transparent)" }}
              aria-hidden="true"
            />
            <div className="flex items-center gap-4">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{
                  background: "linear-gradient(135deg, hsl(45 80% 60%), hsl(38 70% 45%))",
                  color: "hsl(var(--text-inverse))",
                }}
              >
                <Crown className="h-6 w-6" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-display text-lg text-text-primary">The Trading Desk</span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.18em]"
                    style={{
                      color: "hsl(var(--primary))",
                      backgroundColor: "hsl(var(--primary) / 0.12)",
                      border: "1px solid hsl(var(--primary) / 0.4)",
                    }}
                  >
                    Premium
                  </span>
                </div>
                <p className="mt-0.5 truncate text-sm text-text-secondary">
                  Live trades, daily positions & members-only streams
                </p>
              </div>
              <ArrowUpRight
                className="h-5 w-5 shrink-0 text-primary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </div>
          </a>
        </div>

        {/* ── Standard links ───────────────────────────────────────── */}
        <div className="mt-3 flex w-full flex-col gap-3">
          {links.map(({ label, sublabel, href, external, Icon }) => {
            const inner = (
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-card-border bg-surface-secondary text-primary transition-colors duration-300 group-hover:border-primary/40">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <span className="block font-semibold text-text-primary">{label}</span>
                  <span className="block truncate text-sm text-text-secondary">{sublabel}</span>
                </div>
                <ArrowUpRight
                  className="h-5 w-5 shrink-0 text-text-muted transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                  aria-hidden="true"
                />
              </div>
            );
            const cls =
              "group card-modern block w-full p-4 sm:p-5";
            return external ? (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={cls}>
                {inner}
              </a>
            ) : (
              <Link key={label} href={href} aria-label={label} className={cls}>
                {inner}
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <Link href="/" className="link-animated text-sm font-medium text-text-secondary hover:text-text-primary">
            sergioavedian.com
          </Link>
          <p className="max-w-sm text-center text-[0.7rem] leading-relaxed text-text-muted">
            Educational content only. Nothing here is financial advice. Past performance is not indicative of future results.
          </p>
          <p className="text-[0.7rem] text-text-muted">© 2026 Sergio Avedian Inc.</p>
        </div>
      </div>
    </main>
  );
}
