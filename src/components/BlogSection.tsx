import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const BlogSection = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Understanding the New Uber Pro Rewards Program",
      excerpt: "A comprehensive breakdown of Uber's updated rewards system and how drivers can maximize their benefits through strategic driving patterns.",
      author: "Sergio Avedian",
      publishedAt: "March 15, 2024",
      readTime: "8 min read",
      category: "Rideshare",
      featured: true,
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "DoorDash Market Analysis: Q1 2024 Earnings Report",
      excerpt: "Analyzing DoorDash's latest quarterly earnings and what the numbers mean for delivery drivers and market trends.",
      author: "Sergio Avedian",
      publishedAt: "March 12, 2024",
      readTime: "12 min read",
      category: "Markets",
      featured: false,
      image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "California Prop 22: Two Years Later",
      excerpt: "Examining the long-term effects of Proposition 22 on gig worker classification and earnings in California.",
      author: "Sergio Avedian",
      publishedAt: "March 10, 2024",
      readTime: "15 min read",
      category: "Regulation",
      featured: false,
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      title: "Essential Tax Deductions for Gig Workers in 2024",
      excerpt: "Complete guide to maximizing tax deductions as an independent contractor, including mileage, equipment, and home office expenses.",
      author: "Sergio Avedian",
      publishedAt: "March 8, 2024",
      readTime: "10 min read",
      category: "Finance",
      featured: false,
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  const categoryColors = {
    Rideshare: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
    Delivery: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
    Regulation: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
    Finance: "bg-cta/10 text-cta",
    Markets: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300"
  };

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <section id="blog" className="py-20 lg:py-32 relative">
      <div className="editorial-container">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-16">
          <div>
            <h2 className="text-4xl lg:text-5xl font-black text-gradient mb-6">
              Editorial Insights
            </h2>
            <p className="text-xl text-text-secondary prose-modern">
              In-depth analysis and commentary on gig economy trends
            </p>
          </div>
          <Link to="/blog">
            <Button variant="secondary" size="lg" className="glass-card">
              All Articles
            </Button>
          </Link>
        </div>

        {/* Featured Article */}
        {featuredPost && (
          <Link to={`/blog/uber-pro-rewards-program-guide`} className="block">
            <article className="card-modern rounded-3xl overflow-hidden mb-16 group cursor-pointer">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="aspect-video lg:aspect-auto relative overflow-hidden">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cta text-cta-foreground">
                    Featured
                  </span>
                </div>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center space-x-4 mb-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      categoryColors[featuredPost.category as keyof typeof categoryColors]
                    }`}
                  >
                    {featuredPost.category}
                  </span>
                  <div className="flex items-center text-text-muted text-sm">
                    <Calendar className="h-3 w-3 mr-1" />
                    {featuredPost.publishedAt}
                  </div>
                  <div className="flex items-center text-text-muted text-sm">
                    <Clock className="h-3 w-3 mr-1" />
                    {featuredPost.readTime}
                  </div>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4 group-hover:text-primary transition-colors">
                  {featuredPost.title}
                </h3>
                <p className="text-lg text-text-secondary mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">
                    By {featuredPost.author}
                  </span>
                  <Button variant="ghost" className="text-primary hover:text-primary-hover group/btn">
                    Read More
                    <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </article>
          </Link>
        )}

        {/* Regular Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => {
            // Map post IDs to slugs
            const slugMap: { [key: number]: string } = {
              2: 'doordash-q1-2024-earnings-analysis',
              3: 'california-prop-22-two-years-later',
              4: 'gig-worker-tax-deductions-2024'
            };
            
            return (
              <Link key={post.id} to={`/blog/${slugMap[post.id]}`} className="block">
                <article className="card-modern rounded-3xl overflow-hidden group cursor-pointer h-full">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      categoryColors[post.category as keyof typeof categoryColors]
                    }`}
                  >
                    {post.category}
                  </span>
                  <div className="flex items-center text-text-muted text-sm">
                    <Clock className="h-3 w-3 mr-1" />
                    {post.readTime}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-text-secondary mb-4 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-text-muted">
                  <span>{post.publishedAt}</span>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary-hover">
                    Read More
                  </Button>
                </div>
              </div>
            </article>
              </Link>
            );
          })}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16 bg-gradient-to-r from-primary/5 to-cta/5 border border-primary/20 rounded-2xl p-8 lg:p-12 text-center">
          <h3 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">
            Weekly Industry Digest
          </h3>
          <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
            Get our weekly roundup of the most important gig economy news, regulations, and market insights delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-card-border rounded-lg bg-card text-card-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Button variant="cta" size="lg">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;