import { useParams, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { blogPosts, blogCategories, BlogPost } from "@/types/blog";
import { 
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Link as LinkIcon,
  ChevronUp,
  Tag
} from "lucide-react";
import { cn } from "@/lib/utils";

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [readingProgress, setReadingProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Find the blog post
  const post: BlogPost | undefined = blogPosts.find(p => p.slug === slug);

  // Get related posts (same category, excluding current post)
  const relatedPosts = blogPosts
    .filter(p => p.category === post?.category && p.slug !== slug)
    .slice(0, 3);

  // Get category color
  const getCategoryColor = (category: string) => {
    const categoryObj = blogCategories.find(cat => cat.name === category);
    return categoryObj?.color || "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
  };

  // Handle scroll progress and scroll-to-top visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / maxHeight) * 100;
      
      setReadingProgress(progress);
      setShowScrollTop(scrolled > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Share functions
  const shareUrl = window.location.href;
  const shareText = post ? `${post.title} by ${post.author}` : '';

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If post not found, redirect to blog list
  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-card-border z-50">
        <div 
          className="h-full bg-gradient-to-r from-primary to-cta transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Hero Section */}
      <article className="py-12 lg:py-20">
        <div className="editorial-container max-w-4xl">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link 
              to="/blog" 
              className="inline-flex items-center text-text-muted hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Articles
            </Link>
          </nav>

          {/* Article Header */}
          <header className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Badge className={getCategoryColor(post.category)}>
                {post.category}
              </Badge>
              {post.featured && (
                <Badge className="bg-cta text-cta-foreground">
                  Featured
                </Badge>
              )}
            </div>

            <h1 className="text-4xl lg:text-5xl font-black text-text-primary mb-6 leading-tight">
              {post.title}
            </h1>

            <p className="text-xl text-text-secondary mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-6 text-text-muted mb-8">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {post.publishedAt}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {post.readTime}
              </div>
              <div className="text-text-primary font-medium">
                By {post.author}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Share Buttons */}
            <div className="flex items-center space-x-4 mb-8">
              <span className="text-sm text-text-muted font-medium">Share:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={shareOnTwitter}
                className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={shareOnFacebook}
                className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={shareOnLinkedIn}
                className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
              >
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={copyLink}
                className="hover:bg-green-50 hover:border-green-200 hover:text-green-600"
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            </div>

            <Separator />
          </header>

          {/* Featured Image */}
          <div className="aspect-video rounded-2xl overflow-hidden mb-12 shadow-2xl">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-text-primary prose-p:text-text-secondary prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-text-primary prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-text-primary prose-code:bg-card prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-primary">
            <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />').replace(/#{1,6} /g, (match) => {
              const level = match.trim().length;
              return `<h${level} class="font-bold text-text-primary mt-8 mb-4">`;
            }).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/_(.*?)_/g, '<em>$1</em>') }} />
          </div>

          {/* Author Bio */}
          <div className="mt-16 p-8 bg-gradient-to-r from-primary/5 to-cta/5 rounded-2xl border border-primary/20">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-cta rounded-full flex items-center justify-center text-white font-bold text-xl">
                {post.author.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-text-primary mb-2">
                  About {post.author}
                </h3>
                <p className="text-text-secondary mb-4">
                  Sergio Avedian is a leading expert in the gig economy with over a decade of experience analyzing market trends, regulations, and opportunities for independent workers. His insights have helped thousands of drivers and delivery workers maximize their earnings and navigate the evolving landscape of app-based work.
                </p>
                <div className="flex space-x-4">
                  <Button variant="outline" size="sm">
                    Follow on Twitter
                  </Button>
                  <Button variant="outline" size="sm">
                    View All Articles
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter CTA */}
          <div className="mt-16 text-center p-8 bg-card rounded-2xl border border-card-border">
            <h3 className="text-2xl font-bold text-text-primary mb-4">
              Stay Updated
            </h3>
            <p className="text-text-secondary mb-6">
              Get weekly insights on gig economy trends, regulations, and opportunities delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-card-border rounded-lg bg-background text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Button variant="cta" size="lg">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-surface">
          <div className="editorial-container">
            <h2 className="text-3xl font-bold text-text-primary mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="group"
                >
                  <article className="card-modern rounded-2xl overflow-hidden h-full hover:shadow-xl transition-all duration-300">
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <Badge className={getCategoryColor(relatedPost.category)} >
                        {relatedPost.category}
                      </Badge>
                      <h3 className="text-lg font-bold text-text-primary mt-3 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-text-secondary text-sm line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-4 text-xs text-text-muted">
                        <span>{relatedPost.publishedAt}</span>
                        <span>{relatedPost.readTime}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className={cn(
            "fixed bottom-8 right-8 w-12 h-12 rounded-full shadow-lg transition-all duration-300 z-40",
            "bg-primary hover:bg-primary-hover text-white"
          )}
          size="icon"
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      )}

      <Footer />
    </div>
  );
};

export default BlogPostPage;