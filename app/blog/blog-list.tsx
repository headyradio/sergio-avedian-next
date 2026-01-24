"use client";

import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/lib/sanity/client";
import { format } from "date-fns";

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: any;
  publishedAt: string;
  author?: { name: string; image?: any; slug?: string };
  categories?: Array<{ title: string; slug: { current: string } }>;
}

interface BlogListProps {
  initialPosts: Post[];
}

export default function BlogList({ initialPosts }: BlogListProps) {
  if (!initialPosts || initialPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary text-lg">
          No posts yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {initialPosts.map((post) => (
        <article key={post._id} className="card-premium rounded-xl overflow-hidden group relative">
          <Link href={`/blog/${post.slug.current}`} className="absolute inset-0 z-0">
             <span className="sr-only">Read {post.title}</span>
          </Link>

            {post.mainImage && (
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={urlForImage(post.mainImage).width(600).height(340).url()}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            )}
            <div className="p-6 pointer-events-none">
              {post.categories && post.categories.length > 0 && (
                <div className="flex gap-2 mb-3 relative z-10 pointer-events-auto">
                  {post.categories.slice(0, 2).map((cat) => (
                    <span
                      key={cat.slug.current}
                      className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary"
                    >
                      {cat.title}
                    </span>
                  ))}
                </div>
              )}
              <h2 className="text-xl font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="text-text-secondary text-sm line-clamp-2 mb-4">
                  {post.excerpt}
                </p>
              )}
              <div className="flex items-center justify-between text-sm text-text-muted">
                {post.author && (
                  <Link href={`/author/${post.author.slug}`} className="flex items-center gap-2 hover:text-primary transition-colors z-10 relative pointer-events-auto">
                    {post.author.image ? (
                      <div className="relative w-6 h-6 rounded-full overflow-hidden border border-border">
                        <Image
                          src={urlForImage(post.author.image).width(64).height(64).url()}
                          alt={post.author.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-surface-secondary flex items-center justify-center text-xs font-bold text-text-muted">
                        {post.author.name.charAt(0)}
                      </div>
                    )}
                    <span>{post.author.name}</span>
                  </Link>
                )}
                {post.publishedAt && (
                  <time dateTime={post.publishedAt}>
                    {format(new Date(post.publishedAt), "MMM d, yyyy")}
                  </time>
                )}
              </div>
            </div>
        </article>
      ))}
    </div>
  );
}
