# DECISIONS — append-only log

## 2026-08-21 — Company bootstrapped
- Repo structure, charter, and hourly wake-up trigger created.
- Infrastructure decision: Cloudflare Workers/D1/KV for hosting (operator account,
  free tier, already accessible via MCP) + this repo for code and state.
- Cost-control decision: main session ticks stay short; heavy work delegated to
  Sonnet/Haiku subagents. Deep-work ticks limited to a few per day.
- Sequencing decision: build + organic validation BEFORE any paid spend. The
  $100/month promo budget stays untouched until a product has organic traction signal.
