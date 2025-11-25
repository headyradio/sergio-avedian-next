import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import MainHeroSection from "@/components/MainHeroSection";
import GoldSubscriptionSection from "@/components/GoldSubscriptionSection";
import VideoSection from "@/components/VideoSection";
import CMSBlogSection from "@/components/CMSBlogSection";
import Footer from "@/components/Footer";
import useScrollToAnchor from "@/hooks/useScrollToAnchor";

const Index = () => {
  useScrollToAnchor();
  
  return (
    <>
      <Helmet>
        <title>Sergio Avedian - Build Wealth Without a Financial Advisor</title>
        <meta 
          name="description" 
          content="Practical, no‑hype guidance and insights from Sergio Avedian — 35+ years on Wall Street — focused on building wealth without a financial advisor." 
        />
        <meta name="keywords" content="wealth building, financial advisor, wall street, investment guidance, financial independence, wealth management, trading, investing" />
        <link rel="canonical" href="https://sergioavedian.com/" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navigation />
      <MainHeroSection />
      <GoldSubscriptionSection />
      <CMSBlogSection />
      <VideoSection />
      <Footer />
      </div>
    </>
  );
};

export default Index;
