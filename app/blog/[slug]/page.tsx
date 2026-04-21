import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { client, urlForImage } from "@/lib/sanity/client";
import { postBySlugQuery, postSlugsQuery, suggestedPostsQuery } from "@/lib/sanity/queries";
import Image from "next/image";
import { format } from "date-fns";
import PostBody from "@/components/PostBody";
import TableOfContents from "@/components/TableOfContents";
import { portableTextToPlainText } from "@/lib/utils";
import { getCachedAudioUrl } from "@/lib/audio-generator";
import dynamic from "next/dynamic";

// Dynamic Imports for Code Splitting
const ArticleAudioPlayer = dynamic(() => import("@/components/ArticleAudioPlayer"), {
  ssr: false, // Interaction only, not needed for SEO
  loading: () => <div className="h-24 bg-surface/50 rounded-lg animate-pulse my-6" />,
});

const SocialShareButtons = dynamic(() => import("@/components/blog/SocialShareButtons"), {
  ssr: false, // Interaction only
  loading: () => <div className="h-8 w-24 bg-surface/50 rounded-full animate-pulse" />,
});

const SuggestedArticles = dynamic(() => import("@/components/SuggestedArticles"), {
  // SSR needed for SEO links, but can still be split from main bundle
  loading: () => <div className="h-96 bg-surface/50 rounded-lg animate-pulse mt-20" />,
});

const FinalCTASection = dynamic(() => import("@/components/FinalCTASection"), {
  loading: () => <div className="h-64 bg-surface/50 rounded-lg animate-pulse mt-12" />,
});

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
    client.fetch(suggestedPostsQuery, { currentSlug: params.slug }),
  ]);

  if (!post) {
    notFound();
  }

  // Resolve pre-generated audio URLs from Vercel Blob CDN.
  // Audio is generated asynchronously via the Sanity webhook on publish.
  const [audioUrlEn, audioUrlEs] = await Promise.all([
    getCachedAudioUrl(post.slug.current, 'en'),
    getCachedAudioUrl(post.slug.current, 'es'),
  ]);

  const readingTime = estimateReadingTime(post.body);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt || `Read ${post.title} on Sergio Avedian's Blog`,
    "image": post.mainImage
      ? urlForImage(post.mainImage).width(1200).height(630).url()
      : "https://sergioavedian.com/og-image.png",
    "datePublished": post.publishedAt || '2026-01-01',
    "dateModified": post.publishedAt || '2026-01-01',
    "author": {
      "@type": "Person",
      "name": post.author?.name || "Sergio Avedian",
      "url": "https://sergioavedian.com/about-sergio"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Sergio Avedian",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sergioavedian.com/sergio-avedian-logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://sergioavedian.com/blog/${post.slug.current}`
    }
  };

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <main>
        {/* Hero Section — full-bleed, immersive, back button overlaid */}
        <div className="relative w-full h-[72vh] min-h-[520px] md:h-[70vh] md:min-h-[560px] flex items-center justify-center mb-10 md:mb-12">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            {post.mainImage ? (
              <Image
                src={urlForImage(post.mainImage).width(1920).height(1080).url()}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1920px"
                quality={85}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800" />
            )}
            {/* Base darkening layer */}
            <div className="absolute inset-0 bg-black/55 z-10" />
            {/* Vignette: darkens edges, subtly lifts center text off the image */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.55)_100%)] z-10" />
            {/* Bottom gradient so content below the hero reads cleanly */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
          </div>

          {/* Back button — frosted glass pill, overlaid top-left */}
          <div className="absolute top-5 left-4 z-30">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs font-semibold tracking-wide hover:bg-black/60 transition-all duration-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              All Articles
            </Link>
          </div>

          {/* Hero Content — centered */}
          <div className="relative z-20 container mx-auto px-4 text-center max-w-4xl">
            {post.categories && post.categories.length > 0 && (
              <span className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/20 rounded-full backdrop-blur-sm border border-primary/30">
                {post.categories[0].title}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight [text-shadow:0_2px_20px_rgba(0,0,0,0.9),0_1px_4px_rgba(0,0,0,0.8)]">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-base md:text-xl text-gray-100 max-w-2xl mx-auto leading-relaxed [text-shadow:0_1px_12px_rgba(0,0,0,0.9),0_1px_3px_rgba(0,0,0,0.7)]">
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
            <article className="flex-1 w-full min-w-0 max-w-3xl mx-auto lg:mx-0 article-reading-surface">

              {/* Post Meta Data Bar */}
              <div className="article-meta-bar flex flex-row items-center justify-between py-4 border-b gap-3 mb-8">
                <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm min-w-0">
                  {post.author && (
                    <Link href={`/author/${post.author.slug || '#'}`} className="flex items-center gap-2 transition-colors shrink-0">
                      {post.author.image ? (
                        <div className="relative w-7 h-7 rounded-full overflow-hidden border border-[#d9d0c3] shrink-0">
                           <Image
                              src={urlForImage(post.author.image).width(64).height(64).url()}
                              alt=""
                              fill
                              className="object-cover"
                           />
                        </div>
                      ) : (
                         <User className="w-4 h-4 shrink-0" />
                      )}
                      <span className="font-medium truncate">{post.author.name}</span>
                    </Link>
                  )}
                  <span className="opacity-40 hidden sm:inline">·</span>
                  <time dateTime={post.publishedAt || '2026-01-01'} className="hidden sm:block shrink-0">
                    {format(new Date(post.publishedAt || '2026-01-01'), "MMM d, yyyy")}
                  </time>
                  <span className="opacity-40">·</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{readingTime} min read</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <SocialShareButtons title={post.title} slug={post.slug.current} />
                </div>
              </div>

               {/* Audio Player — renders only if pre-generated audio exists */}
               <ArticleAudioPlayer
                  title={post.title}
                  audioUrls={{ en: audioUrlEn, es: audioUrlEs }}
               />

               {/* Mobile TOC */}
                <div className="lg:hidden mb-8 border border-[#d9d0c3] rounded-lg p-4 bg-[#f5ede0]/50">
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
