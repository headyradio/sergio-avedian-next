import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SubscribeDropdown from "@/components/SubscribeDropdown";
import ScrollProgressIndicator from "@/components/ScrollProgressIndicator";
import { useBlogPost } from "@/hooks/useSupabaseCMS";
import { convertMarkdownToHTML } from "@/utils/markdownHelpers";
import { OptimizedImage } from "@/components/OptimizedImage";

const CMSBlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useBlogPost(slug || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">Loading article...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-text-primary mb-4">Article Not Found</h1>
            <p className="text-text-secondary mb-8">The article you're looking for doesn't exist or has been moved.</p>
            <Link to="/blog">
              <Button>Back to Blog</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ScrollProgressIndicator />
      <Navigation />
      
      {/* Back Navigation */}
      <div className="py-6 bg-background">
        <div className="editorial-container max-w-4xl">
          <Link to="/blog" className="inline-flex items-center text-primary hover:text-primary-hover transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Articles
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] lg:min-h-[70vh] flex items-center justify-center">
        {/* Background Image */}
        {post.cover_image_url && (
          <div className="absolute inset-0 z-0">
            <OptimizedImage
              src={post.cover_image_url}
              alt={post.cover_image_alt || post.title}
              className="w-full h-full"
              priority={true}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/70"></div>
          </div>
        )}
        
        {/* Fallback Background for articles without cover image */}
        {!post.cover_image_url && (
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/20 via-background to-cta/20"></div>
        )}

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Category Badge */}
          {post.category && (
            <div className="mb-6">
              <Badge 
                className="bg-white/10 backdrop-blur-sm border-2 text-white font-medium text-sm px-4 py-2"
                style={{ borderColor: post.category.color }}
              >
                <Tag className="h-4 w-4 mr-2" />
                {post.category.name}
              </Badge>
            </div>
          )}

          {/* Article Title */}
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight mb-6 drop-shadow-lg">
            {post.title}
          </h1>
          
          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              {post.excerpt}
            </p>
          )}
        </div>
      </section>

      {/* Article Byline */}
      <section className="py-8 border-b border-border/20">
        <div className="editorial-container max-w-4xl">
          <div className="flex flex-wrap items-center justify-center gap-6 text-text-muted">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span className="font-medium">By {post.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>
                {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>{post.read_time || '5 min read'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-16 lg:py-20">
        <div className="editorial-container max-w-4xl">

          {/* Article Content */}
          <div 
            className="prose prose-lg prose-gray dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-text-primary prose-p:text-text-secondary prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-text-primary prose-ul:text-text-secondary prose-ol:text-text-secondary prose-blockquote:border-l-primary prose-blockquote:bg-surface/50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg prose-code:bg-surface prose-code:text-text-primary prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-surface prose-pre:border prose-pre:border-border"
            dangerouslySetInnerHTML={{ __html: convertMarkdownToHTML(post.content || '') }}
          />

          {/* Subscribe CTA */}
          <div className="mt-16 p-8 bg-gradient-to-r from-primary/5 to-cta/5 border border-primary/20 rounded-2xl text-center">
            <h3 className="text-2xl font-bold text-text-primary mb-4">
              Get More Trading Insights
            </h3>
            <p className="text-lg text-text-secondary mb-6 max-w-2xl mx-auto">
              Join thousands of traders and investors getting exclusive market analysis and strategies from a Wall Street veteran.
            </p>
            <div className="flex justify-center">
              <SubscribeDropdown variant="cta" size="lg" />
            </div>
          </div>

            {/* Author Bio */}
          <div className="mt-12">
            <div className="p-6 bg-surface/50 rounded-xl border border-border">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-cta rounded-full flex items-center justify-center text-white font-bold text-xl">
                  SA
                </div>
                <div>
                  <h4 className="font-bold text-text-primary mb-2">Sergio Avedian</h4>
                  <p className="text-text-secondary leading-relaxed">
                    Wall Street veteran with 35+ years of experience in trading and investment management. 
                    Former senior executive at major financial institutions, now sharing proven strategies and market insights 
                    with independent traders and investors worldwide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default CMSBlogPostPage;