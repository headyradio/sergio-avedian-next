import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, ArrowRight, User } from "lucide-react";
import { useBlogPosts, useFeaturedBlogPosts, CMSBlogPost } from "@/hooks/useSupabaseCMS";

// Loading skeleton component
const BlogCardSkeleton = () => (
  <Card className="overflow-hidden">
    <div className="loading-shimmer h-48 w-full"></div>
    <div className="p-6 space-y-4">
      <div className="loading-shimmer h-4 w-20 rounded"></div>
      <div className="loading-shimmer h-6 w-full rounded"></div>
      <div className="loading-shimmer h-16 w-full rounded"></div>
      <div className="loading-shimmer h-4 w-32 rounded"></div>
    </div>
  </Card>
);

const FeaturedBlogCard = ({ post }: { post: CMSBlogPost }) => (
  <Card className="overflow-hidden card-modern group cursor-pointer">
    <div className="relative">
      <img
        src={post.cover_image_url || "/placeholder.svg"}
        alt={post.cover_image_alt || post.title}
        className="w-full h-64 lg:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute top-4 left-4">
        <span className="bg-brand-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
          Featured
        </span>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
    </div>
    
    <div className="p-8 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-text-muted">
        <span className="px-3 py-1 bg-surface rounded-full font-medium text-brand-primary">
            {post.category?.name || 'Uncategorized'}
          </span>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {post.read_time || '5 min read'}
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-text-primary group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        
        <p className="text-text-secondary leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <User className="h-4 w-4 text-text-muted" />
          <span className="text-sm text-text-muted">{post.author}</span>
          <span className="text-text-muted">•</span>
          <div className="flex items-center gap-1 text-sm text-text-muted">
            <Calendar className="h-4 w-4" />
            {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
        </div>
        
        <Button variant="ghost" size="sm" className="group/btn">
          Read More
          <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  </Card>
);

const BlogCard = ({ post }: { post: CMSBlogPost }) => (
  <Card className="overflow-hidden card-modern group cursor-pointer">
    <div className="relative">
      <img
        src={post.cover_image_url || "/placeholder.svg"}
        alt={post.cover_image_alt || post.title}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
      />
    </div>
    
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <span className="px-3 py-1 bg-surface rounded-full text-sm font-medium text-brand-primary">
          {post.category?.name || 'Uncategorized'}
        </span>
        <div className="flex items-center gap-1 text-sm text-text-muted">
          <Clock className="h-4 w-4" />
          {post.read_time || '5 min read'}
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-2">
        {post.title}
      </h3>
      
      <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">
        {post.excerpt}
      </p>
      
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-1 text-sm text-text-muted">
          <Calendar className="h-4 w-4" />
          {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })}
        </div>
        
        <Button variant="ghost" size="sm" className="group/btn">
          Read More
          <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  </Card>
);

const CMSBlogSection = () => {
  const { data: featuredPosts, isLoading: featuredLoading } = useFeaturedBlogPosts();
  const { data: regularPosts, isLoading: regularLoading } = useBlogPosts(6, 0);

  const featuredPost = featuredPosts?.[0];
  const otherPosts = regularPosts?.filter(post => !post.featured) || [];

  return (
    <section className="py-24 lg:py-32 bg-surface">
      <div className="editorial-container">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-text-primary">
            Latest Insights
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto prose-modern">
            Stay informed with the latest trends, strategies, and insights from the gig economy.
            Expert analysis you can trust.
          </p>
        </div>

        {/* Featured Post */}
        {featuredLoading ? (
          <div className="mb-16">
            <BlogCardSkeleton />
          </div>
        ) : featuredPost ? (
          <div className="mb-16">
            <FeaturedBlogCard post={featuredPost} />
          </div>
        ) : null}

        {/* Regular Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularLoading
            ? Array.from({ length: 6 }, (_, i) => <BlogCardSkeleton key={i} />)
            : otherPosts.map((post) => <BlogCard key={post.id} post={post} />)
          }
        </div>

        {/* Newsletter CTA */}
        <div className="mt-20 text-center glass-card p-12 rounded-3xl">
          <h3 className="text-3xl font-black text-text-primary mb-4">
            Never Miss an Update
          </h3>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Get the latest gig economy insights delivered directly to your inbox. 
            Join thousands of drivers and entrepreneurs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 bg-input border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button className="cta-electric px-8 py-3 font-semibold">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CMSBlogSection;