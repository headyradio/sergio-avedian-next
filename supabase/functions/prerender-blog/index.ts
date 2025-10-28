import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Bot user agents to detect (social media crawlers and search engines)
const BOT_USER_AGENTS = [
  'facebookexternalhit', // Facebook
  'Facebot', // Facebook
  'LinkedInBot', // LinkedIn
  'Twitterbot', // Twitter/X
  'TwitterBot', // Twitter/X
  'Slackbot', // Slack
  'TelegramBot', // Telegram
  'Googlebot', // Google
  'bingbot', // Bing
  'Slurp', // Yahoo
  'DuckDuckBot', // DuckDuckGo
  'Baiduspider', // Baidu
  'YandexBot', // Yandex
  'WhatsApp', // WhatsApp
  'Pinterest', // Pinterest
];

function isBot(userAgent: string): boolean {
  const lowerUA = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => lowerUA.includes(bot.toLowerCase()));
}

function generateBlogHTML(post: any, imageUrl: string): string {
  const title = post.title || 'Sergio Avedian';
  const description = post.seo_description || post.excerpt || `Read ${post.title} by Sergio Avedian`;
  const url = `https://sergioavedian.com/blog/${post.slug}`;
  const keywords = post.seo_keywords?.join(', ') || 'wealth building, trading, investing';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- Primary Meta Tags -->
  <title>${title}</title>
  <meta name="title" content="${title}" />
  <meta name="description" content="${description}" />
  <meta name="keywords" content="${keywords}" />
  <meta name="author" content="Sergio Avedian" />
  <link rel="canonical" href="${url}" />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Sergio Avedian" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:secure_url" content="${imageUrl}" />
  <meta property="og:image:alt" content="${post.cover_image_alt || title}" />
  <meta property="og:locale" content="en_US" />
  <meta property="article:published_time" content="${post.published_at || post.created_at}" />
  ${post.updated_at ? `<meta property="article:modified_time" content="${post.updated_at}" />` : ''}
  ${post.seo_keywords?.map((tag: string) => `<meta property="article:tag" content="${tag}" />`).join('\n  ') || ''}
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@sergioaved" />
  <meta name="twitter:url" content="${url}" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${imageUrl}" />
  <meta name="twitter:image:alt" content="${post.cover_image_alt || title}" />
  
  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${title}",
    "description": "${description}",
    "image": "${imageUrl}",
    "datePublished": "${post.published_at || post.created_at}",
    ${post.updated_at ? `"dateModified": "${post.updated_at}",` : ''}
    "author": {
      "@type": "Person",
      "name": "Sergio Avedian",
      "url": "https://sergioavedian.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Sergio Avedian",
      "url": "https://sergioavedian.com"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "${url}"
    }
  }
  </script>
  
  <!-- Redirect regular users to SPA -->
  <meta http-equiv="refresh" content="0;url=${url}" />
  <script>window.location.href = "${url}";</script>
</head>
<body>
  <h1>${title}</h1>
  <p>${description}</p>
  <p>Redirecting to article...</p>
</body>
</html>`;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const userAgent = req.headers.get('user-agent') || '';
    const url = new URL(req.url);
    
    console.log('Prerender request:', { userAgent, path: url.pathname });
    
    // Only prerender for bots
    if (!isBot(userAgent)) {
      console.log('Not a bot, returning 404');
      return new Response('Not Found', { status: 404 });
    }
    
    // Extract slug from path (e.g., /blog/my-post-slug)
    const pathMatch = url.pathname.match(/\/blog\/([^\/]+)/);
    if (!pathMatch) {
      console.log('Invalid blog path');
      return new Response('Not Found', { status: 404 });
    }
    
    const slug = pathMatch[1];
    console.log('Fetching blog post:', slug);
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Fetch blog post
    const { data: post, error } = await supabase
      .from('cms_blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();
    
    if (error || !post) {
      console.error('Blog post not found:', error);
      return new Response('Not Found', { status: 404 });
    }
    
    console.log('Blog post found:', post.title);
    
    // Get absolute image URL
    let imageUrl = 'https://sergioavedian.com/sergio-hero-main.png'; // Default
    if (post.cover_image_url) {
      if (post.cover_image_url.startsWith('http')) {
        imageUrl = post.cover_image_url;
      } else if (post.cover_image_url.includes('/assets/blog/')) {
        const filename = post.cover_image_url.split('/').pop();
        imageUrl = `https://sergioavedian.com/assets/blog/${filename}`;
      }
    }
    
    // Generate and return pre-rendered HTML
    const html = generateBlogHTML(post, imageUrl);
    
    return new Response(html, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
    
  } catch (error) {
    console.error('Prerender error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
