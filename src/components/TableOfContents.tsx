"use client";

import { useEffect, useState } from "react";
import { cn, slugify } from "@/lib/utils";

interface Heading {
  id: string;
  text: string;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0% 0% -80% 0%" }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="space-y-2">
      <h2 className="font-bold text-lg text-text-primary mb-4">Jump to section</h2>
      <ul className="space-y-3 border-l px-2 border-white/50">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(heading.id);
                if (element) {
                   // Offset for fixed header (approx 80px)
                   const y = element.getBoundingClientRect().top + window.scrollY - 100;
                   window.scrollTo({ top: y, behavior: 'smooth' });
                   setActiveId(heading.id);
                }
              }}
              className={cn(
                "block text-sm transition-colors duration-200 hover:text-primary pl-4 font-normal",
                activeId === heading.id
                  ? "text-primary font-medium border-l-2 border-primary -ml-[9px] "
                  : "text-text-secondary"
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
