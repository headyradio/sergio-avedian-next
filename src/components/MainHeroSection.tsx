import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";
import sergioHeroMain from "@/assets/sergio-hero-main.png";
import { useHomepageContent } from "@/hooks/useSupabaseCMS";

const MainHeroSection = () => {
  const { data: content, isLoading } = useHomepageContent();
  
  console.log('MainHeroSection - isLoading:', isLoading);
  console.log('MainHeroSection - content:', content);

  if (isLoading) {
    return (
      <section className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90"></div>
        <div className="editorial-container py-20 lg:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div className="space-y-8 lg:space-y-12">
              <div className="loading-shimmer h-8 w-64 rounded"></div>
              <div className="loading-shimmer h-32 w-full rounded"></div>
              <div className="loading-shimmer h-12 w-48 rounded"></div>
            </div>
            <div className="loading-shimmer h-96 w-full rounded-3xl"></div>
          </div>
        </div>
      </section>
    );
  }

  console.log('MainHeroSection - rendering main section');
  
  return (
    <section className="relative min-h-screen flex items-center bg-background text-foreground" style={{ backgroundColor: 'red', minHeight: '100vh' }}>
      <div className="editorial-container py-20 lg:py-32 relative z-10">
        <h1 className="text-4xl font-bold text-white mb-4">HERO SECTION TEST</h1>
        <p className="text-xl text-white">This is a test to see if the hero section renders</p>
        <p className="text-lg text-white">Loading: {isLoading ? 'true' : 'false'}</p>
        <p className="text-lg text-white">Content: {content ? 'exists' : 'null'}</p>
      </div>
    </section>
  );
};

export default MainHeroSection;