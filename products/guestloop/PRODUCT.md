# GuestLoop (working title) — product spec v0.1

**One-liner:** Your podcast already contains your best sales and personal-brand
material — GuestLoop remembers every episode and every guest, and turns each new
episode into a week of LinkedIn drafts plus guest follow-up emails that build real
relationships.

**Buyer:** solo B2B/expert podcast hosts (coaches, consultants, agency owners,
founders) with an ACTIVE show (RSS-fresh ≤90 days), who podcast for business
development, not ad revenue.

**Positioning (per diligence):** NOT another repurposer (Castmagic owns
many-outputs-from-one-upload). GuestLoop is the relationship/sales angle:
- Cross-episode callbacks: "As @Guest said back in ep. 12…" woven into new drafts.
- Guest CRM-lite: per-guest page with open threads, promised intros, follow-up
  email drafts 1 week / 1 month after their episode.
- Continuity memory the customer accumulates — switching cost grows every episode.

**Pricing:** $29/mo solo (4 eps/mo) · $49/mo pro (unlimited + auto-post pilot).
PAUSE-NOT-CANCEL is first-class (podfade-aware billing). 14-day free trial, no card.

**MVP architecture (Cloudflare):**
- Worker (API + site) · D1 (users, shows, episodes, guests, threads) · KV (cache)
- Ingestion: public RSS poll (cron) → audio fetch → transcription
  (Workers AI Whisper first; OpenAI Whisper API fallback) → episode digest +
  guest/thread extraction (Claude API) → per-show memory store in D1
- Outputs: 5 LinkedIn drafts + 2 guest email drafts per episode, delivered via
  email + dashboard. Copy-paste first; w_member_social auto-post as later opt-in pilot.
- Payments: Lemon Squeezy overlay checkout (BLOCKER: operator account).

**Build sequence:**
1. Landing page + waitlist (email into KV) on workers.dev — live ASAP for signal.
2. Pipeline prototype against 2–3 real public podcasts; sample outputs on the
   landing page (the proof IS the marketing).
3. Auth + dashboard + billing → first paying users.

**New blockers introduced:** production LLM API key (Anthropic) as a Worker secret +
a small inference budget (est. $1–2/customer/mo, ~95% margin at price). Not needed
for the landing page. Added to BLOCKERS.md.

**Naming note:** "GuestLoop" is a working title — check collisions before buying a
domain; rename is cheap until launch.

**Kill criteria (charter rule):** <30 waitlist signups OR <3 paying conversions
after 4 weeks of real distribution effort → kill and take the reserve idea or round 4.
