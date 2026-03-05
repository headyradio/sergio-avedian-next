"use client";

import { slugify } from "@/lib/utils";
import { PortableText } from '@portabletext/react';
import { Gallery } from "./Gallery";

const BODY_TEXT = "text-[#e8e4dc]";
const BODY_SIZE = "text-[17px] leading-[1.8]";

const components = {
  block: {
    h1: ({children}: any) => <h1 className="text-4xl font-bold mt-10 mb-4 text-text-primary">{children}</h1>,
    h2: ({children}: any) => {
      const text = children?.toString() || "";
      const id = slugify(text);
      return <h2 id={id} className="text-2xl font-bold mt-10 mb-4 text-text-primary scroll-mt-24">{children}</h2>
    },
    h3: ({children}: any) => <h3 className="text-xl font-bold mt-8 mb-3 text-text-primary">{children}</h3>,
    h4: ({children}: any) => <h4 className="text-lg font-bold mt-6 mb-2 text-text-primary">{children}</h4>,
    normal: ({children}: any) => <p className={`mb-6 ${BODY_TEXT} ${BODY_SIZE}`}>{children}</p>,
    blockquote: ({children}: any) => (
      <blockquote className={`border-l-4 border-primary pl-5 my-6 italic ${BODY_TEXT} opacity-90`}>
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({children}: any) => <ul className={`list-disc ml-6 mb-6 space-y-2 ${BODY_TEXT} ${BODY_SIZE}`}>{children}</ul>,
    number: ({children}: any) => <ol className={`list-decimal ml-6 mb-6 space-y-2 ${BODY_TEXT} ${BODY_SIZE}`}>{children}</ol>,
  },
  marks: {
    link: ({value, children}: any) => {
      const target = (value?.href || '').startsWith('http') ? '_blank' : undefined;
      return (
        <a 
          href={value?.href} 
          target={target} 
          rel={target === '_blank' ? 'noopener noreferrer' : undefined} 
          className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    gallery: Gallery,
  },
};

export default function PostBody({ content }: { content: any }) {
  return (
    <div className="max-w-[68ch] prose-modern px-4 md:px-0">
      <PortableText value={content} components={components} />
    </div>
  );
}
