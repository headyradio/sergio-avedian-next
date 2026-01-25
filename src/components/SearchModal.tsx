"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { 
  CommandDialog, 
  CommandInput, 
  CommandList, 
  CommandEmpty, 
  CommandGroup, 
  CommandItem 
} from "@/components/ui/command";
import { Search as SearchIcon, FileText, Calendar, User, Loader2 } from "lucide-react";
import { searchPosts, type SearchResult } from "@/app/actions";
import { format } from "date-fns";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchModal = ({ open, onOpenChange }: SearchModalProps) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      startTransition(async () => {
        const data = await searchPosts(query);
        setResults(data);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (slug: string) => {
    onOpenChange(false);
    router.push(`/blog/${slug}`);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Search articles, topics, strategies..." 
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          {isPending ? (
            <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </div>
          ) : (
             query ? "No results found." : "Type to search..."
          )}
        </CommandEmpty>
        
        {results.length > 0 && !isPending && (
          <CommandGroup heading="Articles">
            {results.map((post) => (
              <CommandItem 
                key={post._id} 
                value={post.title}
                onSelect={() => handleSelect(post.slug.current)}
                className="cursor-pointer"
              >
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-base">{post.title}</span>
                    <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.publishedAt && format(new Date(post.publishedAt), "MMM d, yyyy")}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author?.name || "Sergio Avedian"}
                    </span>
                    {post.category && (
                      <span className="px-1.5 py-0.5 rounded-full bg-accent/50 text-accent-foreground">
                        {post.category}
                      </span>
                    )}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
};

export default SearchModal;