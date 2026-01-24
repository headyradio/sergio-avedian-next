import { NextRequest, NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const { text, slug } = await request.json();

    if (!text || !slug) {
      return NextResponse.json(
        { error: 'Missing required parameters: text and slug' },
        { status: 400 }
      );
    }

    // 1. Check Cache (Vercel Blob)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        console.log(`Checking cache for slug: ${slug}`);
        // List blobs to find if one exists with this slug
        const filter = `audio/${slug}.mp3`;
        const { blobs } = await list({
          prefix: filter,
          limit: 1,
        });

        const cachedBlob = blobs.find(b => b.pathname === filter);

        if (cachedBlob) {
           console.log(`Cache HIT for slug: ${slug} -> ${cachedBlob.url}`);
           return NextResponse.json({ audioUrl: cachedBlob.url, cached: true });
        }
        console.log(`Cache MISS for slug: ${slug}`);
      } catch (e) {
        console.warn("Failed to check cache:", e);
      }
    }

    console.log(`Generating audio for slug: ${slug}`);

    // 2. Call Google Cloud TTS API via REST (using API Key)
    // We use REST here because it supports API Keys easily, whereas the Node.js client prefers Service Account Keys.
    if (!process.env.GOOGLE_TTS_API_KEY) {
         return NextResponse.json(
            { error: 'Server configuration error: Missing Google TTS API Key' },
            { status: 500 }
        );
    }

    const ttsResponse = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_TTS_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { text: text },
          voice: { languageCode: 'en-US', name: 'en-US-Journey-D' }, // Journey voice (News/Blog style)
          audioConfig: { audioEncoding: 'MP3' },
        }),
      }
    );

    if (!ttsResponse.ok) {
       const errorData = await ttsResponse.json().catch(() => ({}));
       console.error("Google TTS REST Error:", errorData);
       throw new Error(`Google TTS API failed: ${ttsResponse.statusText}`);
    }

    const responseJson = await ttsResponse.json();
    const audioContent = responseJson.audioContent; // Base64 string

    if (!audioContent) {
        throw new Error("No audio content received from Google Cloud TTS");
    }
    
    // Convert Base64 output to Buffer
    const bufferData = Buffer.from(audioContent, 'base64');

    // 4. Try to cache in Vercel Blob if token is available
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { url } = await put(`audio/${slug}.mp3`, bufferData, {
          access: 'public',
          contentType: 'audio/mpeg',
          addRandomSuffix: false // IMPORTANT: Ensure determinism for simple path checking
        });
        console.log(`Audio cached to Blob: ${url}`);
        return NextResponse.json({ audioUrl: url, cached: true });
      } catch (blobError) {
        console.error("Blob Storage Error:", blobError);
        // Fallback to sending raw audio if caching fails
      }
    } else {
        console.warn("BLOB_READ_WRITE_TOKEN not found. Skipping caching.");
    }

    // 5. If Blob storage is not configured or failed, return audio directly
    return new NextResponse(bufferData, {
        headers: {
            'Content-Type': 'audio/mpeg',
            'Content-Length': bufferData.length.toString(),
        }
    });

  } catch (error) {
    console.error("Generate Audio Route Error:", error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
