import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight, Award, Phone } from "lucide-react";
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
    <section id="blog" className="py-16 lg:py-20 bg-background">
      <div className="editorial-container">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
              Latest Articles
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Practical insights for building wealth
            </p>
          </div>
          <Link href="/blog" className="text-sm font-medium text-primary hover:text-primary-hover transition-colors flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {posts.map((post) => (
            <article key={post._id} className="bg-surface rounded-lg overflow-hidden group relative h-full flex flex-col hover:shadow-large transition-all duration-300 hover:-translate-y-1">
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
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
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
                  <div className="flex items-center justify-between mb-3">
                    {post.categories && post.categories.length > 0 && (
                      <span className="text-xs font-medium text-primary uppercase tracking-wider relative z-10">
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
                  <div className="flex items-center justify-between pt-4 mt-auto border-t border-border/50">
                    <div className="flex items-center gap-1 text-xs text-text-muted">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
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
        <div className="flex justify-center mb-16">
          <Link href="/blog">
            <Button 
              variant="outline" 
              size="lg"
              className="group border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              Browse all articles
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Coaching CTA - Compact dark panel */}
        <div className="mt-12 bg-surface rounded-lg p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              Need Personalized Guidance?
            </h3>
            <p className="text-sm text-text-secondary">
              Work directly with Sergio for custom trading strategies.
            </p>
          </div>
          
          <Link href="/coaching">
            <Button 
              size="default" 
              className="bg-primary hover:bg-primary-hover text-primary-foreground font-medium whitespace-nowrap"
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