import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { urlForImage } from "@/lib/sanity/client";

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: any;
  publishedAt: string;
  categories?: { title: string; slug: { current: string } }[];
}

interface SuggestedArticlesProps {
  posts: Post[];
}

export default function SuggestedArticles({ posts }: SuggestedArticlesProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-16 border-t border-border/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Continue Reading
            </h2>
            <Link 
              href="/blog" 
              className="text-primary hover:text-primary/80 transition-colors font-medium flex items-center gap-1 text-sm"
            >
              View all articles
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug.current}`}
                className="group bg-surface/50 rounded-xl overflow-hidden border border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  {post.mainImage ? (
                    <Image
                      src={urlForImage(post.mainImage).width(400).height(250).url()}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-surface to-surface-secondary" />
                  )}
                  {/* Category Badge */}
                  {post.categories && post.categories[0] && (
                    <span className="absolute top-3 left-3 px-2 py-1 text-xs font-medium bg-background/80 backdrop-blur-sm text-primary rounded-full">
                      {post.categories[0].title}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-text-secondary line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
