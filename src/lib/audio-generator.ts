import { put, list } from '@vercel/blob';

const MAX_BYTES = 4500; // Stay under Google TTS 5000 byte limit

// Split text into chunks that fit within the byte limit
export function splitTextIntoChunks(text: string, maxBytes: number = MAX_BYTES): string[] {
  const chunks: string[] = [];
  let currentChunk = '';

  // Split by sentences first
  const sentences = text.split(/(?<=[.!?])\s+/);

  for (const sentence of sentences) {
    const potentialChunk = currentChunk + (currentChunk ? ' ' : '') + sentence;

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

// Generate audio for a single chunk via Google TTS
async function generateAudioChunk(text: string, apiKey: string): Promise<Buffer> {
  const ttsResponse = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text },
        voice: { languageCode: 'en-US', name: 'en-US-Journey-D' },
        audioConfig: { audioEncoding: 'MP3' },
      }),
    }
  );

  if (!ttsResponse.ok) {
    const errorData = await ttsResponse.json().catch(() => ({}));
    console.error('Google TTS REST Error:', errorData);
    throw new Error(`Google TTS API failed: ${ttsResponse.statusText}`);
  }

  const responseJson = await ttsResponse.json();
  if (!responseJson.audioContent) {
    throw new Error('No audio content received from Google Cloud TTS');
  }

  return Buffer.from(responseJson.audioContent, 'base64');
}

// Check if audio is already cached in Vercel Blob
export async function getCachedAudioUrl(slug: string): Promise<string | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;

  try {
    const filter = `audio/${slug}.mp3`;
    const { blobs } = await list({ prefix: filter, limit: 1 });
    const cached = blobs.find(b => b.pathname === filter);
    return cached ? cached.url : null;
  } catch (e) {
    console.warn('Failed to check audio cache:', e);
    return null;
  }
}

// Generate and cache audio for an article
export async function generateAudioForArticle(
  slug: string,
  text: string
): Promise<{ audioUrl: string | null; audioBuffer: Buffer }> {
  const apiKey = process.env.GOOGLE_TTS_API_KEY;
  if (!apiKey) {
    throw new Error('Missing GOOGLE_TTS_API_KEY environment variable');
  }

  const textBytes = Buffer.byteLength(text, 'utf8');
  console.log(`[audio-generator] Generating audio for "${slug}" (${textBytes} bytes)`);

  const audioBuffers: Buffer[] = [];

  if (textBytes > MAX_BYTES) {
    const chunks = splitTextIntoChunks(text, MAX_BYTES);
    console.log(`[audio-generator] Split into ${chunks.length} chunks`);

    for (let i = 0; i < chunks.length; i++) {
      console.log(`[audio-generator] Chunk ${i + 1}/${chunks.length} (${Buffer.byteLength(chunks[i], 'utf8')} bytes)`);
      const buf = await generateAudioChunk(chunks[i], apiKey);
      audioBuffers.push(buf);
    }
  } else {
    const buf = await generateAudioChunk(text, apiKey);
    audioBuffers.push(buf);
  }

  const combinedBuffer = Buffer.concat(audioBuffers);
  console.log(`[audio-generator] Combined audio: ${combinedBuffer.length} bytes`);

  // Cache to Vercel Blob
  let audioUrl: string | null = null;
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { url } = await put(`audio/${slug}.mp3`, combinedBuffer, {
        access: 'public',
        contentType: 'audio/mpeg',
        addRandomSuffix: false,
      });
      audioUrl = url;
      console.log(`[audio-generator] Cached to Blob: ${url}`);
    } catch (e) {
      console.error('[audio-generator] Blob caching failed:', e);
    }
  }

  return { audioUrl, audioBuffer: combinedBuffer };
}
