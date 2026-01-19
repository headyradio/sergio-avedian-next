import { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { client } from "@/lib/sanity/client";
import { paginatedPostsQuery, postsCountQuery } from "@/lib/sanity/queries";
import BlogList from "./blog-list";
import Pagination from "@/components/Pagination";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights, strategies, and practical guidance on building wealth from Sergio Avedian's 35+ years on Wall Street.",
};

// Revalidate every 60 seconds
export const revalidate = 60;

const POSTS_PER_PAGE = 9;

async function getPaginatedPosts(page: number) {
  const start = (page - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;
  
  try {
    const [posts, total] = await Promise.all([
      client.fetch(paginatedPostsQuery, { start, end }),
      client.fetch(postsCountQuery)
    ]);
    return { posts, total };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { posts: [], total: 0 };
  }
}

interface BlogPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const currentPage = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
  const { posts, total } = await getPaginatedPosts(currentPage);
  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="editorial-container py-12">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            Blog
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl">
            Insights, strategies, and practical guidance on building wealth from 35+ years on Wall Street.
          </p>
        </header>
        <BlogList initialPosts={posts} />
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </main>
      <Footer />
    </div>
  );
}
