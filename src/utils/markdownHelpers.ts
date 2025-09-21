// Convert markdown content to HTML
export const convertMarkdownToHTML = (content: string): string => {
  // Check if content appears to be markdown (contains # headers)
  if (content.includes('# ') || content.includes('## ') || content.includes('### ')) {
    // Basic markdown conversion for headers and common formatting
    return content
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-4 mt-8">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-6 mt-10">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6 mt-12">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^(?!<h|<\/p>|<p)(.+)$/gim, '<p class="mb-4">$1</p>')
      .replace(/(<p class="mb-4">)(<h[1-6])/g, '$2')
      .replace(/(<\/h[1-6]>)(<\/p>)/g, '$1')
  }
  
  // Return as-is if it's already HTML or plain text
  return content
}