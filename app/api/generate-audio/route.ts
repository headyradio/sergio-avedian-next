import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

// Voice ID: Using a standard professional voice ("Adam") as placeholder.
// Replace with Sergio's custom voice clone ID if available.
const VOICE_ID = "pNInz6obpgDQGcFmaJgB"; 

export async function POST(request: NextRequest) {
  try {
    const { text, slug } = await request.json();

    if (!text || !slug) {
      return NextResponse.json(
        { error: 'Missing required parameters: text and slug' },
        { status: 400 }
      );
    }

    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error: Missing API Key' },
        { status: 500 }
      );
    }

    console.log(`Generating audio for slug: ${slug}`);

    // Call ElevenLabs API
    // Using "eleven_turbo_v2_5" for low latency and cost effectiveness as requested
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_turbo_v2_5",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("ElevenLabs API Error:", errorData);
      return NextResponse.json(
        { error: 'Failed to generate audio', details: errorData },
        { status: response.status }
      );
    }

    const audioBuffer = await response.arrayBuffer();

    // Try to cache in Vercel Blob if token is available
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { url } = await put(`audio/${slug}.mp3`, audioBuffer, {
          access: 'public',
          contentType: 'audio/mpeg',
        });
        console.log(`Audio cached to Blob: ${url}`);
        return NextResponse.json({ audioUrl: url, cached: true });
      } catch (blobError) {
        console.error("Blob Storage Error:", blobError);
        // Fallback to sending raw audio if caching fails
        // Note: In a real prod environment, we might want to fail or just return the stream directly
      }
    } else {
        console.warn("BLOB_READ_WRITE_TOKEN not found. Skipping caching.");
    }

    // If Blob storage is not configured or failed, return audio directly
    // Returning as a blob/stream
    return new NextResponse(audioBuffer, {
        headers: {
            'Content-Type': 'audio/mpeg',
            'Content-Length': audioBuffer.byteLength.toString(),
        }
    });

  } catch (error) {
    console.error("Generate Audio Route Error:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
