import { NextRequest, NextResponse } from "next/server";
import { createBroadcast } from "@/lib/kit/client";
import { client, urlForImage } from "@/lib/sanity/client";
import { toHTML } from "@portabletext/to-html";

// Security: Verify the webhook secret to prevent unauthorized access
const SANITY_WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-sanity-secret'
};

// Components for portabletext-to-html
// This ensures Sanity rich text is converted to email-safe HTML strings
const portableTextComponents = {
  block: {
    h1: ({ children }: any) => `<h1 style="font-size: 24px; font-weight: bold; margin: 24px 0 12px; color: #111;">${children}</h1>`,
    h2: ({ children }: any) => `<h2 style="font-size: 20px; font-weight: bold; margin: 24px 0 12px; color: #333;">${children}</h2>`,
    h3: ({ children }: any) => `<h3 style="font-size: 18px; font-weight: bold; margin: 20px 0 10px; color: #444;">${children}</h3>`,
    normal: ({ children }: any) => `<p style="font-size: 16px; line-height: 1.6; color: #555; margin-bottom: 16px;">${children}</p>`,
    blockquote: ({ children }: any) => `<blockquote style="border-left: 4px solid #ccc; margin: 16px 0; padding-left: 16px; font-style: italic; color: #666;">${children}</blockquote>`,
  },
  list: {
    bullet: ({ children }: any) => `<ul style="margin-left: 20px; margin-bottom: 16px; color: #555; font-size: 16px; line-height: 1.6;">${children}</ul>`,
    number: ({ children }: any) => `<ol style="margin-left: 20px; margin-bottom: 16px; color: #555; font-size: 16px; line-height: 1.6;">${children}</ol>`,
  },
  listItem: {
    bullet: ({ children }: any) => `<li style="margin-bottom: 8px;">${children}</li>`,
    number: ({ children }: any) => `<li style="margin-bottom: 8px;">${children}</li>`,
  },
  marks: {
    link: ({ children, value }: any) => `<a href="${value.href}" style="color: #000; text-decoration: underline;" target="_blank" rel="noopener noreferrer">${children}</a>`,
    strong: ({ children }: any) => `<strong>${children}</strong>`,
    em: ({ children }: any) => `<em>${children}</em>`,
  },
  types: {
    image: ({ value }: any) => {
      const imageUrl = value?.asset ? urlForImage(value).width(600).url() : '';
      return imageUrl ? `<img src="${imageUrl}" alt="${value.alt || ''}" style="max-width: 100%; height: auto; border-radius: 4px; margin: 20px 0;" />` : '';
    }
  }
};

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate Request
    const secret = request.headers.get("x-sanity-secret");
    const sanityCheck = request.headers.get("sanity-webhook-signature"); // Present on real webhooks

    if (secret !== SANITY_WEBHOOK_SECRET) {
      if (!SANITY_WEBHOOK_SECRET) console.warn("SANITY_WEBHOOK_SECRET is not set");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    // 2. Extract Document ID
    // Support two payloads:
    // A) Manual "Draft Newsletter" button: { docId: "..." }
    // B) Sanity Webhook: { _id: "...", _type: "post", ... }
    const body = await request.json();
    const docId = body.docId || body._id;

    if (!docId) {
      console.warn("Missing docId in payload:", body);
      return NextResponse.json({ error: "Missing Document ID" }, { status: 400, headers: corsHeaders });
    }

    // 3. Fetch Full Article Content from Sanity
    // We always refetch to ensure we have the absolute latest version and all fields
    const query = `*[_type == "post" && _id == $id][0]{
      title,
      slug,
      excerpt,
      mainImage, // Alias assumed handled in query or we map it here
      coverImage, // Fallback
      body,
      publishedAt,
      "authorName": author->name
    }`;
    const article = await client.fetch(query, { id: docId });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404, headers: corsHeaders });
    }

    // 4. Generate Email Content
    const articleUrl = `https://sergioavedian.com/blog/${article.slug.current}`;
    
    // Resolve Main Image (Handle alias mismatch safety)
    const rawImage = article.mainImage || article.coverImage;
    const heroImageUrl = rawImage ? urlForImage(rawImage).width(800).url() : "";

    // Convert Portable Text Body to HTML
    const bodyHtml = article.body ? toHTML(article.body, { components: portableTextComponents }) : "";

    // Assemble Full Email HTML
    const emailTemplate = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; max-width: 640px; margin: 0 auto; padding: 20px;">
        
        <!-- Hero Image -->
        ${heroImageUrl ? `
          <div style="margin-bottom: 24px;">
            <img src="${heroImageUrl}" alt="${article.title}" style="width: 100%; height: auto; border-radius: 8px; display: block;" />
          </div>
        ` : ""}
        
        <!-- Title -->
        <h1 style="font-size: 28px; font-weight: 700; line-height: 1.25; margin-bottom: 16px; color: #111;">
          ${article.title}
        </h1>

        <!-- Content Body (Converted from Portable Text) -->
        <div style="font-size: 16px; line-height: 1.6; color: #444; margin-bottom: 32px;">
          ${bodyHtml || `<p>${article.excerpt}</p>`} 
        </div>

        <!-- Read More Button (If needed, primarily for excerpt-only emails, but good CTA anyway) -->
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
          <a href="${articleUrl}" style="background-color: #000; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 600; font-size: 16px; display: inline-block;">
            Read This Article on the Website
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 24px; font-size: 14px; color: #888;">
          <p>Published on ${new Date(article.publishedAt || Date.now()).toLocaleDateString()}</p>
        </div>

      </div>
    `;

    // 5. Create Draft Broadcast in Kit
    const broadcast = await createBroadcast({
      subject: `New Post: ${article.title}`,
      content: emailTemplate,
      public: false, // Draft
      description: `Drafted via Sanity Connect on ${new Date().toLocaleString()}`
    });

    console.log(`Draft created for ${article.title} (Kit ID: ${broadcast.data?.id})`);

    return NextResponse.json({ 
      success: true, 
      broadcastId: broadcast.data?.id,
      message: "Draft created successfully with full content" 
    }, {
      headers: corsHeaders
    });

  } catch (error: any) {
    console.error("Draft generation error:", error);
    // Ensure we return JSON with CORS specific headers even on crash
    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        details: error.message 
      }, 
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: corsHeaders
  });
}
