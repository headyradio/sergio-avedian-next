import { put, list } from '@vercel/blob';

const MAX_BYTES = 4500; // Stay under Google TTS 5000 byte limit

// Voice config per language
const VOICE_CONFIG: Record<string, { languageCode: string; name: string }> = {
  en: { languageCode: 'en-US', name: 'en-US-Journey-D' },
  es: { languageCode: 'es-US', name: 'es-US-Journey-F' },
};

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

// Translate text using Google Cloud Translation API
export async function translateText(text: string, targetLang: string, apiKey: string): Promise<string> {
  console.log(`[audio-generator] Translating to "${targetLang}" via Google Translate (${Buffer.byteLength(text, 'utf8')} bytes)`);

  const response = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, source: 'en', target: targetLang, format: 'text' }),
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    console.error('[audio-generator] Google Translate error:', err);
    throw new Error(`Google Translate API failed: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  const translated = json?.data?.translations?.[0]?.translatedText;
  if (!translated) throw new Error('No translated text returned from Google Translate');

  console.log(`[audio-generator] Translation complete (${Buffer.byteLength(translated, 'utf8')} bytes)`);
  return translated;
}

// Generate audio for a single chunk via Google TTS
async function generateAudioChunk(
  text: string,
  apiKey: string,
  voice: { languageCode: string; name: string }
): Promise<Buffer> {
  const ttsResponse = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text },
        voice,
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
// Cache key: audio/{slug}-{lang}.mp3  (e.g. audio/my-article-en.mp3)
// Falls back to legacy audio/{slug}.mp3 for English to avoid re-generating existing files
export async function getCachedAudioUrl(slug: string, lang: string = 'en'): Promise<string | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;

  try {
    const primaryPath = `audio/${slug}-${lang}.mp3`;
    const { blobs: primaryBlobs } = await list({ prefix: primaryPath, limit: 1 });
    const primary = primaryBlobs.find(b => b.pathname === primaryPath);
    if (primary) return primary.url;

    // Legacy fallback for English: audio/{slug}.mp3
    if (lang === 'en') {
      const legacyPath = `audio/${slug}.mp3`;
      const { blobs: legacyBlobs } = await list({ prefix: legacyPath, limit: 1 });
      const legacy = legacyBlobs.find(b => b.pathname === legacyPath);
      if (legacy) return legacy.url;
    }

    return null;
  } catch (e) {
    console.warn('Failed to check audio cache:', e);
    return null;
  }
}

// Generate and cache audio for an article in the given language
export async function generateAudioForArticle(
  slug: string,
  text: string,
  lang: string = 'en'
): Promise<{ audioUrl: string | null; audioBuffer: Buffer }> {
  const apiKey = process.env.GOOGLE_TTS_API_KEY;
  if (!apiKey) {
    throw new Error('Missing GOOGLE_TTS_API_KEY environment variable');
  }

  const voice = VOICE_CONFIG[lang] ?? VOICE_CONFIG['en'];

  // Translate if not English
  let textToSpeak = text;
  if (lang !== 'en') {
    textToSpeak = await translateText(text, lang, apiKey);
  }

  const textBytes = Buffer.byteLength(textToSpeak, 'utf8');
  console.log(`[audio-generator] Generating "${lang}" audio for "${slug}" (${textBytes} bytes)`);

  const audioBuffers: Buffer[] = [];

  if (textBytes > MAX_BYTES) {
    const chunks = splitTextIntoChunks(textToSpeak, MAX_BYTES);
    console.log(`[audio-generator] Split into ${chunks.length} chunks`);

    for (let i = 0; i < chunks.length; i++) {
      console.log(`[audio-generator] Chunk ${i + 1}/${chunks.length} (${Buffer.byteLength(chunks[i], 'utf8')} bytes)`);
      const buf = await generateAudioChunk(chunks[i], apiKey, voice);
      audioBuffers.push(buf);
    }
  } else {
    const buf = await generateAudioChunk(textToSpeak, apiKey, voice);
    audioBuffers.push(buf);
  }

  const combinedBuffer = Buffer.concat(audioBuffers);
  console.log(`[audio-generator] Combined audio: ${combinedBuffer.length} bytes`);

  // Cache to Vercel Blob as audio/{slug}-{lang}.mp3
  let audioUrl: string | null = null;
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { url } = await put(`audio/${slug}-${lang}.mp3`, combinedBuffer, {
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
