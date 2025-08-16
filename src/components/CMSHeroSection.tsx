import { Button } from "@/components/ui/button";
import { Play, Mail } from "lucide-react";
import sergioHero from "@/assets/sergio-hero.jpg";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useHomepageContent } from "@/hooks/useCMS";

interface LatestVideo {
  video_id: string;
  title: string;
  description: string;
  thumbnail_high: string;
  view_count: number;
}

const CMSHeroSection = () => {
  const [latestVideo, setLatestVideo] = useState<LatestVideo | null>(null);
  const { data: homepageContent, isLoading: contentLoading } = useHomepageContent();

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

  // Use CMS content with fallbacks
  const heroTitle = homepageContent?.heroTitle || latestVideo?.title || "Navigating the Gig Economy Revolution";
  const heroDescription = homepageContent?.heroDescription || latestVideo?.description?.substring(0, 200) || "Expert insights on rideshare, delivery, regulation, and financial strategies for gig workers. Join thousands who trust Sergio's analysis.";
  const ctaPrimary = homepageContent?.heroCtaPrimary || "Watch Latest Video";
  const ctaSecondary = homepageContent?.heroCTaSecondary || "Get Weekly Insights";
  const statsSubscribers = homepageContent?.statsSubscribers || "50K+";
  const statsNewsletter = homepageContent?.statsNewsletter || "10K+";
  const statsVideos = homepageContent?.statsVideos || "500+";

  // Show loading state for critical content
  if (contentLoading) {
    return (
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="editorial-container py-24 lg:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="loading-shimmer h-8 w-32 rounded-full"></div>
                <div className="loading-shimmer h-20 w-full rounded"></div>
                <div className="loading-shimmer h-16 w-3/4 rounded"></div>
              </div>
              <div className="flex gap-6">
                <div className="loading-shimmer h-12 w-48 rounded"></div>
                <div className="loading-shimmer h-12 w-48 rounded"></div>
              </div>
            </div>
            <div className="loading-shimmer h-96 w-full rounded-3xl"></div>
          </div>
        </div>
      </section>
    );
  }

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
                {heroTitle}
              </h1>
              <p className="text-xl lg:text-2xl text-text-secondary leading-relaxed max-w-2xl prose-modern">
                {heroDescription}...
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
                {ctaPrimary}
              </Button>
              <Button variant="secondary" size="xl" className="group glass-card text-lg px-8 py-4">
                <Mail className="h-6 w-6 group-hover:scale-110 transition-transform" />
                {ctaSecondary}
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center space-x-8 pt-12">
              <div className="text-center">
                <div className="text-3xl font-black text-gradient">{statsSubscribers}</div>
                <div className="text-sm text-text-muted font-mono uppercase tracking-wider">YouTube Subscribers</div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="text-center">
                <div className="text-3xl font-black text-gradient">{statsNewsletter}</div>
                <div className="text-sm text-text-muted font-mono uppercase tracking-wider">Newsletter Readers</div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="text-center">
                <div className="text-3xl font-black text-gradient">{statsVideos}</div>
                <div className="text-sm text-text-muted font-mono uppercase tracking-wider">Videos Published</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative lg:order-last">
            <div className="relative">
              <img
                src={homepageContent?.heroImage?.url || latestVideo?.thumbnail_high || sergioHero}
                alt={homepageContent?.heroImage?.alt || (latestVideo ? latestVideo.title : "Sergio Avedian - Gig Economy Expert")}
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

export default CMSHeroSection;