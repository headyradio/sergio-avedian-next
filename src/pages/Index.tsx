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
  
  // Organization Schema for brand identity
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Sergio Avedian",
    "url": "https://sergioavedian.com",
    "logo": "https://sergioavedian.com/favicon.png",
    "description": "Wall Street veteran with 35+ years of experience providing practical guidance on building wealth without a financial advisor.",
    "founder": {
      "@type": "Person",
      "name": "Sergio Avedian",
      "jobTitle": "Financial Educator & Wall Street Veteran",
      "url": "https://sergioavedian.com/about"
    },
    "sameAs": [
      "https://twitter.com/sergioaved",
      "https://www.youtube.com/@sergioavedian",
      "https://www.linkedin.com/in/sergioavedian"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "email": "sergio@sergioavedian.com",
      "url": "https://sergioavedian.com/contact"
    }
  };

  // WebSite Schema for search functionality
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Sergio Avedian",
    "url": "https://sergioavedian.com",
    "description": "Practical, no‑hype guidance and insights from Sergio Avedian — 35+ years on Wall Street — focused on building wealth without a financial advisor.",
    "publisher": {
      "@type": "Organization",
      "name": "Sergio Avedian",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sergioavedian.com/favicon.png"
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://sergioavedian.com/blog?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };
  
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
        
        {/* Structured Data - Organization */}
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
        
        {/* Structured Data - WebSite */}
        <script type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </script>
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
