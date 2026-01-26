"use client";

import { Linkedin, Mail } from "lucide-react";

interface SocialShareButtonsProps {
  title: string;
  slug: string;
}

export default function SocialShareButtons({ title, slug }: SocialShareButtonsProps) {
  const baseUrl = "https://sergioavedian.com";
  const url = `${baseUrl}/blog/${slug}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareOnX = () => {
    window.open(
      `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareViaEmail = () => {
    window.open(
      `mailto:?subject=${encodedTitle}&body=Check out this article by Sergio Avedian: ${encodedUrl}`,
      "_self"
    );
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={shareOnX}
        className="p-2 rounded-full hover:bg-muted transition-colors text-text-secondary hover:text-primary"
        aria-label="Share on X"
      >
        <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
        </svg>
      </button>
      <button
        onClick={shareOnLinkedIn}
        className="p-2 rounded-full hover:bg-muted transition-colors text-text-secondary hover:text-[#0A66C2]"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
      </button>
      <button
        onClick={shareViaEmail}
        className="p-2 rounded-full hover:bg-muted transition-colors text-text-secondary hover:text-foreground"
        aria-label="Share via Email"
      >
        <Mail className="w-4 h-4" />
      </button>
    </div>
  );
}
