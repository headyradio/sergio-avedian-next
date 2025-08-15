import { Button } from "@/components/ui/button";
import { Play, Mail } from "lucide-react";
import sergioHero from "@/assets/sergio-hero.jpg";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
    <section className="relative bg-background overflow-hidden">
      <div className="editorial-container py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Content */}
          <div className="space-y-12">
            <div className="space-y-8">
              <div className="meta-text">Latest Episode</div>
              <h1 className="heading-display font-serif">
                {latestVideo?.title || "Navigating the Gig Economy Revolution"}
              </h1>
              <p className="body-large max-w-xl text-text-secondary">
                {latestVideo?.description?.substring(0, 160) || "Expert insights on rideshare, delivery, regulation, and financial strategies for gig workers. Join thousands who trust Sergio's analysis."}...
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-6">
              <Button 
                size="lg" 
                className="cta-primary px-10 py-4 text-lg font-medium group"
                onClick={() => latestVideo && window.open(`https://youtube.com/watch?v=${latestVideo.video_id}`, '_blank')}
              >
                <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch Latest Video
              </Button>
              <Button variant="secondary" size="lg" className="px-10 py-4 text-lg font-medium interactive-subtle group">
                <Mail className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Get Weekly Insights
              </Button>
            </div>

            {/* Social Proof */}
            <div className="pt-12">
              <div className="divider-subtle mb-8" />
              <div className="flex items-center space-x-12">
                <div>
                  <div className="text-4xl font-medium text-text-primary">50K+</div>
                  <div className="meta-text">Subscribers</div>
                </div>
                <div>
                  <div className="text-4xl font-medium text-text-primary">10K+</div>
                  <div className="meta-text">Newsletter Readers</div>
                </div>
                <div>
                  <div className="text-4xl font-medium text-text-primary">500+</div>
                  <div className="meta-text">Videos</div>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative lg:order-last">
            <div className="card-feature aspect-[4/5] group cursor-pointer">
              <img
                src={sergioHero}
                alt="Sergio Avedian - Gig Economy Expert"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Play overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white text-primary w-16 h-16 rounded-full flex items-center justify-center shadow-large">
                  <Play className="h-6 w-6 ml-1" />
                </div>
              </div>
            </div>
            
            {/* Floating stats */}
            <div className="absolute -bottom-4 -right-4 bg-card border border-card-border rounded-lg p-4 shadow-medium">
              <div className="meta-text mb-1">Latest Video</div>
              <div className="text-2xl font-medium text-text-primary">
                {latestVideo ? formatViews(latestVideo.view_count) : '125K'}
              </div>
              <div className="meta-text">Views</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;