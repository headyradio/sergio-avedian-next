import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, ArrowRight, Calendar, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useBlogPosts } from "@/hooks/useSupabaseCMS";
import { OptimizedImage } from "@/components/OptimizedImage";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchModal = ({ open, onOpenChange }: SearchModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: allPosts, isLoading } = useBlogPosts(50, 0, true); // Get recent published posts
  const navigate = useNavigate();

  // Filter posts based on search term
  const filteredPosts = allPosts?.filter((post) => {
    if (!searchTerm.trim()) return false;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  })?.slice(0, 5) || []; // Show max 5 results

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onOpenChange(false);
      navigate(`/blog?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handlePostClick = () => {
    onOpenChange(false);
  };

  // Reset search when modal closes
  useEffect(() => {
    if (!open) {
      setSearchTerm("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Search className="h-5 w-5 text-primary" />
            Search Articles
          </DialogTitle>
        </DialogHeader>

        <div className="px-6">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted h-4 w-4" />
            <Input
              type="text"
              placeholder="Search articles, topics, strategies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 h-12 text-base bg-surface border border-border focus:ring-2 focus:ring-primary/30 rounded-xl"
              autoFocus
            />
          </form>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {searchTerm.trim() && (
            <div className="p-6 pt-4">
              {isLoading ? (
                <div className="text-center py-8 text-text-muted">
                  Searching...
                </div>
              ) : filteredPosts.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-text-muted mb-4">
                    Found {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''}
                  </p>
                  {filteredPosts.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      onClick={handlePostClick}
                      className="block group"
                    >
                      <div className="flex gap-4 p-4 rounded-xl hover:bg-surface transition-colors">
                        <div className="flex-shrink-0">
                          <OptimizedImage
                            src={post.cover_image_url?.replace('/src/assets/', '/assets/blog/') || "/assets/blog/options-trading.jpg"}
                            alt={post.cover_image_alt || post.title}
                            className="w-16 h-16 object-cover rounded-lg"
                            aspectRatio="square"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-1 mb-1">
                            {post.title}
                          </h4>
                          <p className="text-sm text-text-secondary line-clamp-2 mb-2">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-text-muted">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {post.read_time || '5 min read'}
                            </span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 flex items-center">
                          <ArrowRight className="h-4 w-4 text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </Link>
                  ))}
                  
                  {/* See all results link */}
                  <div className="pt-4 border-t border-border">
                    <Button
                      onClick={() => {
                        onOpenChange(false);
                        navigate(`/blog?search=${encodeURIComponent(searchTerm.trim())}`);
                      }}
                      variant="ghost"
                      className="w-full justify-center"
                    >
                      See all results for "{searchTerm}"
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-text-muted mx-auto mb-3" />
                  <p className="text-text-muted">No articles found for "{searchTerm}"</p>
                  <p className="text-sm text-text-muted mt-1">Try different keywords or browse all articles</p>
                </div>
              )}
            </div>
          )}

          {!searchTerm.trim() && (
            <div className="p-6 pt-4 text-center">
              <Search className="h-12 w-12 text-text-muted mx-auto mb-3" />
              <p className="text-text-muted">Start typing to search articles...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;