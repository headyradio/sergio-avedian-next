import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { blogPosts, blogCategories, BlogPost } from "@/types/blog";
import { Search, Calendar, Clock, ArrowRight, Filter } from "lucide-react";

const BlogListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  // Filter posts based on search and category
  const filteredPosts = blogPosts.filter((post: BlogPost) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  // Get category color
  const getCategoryColor = (category: string) => {
    const categoryObj = blogCategories.find(cat => cat.name === category);
    return categoryObj?.color || "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-primary/5 via-background to-cta/5">
        <div className="editorial-container">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-black text-gradient mb-6">
              Editorial Insights
            </h1>
            <p className="text-base lg:text-lg text-text-secondary mb-8 leading-relaxed">
              In-depth analysis and commentary on the gig economy, regulations, and market trends that shape the future of independent work.
            </p>
            
            {/* Search and Filter */}
            <div className="flex flex-col lg:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-lg border-card-border bg-card/50 backdrop-blur-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedCategory === "" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("")}
                  className="h-12"
                >
                  All
                </Button>
                {blogCategories.map((category) => (
                  <Button
                    key={category.slug}
                    variant={selectedCategory === category.name ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.name)}
                    className="h-12 hidden sm:flex"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Mobile Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center mt-4 sm:hidden">
              {blogCategories.map((category) => (
                <Button
                  key={category.slug}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.name)}
                  size="sm"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 lg:py-24">
        <div className="editorial-container">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <Filter className="h-16 w-16 text-text-muted mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-text-primary mb-2">No articles found</h3>
              <p className="text-text-secondary">Try adjusting your search terms or category filter.</p>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-8">
                <p className="text-text-secondary">
                  Showing {currentPosts.length} of {filteredPosts.length} articles
                  {selectedCategory && ` in ${selectedCategory}`}
                  {searchTerm && ` matching "${searchTerm}"`}
                </p>
              </div>

              {/* Articles Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {currentPosts.map((post: BlogPost) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="group"
                  >
                    <article className="card-modern rounded-3xl overflow-hidden h-full hover:shadow-xl transition-all duration-300">
                      <div className="aspect-video relative overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {post.featured && (
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-cta text-cta-foreground">
                              Featured
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <Badge
                            variant="secondary"
                            className={getCategoryColor(post.category)}
                          >
                            {post.category}
                          </Badge>
                          <div className="flex items-center text-text-muted text-sm">
                            <Clock className="h-3 w-3 mr-1" />
                            {post.readTime}
                          </div>
                        </div>
                        <h3 className="text-base lg:text-lg font-bold text-text-primary mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                          {post.title}
                        </h3>
                        <p className="text-text-secondary mb-4 line-clamp-3 leading-relaxed flex-1">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-text-muted">
                            <Calendar className="h-3 w-3 mr-1" />
                            {post.publishedAt}
                          </div>
                          <div className="text-primary group-hover:text-primary-hover flex items-center font-medium">
                            Read More
                            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className="w-10 h-10"
                    >
                      {page}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-cta/5">
        <div className="editorial-container">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-xl lg:text-2xl font-bold text-text-primary mb-4">
              Never Miss an Update
            </h3>
            <p className="text-base text-text-secondary mb-8">
              Get our weekly roundup of the most important gig economy news, regulations, and market insights delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-12"
              />
              <Button variant="cta" size="lg" className="h-12">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogListPage;