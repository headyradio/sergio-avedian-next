import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import VideoGrid from "@/components/VideoGrid";
import BlogSection from "@/components/BlogSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <VideoGrid />
      <BlogSection />
      <Footer />
    </div>
  );
};

export default Index;
