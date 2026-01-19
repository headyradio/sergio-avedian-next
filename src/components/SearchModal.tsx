"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchModal = ({ open, onOpenChange }: SearchModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onOpenChange(false);
      router.push(`/blog?search=${encodeURIComponent(searchTerm.trim())}`);
    }
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

        <div className="p-6 pt-4">
          {searchTerm.trim() ? (
            <div className="text-center py-4">
              <Button
                onClick={() => {
                  onOpenChange(false);
                  router.push(`/blog?search=${encodeURIComponent(searchTerm.trim())}`);
                }}
                className="cta-electric"
              >
                Search for &quot;{searchTerm}&quot;
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
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