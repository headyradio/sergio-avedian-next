import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity/client';
import { postBySlugQuery } from '@/lib/sanity/queries';
import { portableTextToPlainText } from '@/lib/utils';
import { getCachedAudioUrl, generateAudioForArticle } from '@/lib/audio-generator';

// Allow up to 120 seconds for audio generation on Vercel
export const maxDuration = 120;

// On-demand audio generation fallback.
// The webhook pre-generates audio on publish, but if that didn't run (or hasn't
// finished) the player calls this route on first play so the feature still works.
export async function POST(request: NextRequest) {
  try {
    const { slug, lang = 'en' } = await request.json();

    if (!slug) {
      return NextResponse.json({ error: 'Missing required parameter: slug' }, { status: 400 });
    }

    // 1. Return cached audio if it already exists (language-aware)
    const cachedUrl = await getCachedAudioUrl(slug, lang);
    if (cachedUrl) {
      return NextResponse.json({ audioUrl: cachedUrl, cached: true });
    }

    // 2. Fetch the article and build the plain text (same format as the webhook)
    const post = await client.fetch(postBySlugQuery, { slug });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const bodyText = portableTextToPlainText(post.body);
    if (!bodyText.trim()) {
      return NextResponse.json({ error: 'Post has no text content' }, { status: 422 });
    }

    const plainText = `${post.title}. By ${post.author?.name || 'Sergio Avedian'}. ${bodyText}`;

    // 3. Generate and cache audio (translates internally if lang !== 'en')
    const { audioUrl, audioBuffer } = await generateAudioForArticle(slug, plainText, lang);

    if (audioUrl) {
      return NextResponse.json({ audioUrl, cached: true });
    }

    // 4. Fallback: stream raw audio if Blob caching failed
    return new NextResponse(new Uint8Array(audioBuffer), {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('[generate-audio] Route error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
