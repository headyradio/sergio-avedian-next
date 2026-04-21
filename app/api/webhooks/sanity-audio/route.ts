import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { client } from '@/lib/sanity/client';
import { postBySlugQuery } from '@/lib/sanity/queries';
import { portableTextToPlainText } from '@/lib/utils';
import { getCachedAudioUrl, generateAudioForArticle } from '@/lib/audio-generator';

// Allow up to 120 seconds for audio generation on Vercel
export const maxDuration = 120;

// GROQ query to fetch a post by its Sanity document _id
const postByIdQuery = `*[_id == $id && _type == "post" && !(_id in path("drafts.**"))][0] {
  _id,
  title,
  slug,
  excerpt,
  "body": content,
  "mainImage": coverImage,
  publishedAt,
  "author": author->{name, image, bio, "slug": slug.current},
  "categories": categories[]->{title, slug}
}`;

// Verify Sanity webhook signature
function isValidSignature(body: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(body).digest('hex');
  return signature === digest;
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('sanity-webhook-signature') || '';
    const secret = process.env.SANITY_WEBHOOK_SECRET;

    // Validate webhook signature
    if (secret && signature) {
      if (!isValidSignature(rawBody, signature, secret)) {
        console.error('[sanity-audio] Invalid webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    console.log('[sanity-audio] Webhook received:', JSON.stringify(payload));

    // Only process "post" documents
    if (payload._type && payload._type !== 'post') {
      console.log(`[sanity-audio] Ignoring document type: ${payload._type}`);
      return NextResponse.json({ message: 'Not a post, skipping' }, { status: 200 });
    }

    // Try to get slug from payload first, otherwise fetch the document by _id
    let slug = payload.slug?.current || payload.slug;
    let post;

    if (slug) {
      // Slug available in payload — fetch full post by slug
      console.log(`[sanity-audio] Fetching post by slug: ${slug}`);
      post = await client.fetch(postBySlugQuery, { slug });
    } else if (payload._id) {
      // Slug NOT in payload (common with default Sanity webhook projections)
      // Fetch the full document by _id instead
      console.log(`[sanity-audio] No slug in payload, fetching post by _id: ${payload._id}`);
      post = await client.fetch(postByIdQuery, { id: payload._id });
      slug = post?.slug?.current;
    }

    if (!post || !slug) {
      console.error(`[sanity-audio] Post not found — slug: ${slug}, _id: ${payload._id}`);
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Build the plain text (English source — same format as the client-side player)
    const plainText = `${post.title}. By ${post.author?.name || 'Sergio Avedian'}. ${portableTextToPlainText(post.body)}`;

    if (!portableTextToPlainText(post.body).trim()) {
      console.warn(`[sanity-audio] Post "${slug}" has no text content in body — skipping audio generation`);
      return NextResponse.json({ message: 'Post has no text content', slug }, { status: 200 });
    }

    // Generate English and Spanish audio in parallel, skipping cached
    const langs = ['en', 'es'] as const;
    const entries = await Promise.all(
      langs.map(async (lang) => {
        const cached = await getCachedAudioUrl(slug, lang);
        if (cached) {
          console.log(`[sanity-audio] "${lang}" audio already cached for "${slug}"`);
          return [lang, cached] as const;
        }
        console.log(`[sanity-audio] Generating "${lang}" audio for "${slug}"`);
        const { audioUrl } = await generateAudioForArticle(slug, plainText, lang);
        console.log(`[sanity-audio] "${lang}" audio generated: ${audioUrl}`);
        return [lang, audioUrl] as const;
      })
    );

    const results = Object.fromEntries(entries);

    return NextResponse.json({
      message: 'Audio generated successfully',
      slug,
      audioUrls: results,
    });
  } catch (error) {
    console.error('[sanity-audio] Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
