import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { client } from '@/lib/sanity/client';
import { postBySlugQuery } from '@/lib/sanity/queries';
import { portableTextToPlainText } from '@/lib/utils';
import { getCachedAudioUrl, generateAudioForArticle } from '@/lib/audio-generator';

// Allow up to 120 seconds for audio generation on Vercel
export const maxDuration = 120;

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

    // Extract slug from the webhook payload
    const slug = payload.slug?.current || payload.slug;
    if (!slug) {
      console.log('[sanity-audio] No slug in payload, skipping');
      return NextResponse.json({ message: 'No slug found, skipping' }, { status: 200 });
    }

    // Only process "post" documents
    if (payload._type && payload._type !== 'post') {
      console.log(`[sanity-audio] Ignoring document type: ${payload._type}`);
      return NextResponse.json({ message: 'Not a post, skipping' }, { status: 200 });
    }

    // Fetch the full post content from Sanity
    console.log(`[sanity-audio] Fetching post content for slug: ${slug}`);
    const post = await client.fetch(postBySlugQuery, { slug });

    if (!post) {
      console.error(`[sanity-audio] Post not found for slug: ${slug}`);
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Build the plain text (English source — same format as the client-side player)
    const plainText = `${post.title}. By ${post.author?.name || 'Sergio Avedian'}. ${portableTextToPlainText(post.body)}`;

    const results: Record<string, string | null> = {};

    // Generate English and Spanish audio, skipping whichever is already cached
    for (const lang of ['en', 'es']) {
      const cached = await getCachedAudioUrl(slug, lang);
      if (cached) {
        console.log(`[sanity-audio] "${lang}" audio already cached for "${slug}": ${cached}`);
        results[lang] = cached;
        continue;
      }

      console.log(`[sanity-audio] Generating "${lang}" audio for "${slug}"`);
      const { audioUrl } = await generateAudioForArticle(slug, plainText, lang);
      results[lang] = audioUrl;
      console.log(`[sanity-audio] "${lang}" audio generated: ${audioUrl}`);
    }

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
