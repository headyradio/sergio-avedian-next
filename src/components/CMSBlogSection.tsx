"use client";

import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight, Phone } from "lucide-react";
import Link from "next/link";
import { urlForImage } from "@/lib/sanity/client";
import Image from "next/image";


interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  mainImage: any;
  publishedAt: string;
  author: {
    name: string;
    image: any;
    slug?: string;
  };
  categories?: Array<{
    title: string;
    slug: { current: string };
  }>;
}

interface CMSBlogSectionProps {
  posts: BlogPost[];
}

const CMSBlogSection = ({ posts = [] }: CMSBlogSectionProps) => {

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section id="blog" className="section-spacing bg-background">
      <div className="editorial-container">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-semibold tracking-[0.25em] text-primary uppercase block mb-3">
              Insights
            </span>
            <h2 className="text-3xl md:text-4xl font-display text-text-primary">
              Latest Articles
            </h2>
          </div>
          <Link href="/blog" className="text-sm font-medium text-primary hover:text-primary-hover transition-colors flex items-center gap-1.5 group">
            View all <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-10">
          {posts.map((post) => (
            <article key={post._id} className="bg-surface rounded-lg overflow-hidden group relative h-full flex flex-col transition-all duration-300 border border-border/30 hover:border-primary/40">
                <Link href={`/blog/${post.slug.current}`} className="absolute inset-0 z-0">
                   <span className="sr-only">Read {post.title}</span>
                </Link>

                {/* Image */}
                <div className="relative aspect-video w-full overflow-hidden">
                  {post.mainImage ? (
                    <Image
                      src={urlForImage(post.mainImage).url()}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-surface-secondary flex items-center justify-center">
                      <span className="text-text-muted">No Image</span>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-6 flex flex-col flex-grow pointer-events-none">
                  {/* Category & Read Time */}
                  <div className="flex items-center justify-between mb-4">
                    {post.categories && post.categories.length > 0 && (
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider relative z-10">
                        {post.categories[0].title}
                      </span>
                    )}
                    <div className="flex items-center gap-1 text-xs text-text-muted">
                      <Clock className="h-3 w-3" />
                      5 min
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-2 mb-3">
                    {post.title}
                  </h3>
                  
                  {/* Excerpt */}
                  <p className="text-text-secondary text-sm leading-relaxed line-clamp-2 flex-grow">
                    {post.excerpt}
                  </p>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between pt-5 mt-auto border-t border-border/40">
                    <div className="flex items-center gap-1 text-xs text-text-muted">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.publishedAt || '2026-01-01').toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                       {post.author && post.author.name && (
                        <>
                          <span className="mx-1">•</span>
                          <Link href={`/author/${post.author.slug}`} className="hover:text-primary transition-colors relative z-10 pointer-events-auto">
                            {post.author.name}
                          </Link>
                        </>
                      )}
                    </div>
                    
                    <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </article>
          ))}
        </div>

        {/* Browse All Button */}
        <div className="flex justify-center mb-10">
          <Link href="/blog">
            <Button 
              variant="outline" 
              size="lg"
              className="group border-border hover:border-primary text-text-primary hover:text-primary transition-all duration-300 px-8"
            >
              Browse all articles
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Coaching CTA */}
        <div className="bg-surface rounded-lg p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-border/30">
          <div className="text-center md:text-left">
            <h3 className="text-xl lg:text-2xl font-display text-text-primary mb-2">
              Need Personalized Guidance?
            </h3>
            <p className="text-sm text-text-secondary max-w-md">
              Work directly with Sergio for custom trading strategies.
            </p>
          </div>
          
          <Link href="/coaching">
            <Button 
              size="default" 
              className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold whitespace-nowrap px-8"
            >
              <Phone className="w-4 h-4 mr-2" />
              Get Coaching
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CMSBlogSection;