import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, ArrowRight, User, Award, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { CMSBlogPost } from "@/hooks/useSupabaseCMS";
import { useHomepageBlogPosts } from "@/hooks/useHomepageBlogPosts";
import SubscribeDropdown from "@/components/SubscribeDropdown";
import { OptimizedImage } from "@/components/OptimizedImage";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

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
  <Link to={`/blog/${post.slug}`}>
    <Card className="overflow-hidden card-modern group cursor-pointer">
      <div className="relative">
        <OptimizedImage
          src={post.cover_image_url || "/placeholder.svg"}
          alt={post.cover_image_alt || post.title}
          className="w-full h-64 lg:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
          priority={true}
          aspectRatio="auto"
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
  </Link>
);

const BlogCard = ({ post }: { post: CMSBlogPost }) => {
  const { ref, isIntersecting } = useIntersectionObserver();

  return (
    <div ref={ref}>
      <Link to={`/blog/${post.slug}`}>
        <Card className="overflow-hidden card-modern group cursor-pointer">
          <div className="relative">
            <OptimizedImage
              src={isIntersecting ? (post.cover_image_url || "/placeholder.svg") : "/placeholder.svg"}
              alt={post.cover_image_alt || post.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              aspectRatio="auto"
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
    </Link>
  </div>
);
};

const CMSBlogSection = () => {
  const { data: blogData, isLoading } = useHomepageBlogPosts();

  const { featuredPost, regularPosts, hasMorePosts } = blogData || {
    featuredPost: null,
    regularPosts: [],
    hasMorePosts: false
  };

  return (
    <section id="blog" className="py-24 lg:py-32 bg-surface">
      <div className="editorial-container">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-text-primary">
            Sergio's Blog
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto prose-modern">
            Practical, no‑hype guidance and insights from Sergio Avedian — 35+ years on Wall Street — focused on building wealth without a financial advisor.
          </p>
        </div>

        {/* Featured Post */}
        {isLoading ? (
          <div className="mb-16">
            <BlogCardSkeleton />
          </div>
        ) : featuredPost ? (
          <div className="mb-16">
            <FeaturedBlogCard post={featuredPost} />
          </div>
        ) : null}

        {/* Regular Posts Grid - 2 rows × 3 columns */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {isLoading
            ? Array.from({ length: 6 }, (_, i) => <BlogCardSkeleton key={i} />)
            : regularPosts.map((post) => <BlogCard key={post.id} post={post} />)
          }
        </div>

        {/* Read More Articles CTA */}
        {hasMorePosts && !isLoading && (
          <div className="text-center">
            <Link to="/blog">
              <Button variant="outline" size="lg" className="group">
                Read More Articles
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        )}

        {/* Coaching CTA */}
        <div className="mt-20 text-center glass-card p-12 rounded-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">35+ Years Wall Street Experience</span>
          </div>
          
          <h3 className="text-3xl font-black text-text-primary mb-4">
            Need More Guidance?
          </h3>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Reach out to discuss your trading goals and see how personalized coaching 
            can accelerate your path to consistent profits.
          </p>
          
          <div className="flex justify-center">
            <Link to="/coaching">
              <Button 
                size="lg" 
                className="cta-electric text-lg px-8 py-4 font-semibold"
              >
                <Phone className="w-5 h-5 mr-2" />
                Contact Me to Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CMSBlogSection;