import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SubscribeDropdown from "@/components/SubscribeDropdown";
import { useBlogPost } from "@/hooks/useSupabaseCMS";

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
      <Navigation />
      
      {/* Article Header */}
      <article className="py-12 lg:py-20">
        <div className="editorial-container max-w-4xl">
          <div className="mb-8">
            <Link to="/blog" className="inline-flex items-center text-primary hover:text-primary-hover transition-colors mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Articles
            </Link>
          </div>

          {/* Cover Image */}
          {post.cover_image_url && (
            <div className="aspect-video mb-8 rounded-2xl overflow-hidden">
              <img
                src={post.cover_image_url}
                alt={post.cover_image_alt || post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Meta */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted mb-6">
              {post.category && (
                <Badge 
                  className="bg-surface border-2 text-text-primary font-medium"
                  style={{ borderColor: post.category.color }}
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {post.category.name}
                </Badge>
              )}
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {post.read_time || '5 min read'}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {post.author}
              </div>
            </div>

            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-black text-text-primary leading-tight">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-xl text-text-secondary mt-6 leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </div>

          {/* Article Content */}
          <div 
            className="prose prose-lg prose-gray dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-text-primary prose-p:text-text-secondary prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-text-primary prose-ul:text-text-secondary prose-ol:text-text-secondary prose-blockquote:border-l-primary prose-blockquote:bg-surface/50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg prose-code:bg-surface prose-code:text-text-primary prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-surface prose-pre:border prose-pre:border-border"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
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
          <div className="mt-12 p-6 bg-surface/50 rounded-xl border border-border">
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
      </article>

      <Footer />
    </div>
  );
};

export default CMSBlogPostPage;