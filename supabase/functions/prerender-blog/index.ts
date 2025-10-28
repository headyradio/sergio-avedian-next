import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Bot user agents to detect
const BOT_USER_AGENTS = [
  'facebookexternalhit',
  'facebot',
  'twitterbot',
  'linkedinbot',
  'whatsapp',
  'pinterest',
  'slackbot',
  'telegrambot',
  'discordbot',
  'googlebot',
  'bingbot',
  'slurp',
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'ia_archiver',
];

function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => ua.includes(bot)) || ua.includes('bot') || ua.includes('crawl') || ua.includes('spider');
}

function getAbsoluteImageUrl(url: string | null): string {
  if (!url) return 'https://fkafzarnschmdbxevicb.supabase.co/storage/v1/object/public/cms-media/default-og-image.jpg';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/')) return `https://sergioavedian.com${url}`;
  return url;
}

function generatePrerenderedHTML(post: any, canonicalUrl: string): string {
  const imageUrl = getAbsoluteImageUrl(post.cover_image_url);
  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt || '';
  const author = post.cms_authors?.name || post.author || 'Sergio Avedian';
  const publishedAt = post.published_at || post.created_at;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- Primary Meta Tags -->
  <title>${title}</title>
  <meta name="title" content="${title}" />
  <meta name="description" content="${description}" />
  <meta name="author" content="${author}" />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:site_name" content="Sergio Avedian" />
  <meta property="article:published_time" content="${publishedAt}" />
  <meta property="article:author" content="${author}" />
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${canonicalUrl}" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${imageUrl}" />
  <meta name="twitter:site" content="@sergioaved" />
  <meta name="twitter:creator" content="@sergioaved" />
  
  <!-- Canonical URL -->
  <link rel="canonical" href="${canonicalUrl}" />
  
  <!-- JSON-LD Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "${title}",
    "description": "${description}",
    "image": "${imageUrl}",
    "author": {
      "@type": "Person",
      "name": "${author}"
    },
    "publisher": {
      "@type": "Person",
      "name": "Sergio Avedian"
    },
    "datePublished": "${publishedAt}",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "${canonicalUrl}"
    }
  }
  </script>
  
  <!-- Meta refresh for regular users (bots ignore this) -->
  <meta http-equiv="refresh" content="0;url=${canonicalUrl}" />
  
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      line-height: 1.6;
    }
    .loading {
      text-align: center;
      color: #666;
    }
    img {
      max-width: 100%;
      height: auto;
    }
  </style>
</head>
<body>
  <div class="loading">
    <h1>${title}</h1>
    <p>Loading article...</p>
    <noscript>
      <p>Please enable JavaScript or <a href="${canonicalUrl}">click here</a> to view this article.</p>
    </noscript>
  </div>
  
  <script>
    // Redirect to SPA for users with JavaScript enabled
    window.location.href = '${canonicalUrl}';
  </script>
</body>
</html>`;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const userAgent = req.headers.get('user-agent') || '';
    
    console.log('Prerender request:', {
      path: url.pathname,
      userAgent,
      isBot: isBot(userAgent)
    });

    // Get the path parameter
    const path = url.searchParams.get('path') || url.pathname;
    
    // Extract slug from path (e.g., /blog/my-post -> my-post)
    const slugMatch = path.match(/\/blog\/([^\/]+)/);
    if (!slugMatch) {
      return new Response('Invalid blog post URL', { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
      });
    }
    
    const slug = slugMatch[1];
    console.log('Fetching blog post:', slug);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch blog post with author data
    const { data: post, error } = await supabase
      .from('cms_blog_posts')
      .select(`
        *,
        cms_authors (
          name,
          bio,
          avatar_url
        )
      `)
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error || !post) {
      console.error('Blog post not found:', error);
      return new Response('Blog post not found', { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
      });
    }

    const canonicalUrl = `https://sergioavedian.com/blog/${slug}`;
    const html = generatePrerenderedHTML(post, canonicalUrl);

    return new Response(html, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
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
