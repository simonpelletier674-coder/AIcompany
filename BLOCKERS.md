# BLOCKERS — one-time setups only the operator can do

These are the only things Claude cannot do autonomously, because they legally require
a human identity and control of funds. Each is a one-time setup; after that, Claude
operates them via API with no further intervention.

## 1. Payment rail (required for the first dollar — highest priority)
Claude cannot create a Stripe/Gumroad/Lemon Squeezy account: payouts require a legal
identity, a bank account, and tax info.

**Recommended:** create a [Lemon Squeezy](https://lemonsqueezy.com) or
[Gumroad](https://gumroad.com) account (they act as merchant of record — they handle
sales tax/VAT, so nothing else is needed). Then put an API key in this repo's
deployment secrets or a Cloudflare Worker secret named `PAYMENT_API_KEY`.
- Not urgent for week 1–2 (building + validation come first), but blocks revenue.

## 2. Ad spend mechanism (required before any of the $100/month is spendable)
Claude cannot attach a credit card to an ad platform. When the time comes (not before
a product shows organic traction), the operator creates ONE ad account — likely
Reddit Ads or Google Ads depending on the product — sets a hard $100/month spending
cap in the platform itself, and shares access. The platform-level cap is the budget
enforcement; Claude never needs card details.

## 3. Domain (optional, ~$10/year, improves trust + SEO)
Workers.dev subdomains work for launch. A real domain can wait until an idea is
validated. If bought, buy it in the operator's Cloudflare account and Claude handles
all DNS/routing from there.

## 4. Revenue destination
Decide where payouts land (operator's bank via the payment rail's payout settings).
Claude never touches this; just confirming it's configured in the rail from item 1.

---
**Status:** none of these block the next ~2 weeks of work (ideation, build, landing
page, organic channel prep). Item 1 becomes the critical path the day the product is
sellable.

## 5. Production LLM API key (needed before first CUSTOMER, not before landing page)
The product pipeline (transcript digestion, draft generation) needs an Anthropic API
key as a Cloudflare Worker secret, with a small budget (~$1–2 per customer per
month at ~95% gross margin). Workers AI's built-in Whisper covers transcription on
the free tier initially. Timing: when the waitlist converts to first trials.


## 6. ✅ RESOLVED 2026-08-22 — Deployment path to Cloudflare Workers
Operator connected the GitHub repo to Cloudflare Workers Builds. Every push to the
branch now auto-deploys (verified live: the samples version deployed without any
manual step). The company ships to production autonomously. Original blocker below
for the record.

### (original blocker text)
The landing page is built and ready in `products/guestloop/site/`, but this
session's network egress policy BLOCKS `api.cloudflare.com` (403 policy denial),
so `wrangler deploy` cannot run from here even though CLOUDFLARE_API_TOKEN is set.
The Cloudflare MCP connector works but has no code-deploy tool (data resources
only — the waitlist KV namespace is already created: 438111eeba5245b4ab5c0220e154ea60).

Two one-time fixes — EITHER works, (b) is best for autonomy:
(a) In the Claude Code web environment settings for this environment, allow
    network access to `api.cloudflare.com` — then wrangler deploys work forever.
(b) In the Cloudflare dashboard: Workers & Pages → create application →
    connect to the GitHub repo `simonpelletier674-coder/AIcompany`, root directory
    `products/guestloop/site`, branch `claude/autonomous-revenue-company-ucakzq`
    (Workers Builds). Then EVERY git push auto-deploys — full autonomy with no
    egress change needed.

## 7. Platform accounts for launch posts (needed to start GuestLoop's 4-week clock)
The company has no Reddit/HN/Indie Hackers/X accounts and cannot create them
(platform ToS + phone/email verification require a human). Launch content is being
drafted now (products/guestloop/marketing/). Two options:
(a) Operator posts the drafts under their own accounts with the honest framing
    written into them ("I gave an AI a budget and autonomy; this is its first
    product") — ~15 minutes total, highest-credibility version of the story.
(b) Skip account-gated channels; rely only on SEO + directory submissions that need
    just an email. Slower, weaker launch.
Recommendation: (a). The drafts will be ready for copy-paste.

## 8. Second Workers Builds connection (Undertone deploy — one dashboard step)
Undertone's site is built and ready in `products/undertone/site/`. The existing
Workers Builds connection deploys only the guestloop worker (root wrangler.toml).
One-time step: Cloudflare dashboard → Workers & Pages → import the SAME repo again
→ **Root directory: `products/undertone/site`** → branch
`claude/autonomous-revenue-company-ucakzq`. That creates the `undertone` worker with
its own push-to-deploy. (Alternative: one manual `npx wrangler deploy` from that
directory.) D1 database + waitlist table already exist and are wired in.
