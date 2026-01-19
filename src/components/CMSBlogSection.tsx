import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    <section id="blog" className="py-24 lg:py-32 bg-surface">
      <div className="editorial-container">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-text-primary">
            Sergio&apos;s Blog
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto prose-modern">
            Practical, no‑hype guidance and insights from Sergio Avedian — 35+ years on Wall Street — focused on building wealth without a financial advisor.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.map((post) => (
            <Link key={post._id} href={`/blog/${post.slug.current}`}>
              <Card className="overflow-hidden card-modern group cursor-pointer h-full flex flex-col">
                <div className="relative aspect-video w-full overflow-hidden">
                  {post.mainImage ? (
                    <Image
                      src={urlForImage(post.mainImage).url()}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-brand-secondary/20 flex items-center justify-center">
                      <span className="text-text-muted">No Image</span>
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex flex-col flex-grow space-y-4">
                  <div className="flex items-center justify-between">
                    {post.categories && post.categories.length > 0 && (
                      <span className="px-3 py-1 bg-surface rounded-full text-sm font-medium text-brand-primary">
                        {post.categories[0].title}
                      </span>
                    )}
                    <div className="flex items-center gap-1 text-sm text-text-muted">
                      <Clock className="h-4 w-4" />
                      5 min read
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-text-secondary text-sm leading-relaxed line-clamp-3 flex-grow">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                    <div className="flex items-center gap-1 text-sm text-text-muted">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    
                    <Button variant="ghost" size="sm" className="group/btn p-0 hover:bg-transparent hover:text-primary">
                      Read More
                      <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Read More Articles CTA */}
        <div className="text-center">
          <Link href="/blog">
            <Button variant="outline" size="lg" className="group">
              Read More Articles
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

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
            <Link href="/coaching">
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