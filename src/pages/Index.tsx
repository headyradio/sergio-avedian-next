import Navigation from "@/components/Navigation";
import MainHeroSection from "@/components/MainHeroSection";
import VideoSection from "@/components/VideoSection";
import CMSBlogSection from "@/components/CMSBlogSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <MainHeroSection />
      <VideoSection />
      <CMSBlogSection />
      <Footer />
    </div>
  );
};

export default Index;
