import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import hygraphClient from '@/lib/hygraph';
import type { BlogPost, HomePageContent, FooterContent, NavigationItem } from '@/types/cms';

// GraphQL Queries
const GET_BLOG_POSTS = gql`
  query GetBlogPosts($first: Int = 10, $skip: Int = 0) {
    blogPosts(first: $first, skip: $skip, orderBy: publishedAt_DESC) {
      id
      title
      slug
      excerpt
      content
      publishedAt
      updatedAt
      author
      category
      readTime
      featured
      coverImage {
        url
        alt
      }
      seo {
        title
        description
        keywords
      }
    }
  }
`;

const GET_HOMEPAGE_CONTENT = gql`
  query GetHomepageContent {
    homepageContent(where: { id: "homepage" }) {
      id
      heroTitle
      heroDescription
      heroCtaPrimary
      heroCTaSecondary
      statsSubscribers
      statsNewsletter
      statsVideos
      heroImage {
        url
        alt
      }
    }
  }
`;

const GET_FOOTER_CONTENT = gql`
  query GetFooterContent {
    footerContent(where: { id: "footer" }) {
      id
      description
      newsletterTitle
      newsletterDescription
      copyrightText
      socialLinks
      footerLinks
    }
  }
`;

const GET_NAVIGATION_ITEMS = gql`
  query GetNavigationItems {
    navigationItems(orderBy: order_ASC) {
      id
      label
      href
      order
    }
  }
`;

// Custom Hooks
export const useBlogPosts = (first = 10, skip = 0) => {
  return useQuery({
    queryKey: ['blogPosts', first, skip],
    queryFn: async () => {
      const data = await hygraphClient.request(
        GET_BLOG_POSTS,
        { first, skip }
      );
      return data.blogPosts as BlogPost[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFeaturedBlogPosts = () => {
  const FEATURED_POSTS_QUERY = gql`
    query GetFeaturedBlogPosts {
      blogPosts(where: { featured: true }, orderBy: publishedAt_DESC, first: 5) {
        id
        title
        slug
        excerpt
        content
        publishedAt
        author
        category
        readTime
        featured
        coverImage {
          url
          alt
        }
      }
    }
  `;

  return useQuery({
    queryKey: ['featuredBlogPosts'],
    queryFn: async () => {
      const data = await hygraphClient.request(
        FEATURED_POSTS_QUERY
      );
      return data.blogPosts as BlogPost[];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useHomepageContent = () => {
  return useQuery({
    queryKey: ['homepageContent'],
    queryFn: async () => {
      const data = await hygraphClient.request(
        GET_HOMEPAGE_CONTENT
      );
      return data.homepageContent as HomePageContent;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - homepage content changes less frequently
  });
};

export const useFooterContent = () => {
  return useQuery({
    queryKey: ['footerContent'],
    queryFn: async () => {
      const data = await hygraphClient.request(
        GET_FOOTER_CONTENT
      );
      return data.footerContent as FooterContent;
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useNavigationItems = () => {
  return useQuery({
    queryKey: ['navigationItems'],
    queryFn: async () => {
      const data = await hygraphClient.request(
        GET_NAVIGATION_ITEMS
      );
      return data.navigationItems as NavigationItem[];
    },
    staleTime: 10 * 60 * 1000,
  });
};

// Test hook to verify connection with your specific blog post
export const useTestBlogPost = () => {
  const TEST_QUERY = gql`
    query TestBlogPost {
      blogPost(where: { id: "cmeejj2fg0v6u08pstr5nzgv5" }) {
        id
        title
        content
        publishedAt
      }
    }
  `;

  return useQuery({
    queryKey: ['testBlogPost'],
    queryFn: async () => {
      const data = await hygraphClient.request(TEST_QUERY);
      return data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute for testing
  });
};