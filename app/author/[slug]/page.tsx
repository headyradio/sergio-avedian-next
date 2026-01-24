import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { client, urlForImage } from "@/lib/sanity/client";
import { authorBySlugQuery, postsByAuthorQuery } from "@/lib/sanity/queries";
import CMSBlogSection from "@/components/CMSBlogSection";

export const revalidate = 60;

interface AuthorPageProps {
  params: { slug: string };
}

async function getAuthorData(slug: string) {
  try {
    const [author, posts] = await Promise.all([
      client.fetch(authorBySlugQuery, { slug }),
      client.fetch(postsByAuthorQuery, { slug }),
    ]);
    return { author, posts };
  } catch (error) {
    console.error("Error fetching author data:", error);
    return { author: null, posts: [] };
  }
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { author } = await getAuthorData(params.slug);
  
  if (!author) {
    return {
      title: "Author Not Found",
    };
  }

  return {
    title: `${author.name} - Author`,
    description: author.bio || `Read articles by ${author.name}`,
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { author, posts } = await getAuthorData(params.slug);

  if (!author) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="editorial-container py-12">
        {/* Author Header */}
        <header className="mb-12 flex flex-col md:flex-row items-center gap-8 bg-surface p-8 rounded-lg border border-border">
          <div className="relative w-32 h-32 md:w-48 md:h-48 flex-shrink-0">
            {author.image ? (
               <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-surface-secondary">
                <Image
                  src={urlForImage(author.image).url()}
                  alt={author.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-full rounded-full bg-surface-secondary flex items-center justify-center text-4xl font-bold text-text-muted">
                {author.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              {author.name}
            </h1>
            {author.bio && (
              <p className="text-text-secondary max-w-2xl text-lg leading-relaxed">
                {author.bio}
              </p>
            )}
             <p className="text-sm text-text-muted mt-4">
              {posts.length} Article{posts.length !== 1 ? 's' : ''} Published
            </p>
          </div>
        </header>

        {/* Author Posts */}
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Latest Articles by {author.name}</h2>
             {posts.length > 0 ? (
                <CMSBlogSection posts={posts} />
             ) : (
                <p className="text-text-secondary">No articles found.</p>
             )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
