import { groq } from 'next-sanity';

// Get all published blog posts
export const postsQuery = groq`
  *[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    "mainImage": coverImage,
    publishedAt,
    "author": author->{name, image, "slug": slug.current},
    "categories": categories[]->{title, slug}
  }
`;

// Get paginated posts
export const paginatedPostsQuery = groq`
  *[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc) [$start...$end] {
    _id,
    title,
    slug,
    excerpt,
    "mainImage": coverImage,
    publishedAt,
    "author": author->{name, image, "slug": slug.current},
    "categories": categories[]->{title, slug}
  }
`;

// Get total posts count
export const postsCountQuery = groq`
  count(*[_type == "post" && !(_id in path("drafts.**"))])
`;

// Get a single post by slug
export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    _id,
    title,
    slug,
    excerpt,
    "body": content,
    "mainImage": coverImage,
    publishedAt,
    "author": author->{name, image, bio, "slug": slug.current},
    "categories": categories[]->{title, slug}
  }
`;

// Get all categories
export const categoriesQuery = groq`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description
  }
`;

// Get posts by category
export const postsByCategoryQuery = groq`
  *[_type == "post" && $categorySlug in categories[]->slug.current && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    "mainImage": coverImage,
    publishedAt,
    "author": author->{name, image, "slug": slug.current},
    "categories": categories[]->{title, slug}
  }
`;

// Get featured posts (for homepage)
export const featuredPostsQuery = groq`
  *[_type == "post" && featured == true && !(_id in path("drafts.**"))] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    excerpt,
    "mainImage": coverImage,
    publishedAt,
    "author": author->{name, image, "slug": slug.current}
  }
`;
// Get latest posts (for homepage fallback)
export const latestPostsQuery = groq`
  *[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc, _createdAt desc)[0...6] {
    _id,
    title,
    slug,
    excerpt,
    "mainImage": coverImage,
    publishedAt,
    "author": author->{name, image, "slug": slug.current},
    "categories": categories[]->{title, slug}
  }
`;

// Get all post slugs for static paths
export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)][].slug.current
`;

// Get suggested posts (excluding current post)
export const suggestedPostsQuery = groq`
  *[_type == "post" && !(_id in path("drafts.**")) && slug.current != $currentSlug] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    excerpt,
    "mainImage": coverImage,
    publishedAt,
    "categories": categories[]->{title, slug}
  }
`;

// Get author by slug
export const authorBySlugQuery = groq`
  *[_type == "author" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    image,
    bio
  }
`;

// Get posts by author
export const postsByAuthorQuery = groq`
  *[_type == "post" && author->slug.current == $slug && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    "mainImage": coverImage,
    publishedAt,
    "author": author->{name, image, "slug": slug.current},
    "categories": categories[]->{title, slug}
  }
`;

// Get paginated posts by author
export const paginatedPostsByAuthorQuery = groq`
  *[_type == "post" && author->slug.current == $slug && !(_id in path("drafts.**"))] | order(publishedAt desc) [$start...$end] {
    _id,
    title,
    slug,
    excerpt,
    "mainImage": coverImage,
    publishedAt,
    "author": author->{name, image, "slug": slug.current},
    "categories": categories[]->{title, slug}
  }
`;

// Get total posts count by author
export const postsCountByAuthorQuery = groq`
  count(*[_type == "post" && author->slug.current == $slug && !(_id in path("drafts.**"))])
`;

// Search posts
export const searchPostsQuery = groq`
  *[_type == "post" && !(_id in path("drafts.**")) && (
    title match $term + "*" || 
    excerpt match $term + "*" ||
    pt::text(content) match $term + "*"
  )] | order(publishedAt desc)[0...10] {
    _id,
    title,
    slug,
    publishedAt,
    "author": author->{name},
    "category": categories[0]->title
  }
`;
