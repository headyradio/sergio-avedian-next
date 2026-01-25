import { NextRequest, NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';

const MAX_BYTES = 4500; // Stay under 5000 byte limit with some buffer

// Split text into chunks that fit within the byte limit
function splitTextIntoChunks(text: string, maxBytes: number): string[] {
  const chunks: string[] = [];
  let currentChunk = '';
  
  // Split by sentences first
  const sentences = text.split(/(?<=[.!?])\s+/);
  
  for (const sentence of sentences) {
    const potentialChunk = currentChunk + (currentChunk ? ' ' : '') + sentence;
    
    // Check byte length
    if (Buffer.byteLength(potentialChunk, 'utf8') > maxBytes) {
      if (currentChunk) {
        chunks.push(currentChunk);
        currentChunk = sentence;
      } else {
        // Single sentence is too long, split by words
        const words = sentence.split(' ');
        for (const word of words) {
          const potentialWord = currentChunk + (currentChunk ? ' ' : '') + word;
          if (Buffer.byteLength(potentialWord, 'utf8') > maxBytes) {
            if (currentChunk) chunks.push(currentChunk);
            currentChunk = word;
          } else {
            currentChunk = potentialWord;
          }
        }
      }
    } else {
      currentChunk = potentialChunk;
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk);
  }
  
  return chunks;
}

// Generate audio for a single chunk
async function generateAudioChunk(text: string, apiKey: string): Promise<Buffer> {
  const ttsResponse = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: { text },
        voice: { languageCode: 'en-US', name: 'en-US-Journey-D' },
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
  const audioContent = responseJson.audioContent;

  if (!audioContent) {
    throw new Error("No audio content received from Google Cloud TTS");
  }

  return Buffer.from(audioContent, 'base64');
}

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

    // 2. Validate API Key
    if (!process.env.GOOGLE_TTS_API_KEY) {
         return NextResponse.json(
            { error: 'Server configuration error: Missing Google TTS API Key' },
            { status: 500 }
        );
    }

    // 3. Split text into chunks if needed
    const textBytes = Buffer.byteLength(text, 'utf8');
    console.log(`Text length: ${textBytes} bytes`);
    
    let audioBuffers: Buffer[] = [];
    
    if (textBytes > MAX_BYTES) {
      console.log(`Text exceeds ${MAX_BYTES} bytes, splitting into chunks...`);
      const chunks = splitTextIntoChunks(text, MAX_BYTES);
      console.log(`Split into ${chunks.length} chunks`);
      
      // Generate audio for each chunk
      for (let i = 0; i < chunks.length; i++) {
        console.log(`Generating chunk ${i + 1}/${chunks.length} (${Buffer.byteLength(chunks[i], 'utf8')} bytes)`);
        const chunkBuffer = await generateAudioChunk(chunks[i], process.env.GOOGLE_TTS_API_KEY);
        audioBuffers.push(chunkBuffer);
      }
    } else {
      // Single chunk
      const buffer = await generateAudioChunk(text, process.env.GOOGLE_TTS_API_KEY);
      audioBuffers.push(buffer);
    }

    // 4. Concatenate all audio buffers
    const combinedBuffer = Buffer.concat(audioBuffers);
    console.log(`Combined audio size: ${combinedBuffer.length} bytes`);

    // 5. Try to cache in Vercel Blob if token is available
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { url } = await put(`audio/${slug}.mp3`, combinedBuffer, {
          access: 'public',
          contentType: 'audio/mpeg',
          addRandomSuffix: false
        });
        console.log(`Audio cached to Blob: ${url}`);
        return NextResponse.json({ audioUrl: url, cached: true });
      } catch (blobError) {
        console.error("Blob Storage Error:", blobError);
      }
    } else {
        console.warn("BLOB_READ_WRITE_TOKEN not found. Skipping caching.");
    }

    // 6. If Blob storage is not configured or failed, return audio directly
    return new NextResponse(combinedBuffer, {
        headers: {
            'Content-Type': 'audio/mpeg',
            'Content-Length': combinedBuffer.length.toString(),
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
