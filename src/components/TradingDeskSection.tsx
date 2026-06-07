"use client";

import Image from "next/image";
import {
  Activity,
  BarChart3,
  Radio,
  GraduationCap,
  CandlestickChart,
  Briefcase,
  Trophy,
  Bell,
  Crown,
  ArrowRight,
} from "lucide-react";

const DISCORD_URL = "https://discord.gg/s9nJvURcpb";
const WHOP_URL = "https://whop.com/checkout/plan_kPD5F9M8dEH34";

const premiumBenefits = [
  {
    icon: Activity,
    title: "Access My Trades — Live",
    description: "Watch every entry and exit in real time. (Not financial advice)",
  },
  {
    icon: BarChart3,
    title: "Daily Open Positions",
    description: "Full transparency on what's on the book, every single day",
  },
  {
    icon: Radio,
    title: "Members-Only Livestreams",
    description: "Exclusive Discord livestreams reserved for premium members",
  },
  {
    icon: GraduationCap,
    title: "Equity, Options & Futures Education",
    description: "Structured trading education across all three markets",
  },
  {
    icon: CandlestickChart,
    title: "Fundamental & Technical Analysis",
    description: "How I read the markets — from balance sheets to charts",
  },
  {
    icon: Briefcase,
    title: "My Long-Term Portfolio",
    description: "See exactly what I hold for the long run, and why",
  },
  {
    icon: Trophy,
    title: "Robinhood $1,000 Account Challenge",
    description: "Follow a small account grow with disciplined, real trades",
  },
  {
    icon: Bell,
    title: "Macro Insights & Earnings Alerts",
    description: "Big-picture context and timely alerts ahead of earnings",
  },
];

const DiscordMark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 127.14 96.36" fill="currentColor" className={className} aria-hidden="true">
    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
  </svg>
);

