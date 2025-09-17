import Navigation from "@/components/Navigation";
import MainHeroSection from "@/components/MainHeroSection";
import HeroSection from "@/components/HeroSection";
import VideoSection from "@/components/VideoSection";
import BlogSection from "@/components/BlogSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <MainHeroSection />
      <HeroSection />
      <VideoSection />
      <BlogSection />
      <Footer />
    </div>
  );
};

export default Index;
