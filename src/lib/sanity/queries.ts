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
    "author": author->{name, image},
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
    "author": author->{name, image},
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
    "author": author->{name, image, bio},
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
    "author": author->{name, image},
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
    "author": author->{name, image}
  }
`;
// Get latest posts (for homepage fallback)
export const latestPostsQuery = groq`
  *[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc)[0...6] {
    _id,
    title,
    slug,
    excerpt,
    "mainImage": coverImage,
    publishedAt,
    "author": author->{name, image},
    "categories": categories[]->{title, slug}
  }
`;