const TradingDeskSection = () => {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: "hsl(228 48% 7%)" }}
      aria-labelledby="trading-desk-heading"
    >
      {/* Atmosphere: gold glow + faint chart grid */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[60rem] h-[30rem] rounded-full opacity-25"
          style={{
            background:
              "radial-gradient(ellipse at center, hsl(43 75% 52% / 0.35), transparent 65%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(43 60% 70% / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(43 60% 70% / 0.5) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      <div className="editorial-container relative section-spacing">
        {/* ── Header ───────────────────────────────────────── */}
        <div className="text-center mb-10">
          <p
            className="text-[0.7rem] sm:text-xs font-semibold tracking-[0.35em] uppercase mb-4"
            style={{ color: "hsl(43 70% 58%)" }}
          >
            A Premium Discord Community
          </p>
          <h2
            id="trading-desk-heading"
            className="text-4xl sm:text-5xl lg:text-6xl font-display tracking-tight"
            style={{
              background:
                "linear-gradient(180deg, hsl(45 85% 78%) 0%, hsl(43 70% 55%) 55%, hsl(38 65% 42%) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            The Trading Desk
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg" style={{ color: "hsl(225 25% 78%)" }}>
            Trade with a 30+ year market veteran. Education, process, and
            long-term trader development — not hype.
          </p>
        </div>

        {/* ── Featured banner ──────────────────────────────── */}
        <div className="relative max-w-4xl mx-auto mb-16">
          <div
            className="absolute -inset-1 rounded-2xl opacity-60 blur-md"
            style={{
              background:
                "linear-gradient(135deg, hsl(43 75% 55% / 0.5), transparent 40%, hsl(43 75% 55% / 0.5))",
            }}
            aria-hidden="true"
          />
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group/banner relative block rounded-2xl overflow-hidden border transition-transform duration-300 hover:scale-[1.01]"
            style={{ borderColor: "hsl(43 60% 50% / 0.45)" }}
            aria-label="Join The Trading Desk on Discord"
          >
            <Image
              src="/the-trading-desk-banner.png"
              alt="The Trading Desk — trade with a 30+ year veteran. A premium Discord community focused on education, process, and long-term trader development."
              width={1672}
              height={941}
              className="w-full h-auto transition-transform duration-500 group-hover/banner:scale-[1.02]"
              sizes="(max-width: 1024px) 100vw, 896px"
              priority={false}
            />
          </a>
        </div>

        {/* ── Two paths in ────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16">
          {/* Free — Discord */}
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1"
            style={{
              borderColor: "hsl(225 25% 24%)",
              backgroundColor: "hsl(227 40% 11%)",
            }}
            aria-label="Join The Trading Desk Discord as a free member"
          >
            <div className="flex items-center gap-3 mb-5">
              <span
                className="flex items-center justify-center w-11 h-11 rounded-xl"
                style={{ backgroundColor: "hsl(235 86% 65% / 0.15)", color: "hsl(235 86% 72%)" }}
              >
                <DiscordMark className="w-5 h-5" />
              </span>
              <span
                className="text-[0.65rem] font-bold tracking-[0.25em] uppercase px-3 py-1 rounded-full border"
                style={{ color: "hsl(225 25% 70%)", borderColor: "hsl(225 25% 28%)" }}
              >
                Free Member
              </span>
            </div>
            <h3 className="text-2xl font-display mb-2" style={{ color: "hsl(45 40% 92%)" }}>
              Join the Community
            </h3>
            <p className="text-sm leading-relaxed mb-8 flex-1" style={{ color: "hsl(225 20% 68%)" }}>
              Step onto the desk for free. Market talk, community channels, and
              a front-row seat to how serious traders think.
            </p>
            <span
              className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
              style={{ color: "hsl(235 86% 75%)" }}
            >
              Join free on Discord
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </a>

          {/* Premium — Whop */}
          <a
            href={WHOP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1"
            style={{
              background:
                "linear-gradient(160deg, hsl(227 42% 13%) 0%, hsl(228 45% 9%) 100%)",
              border: "1px solid hsl(43 65% 52% / 0.55)",
              boxShadow: "0 0 50px hsl(43 75% 50% / 0.12), inset 0 1px 0 hsl(45 80% 70% / 0.15)",
            }}
            aria-label="Become a premium member of The Trading Desk"
          >
            {/* corner shimmer */}
            <div
              className="absolute top-0 left-8 right-8 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, hsl(45 85% 65% / 0.8), transparent)",
              }}
              aria-hidden="true"
            />
            <div className="flex items-center gap-3 mb-5">
              <span
                className="flex items-center justify-center w-11 h-11 rounded-xl"
                style={{
                  background: "linear-gradient(135deg, hsl(45 80% 60%), hsl(38 70% 45%))",
                  color: "hsl(228 48% 8%)",
                }}
              >
                <Crown className="w-5 h-5" aria-hidden="true" />
              </span>
              <span
                className="text-[0.65rem] font-bold tracking-[0.25em] uppercase px-3 py-1 rounded-full"
                style={{
                  color: "hsl(43 80% 60%)",
                  backgroundColor: "hsl(43 75% 50% / 0.12)",
                  border: "1px solid hsl(43 65% 52% / 0.4)",
                }}
              >
                Premium Member
              </span>
            </div>
            <h3 className="text-2xl font-display mb-2" style={{ color: "hsl(45 60% 88%)" }}>
              Take a Seat at the Desk
            </h3>
            <p className="text-sm leading-relaxed mb-8 flex-1" style={{ color: "hsl(225 20% 70%)" }}>
              Full access: my live trades, daily positions, members-only
              livestreams, and the complete education stack below.
            </p>
            <span
              className="inline-flex items-center justify-center gap-2 w-full rounded-xl py-3.5 text-sm font-bold tracking-wide uppercase transition-all duration-300 group-hover:brightness-110"
              style={{
                background: "linear-gradient(135deg, hsl(45 85% 62%), hsl(40 75% 48%))",
                color: "hsl(228 48% 8%)",
                boxShadow: "0 8px 24px hsl(43 75% 45% / 0.35)",
              }}
            >
              Join the Desk
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </a>
        </div>

        {/* ── Premium benefits ledger ──────────────────────── */}
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, hsl(43 60% 50% / 0.5))" }} aria-hidden="true" />
            <h3
              className="text-xs sm:text-sm font-bold tracking-[0.3em] uppercase whitespace-nowrap"
              style={{ color: "hsl(43 70% 60%)" }}
            >
              Premium Members Get More
            </h3>
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, hsl(43 60% 50% / 0.5), transparent)" }} aria-hidden="true" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {premiumBenefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="flex items-start gap-4 rounded-xl border p-5 transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    borderColor: "hsl(225 25% 20%)",
                    backgroundColor: "hsl(227 38% 10% / 0.8)",
                  }}
                >
                  <span
                    className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0 mt-0.5"
                    style={{
                      backgroundColor: "hsl(43 75% 50% / 0.12)",
                      color: "hsl(43 75% 58%)",
                      border: "1px solid hsl(43 65% 52% / 0.25)",
                    }}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold leading-snug mb-1" style={{ color: "hsl(45 40% 90%)" }}>
                      {benefit.title}
                    </h4>
                    <p className="text-xs leading-relaxed" style={{ color: "hsl(225 18% 62%)" }}>
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-center text-[0.7rem] tracking-wide" style={{ color: "hsl(225 15% 48%)" }}>
            Educational content only. Nothing on The Trading Desk is financial advice.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TradingDeskSection;
