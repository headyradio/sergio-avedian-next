import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-');  // Replace multiple - with single -
}

export function portableTextToPlainText(blocks: any[] = []): string {
  return blocks
    // loop through each block
    .map(block => {
      // if it's not a text block with children, return nothing
      if (block._type !== 'block' || !block.children) {
        return ''
      }
      // loop through the children spans, and join them
      return block.children.map((child: any) => child.text).join('')
    })
    // join the paragraphs leaving split by two linebreaks
    .join('\n\n')
}
