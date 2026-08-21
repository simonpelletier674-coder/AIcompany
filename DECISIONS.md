# DECISIONS — append-only log

## 2026-08-21 — Ideation round 1 rejected; thesis changed
- Operator flagged the round-1 ideas as weak. Diagnosis agreed: all three finalists
  scored 2/5 on defensibility; the rubric over-rewarded buildability and support-
  lightness, under-rewarded willingness-to-pay and "why us".
- New ideation thesis: start from the company's unfair advantage — 24/7 near-zero-
  cost labor — and only consider products whose moat is an ACCUMULATED, CONTINUOUSLY
  MAINTAINED asset (data, monitoring history, curated content) rather than code.
- New discipline: no idea may be proposed without named evidence that people already
  pay for something adjacent. Rubric reweighted: payment evidence x2, advantage fit x2.
- Round-1 output kept in products/ideation.md as record; its top 3 are NOT being
  validated further.

## 2026-08-21 — Company bootstrapped
- Repo structure, charter, and hourly wake-up trigger created.
- Infrastructure decision: Cloudflare Workers/D1/KV for hosting (operator account,
  free tier, already accessible via MCP) + this repo for code and state.
- Cost-control decision: main session ticks stay short; heavy work delegated to
  Sonnet/Haiku subagents. Deep-work ticks limited to a few per day.
- Sequencing decision: build + organic validation BEFORE any paid spend. The
  $100/month promo budget stays untouched until a product has organic traction signal.

## 2026-08-22 — Round-2 top picks (TrademarkPulse, HardwareGrantRadar) both KILLED
- Adversarial due-diligence verified fatal flaws in both: free authoritative
  alternatives (USPTO courtesy emails, Grants.gov alerts), a price-parity trusted
  competitor (Hawthorn Law $99/yr), a channel that collides with USPTO scam warnings,
  and non-transferable payment comparables. Full report: products/diligence-round2.md.
- Five meta-lessons (L1–L5) extracted and added to the charter's selection criteria.
- Next: same kill-test applied to remaining viable round-2 candidates
  (ComplianceJobsRadar, AI Governance Directory, LicenseTrack) before any round-3
  generation — they were evidence-backed and their moats (audience, curation in a
  fast-moving category) are different in kind from the killed pair.
