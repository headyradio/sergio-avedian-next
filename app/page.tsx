
// Force dynamic rendering to avoid static generation timeout
export const dynamic = 'force-dynamic';

import Navigation from "@/components/Navigation";
import MainHeroSection from "@/components/MainHeroSection";
import FeaturedArticleBanner from "@/components/FeaturedArticleBanner";
import GoldSubscriptionSection from "@/components/GoldSubscriptionSection";
import VideoSection from "@/components/VideoSection";
import CMSBlogSection from "@/components/CMSBlogSection";
import Footer from "@/components/Footer";
import { client } from "@/lib/sanity/client";
import { latestPostsQuery } from "@/lib/sanity/queries";
import { getLatestLongFormVideos, getShorts, getShowVideos } from "@/lib/youtube";

export default async function HomePage() {
  const [posts, latestVideos, powerHourVideos, tradingVideos, shorts] = await Promise.all([
    client.fetch(latestPostsQuery),
    getLatestLongFormVideos(6),
    getShowVideos("Sergio Avedian Power Hour"),
    getShowVideos("Trading with Sergio"),
    getShorts(10)
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <MainHeroSection />
      <FeaturedArticleBanner />
      <GoldSubscriptionSection />
      <CMSBlogSection posts={posts} />
      <VideoSection 
        latestVideos={latestVideos} 
        powerHourVideos={powerHourVideos}
        tradingVideos={tradingVideos}
        shorts={shorts} 
      />
      <Footer />
    </div>
  );
}
