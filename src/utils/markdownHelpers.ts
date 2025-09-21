// Enhanced markdown to HTML converter
export const convertMarkdownToHTML = (content: string): string => {
  // If content is already HTML (contains HTML tags), return as-is
  if (content.includes('<') && content.includes('>')) {
    return content;
  }

  // Check if content appears to be markdown
  if (content.includes('# ') || content.includes('## ') || content.includes('### ') || content.includes('**') || content.includes('*')) {
    // Enhanced markdown conversion with better formatting
    let html = content
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-4 mt-8 text-foreground">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-6 mt-10 text-foreground">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6 mt-12 text-foreground">$1</h1>')
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // Lists (basic support)
      .replace(/^\* (.*$)/gim, '<li class="mb-2">$1</li>')
      .replace(/^- (.*$)/gim, '<li class="mb-2">$1</li>')
      // Wrap consecutive list items in ul
      .replace(/(<li class="mb-2">.*<\/li>\s*)+/g, '<ul class="mb-4 pl-6 space-y-2 list-disc">$&</ul>')
      // Paragraphs - split by double newlines
      .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed text-muted-foreground">')
      // Wrap remaining text in paragraphs
      .replace(/^(?!<h|<\/p>|<p|<ul|<li)(.+)$/gim, '<p class="mb-4 leading-relaxed text-muted-foreground">$1</p>')
      // Clean up paragraph/header conflicts
      .replace(/(<p class="mb-4 leading-relaxed text-muted-foreground">)(<h[1-6])/g, '$2')
      .replace(/(<\/h[1-6]>)(<\/p>)/g, '$1');

    return html;
  }
  
  // Return as plain text wrapped in paragraph
  return `<p class="mb-4 leading-relaxed text-muted-foreground">${content}</p>`;
}