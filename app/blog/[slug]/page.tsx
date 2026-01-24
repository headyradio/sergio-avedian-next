import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SuggestedArticles from "@/components/SuggestedArticles";
import FinalCTASection from "@/components/FinalCTASection";
import { client, urlForImage } from "@/lib/sanity/client";
import { postBySlugQuery, postSlugsQuery, suggestedPostsQuery } from "@/lib/sanity/queries";
import Image from "next/image";
import { format } from "date-fns";
import PostBody from "@/components/PostBody";
import SocialShareButtons from "@/components/blog/SocialShareButtons";
import TableOfContents from "@/components/TableOfContents";

interface Props {
  params: { slug: string };
}

export const revalidate = 60; // ISR: Revalidate every 60 seconds

// Generate static params for all blog posts (SSG)
export async function generateStaticParams() {
  const slugs = await client.fetch(postSlugsQuery);
  return slugs.map((slug: string) => ({ slug }));
}

async function getPost(slug: string) {
  try {
    const post = await client.fetch(postBySlugQuery, { slug });
    return post;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const ogImage = post.mainImage
    ? urlForImage(post.mainImage).width(1200).height(630).url()
    : "https://sergioavedian.com/og-image.png"; // Fallback image

  return {
    title: `${post.title} | Sergio Avedian`,
    description: post.excerpt || `Read ${post.title} on Sergio Avedian's Blog`,
    openGraph: {
      title: post.title,
      description: post.excerpt || `Read ${post.title} on Sergio Avedian's Blog`,
      type: "article",
      publishedTime: post.publishedAt,
      url: `https://sergioavedian.com/blog/${post.slug.current}`,
      siteName: "Sergio Avedian",
      authors: post.author ? [post.author.name] : ["Sergio Avedian"],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
  };
}

function estimateReadingTime(body: any[]): number {
  if (!body) return 0;
  // Simple estimation: count words in blocks
  let wordCount = 0;
  body.forEach(block => {
    if (block._type === 'block' && block.children) {
      block.children.forEach((child: any) => {
        if (child.text) {
          wordCount += child.text.split(' ').length;
        }
      });
    }
  });
  return Math.ceil(wordCount / 200); // 200 words per minute
}

export default async function BlogPostPage({ params }: Props) {
  const [post, suggestedPosts] = await Promise.all([
    getPost(params.slug),
    client.fetch(suggestedPostsQuery, { currentSlug: params.slug })
  ]);

  if (!post) {
    notFound();
  }

  const readingTime = estimateReadingTime(post.body);
  
  // Extract Headings for TOC
  const headings = post.body
    ?.filter((block: any) => block._type === 'block' && block.style === 'h2')
    .map((block: any) => ({
      text: block.children?.[0]?.text || "",
      id: block.children?.[0]?.text ? block.children[0].text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-') : ""
    }))
    .filter((h: any) => h.text && h.id) || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <main className="pb-20">
        {/* Back Link */}
        <div className="container mx-auto px-4 py-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors font-medium mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Articles
          </Link>
        </div>

        {/* Hero Section */}
        <div className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center mb-12">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            {post.mainImage ? (
              <Image
                src={urlForImage(post.mainImage).width(1920).height(1080).url()}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800" />
            )}
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60 z-10" />
          </div>

          {/* Hero Content */}
          <div className="relative z-20 container mx-auto px-4 text-center max-w-4xl">
            {post.categories && post.categories.length > 0 && (
              <span className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full backdrop-blur-sm border border-primary/20">
                {post.categories[0].title}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                {post.excerpt}
              </p>
            )}
          </div>
        </div>

        <div className="editorial-container px-4">
          <div className="flex flex-col lg:flex-row gap-8 relative items-start">
             
             {/* Left Column: TOC (Desktop) */}
            <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0 sticky top-24">
                <TableOfContents headings={headings} />
            </aside>

            {/* Main Content Column */}
            <article className="flex-1 w-full min-w-0 max-w-3xl mx-auto lg:mx-0">
              
              {/* Post Meta Data Bar */}
              <div className="flex flex-col md:flex-row items-center justify-between py-6 border-b border-border/40 gap-6 mb-8">
                <div className="flex flex-wrap items-center gap-6 text-sm text-text-secondary">
                  {post.author && (
                    <Link href={`/author/${post.author.slug || '#'}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                      {post.author.image ? (
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-primary/20">
                           <Image 
                              src={urlForImage(post.author.image).width(64).height(64).url()} 
                              alt={post.author.name}
                              fill
                              className="object-cover" 
                           />
                        </div>
                      ) : (
                         <User className="w-4 h-4 text-primary" />
                      )}
                      <span className="font-medium">{post.author.name}</span>
                    </Link>
                  )}
                  {post.publishedAt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <time dateTime={post.publishedAt}>
                        {format(new Date(post.publishedAt), "MMMM d, yyyy")}
                      </time>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{readingTime} min read</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-text-secondary uppercase tracking-wider hidden md:block">Share</span>
                  <SocialShareButtons title={post.title} slug={post.slug.current} />
                </div>
              </div>

               {/* Mobile TOC */}
                <div className="lg:hidden mb-8 border border-border/40 rounded-lg p-4 bg-surface/50">
                    <TableOfContents headings={headings} />
                </div>

              {/* Post Content */}
              {post.body && <PostBody content={post.body} />}
            </article>

            {/* Empty Right Column for Balance or potential Ads/Related later */}
             <div className="hidden xl:block w-16 flex-shrink-0"></div>

          </div>
        </div>
        
        {/* Suggested Articles */}
        <div className="mt-20">
             <SuggestedArticles posts={suggestedPosts} />
        </div>

        {/* CTA Section */}
        <FinalCTASection />
      </main>
      
      <Footer />
    </div>
  );
}
