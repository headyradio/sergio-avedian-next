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
    <section id="blog" className="py-24 lg:py-32 bg-background">
      <div className="editorial-container">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-text-primary mb-4">
            Latest Articles
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl">
            Practical insights and strategies for building wealth without a financial advisor.
          </p>
        </div>

        {/* Blog Posts Grid - Dark cards like slide deck */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {posts.map((post) => (
            <Link key={post._id} href={`/blog/${post.slug.current}`}>
              <article className="bg-surface rounded-lg overflow-hidden group cursor-pointer h-full flex flex-col hover:shadow-large transition-all duration-300 hover:-translate-y-1">
                {/* Image */}
                <div className="relative aspect-video w-full overflow-hidden">
                  {post.mainImage ? (
                    <Image
                      src={urlForImage(post.mainImage).url()}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-surface-secondary flex items-center justify-center">
                      <span className="text-text-muted">No Image</span>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Category & Read Time */}
                  <div className="flex items-center justify-between mb-3">
                    {post.categories && post.categories.length > 0 && (
                      <span className="text-xs font-medium text-primary uppercase tracking-wider">
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
                    </div>
                    
                    <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/blog">
            <Button variant="outline" size="lg" className="group border-2 border-border hover:border-primary">
              View All Articles
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Coaching CTA - Light gray panel like slide deck */}
        <div className="mt-20 bg-surface-tertiary rounded-lg p-10 lg:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs font-medium text-text-inverse/70 uppercase tracking-wider mb-4 block">
              Personalized Guidance
            </span>
            
            <h3 className="text-3xl font-bold text-text-inverse mb-4">
              Need More Guidance?
            </h3>
            <p className="text-lg text-text-inverse/80 mb-8">
              Reach out to discuss your trading goals and see how personalized coaching 
              can accelerate your path to consistent profits.
            </p>
            
            <Link href="/coaching">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold px-8"
              >
                <Phone className="w-4 h-4 mr-2" />
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