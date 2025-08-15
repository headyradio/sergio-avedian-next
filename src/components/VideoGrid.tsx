import { Button } from "@/components/ui/button";
import { Play, Clock, Eye } from "lucide-react";

const VideoGrid = () => {
  const videos = [
    {
      id: 1,
      title: "Uber's New Pay Structure: What Drivers Need to Know",
      excerpt: "Breaking down the latest changes to Uber's payment system and how it affects your earnings potential.",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      duration: "12:45",
      views: "45K",
      category: "Rideshare",
      publishedAt: "2 days ago"
    },
    {
      id: 2,
      title: "DoorDash vs UberEats: Earnings Comparison 2024",
      excerpt: "Comprehensive analysis of which platform offers better earning opportunities for delivery drivers.",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      duration: "18:30",
      views: "67K",
      category: "Delivery",
      publishedAt: "5 days ago"
    },
    {
      id: 3,
      title: "California AB5 Update: Impact on Gig Workers",
      excerpt: "Latest developments in California's gig worker classification law and what it means for drivers.",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      duration: "15:20",
      views: "89K",
      category: "Regulation",
      publishedAt: "1 week ago"
    },
    {
      id: 4,
      title: "Tax Tips for Gig Workers: Maximize Your Deductions",
      excerpt: "Essential tax strategies every gig worker should know to maximize deductions and minimize liability.",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      duration: "22:15",
      views: "134K",
      category: "Finance",
      publishedAt: "2 weeks ago"
    },
    {
      id: 5,
      title: "The Future of Autonomous Vehicles and Gig Work",
      excerpt: "How self-driving cars will impact the gig economy and what drivers should prepare for.",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      duration: "25:45",
      views: "78K",
      category: "Markets",
      publishedAt: "3 weeks ago"
    },
    {
      id: 6,
      title: "Building Multiple Income Streams as a Gig Worker",
      excerpt: "Strategies for diversifying your gig work portfolio and creating sustainable income.",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      duration: "19:30",
      views: "156K",
      category: "Finance",
      publishedAt: "1 month ago"
    }
  ];

  const categoryColors = {
    Rideshare: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
    Delivery: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
    Regulation: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
    Finance: "bg-cta/10 text-cta",
    Markets: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300"
  };

  return (
    <section className="py-16 lg:py-24 bg-surface">
      <div className="editorial-container">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
              Latest Videos
            </h2>
            <p className="text-lg text-text-secondary">
              Stay informed with expert analysis on the gig economy
            </p>
          </div>
          <Button variant="editorial" size="lg">
            View All Videos
          </Button>
        </div>

        {/* Video Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <article
              key={video.id}
              className="group bg-card border border-card-border rounded-2xl overflow-hidden shadow-subtle hover:shadow-large transition-all duration-300 cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-surface overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center">
                    <Play className="h-6 w-6 ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/75 text-white px-2 py-1 rounded text-sm font-medium flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {video.duration}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      categoryColors[video.category as keyof typeof categoryColors]
                    }`}
                  >
                    {video.category}
                  </span>
                  <div className="flex items-center text-text-secondary text-sm">
                    <Eye className="h-3 w-3 mr-1" />
                    {video.views}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-text-primary mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {video.title}
                </h3>

                <p className="text-text-secondary mb-4 line-clamp-2 leading-relaxed">
                  {video.excerpt}
                </p>

                <div className="flex items-center justify-between text-sm text-text-muted">
                  <span>{video.publishedAt}</span>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary-hover">
                    Watch now
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16 bg-gradient-to-r from-cta/10 to-primary/10 border border-cta/20 rounded-2xl p-8 lg:p-12 text-center">
          <h3 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">
            Never Miss a Video
          </h3>
          <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
            Get notified when new videos drop. Join thousands of gig workers who stay ahead of the curve.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-card-border rounded-lg bg-card text-card-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Button variant="cta" size="lg">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoGrid;