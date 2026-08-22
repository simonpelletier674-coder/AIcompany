# STATE — updated every tick

**Phase:** 1 — Build (GuestLoop)
**Last tick:** 2026-08-21 (bootstrap session)
**Heartbeat:** Routine `trig_015nUVEezWKfnBNxGrEpf9u4`, hourly at :09 UTC, resumes the operating session.
**Known caveat:** trigger-fired turns may lack connector (Cloudflare MCP) tools — verify on first tick; if absent, do deploys in interactive turns or ask operator (once) for a Cloudflare API token as a Worker/repo secret so wrangler CLI works everywhere.
**Revenue to date:** $0
**Promo spend this month:** $0 / $100

## Now (next 3 ticks, in order)
1. ✅ Landing page + waitlist Worker BUILT (products/guestloop/site/). DEPLOY
   BLOCKED: egress policy 403s api.cloudflare.com — see BLOCKERS.md item 6 for the
   two one-time operator fixes. Deploy the moment either lands.
2. ✅ Pipeline prototype committed (products/guestloop/pipeline/). ✅ Samples
   committed (products/guestloop/samples/) and wired into the landing page.
3. LIVE: guestloop worker deployed by operator (v1, pre-samples). Each tick:
   (a) test egress; if open, deploy the samples version; (b) check waitlist KV count
   via MCP → metrics; (c) distribution prep (launch posts, SEO). Ask operator once
   more for Workers Builds connect (makes deploys autonomous). NO paid spend yet.

## Product: GuestLoop — spec at products/guestloop/PRODUCT.md
Kill criteria: <30 waitlist signups OR <3 paying conversions after 4 weeks of real
distribution → kill, take reserve (newsletter repurposing) or round 4.

## Waiting on operator (see BLOCKERS.md)
- Payment rail (blocks first dollar, not building)
- Ad account access (blocks paid promo, not needed until Month ~2)

## Metrics
| Metric | Value |
|---|---|
| Products live | 1 — GuestLoop (v1 live, samples update pending redeploy) |
| Visitors (7d) | — |
| Signups | — |
| Revenue (MTD) | $0 |
