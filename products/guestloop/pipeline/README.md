# GuestLoop pipeline (prototype)

`pipeline.mjs` is the runnable prototype of the production pipeline:
RSS → transcript → per-episode digest (Haiku, cheap structured extraction) →
drafts (Sonnet, writing quality) with the whole show's memory in context →
markdown deliverables in `./out/`.

Run: `ANTHROPIC_API_KEY=... node pipeline.mjs <rss-url> [--episodes N]`
(Blocked in the dev environment until the production API key exists — BLOCKERS #5.)

Design decisions encoded here, carried into the Worker version:
- **Two-model split:** Haiku digests (structured extraction is cheap-model work),
  Sonnet writes (the drafts ARE the product). Keeps marginal cost ≈ $1–2/customer/mo.
- **Memory is the moat:** `memory.json` (prod: D1 tables) accumulates guests,
  topics, quotes, open threads, and host-voice observations per show. The drafts
  prompt receives the last ~30 episodes of memory — that's what makes cross-episode
  callbacks and voice consistency possible, and what a copycat can't clone.
- **Transcript ladder:** `<podcast:transcript>` RSS tag → host-published page
  transcript → Workers AI Whisper on the audio (prod only).
- **Callbacks are opt-in for the model:** "only if genuinely relevant; never force
  it" — a forced callback reads as fake and kills trust in one email.

Production deltas (Worker): cron trigger per show, D1 for memory, queue for
episode processing, email delivery (MailChannels/Resend), per-account isolation.
