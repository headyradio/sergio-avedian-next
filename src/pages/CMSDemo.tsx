import Navigation from "@/components/Navigation";
import CMSHeroSection from "@/components/CMSHeroSection";
import CMSBlogSection from "@/components/CMSBlogSection";
import Footer from "@/components/Footer";

const CMSDemo = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <CMSHeroSection />
      <CMSBlogSection />
      <Footer />
    </div>
  );
};

export default CMSDemo;