import { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PersonalCoachingSection from "@/components/PersonalCoachingSection";
import CoachingHero from "./coaching-hero";

export const metadata: Metadata = {
  title: "Personal Trading Coaching with Sergio Avedian",
  description: "Get personalized trading coaching from Sergio Avedian, a 35-year Wall Street veteran. Master strategies, risk management, and trading psychology for consistent success.",
  keywords: ["trading coaching", "personal mentorship", "Wall Street guidance", "trading strategies", "risk management", "Sergio Avedian"],
  openGraph: {
    title: "Personal Trading Coaching with Sergio Avedian",
    description: "Get personalized trading coaching from Sergio Avedian, a 35-year Wall Street veteran.",
    url: "https://sergioavedian.com/coaching",
    images: [{ url: "https://sergioavedian.com/sergio-hero-main.png" }],
  },
};

export default function CoachingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <CoachingHero />
      <PersonalCoachingSection />
      <Footer />
    </div>
  );
}
