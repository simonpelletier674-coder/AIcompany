#!/usr/bin/env node
// GuestLoop pipeline prototype — RSS → transcript → show memory → drafts.
//
// Runnable today with: ANTHROPIC_API_KEY=... node pipeline.mjs <rss-url> [--episodes N]
// In production this logic moves into the Worker (cron-triggered), with D1 replacing
// the local JSON memory store and Workers AI Whisper replacing the transcript step
// when an episode has no published transcript.
//
// Stages:
//   1. ingest   — parse RSS, find new episodes since last run
//   2. transcript — use <podcast:transcript> tag if present; else fetch episode page
//                 and extract a host-published transcript; else (prod) Whisper
//   3. digest   — one LLM pass per episode → structured memory record:
//                 {guests[], topics[], quotes[], open_threads[], promises[]}
//   4. drafts   — one LLM pass with THIS episode's digest + the whole show memory
//                 → 5 LinkedIn drafts + 2 guest emails, cross-episode callbacks
//   5. deliver  — prototype: write markdown to ./out; prod: email + dashboard

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const API = 'https://api.anthropic.com/v1/messages';
const MODEL_DIGEST = 'claude-haiku-4-5-20251001'; // cheap structured extraction
const MODEL_DRAFTS = 'claude-sonnet-5';           // writing quality matters here
const MEMORY_FILE = './memory.json';

// ---------- stage 1: ingest ----------
export async function fetchFeed(rssUrl) {
  const res = await fetch(rssUrl, { headers: { 'user-agent': 'GuestLoop/0.1 (+https://guestloop.example)' } });
  if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`);
  const xml = await res.text();
  // Minimal, dependency-free item extraction (prod: real XML parser in Worker).
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m => m[1]);
  return items.map(item => ({
    title: pick(item, 'title'),
    guid: pick(item, 'guid'),
    pubDate: pick(item, 'pubDate'),
    link: pick(item, 'link'),
    audioUrl: (item.match(/<enclosure[^>]*url="([^"]+)"/) || [])[1] || null,
    transcriptUrl: (item.match(/<podcast:transcript[^>]*url="([^"]+)"/) || [])[1] || null,
    description: pick(item, 'description'),
  }));
}
const pick = (xml, tag) => {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return m ? m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim() : '';
};

// ---------- stage 3: digest ----------
const DIGEST_PROMPT = (episode, transcript) => `You are the memory engine of GuestLoop.
Extract a structured record from this podcast episode. Be precise and quote exactly.

Episode: ${episode.title}
Transcript:
${transcript}

Return ONLY JSON:
{
 "guests": [{"name": "", "role_company": "", "linkedin_hint": ""}],
 "topics": ["short topic labels"],
 "best_quotes": [{"speaker": "", "quote": "verbatim, <=40 words", "context": ""}],
 "open_threads": ["things mentioned but unresolved: offers made, intros discussed, follow-ups promised, questions left open"],
 "host_voice_notes": ["short observations about how the HOST talks: phrasings, tone, recurring expressions"],
 "one_line_summary": ""
}`;

const DRAFTS_PROMPT = (episode, digest, memory) => `You are GuestLoop, ghostwriting for a podcast host.

HOST VOICE (accumulated observations): ${JSON.stringify(memory.voice.slice(-20))}
SHOW MEMORY (prior episodes): ${JSON.stringify(memory.episodes.slice(-30).map(e => ({
  title: e.title, guests: e.digest.guests, topics: e.digest.topics,
  best_quotes: e.digest.best_quotes, summary: e.digest.one_line_summary
})))}

NEW EPISODE: ${episode.title}
DIGEST: ${JSON.stringify(digest)}

Write, in the host's voice:
1. FIVE LinkedIn post drafts (story / contrarian insight / listicle / quote-the-guest / engagement question). 80-200 words each, 0-3 hashtags, no emoji spam. At least ONE draft must weave in a relevant callback to a PRIOR episode from show memory, naming that guest ("As <name> told me back in...") — only if genuinely relevant; never force it.
2. A guest thank-you email: warm, short, with their most quotable moment formatted for easy sharing.
3. A "30 days later" follow-up email referencing the specific open_threads.

Return ONLY JSON: {"linkedin": ["...", "...", "...", "...", "..."], "thank_you_email": "...", "followup_email": "..."}`;

async function claude(model, prompt, maxTokens = 4000) {
  const res = await fetch(API, {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ model, max_tokens: maxTokens, messages: [{ role: 'user', content: prompt }] }),
  });
  if (!res.ok) throw new Error(`Claude API ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.content[0].text;
}

const parseJson = (text) => JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1));

// ---------- orchestration ----------
async function main() {
  const [rssUrl] = process.argv.slice(2);
  if (!rssUrl) { console.error('usage: pipeline.mjs <rss-url> [--episodes N]'); process.exit(1); }
  const nArg = process.argv.indexOf('--episodes');
  const limit = nArg > -1 ? Number(process.argv[nArg + 1]) : 1;

  const memory = existsSync(MEMORY_FILE)
    ? JSON.parse(await readFile(MEMORY_FILE, 'utf8'))
    : { episodes: [], voice: [] };
  const seen = new Set(memory.episodes.map(e => e.guid));

  const feed = await fetchFeed(rssUrl);
  const fresh = feed.filter(e => !seen.has(e.guid)).slice(0, limit);
  console.log(`Feed: ${feed.length} items, processing ${fresh.length} new.`);

  await mkdir('./out', { recursive: true });
  for (const ep of fresh) {
    let transcript = null;
    if (ep.transcriptUrl) transcript = await (await fetch(ep.transcriptUrl)).text();
    if (!transcript) {
      console.warn(`No transcript for "${ep.title}" — prod would Whisper the audio (${ep.audioUrl}). Skipping in prototype.`);
      continue;
    }
    transcript = transcript.slice(0, 300_000); // context guard

    console.log(`Digesting: ${ep.title}`);
    const digest = parseJson(await claude(MODEL_DIGEST, DIGEST_PROMPT(ep, transcript)));

    console.log(`Drafting: ${ep.title}`);
    const drafts = parseJson(await claude(MODEL_DRAFTS, DRAFTS_PROMPT(ep, digest, memory), 6000));

    memory.episodes.push({ guid: ep.guid, title: ep.title, pubDate: ep.pubDate, digest });
    memory.voice.push(...(digest.host_voice_notes || []));
    await writeFile(MEMORY_FILE, JSON.stringify(memory, null, 2));

    const slug = ep.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60);
    const md = [
      `# ${ep.title}\n`,
      `## LinkedIn drafts\n`, ...drafts.linkedin.map((p, i) => `### Draft ${i + 1}\n${p}\n`),
      `## Guest thank-you email\n${drafts.thank_you_email}\n`,
      `## 30-day follow-up email\n${drafts.followup_email}\n`,
    ].join('\n');
    await writeFile(`./out/${slug}.md`, md);
    console.log(`Wrote ./out/${slug}.md`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
