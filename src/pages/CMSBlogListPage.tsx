import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useBlogPosts, useCategories } from "@/hooks/useSupabaseCMS";
import { Search, Calendar, Clock, ArrowRight, Filter } from "lucide-react";
import SubscribeDropdown from "@/components/SubscribeDropdown";

const CMSBlogListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;
  const [searchParams] = useSearchParams();

  const { data: allPosts, isLoading: postsLoading } = useBlogPosts(100, 0, true);
  const { data: categories } = useCategories();

  useEffect(() => {
    const urlSearchTerm = searchParams.get('search');
    const urlCategory = searchParams.get('category');
    
    if (urlSearchTerm) {
      setSearchTerm(urlSearchTerm);
    }
    
    if (urlCategory) {
      const categoryMap: { [key: string]: string } = {
        'investment': 'Investment Strategy',
        'trading': 'Trading Psychology',
        'long-term': 'Long-term Investing',
        'options': 'Options Trading'
      };
      
      const mappedCategory = categoryMap[urlCategory.toLowerCase()] || urlCategory;
      setSelectedCategory(mappedCategory);
    }
  }, [searchParams]);

  const filteredPosts = allPosts?.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || post.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  const getCategoryColor = (categoryName: string) => {
    const category = categories?.find(cat => cat.name === categoryName);
    return category?.color || '#3b82f6';
  };

  if (postsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg text-text-primary">Loading articles...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Trading & Investment Blog | Sergio Avedian</title>
        <meta 
          name="description" 
          content="Expert trading insights, investment strategies, and market analysis from Sergio Avedian. 35+ years of Wall Street experience helping you build wealth without a financial advisor." 
        />
        <meta name="keywords" content="trading blog, investment strategies, market analysis, options trading, long-term investing, Wall Street insights, Sergio Avedian" />
        
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sergio Avedian" />
        <meta property="og:title" content="Trading & Investment Blog | Sergio Avedian" />
        <meta property="og:description" content="Expert trading insights, investment strategies, and market analysis from Sergio Avedian. 35+ years of Wall Street experience helping you build wealth without a financial advisor." />
        <meta property="og:url" content="https://sergioavedian.com/blog" />
        <meta property="og:image" content="https://sergioavedian.com/sergio-hero-main.png" />
        <meta property="og:image:secure_url" content="https://sergioavedian.com/sergio-hero-main.png" />
        <meta property="og:image:alt" content="Sergio Avedian Blog - Trading & Investment Insights" />
        <meta property="og:locale" content="en_US" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@sergioaved" />
        <meta name="twitter:creator" content="@sergioaved" />
        <meta name="twitter:title" content="Trading & Investment Blog | Sergio Avedian" />
        <meta name="twitter:description" content="Expert trading insights, investment strategies, and market analysis from Sergio Avedian. 35+ years of Wall Street experience helping you build wealth without a financial advisor." />
        <meta name="twitter:image" content="https://sergioavedian.com/sergio-hero-main.png" />
        <meta name="twitter:image:alt" content="Sergio Avedian Blog - Trading & Investment Insights" />
        
        <link rel="canonical" href="https://sergioavedian.com/blog" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Simple Hero Section - No transforms, no backdrop-filter */}
        <section className="pt-24 pb-12 lg:pt-28 lg:pb-16 bg-surface">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
                Sergio's Blog
              </h1>
              
              <p className="text-base lg:text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
                Practical, no‑hype guidance from 35+ years on Wall Street — focused on building wealth without a financial advisor.
              </p>
              
              {/* Simple Search */}
              <div className="max-w-xl mx-auto mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 h-12 bg-background border border-border rounded-lg"
                  />
                </div>
              </div>
              
              {/* Simple Category Buttons */}
              <div className="flex gap-2 justify-center flex-wrap">
                <Button
                  variant={selectedCategory === "" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("")}
                  size="sm"
                  className="h-9 px-4"
                >
                  All Articles
                </Button>
                {categories?.map((category) => (
                  <Button
                    key={category.slug}
                    variant={selectedCategory === category.name ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.name)}
                    size="sm"
                    className="h-9 px-4"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="py-12 lg:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <Filter className="h-12 w-12 text-text-muted mx-auto mb-4" />
                <h2 className="text-xl font-bold text-text-primary mb-2">No articles found</h2>
                <p className="text-text-secondary">Try adjusting your search terms or category filter.</p>
              </div>
            ) : (
              <>
                {/* Results Count */}
                <div className="mb-8">
                  <p className="text-text-secondary">
                    Showing <span className="text-text-primary font-medium">{currentPosts.length}</span> of{" "}
                    <span className="text-text-primary font-medium">{filteredPosts.length}</span> articles
                    {selectedCategory && <span> in <span className="text-primary">{selectedCategory}</span></span>}
                  </p>
                </div>

                {/* Simple Blog Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
                  {currentPosts.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="block"
                    >
                      <article className="bg-surface border border-border rounded-xl overflow-hidden h-full hover:border-primary/50 hover:shadow-lg transition-shadow duration-300">
                        {/* Image */}
                        <div className="aspect-video relative overflow-hidden bg-surface-secondary">
                          <img
                            src={post.cover_image_url?.replace('/src/assets/', '/assets/blog/') || "/assets/blog/options-trading.jpg"}
                            alt={post.cover_image_alt || post.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          {post.featured && (
                            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                              Featured
                            </Badge>
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="p-5 sm:p-6">
                          {/* Category & Read Time */}
                          <div className="flex items-center justify-between mb-3">
                            <Badge
                              variant="outline"
                              className="text-xs font-medium"
                              style={{ 
                                borderColor: getCategoryColor(post.category?.name || 'General'),
                                color: getCategoryColor(post.category?.name || 'General')
                              }}
                            >
                              {post.category?.name || 'General'}
                            </Badge>
                            <span className="text-xs text-text-muted flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {post.read_time || '5 min'}
                            </span>
                          </div>
                          
                          {/* Title */}
                          <h3 className="text-lg font-semibold text-text-primary mb-2 line-clamp-2">
                            {post.title}
                          </h3>
                          
                          {/* Excerpt */}
                          <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                            {post.excerpt}
                          </p>
                          
                          {/* Footer */}
                          <div className="flex items-center justify-between pt-3 border-t border-border">
                            <span className="text-xs text-text-muted flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                            <span className="text-sm text-primary font-medium flex items-center">
                              Read More
                              <ArrowRight className="h-3 w-3 ml-1" />
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>

                {/* Simple Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      size="sm"
                    >
                      Previous
                    </Button>
                    
                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => setCurrentPage(page)}
                          size="sm"
                          className="w-9 h-9"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      size="sm"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </main>

        {/* Simple Newsletter Section */}
        <section className="py-12 lg:py-16 bg-surface border-t border-border">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">
              Never Miss an Insight
            </h2>
            <p className="text-text-secondary mb-6 max-w-xl mx-auto">
              Join thousands of investors receiving Sergio's weekly market analysis and trading insights.
            </p>
            <SubscribeDropdown size="lg" />
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default CMSBlogListPage;
