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
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sergio Avedian" />
        <meta property="og:title" content="Sergio Avedian - Build Wealth Without a Financial Advisor" />
        <meta property="og:description" content="Practical, no‑hype guidance and insights from Sergio Avedian — 35+ years on Wall Street — focused on building wealth without a financial advisor." />
        <meta property="og:url" content="https://sergioavedian.com/" />
        <meta property="og:image" content="https://sergioavedian.com/sergio-hero-main.png" />
        <meta property="og:image:secure_url" content="https://sergioavedian.com/sergio-hero-main.png" />
        <meta property="og:image:alt" content="Sergio Avedian - Wall Street Veteran" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@sergioaved" />
        <meta name="twitter:creator" content="@sergioaved" />
        <meta name="twitter:title" content="Sergio Avedian - Build Wealth Without a Financial Advisor" />
        <meta name="twitter:description" content="Practical, no‑hype guidance and insights from Sergio Avedian — 35+ years on Wall Street — focused on building wealth without a financial advisor." />
        <meta name="twitter:image" content="https://sergioavedian.com/sergio-hero-main.png" />
        <meta name="twitter:image:alt" content="Sergio Avedian - Wall Street Veteran" />
        
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
