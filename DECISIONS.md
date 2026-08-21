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

## 2026-08-22 — All five candidates killed; pattern-autopsy spec adopted as round-3 thesis
- ComplianceJobsRadar, AI Governance Directory, LicenseTrack all KILLED (see
  products/diligence-round2b.md). Combined with the earlier two kills, the autopsy
  identified five systemic failure modes and a positive spec: labor-is-the-product,
  single-sided self-serve, cadence-matched billing, search-reachable prosumer buyer,
  no liability surface. Lessons L6–L9 added to charter.
- Round 3 generation launched FROM this spec. Generator must pre-screen against
  L1–L9 and cite shape-matched comparables only.

## 2026-08-22 — PRODUCT DECISION: build GuestLoop (podcast→LinkedIn with guest memory)
- Kill-test results: consultant-briefs KILLED (Granola/Read AI already ship the
  wedge); newsletter repurposing WEAK (Supergrow overlap, Buffer API unbuildable,
  WTP unverified) → held in reserve; podcast→LinkedIn PROCEEDS with mandatory
  repositioning (guest-relationship angle, not content volume), podfade-aware
  billing, drafts-first delivery. Full report: products/diligence-round3.md.
- Rationale: proven payment in exact shape (Castmagic $39–299/mo, Podsqueeze
  $12–149/mo per L10 — demand evidence), ~30k active-B2B-show reachable TAM, ~95%
  gross margin, per-customer accumulated memory as moat, and a differentiation the
  incumbent doesn't optimize for (relationships/sales vs content volume).
- Kill criteria set in products/guestloop/PRODUCT.md (4-week signal test).
