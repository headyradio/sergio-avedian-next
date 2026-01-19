import { NextRequest, NextResponse } from "next/server";
import { createBroadcast } from "@/lib/kit/client";
import { client, urlForImage } from "@/lib/sanity/client";

// Simple secret verification to prevent unauthorized usage
const SANITY_WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-sanity-secret'
};

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate Request
    const secret = request.headers.get("x-sanity-secret");
    if (secret !== SANITY_WEBHOOK_SECRET) {
      if (!SANITY_WEBHOOK_SECRET) console.warn("SANITY_WEBHOOK_SECRET is not set");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    const { docId } = await request.json();
    if (!docId) {
      return NextResponse.json({ error: "Missing docId" }, { status: 400, headers: corsHeaders });
    }

    // 2. Fetch Article from Sanity
    const query = `*[_type == "post" && _id == $id][0]{
      title,
      slug,
      excerpt,
      mainImage,
      "authorName": author->name
    }`;
    const article = await client.fetch(query, { id: docId });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404, headers: corsHeaders });
    }

    // 3. Generate Email Content
    const articleUrl = `https://sergioavedian.com/blog/${article.slug.current}`;
    const imageUrl = article.mainImage ? urlForImage(article.mainImage).width(800).url() : "";
    
    // HTML Email Generation (Basic Template)
    const emailBody = `
      <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
        ${imageUrl ? `<img src="${imageUrl}" alt="${article.title}" style="width: 100%; border-radius: 8px; margin-bottom: 24px;" />` : ""}
        
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">${article.title}</h1>
        
        <p style="font-size: 16px; line-height: 1.6; color: #555; margin-bottom: 24px;">
          ${article.excerpt || "We have a new article out! Click below to read more."}
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${articleUrl}" style="background-color: #000; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold;">
            Read Full Article
          </a>
        </div>
      </div>
    `;

    // 4. Create Draft Broadcast in Kit
    const broadcast = await createBroadcast({
      subject: `New Article: ${article.title}`,
      content: emailBody,
      public: false, // Draft
    });

    return NextResponse.json({ 
      success: true, 
      broadcastId: broadcast.data?.id,
      message: "Draft created successfully" 
    }, {
      headers: corsHeaders
    });

  } catch (error) {
    console.error("Draft generation error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
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
