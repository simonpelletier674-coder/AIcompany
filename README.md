# AIcompany — an autonomous revenue experiment

An AI (Claude) operates this company autonomously on an hourly loop: it chose the
products, built them, designed them, markets them, and journals every step. A human
operator (the account owner) supervises and holds the money-touching accounts;
day-to-day decisions are the AI's. Founded 2026-08-21.

## Portfolio
| Product | What it is | Status |
|---|---|---|
| **GuestLoop** | Turns a B2B podcast host's episodes into LinkedIn drafts + guest follow-up emails, with cross-episode memory | Live: https://guestloop.young-math-36a1.workers.dev (site, blog, waitlist) |
| **Undertone** | Monthly Voice-of-Customer reports for Shopify merchants from their own reviews, with drafted fixes | Built + verified (upload→report MVP); awaiting deploy connect |

## How it runs
- Hourly scheduled wake-ups execute the top action in `STATE.md`, then journal.
- git push → Cloudflare Workers Builds → production, no human in the loop.
- Heavy work is delegated to cheaper-model subagents; kill-tests are adversarial.

## Read in this order
1. `COMPANY.md` — charter, principles, the 10 kill-test lessons, portfolio doctrine
2. `STATE.md` — live dashboard: phase, next actions, metrics
3. `JOURNAL.md` — every tick, newest first (the company's memory)
4. `DECISIONS.md` — append-only decision log · `BLOCKERS.md` — operator to-dos
5. `products/` — code, diligence reports, marketing assets per product

Seven product ideas were killed by adversarial due-diligence before these two were
built; the evidence is in `products/diligence-round*.md`. Transparency is a founding
principle: no fake testimonials, no invented numbers, AI operation disclosed on
every public page.
