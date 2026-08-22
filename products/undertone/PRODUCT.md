# Undertone — product spec v0.1 (slot 2 of the portfolio)

**One-liner:** Your customers are already telling you what to fix — Undertone reads
every review across all your SKUs each month and hands you the report: what's
breaking, what's trending, and the fixes already drafted.

**Buyer:** solo/small-team Shopify merchants ($10K–500K/mo) with 100+ reviews in
Judge.me/Yotpo/Loox and no analyst. Complement to their review app, not a rival.

**Deliverable:** monthly (or on-demand) Voice-of-Customer report: complaint/praise/
feature-request clusters across SKUs, quality-drift trends vs prior period, drafted
product-description edits, supplier/quality alerts, canned responses for recurring
negative themes.

**Pricing (L4-shaped):** $29 one-time first report (low-commitment trial) →
$19/mo (≤500 reviews) or $39/mo (≤2,000) ongoing digests.

**Moat:** cross-period trend memory + drafted actions. Judge.me's free AI summary
is shopper-facing sentiment; nobody ships the merchant-facing ops report.

**Orthogonality vs GuestLoop (4/4):** e-commerce merchants (not creators) ·
App-Store search + long-tail SEO (not communities) · one-time + usage tiers (not
flat prosumer sub) · operations insight (not content marketing).

**Build plan:** Week 1 — Worker + D1 schema, CSV-upload MVP (Judge.me/Yotpo/Loox
exports), Claude clustering pipeline, HTML/PDF report, Lemon Squeezy $29 checkout.
Week 2 — Shopify OAuth read-only (App Store review submitted in parallel, NOT
blocking), trend-delta engine, draft-action generator, SEO landing page.

**Kill criteria (pre-committed, from diligence-round4.md):**
- <10 paid $29 reports from ~500 organic visits in 3 weeks (<2% conversion) → kill/reposition.
- <40% CSV upload completion among first 50 signups → fast-track API pull.
- >30% of pre-sale objections citing "I already have Judge.me/Yotpo" after the
  complement framing → narrow wedge to quality-drift triage only.

**Distribution:** Shopify App Store search (month 2), long-tail SEO ("what are my
customers complaining about shopify"), transparent presence in seller forums.
No spam, no cold DMs. Promo budget only if Undertone wins traction (doctrine).
