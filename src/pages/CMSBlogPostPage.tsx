import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Calendar, Clock, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SubscribeDropdown from "@/components/SubscribeDropdown";
import ScrollProgressIndicator from "@/components/ScrollProgressIndicator";
import CTAPopup from "@/components/CTAPopup";

import { useBlogPost } from "@/hooks/useSupabaseCMS";
import { useScrollTrigger } from "@/hooks/useScrollTrigger";
import { useExitIntent } from "@/hooks/useExitIntent";
import { convertMarkdownToHTML } from "@/utils/markdownHelpers";
import { OptimizedImage } from "@/components/OptimizedImage";
import { CommentSection } from "@/components/blog/CommentSection";

const CMSBlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useBlogPost(slug || '');
  
  // CTA Popup triggers with reduced times for testing
  const { shouldTrigger: scrollTrigger, resetTrigger: resetScrollTrigger } = useScrollTrigger({
    threshold: 0.3, // Trigger at 30% scroll instead of 65%
    minTimeOnPage: 5000, // 5 seconds instead of 30
    cooldownPeriod: 5 * 60 * 1000 // 5 minutes instead of 24 hours for testing
  });
  const { shouldTrigger: exitTrigger, resetTrigger: resetExitTrigger } = useExitIntent({
    minTimeOnPage: 3000, // 3 seconds instead of 20
    sensitivity: 50,
    cooldownPeriod: 5 * 60 * 1000 // 5 minutes instead of 24 hours for testing
  });
  
  const [showCTAPopup, setShowCTAPopup] = useState(false);

  // Combine triggers - show popup if either scroll or exit intent triggers
  useEffect(() => {
    console.log(`CTA BlogPost: Triggers check - scroll: ${scrollTrigger}, exit: ${exitTrigger}, showPopup: ${showCTAPopup}`);
    if ((scrollTrigger || exitTrigger) && !showCTAPopup) {
      console.log(`CTA BlogPost: SHOWING POPUP!`);
      setShowCTAPopup(true);
    }
  }, [scrollTrigger, exitTrigger, showCTAPopup]);

  const handleCloseCTAPopup = () => {
    setShowCTAPopup(false);
    resetScrollTrigger();
    resetExitTrigger();
  };

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

  const pageUrl = `https://sergioavedian.com/blog/${post.slug}`;
  
  // Ensure absolute URL for social media sharing
  const getAbsoluteImageUrl = (url: string | null | undefined): string => {
    // Default OG image for homepage/fallback (use a proper default later)
    const defaultOgImage = 'https://sergioavedian.com/sergio-hero-main.png';
    
    if (!url) return defaultOgImage;
    
    // Already absolute URL (Supabase storage or external) - most common for blog posts
    if (url.startsWith('http://') || url.startsWith('https://')) {
      // For Supabase storage URLs, ensure they're public and accessible
      return url;
    }
    
    // Handle old src/assets paths (convert to public assets)
    if (url.startsWith('/src/assets/') || url.startsWith('src/assets/')) {
      const filename = url.split('/').pop();
      return `https://sergioavedian.com/assets/blog/${filename}`;
    }
    
    // Handle relative paths
    if (url.startsWith('/')) {
      return `https://sergioavedian.com${url}`;
    }
    
    return `https://sergioavedian.com/${url}`;
  };
  
  const imageUrl = getAbsoluteImageUrl(post.cover_image_url);
  const description = post.seo_description || post.excerpt || `Read ${post.title} by Sergio Avedian`;
  
  // Enhanced Structured Data for SEO - Article Schema
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": description,
    "image": {
      "@type": "ImageObject",
      "url": imageUrl,
      "caption": post.cover_image_alt || post.title
    },
    "datePublished": post.published_at || post.created_at,
    "dateModified": post.updated_at || post.published_at || post.created_at,
    "author": {
      "@type": "Person",
      "name": post.author || "Sergio Avedian",
      "url": "https://sergioavedian.com/about",
      "jobTitle": "Wall Street Veteran & Financial Educator"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Sergio Avedian",
      "url": "https://sergioavedian.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sergioavedian.com/favicon.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": pageUrl
    },
    ...(post.category && { 
      "articleSection": post.category.name,
      "about": {
        "@type": "Thing",
        "name": post.category.name
      }
    }),
    ...(post.seo_keywords && post.seo_keywords.length > 0 && {
      "keywords": post.seo_keywords.join(', ')
    }),
    "inLanguage": "en-US",
    "timeRequired": post.read_time || "PT5M",
    "wordCount": post.content ? post.content.split(/\s+/).length : undefined
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{post.seo_title || post.title} | Sergio Avedian</title>
        <meta name="description" content={description} />
        {post.seo_keywords && post.seo_keywords.length > 0 && (
          <meta name="keywords" content={post.seo_keywords.join(', ')} />
        )}
        
        {/* Open Graph - Optimized for social sharing */}
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Sergio Avedian" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:image:secure_url" content={imageUrl} />
        <meta property="og:image:alt" content={post.cover_image_alt || post.title} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:locale" content="en_US" />
        <meta property="article:published_time" content={post.published_at || post.created_at} />
        <meta property="article:modified_time" content={post.updated_at || post.published_at || post.created_at} />
        <meta property="article:author" content={post.author || "Sergio Avedian"} />
        {post.category && <meta property="article:section" content={post.category.name} />}
        {post.seo_keywords && post.seo_keywords.map((keyword: string, index: number) => (
          <meta key={index} property="article:tag" content={keyword} />
        ))}
        
        {/* Twitter Card - Enhanced with additional metadata */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@sergioaved" />
        <meta name="twitter:creator" content="@sergioaved" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
        <meta name="twitter:image:alt" content={post.cover_image_alt || post.title} />
        <meta name="twitter:label1" content="Written by" />
        <meta name="twitter:data1" content={post.author || "Sergio Avedian"} />
        <meta name="twitter:label2" content="Reading time" />
        <meta name="twitter:data2" content={post.read_time || "5 min read"} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={pageUrl} />
        
        {/* Structured Data (JSON-LD) */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
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
                <Avatar className="w-16 h-16 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-cta text-white font-bold text-xl">
                    SA
                  </AvatarFallback>
                </Avatar>
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

          {/* Comments Section */}
          <div className="mt-16">
            <CommentSection postId={post.id} />
          </div>
        </div>
      </article>

      <Footer />
      
      {/* CTA Popup */}
      <CTAPopup 
        isOpen={showCTAPopup} 
        onClose={handleCloseCTAPopup} 
      />
      
    </div>
  );
};

export default CMSBlogPostPage;