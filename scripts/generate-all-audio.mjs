/**
 * generate-all-audio.mjs
 *
 * Pre-generates English and Spanish audio for every published blog article
 * and uploads them to Vercel Blob for permanent caching.
 *
 * Run with:
 *   npm run generate-audio
 *
 * This runs locally (no serverless timeout limits).
 * It skips articles that already have cached audio in Vercel Blob.
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@sanity/client';
import { put, list } from '@vercel/blob';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ─── Load .env.local ─────────────────────────────────────────────────────────
function loadEnv() {
  try {
    const envFile = readFileSync(join(ROOT, '.env.local'), 'utf-8');
    for (const line of envFile.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let value = trimmed.slice(eqIdx + 1).trim();
      // Strip surrounding quotes
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
    console.log('✅ Loaded .env.local\n');
  } catch {
    console.error('❌ Could not read .env.local — make sure it exists in the project root.');
    process.exit(1);
  }
}

// ─── Sanity ───────────────────────────────────────────────────────────────────
function getSanityClient() {
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
  });
}

// Fetch all published posts with their full body content
async function fetchAllPosts(client) {
  return client.fetch(`
    *[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
      _id,
      title,
      slug,
      "body": content,
      "authorName": author->name
    }
  `);
}

// Convert Sanity Portable Text blocks to plain text
function portableTextToPlainText(blocks = []) {
  return blocks
    .map(block => {
      if (block._type !== 'block' || !block.children) return '';
      return block.children.map(child => child.text).join('');
    })
    .join('\n\n');
}

// ─── Google Translate ─────────────────────────────────────────────────────────
async function translateText(text, targetLang, apiKey) {
  const res = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, source: 'en', target: targetLang, format: 'text' }),
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Google Translate failed (${res.status}): ${JSON.stringify(err)}`);
  }
  const json = await res.json();
  const translated = json?.data?.translations?.[0]?.translatedText;
  if (!translated) throw new Error('No translated text returned from Google Translate');
  return translated;
}

// ─── Google TTS ───────────────────────────────────────────────────────────────
const MAX_BYTES = 4500;

const VOICES = {
  en: { languageCode: 'en-US', name: 'en-US-Journey-D' },
  es: { languageCode: 'es-US', name: 'es-US-Journey-F' },
};

function splitTextIntoChunks(text, maxBytes = MAX_BYTES) {
  const chunks = [];
  let currentChunk = '';
  const sentences = text.split(/(?<=[.!?])\s+/);

  for (const sentence of sentences) {
    const potential = currentChunk + (currentChunk ? ' ' : '') + sentence;
    if (Buffer.byteLength(potential, 'utf8') > maxBytes) {
      if (currentChunk) {
        chunks.push(currentChunk);
        currentChunk = sentence;
      } else {
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
      currentChunk = potential;
    }
  }
  if (currentChunk) chunks.push(currentChunk);
  return chunks;
}

async function generateAudioChunk(text, apiKey, voice) {
  const res = await fetch(
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
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Google TTS failed (${res.status}): ${JSON.stringify(err)}`);
  }
  const json = await res.json();
  if (!json.audioContent) throw new Error('No audioContent in TTS response');
  return Buffer.from(json.audioContent, 'base64');
}

async function generateAudio(text, apiKey, voice) {
  const bytes = Buffer.byteLength(text, 'utf8');
  if (bytes <= MAX_BYTES) {
    return generateAudioChunk(text, apiKey, voice);
  }
  const chunks = splitTextIntoChunks(text, MAX_BYTES);
  console.log(`      → splitting into ${chunks.length} chunks`);
  const buffers = [];
  for (let i = 0; i < chunks.length; i++) {
    process.stdout.write(`      → chunk ${i + 1}/${chunks.length}...\r`);
    buffers.push(await generateAudioChunk(chunks[i], apiKey, voice));
  }
  console.log('');
  return Buffer.concat(buffers);
}

// ─── Vercel Blob ──────────────────────────────────────────────────────────────
async function isCached(slug, lang) {
  // Check new-style key first
  const primary = `audio/${slug}-${lang}.mp3`;
  const { blobs: p } = await list({ prefix: primary, limit: 1 });
  if (p.find(b => b.pathname === primary)) return true;

  // Fallback legacy key for English
  if (lang === 'en') {
    const legacy = `audio/${slug}.mp3`;
    const { blobs: l } = await list({ prefix: legacy, limit: 1 });
    if (l.find(b => b.pathname === legacy)) return true;
  }
  return false;
}

async function uploadToBlob(slug, lang, buffer) {
  const { url } = await put(`audio/${slug}-${lang}.mp3`, buffer, {
    access: 'public',
    contentType: 'audio/mpeg',
    addRandomSuffix: false,
  });
  return url;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  loadEnv();

  const apiKey = process.env.GOOGLE_TTS_API_KEY;
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

  if (!apiKey) { console.error('❌ Missing GOOGLE_TTS_API_KEY'); process.exit(1); }
  if (!blobToken) { console.error('❌ Missing BLOB_READ_WRITE_TOKEN'); process.exit(1); }

  // Vercel Blob SDK reads this env var automatically
  process.env.BLOB_READ_WRITE_TOKEN = blobToken;

  const sanity = getSanityClient();
  console.log('📡 Fetching all posts from Sanity...');
  const posts = await fetchAllPosts(sanity);
  console.log(`📰 Found ${posts.length} articles\n`);

  const langs = ['en', 'es'];
  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const slug = post.slug?.current;
    if (!slug) { console.warn(`  ⚠️  Skipping post with no slug: ${post.title}`); continue; }

    const plainText = `${post.title}. By ${post.authorName || 'Sergio Avedian'}. ${portableTextToPlainText(post.body)}`;
    console.log(`[${i + 1}/${posts.length}] "${post.title}" (${slug})`);

    for (const lang of langs) {
      process.stdout.write(`  [${lang.toUpperCase()}] Checking cache... `);
      const cached = await isCached(slug, lang);
      if (cached) {
        console.log('✅ Already cached — skipping');
        skipped++;
        continue;
      }
      console.log('not cached — generating');

      try {
        let textToSpeak = plainText;

        if (lang !== 'en') {
          process.stdout.write(`      → Translating to ${lang}... `);
          textToSpeak = await translateText(plainText, lang, apiKey);
          console.log('done');
        }

        process.stdout.write(`      → Generating TTS audio... `);
        const voice = VOICES[lang] ?? VOICES.en;
        const audioBuffer = await generateAudio(textToSpeak, apiKey, voice);
        console.log(`done (${(audioBuffer.length / 1024).toFixed(0)} KB)`);

        process.stdout.write(`      → Uploading to Vercel Blob... `);
        const url = await uploadToBlob(slug, lang, audioBuffer);
        console.log(`done\n      → ${url}`);
        generated++;
      } catch (err) {
        console.error(`\n  ❌ Failed [${lang}]: ${err.message}`);
        failed++;
      }
    }
    console.log('');
  }

  console.log('─────────────────────────────────────────');
  console.log(`✅ Generated: ${generated}`);
  console.log(`⏭️  Skipped (cached): ${skipped}`);
  if (failed > 0) console.log(`❌ Failed: ${failed}`);
  console.log('─────────────────────────────────────────');

  if (failed > 0) {
    console.log('\n💡 If Translation failed: make sure the Cloud Translation API is enabled');
    console.log('   in your Google Cloud project and your GOOGLE_TTS_API_KEY has access to it.');
    console.log('   Visit: https://console.cloud.google.com/apis/library/translate.googleapis.com');
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
