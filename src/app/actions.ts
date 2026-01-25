"use server";

import { client } from "@/lib/sanity/client";
import { searchPostsQuery } from "@/lib/sanity/queries";

export interface SearchResult {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  author: { name: string };
  category: string;
}

export async function searchPosts(term: string): Promise<SearchResult[]> {
  if (!term || term.length < 2) {
    return [];
  }

  try {
    const results = await client.fetch<SearchResult[]>(searchPostsQuery, { term });
    return results;
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}
