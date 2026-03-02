import { NextRequest, NextResponse } from 'next/server';
import { getCachedAudioUrl, generateAudioForArticle } from '@/lib/audio-generator';

// Allow up to 120 seconds for audio generation on Vercel
export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    const { text, slug, lang = 'en' } = await request.json();

    if (!text || !slug) {
      return NextResponse.json(
        { error: 'Missing required parameters: text and slug' },
        { status: 400 }
      );
    }

    // 1. Check cache first (language-aware)
    const cachedUrl = await getCachedAudioUrl(slug, lang);
    if (cachedUrl) {
      console.log(`Cache HIT for slug: ${slug} [${lang}]`);
      return NextResponse.json({ audioUrl: cachedUrl, cached: true });
    }

    console.log(`Cache MISS for slug: ${slug} [${lang}]`);

    // 2. Generate and cache audio (translates internally if lang !== 'en')
    const { audioUrl, audioBuffer } = await generateAudioForArticle(slug, text, lang);

    if (audioUrl) {
      return NextResponse.json({ audioUrl, cached: true });
    }

    // 3. Fallback: return raw audio if Blob caching failed
    return new NextResponse(new Uint8Array(audioBuffer), {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Generate Audio Route Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
