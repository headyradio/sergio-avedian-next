import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useBlogPosts, useCategories } from "@/hooks/useSupabaseCMS";
import { Search, Calendar, Clock, ArrowRight, Filter } from "lucide-react";
import SubscribeDropdown from "@/components/SubscribeDropdown";
import { OptimizedImage } from "@/components/OptimizedImage";

const CMSBlogListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;
  const [searchParams] = useSearchParams();

  const { data: allPosts, isLoading: postsLoading } = useBlogPosts(100, 0, true); // Get published posts
  const { data: categories } = useCategories();

  // Set search term and category from URL parameters on mount
  useEffect(() => {
    const urlSearchTerm = searchParams.get('search');
    const urlCategory = searchParams.get('category');
    
    if (urlSearchTerm) {
      setSearchTerm(urlSearchTerm);
    }
    
    if (urlCategory) {
      // Map URL category parameters to actual category names
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

  // Filter posts based on search and category
  const filteredPosts = allPosts?.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || post.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  // Get category color
  const getCategoryColor = (categoryName: string) => {
    const category = categories?.find(cat => cat.name === categoryName);
    return category?.color || '#3b82f6';
  };

  const getCategoryBadgeClass = (categoryName: string) => {
    const color = getCategoryColor(categoryName);
    return `bg-surface border-2 text-text-primary font-medium`;
  };

  if (postsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">Loading articles...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section - Tightened and Modern */}
      <section className="relative pt-20 pb-12 lg:pt-24 lg:pb-16 overflow-hidden">
        {/* Refined Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-surface/30 to-surface-secondary/50"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 30% 20%, hsl(195 100% 60% / 0.03), transparent 50%), 
                           radial-gradient(circle at 70% 80%, hsl(280 100% 70% / 0.03), transparent 50%)`
        }}></div>
        
        <div className="relative editorial-container">
          <div className="text-center max-w-4xl mx-auto">
            {/* Compact Title */}
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-gradient mb-4 leading-tight">
              Sergio's Blog
            </h1>
            
            {/* Condensed Description */}
            <p className="text-base lg:text-lg text-text-secondary mb-8 leading-relaxed max-w-2xl mx-auto">
              Practical, no‑hype guidance from 35+ years on Wall Street — focused on building wealth without a financial advisor.
            </p>
            
            {/* Compact Search and Filter */}
            <div className="flex flex-col gap-4 max-w-3xl mx-auto">
              {/* Streamlined Search */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-brand-secondary/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative glass-card rounded-xl overflow-hidden">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted h-4 w-4 z-10" />
                  <Input
                    type="text"
                    placeholder="Search articles, topics, strategies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 h-12 bg-transparent border-0 focus:ring-2 focus:ring-primary/20 rounded-xl placeholder:text-text-muted/70"
                  />
                </div>
              </div>
              
              {/* Compact Category Filter */}
              <div className="relative">
                <div className="flex gap-2 justify-center flex-wrap max-w-4xl mx-auto">
                  <Button
                    variant={selectedCategory === "" ? "default" : "outline"}
                    onClick={() => setSelectedCategory("")}
                    size="sm"
                    className="h-9 px-4 glass-card hover:scale-105 transition-all duration-200 font-medium text-sm"
                  >
                    All Articles
                  </Button>
                  {categories?.map((category) => (
                    <Button
                      key={category.slug}
                      variant={selectedCategory === category.name ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category.name)}
                      size="sm"
                      className="h-9 px-4 glass-card hover:scale-105 transition-all duration-200 font-medium text-sm"
                      style={{
                        borderColor: selectedCategory === category.name ? category.color : undefined,
                        boxShadow: selectedCategory === category.name ? `0 0 15px ${category.color}25` : undefined
                      }}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Articles Grid */}
      <section className="py-20 lg:py-32">
        <div className="editorial-container">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <Filter className="h-16 w-16 text-text-muted mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-text-primary mb-2">No articles found</h3>
              <p className="text-text-secondary">Try adjusting your search terms or category filter.</p>
            </div>
          ) : (
            <>
              {/* Enhanced Results Count */}
              <div className="mb-12">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="glass-card px-4 py-2 rounded-xl">
                    <p className="text-text-secondary font-medium">
                      <span className="text-primary font-bold">{currentPosts.length}</span> of <span className="text-text-primary">{filteredPosts.length}</span> articles
                      {selectedCategory && (
                        <span className="text-text-muted"> in <span className="text-primary">{selectedCategory}</span></span>
                      )}
                      {searchTerm && (
                        <span className="text-text-muted"> matching <span className="text-primary">"{searchTerm}"</span></span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Premium Articles Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-16">
                {currentPosts.map((post, index) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="group block"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <article className="card-premium rounded-3xl overflow-hidden h-full hover:shadow-2xl transition-all duration-500 animate-fade-in">
                      {/* Enhanced Image Container */}
                      <div className="aspect-video relative overflow-hidden">
                        <OptimizedImage
                          src={post.cover_image_url?.replace('/src/assets/', '/assets/blog/') || "/assets/blog/options-trading.jpg"}
                          alt={post.cover_image_alt || post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          aspectRatio="video"
                          fallbackSrc="/assets/blog/options-trading.jpg"
                        />
                        {/* Premium Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Enhanced Badges */}
                        <div className="absolute top-4 left-4 flex gap-2">
                          {post.featured && (
                            <Badge className="bg-gradient-to-r from-cta-primary to-brand-secondary text-white border-0 backdrop-blur-sm">
                              ✨ Featured
                            </Badge>
                          )}
                        </div>
                        
                        {/* Premium Read More Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                          <div className="glass-card px-6 py-3 rounded-full text-white font-semibold flex items-center gap-2 transform scale-90 group-hover:scale-100 transition-transform">
                            Read Article
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced Content */}
                      <div className="p-8 flex flex-col flex-1">
                        {/* Category and Meta */}
                        <div className="flex items-center justify-between mb-4">
                          <Badge
                            className="glass-card border-0 text-text-primary font-medium px-3 py-1.5 hover:scale-105 transition-transform"
                            style={{ 
                              background: `linear-gradient(135deg, ${getCategoryColor(post.category?.name || 'General')}20, ${getCategoryColor(post.category?.name || 'General')}10)`,
                              borderLeft: `3px solid ${getCategoryColor(post.category?.name || 'General')}`
                            }}
                          >
                            {post.category?.name || 'General'}
                          </Badge>
                          <div className="flex items-center text-text-muted text-sm glass-card px-2 py-1 rounded-lg">
                            <Clock className="h-3 w-3 mr-1.5" />
                            {post.read_time || '5 min read'}
                          </div>
                        </div>
                        
                        {/* Premium Title */}
                        <h3 className="text-lg lg:text-xl font-bold text-text-primary mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-brand-secondary group-hover:bg-clip-text transition-all duration-300 line-clamp-2 leading-tight">
                          {post.title}
                        </h3>
                        
                        {/* Enhanced Excerpt */}
                        <p className="text-text-secondary mb-6 line-clamp-3 leading-relaxed flex-1 text-base">
                          {post.excerpt}
                        </p>
                        
                        {/* Premium Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-border/30">
                          <div className="flex items-center text-text-muted text-sm">
                            <Calendar className="h-3 w-3 mr-1.5" />
                            {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="text-primary group-hover:text-brand-secondary flex items-center font-semibold text-sm transition-colors">
                            Continue Reading
                            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {/* Premium Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="glass-card hover:scale-105 transition-all duration-200 px-6"
                  >
                    Previous
                  </Button>
                  
                  <div className="flex space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => setCurrentPage(page)}
                        className={`w-12 h-12 glass-card hover:scale-105 transition-all duration-200 ${
                          currentPage === page ? 'bg-gradient-to-r from-primary to-brand-secondary border-0 glow-primary' : ''
                        }`}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="glass-card hover:scale-105 transition-all duration-200 px-6"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Premium Newsletter CTA */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        {/* Premium Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-surface/50 to-brand-secondary/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 30% 20%, hsl(195 100% 60% / 0.1), transparent 50%), 
                           radial-gradient(circle at 70% 80%, hsl(280 100% 70% / 0.1), transparent 50%)`
        }}></div>
        
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-brand-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative editorial-container">
          <div className="text-center max-w-4xl mx-auto">
            {/* Premium Icon */}
            <div className="w-20 h-20 mx-auto mb-8 glass-card rounded-3xl flex items-center justify-center glow-primary">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-brand-secondary rounded-full"></div>
            </div>
            
            <h3 className="text-3xl lg:text-4xl font-black text-gradient mb-6">
              Master the Markets
            </h3>
            <p className="text-lg lg:text-xl text-text-secondary mb-10 leading-relaxed">
              Get exclusive trading strategies, market analysis, and investment insights from a Wall Street professional. 
              Join thousands of successful traders and investors on their journey to financial freedom.
            </p>
            
            {/* Premium CTA */}
            <div className="flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-brand-secondary to-cta-primary rounded-2xl blur opacity-70 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative">
                  <SubscribeDropdown 
                    variant="cta" 
                    size="lg" 
                    className="text-lg px-10 py-5 bg-gradient-to-r from-primary to-brand-secondary hover:from-primary-hover hover:to-brand-secondary border-0 rounded-2xl font-semibold shadow-2xl"
                  />
                </div>
              </div>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-12 flex items-center justify-center gap-8 flex-wrap opacity-70">
              <div className="glass-card px-4 py-2 rounded-xl text-sm text-text-muted">
                ✓ 35+ Years Experience
              </div>
              <div className="glass-card px-4 py-2 rounded-xl text-sm text-text-muted">
                ✓ Wall Street Veteran
              </div>
              <div className="glass-card px-4 py-2 rounded-xl text-sm text-text-muted">
                ✓ Proven Strategies
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CMSBlogListPage;