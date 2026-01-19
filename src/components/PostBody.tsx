"use client";

import { PortableText } from '@portabletext/react';

const components = {
  block: {
    h1: ({children}: any) => <h1 className="text-4xl font-bold my-4 text-text-primary">{children}</h1>,
    h2: ({children}: any) => <h2 className="text-2xl font-bold my-4 text-text-primary">{children}</h2>,
    h3: ({children}: any) => <h3 className="text-xl font-bold my-3 text-text-primary">{children}</h3>,
    h4: ({children}: any) => <h4 className="text-lg font-bold my-2 text-text-primary">{children}</h4>,
    normal: ({children}: any) => <p className="mb-4 text-text-secondary leading-relaxed">{children}</p>,
    blockquote: ({children}: any) => <blockquote className="border-l-4 border-primary pl-4 my-4 italic text-text-muted">{children}</blockquote>,
  },
  list: {
    bullet: ({children}: any) => <ul className="list-disc ml-5 mb-4 text-text-secondary">{children}</ul>,
    number: ({children}: any) => <ol className="list-decimal ml-5 mb-4 text-text-secondary">{children}</ol>,
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
};

export default function PostBody({ content }: { content: any }) {
  return (
    <div className="max-w-3xl mx-auto prose-modern">
      <PortableText value={content} components={components} />
    </div>
  );
}
