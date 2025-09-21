import { Button } from "@/components/ui/button";
import { Play, Mail } from "lucide-react";
import sergioHero from "@/assets/sergio-hero.jpg";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import StockMarketWidget from "@/components/StockMarketWidget";

interface LatestVideo {
  video_id: string;
  title: string;
  description: string;
  thumbnail_high: string;
  view_count: number;
}

const HeroSection = () => {
  const [latestVideo, setLatestVideo] = useState<LatestVideo | null>(null);

  useEffect(() => {
    const fetchLatestVideo = async () => {
      try {
        const { data, error } = await supabase
          .from('youtube_videos')
          .select('video_id, title, description, thumbnail_high, view_count')
          .order('published_at', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          console.error('Error fetching latest video:', error);
          return;
        }

        setLatestVideo(data);
      } catch (error) {
        console.error('Error fetching latest video:', error);
      }
    };

    fetchLatestVideo();
  }, []);

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero"></div>
      <div className="editorial-container py-24 lg:py-32 relative">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Content */}
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="glass-card inline-flex items-center px-4 py-2 rounded-full">
                <span className="text-sm font-medium text-primary font-mono uppercase tracking-wider">Latest Episode</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-text-primary leading-none">
                {latestVideo?.title || "Navigating the Gig Economy Revolution"}
              </h1>
              <p className="text-xl lg:text-2xl text-text-secondary leading-relaxed max-w-2xl prose-modern">
                {latestVideo?.description?.substring(0, 200) || "Expert insights on rideshare, delivery, regulation, and financial strategies for gig workers. Join thousands who trust Sergio's analysis."}...
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-6">
              <Button 
                variant="hero" 
                size="xl" 
                className="group cta-electric text-lg px-8 py-4"
                onClick={() => latestVideo && window.open(`https://youtube.com/watch?v=${latestVideo.video_id}`, '_blank')}
              >
                <Play className="h-6 w-6 group-hover:scale-110 transition-transform" />
                Watch Latest Video
              </Button>
              <Button variant="secondary" size="xl" className="group glass-card text-lg px-8 py-4">
                <Mail className="h-6 w-6 group-hover:scale-110 transition-transform" />
                Get Weekly Insights
              </Button>
            </div>

            {/* Market Data Section */}
            <div className="pt-12">
              <StockMarketWidget variant="expanded" />
            </div>
          </div>

          {/* Image */}
          <div className="relative lg:order-last">
            <div className="relative">
              <img
                src={latestVideo?.thumbnail_high || sergioHero}
                alt={latestVideo ? latestVideo.title : "Sergio Avedian - Gig Economy Expert"}
                className="w-full h-auto rounded-3xl shadow-large"
              />
              {/* Play overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div 
                  className="cta-electric w-24 h-24 rounded-full flex items-center justify-center cursor-pointer transform hover:scale-110 transition-all duration-300 group glow-primary"
                  onClick={() => latestVideo && window.open(`https://youtube.com/watch?v=${latestVideo.video_id}`, '_blank')}
                >
                  <Play className="h-10 w-10 ml-1 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-3xl"></div>
            </div>
            
            {/* Floating stats */}
            <div className="absolute -bottom-8 -left-8 glass-card rounded-3xl p-8 shadow-large">
              <div className="text-sm text-text-muted font-mono uppercase tracking-wider">Latest Video</div>
              <div className="text-3xl font-black text-gradient mt-1">
                {latestVideo ? formatViews(latestVideo.view_count) : '125K'}
              </div>
              <div className="text-sm text-text-muted font-mono uppercase tracking-wider">Views</div>
            </div>
          </div>
        </div>
      </div>

      {/* Ambient Background Effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-radial from-primary/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-radial from-brand-secondary/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-radial from-brand-accent/5 to-transparent rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
    </section>
  );
};

export default HeroSection;