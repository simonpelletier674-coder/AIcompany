# 10 Micro-Product Ideas — Scored & Ranked

Research date: 2026-08-21 (tick 1, Sonnet research subagent). All ideas assume: solo-AI-agent MVP build in <1 week, Cloudflare Workers/D1/KV free tier hosting, Gumroad/Lemon Squeezy checkout, organic-first distribution, zero human support desk.

---

## 1. CrawlCheck — AI Crawler Access Auditor

**Pitch:** Paste a domain, instantly see whether GPTBot, ClaudeBot, PerplexityBot, Google-Extended, and friends are blocked by your robots.txt/CDN rules, plus an auto-generated `llms.txt` and crawler-policy diff.

**Target user & pain:** Marketing/SEO folks and indie site owners who don't know if they've accidentally blocked AI crawlers (or want to deliberately block them) and have no single place to check across 15+ known bot user-agents.

**Monetization:** Free single-domain check. $7/mo or $49 one-time for: scheduled re-checks + email alert on change, multi-domain (up to 10), and a shareable audit-report PDF for agencies to send clients.

**First distribution channel:** r/SEO and r/TechSEO threads about "llms.txt" and "GPTBot blocking"; Hacker News "Show HN"; long-tail SEO keywords ("is GPTBot blocked on my site", "llms.txt checker", "AI crawler audit").

**Competition snapshot:** Several free llms.txt *generators* exist (Apify's, Mintlify/CMS plugins, browser tools). Almost none combine a live bot-blocking *auditor* (crawl + interpret robots.txt/CF rules against real bot UA list) with monitoring/alerts — that's the gap, not the generator itself.

**Scores:** Buildable 5, CF fit 5, Payment-light 5, Organic marketability 4, Defensibility 2, Low support 5 — **Total 26/30**

**Biggest risk:** Generator tools could bolt on an auditor feature and commoditize this in a quarter.

---

## 2. DomainAuth Lite — Dead-Simple DMARC/SPF/DKIM Monitor

**Pitch:** One-domain email-authentication monitor built for solo founders and small businesses who just need to know "did my DMARC break" — no dashboard bloat, no per-message metering.

**Target user & pain:** Solo founders/small biz owners sending cold email or transactional mail who get flagged as spam and don't know why; existing tools are priced/scoped for IT teams (dmarcian $19.99/mo+, DDMARC $29/mo).

**Monetization:** Free one-time scan. $6/mo per domain for weekly re-scan + email alert when SPF/DKIM/DMARC records change or fail — deliberately undercutting the $15-35/mo incumbents.

**First distribution channel:** r/emailmarketing, r/SaaS, r/indiehackers threads on deliverability; keywords "DMARC checker free", "why is my email going to spam small business"; Indie Hackers "I built" post.

**Competition snapshot:** Crowded space (Dmarcian, DDMARC, DMARCwise, Postmark digests, several free checkers) but nearly all pricing starts at $15-35/mo aimed at IT/security teams. Room for a $6/mo "just tell me if it's broken" product for non-technical solo operators.

**Scores:** Buildable 4, CF fit 5, Payment-light 5, Organic marketability 3, Defensibility 2, Low support 4 — **Total 23/30**

**Biggest risk:** Incumbents' free tiers (Postmark's free digest) already satisfy the exact "just tell me" use case, capping willingness to pay.

---

## 3. CronCraft API — Cron Expression Builder & Explainer, as an API

**Pitch:** A tiny hosted API that parses/validates cron expressions, returns plain-English descriptions and next N run times — the thing crontab.guru does in a browser, but callable from your app/CI pipeline.

**Target user & pain:** Developers building admin panels, scheduling UIs, or internal tools who need "next run" / "explain this cron" logic and don't want to vendor a parsing library or maintain timezone edge cases themselves.

**Monetization:** Free tier 100 req/day via API key. $9/mo for 20k req/day + timezone-aware output; $19/mo for 200k req/day.

**First distribution channel:** r/webdev and r/node "scheduling UI" threads; dev.to post "I got tired of writing cron parsers, so I made an API"; keywords "cron expression API", "cron to human readable API".

**Competition snapshot:** crontab.guru is free but browser-only with no public API/rate-tiered access; a few npm libraries (cron-parser, cronstrue) exist but require self-hosting/maintenance. Room for a maintained hosted API a small SaaS can just call.

**Scores:** Buildable 5, CF fit 5, Payment-light 5, Organic marketability 3, Defensibility 2, Low support 5 — **Total 25/30**

**Biggest risk:** Trivially replaceable by a dev vendoring the free npm library themselves in 10 minutes — value-add must be the hosted/maintained convenience, which is a thin moat.

---

## 4. SchemaSync — JSON Schema → Zod/Pydantic/TS/Go, as a CI Action

**Pitch:** A GitHub Action + API that keeps Zod, Pydantic, TypeScript, and Go types automatically in sync with a canonical JSON Schema on every push — not another one-off browser converter.

**Target user & pain:** Small dev teams with a shared API contract (JSON Schema/OpenAPI) who manually regenerate types in 2-4 languages and let them drift; existing tools are all single-use browser converters, not CI-integrated.

**Monetization:** Free for public repos / 1 schema. $12/mo for private repos, multiple schemas, and Slack notification on drift.

**First distribution channel:** r/typescript, r/programming "schema drift" pain posts; GitHub Marketplace listing; keywords "keep zod schema in sync with json schema CI", "openapi to pydantic github action".

**Competition snapshot:** Free browser tools and CLI libs (datamodel-code-generator, quicktype) already do one-shot conversion for free. The CI-integrated "stays in sync automatically, alerts on drift" workflow angle is not directly served by any of them.

**Scores:** Buildable 4, CF fit 4, Payment-light 4, Organic marketability 3, Defensibility 3, Low support 4 — **Total 22/30**

**Biggest risk:** Free tools cover 80% of the actual use case (one-off conversion); the recurring-sync value prop may be too niche to find enough paying teams.

---

## 5. ProrateTuition — Daycare/Preschool Tuition & Sibling-Discount Calculator

**Pitch:** A calculator built specifically for childcare center directors and office admins: mid-month enrollment proration, multi-child sibling discounts, and a branded PDF invoice — done in 60 seconds instead of a spreadsheet.

**Target user & pain:** Daycare/preschool office administrators (not parents) who manually calculate prorated first/last-month tuition and sibling discounts in Excel for every new enrollment and re-derive the formula each time.

**Monetization:** Free calculator, $19 one-time unlock for PDF/branded invoice export + saved center profile (rates, discount policy) so repeat calculations take one click.

**First distribution channel:** r/daycare, r/ECEProfessionals, childcare-director Facebook groups; keywords "prorated tuition calculator daycare", "daycare sibling discount calculator".

**Competition snapshot:** A few parent-facing "estimate my cost" calculators exist (Bloomily, TuitionCalc, ChildcareCostFinder) but they're built for parents comparing centers, not for center admins generating an actual invoice with their own rate table and discount rules — genuinely underserved angle.

**Scores:** Buildable 5, CF fit 5, Payment-light 5, Organic marketability 3, Defensibility 3, Low support 5 — **Total 26/30**

**Biggest risk:** Total addressable market is small (independent center admins, not chains with existing billing software), capping revenue ceiling even if conversion is good.

---

## 6. BakerScale — Recipe Scaler & Baker's-Percentage Converter

**Pitch:** Paste a recipe, scale it to any batch size or pan dimension, convert between volume/weight/baker's percentages, and export a clean printable PDF card.

**Target user & pain:** Food bloggers and small home-bakery owners who need to resize recipes for custom orders or convert US-volume recipes to weight/baker's-percentage for consistency, and currently do it by hand or in a spreadsheet.

**Monetization:** Free scaling/conversion in-browser. $15 one-time for PDF export pack + recipe library (save/reuse up to 50 recipes) or $5/mo for bakery owners scaling many recipes weekly.

**First distribution channel:** r/Baking, r/AskBaking, r/breadit; food-blogger Facebook groups; keywords "recipe scaler baker's percentage", "convert recipe to weight calculator".

**Competition snapshot:** Generic unit converters exist broadly; dedicated baker's-percentage scaling tools with clean PDF export are thin on the ground and mostly buried in bread-specific niche apps. Room for a fast, general-purpose, well-SEO'd version.

**Scores:** Buildable 5, CF fit 5, Payment-light 5, Organic marketability 4, Defensibility 2, Low support 5 — **Total 26/30**

**Biggest risk:** Low willingness-to-pay in a hobbyist audience — most users will be satisfied with the free tier and never convert.

---

## 7. NL2Regex API — Plain-English-to-Regex Generator API

**Pitch:** An API that turns a plain-English description ("match a US phone number, optional country code") into a tested, explained regex pattern with unit tests, for embedding in IDE plugins, forms builders, or internal tools.

**Target user & pain:** Developers and no-code/low-code tool builders who need regex generation as a backend feature but don't want to prompt-engineer and validate an LLM call themselves for every request.

**Monetization:** Free 20 req/day. $9/mo for 2k req/day with response caching; $19/mo for 10k req/day + custom test-case validation.

**First distribution channel:** r/webdev, r/SideProject ("built an API so you never write regex again"); Product Hunt launch; keywords "english to regex API", "regex generator API for developers".

**Competition snapshot:** regex101.com and similar are free, huge, and browser-only with no API. Several "AI regex generator" web widgets exist (single-use, no API/rate tiers). A maintained, cached, rate-tiered API for embedding into other products is a real, if narrow, gap.

**Scores:** Buildable 4, CF fit 4, Payment-light 5, Organic marketability 3, Defensibility 2, Low support 4 — **Total 22/30**

**Biggest risk:** Underlying capability is "call an LLM with a prompt" — any competitor (or the customer themselves) can replicate it in an afternoon, so the product lives or dies on caching/reliability/convenience alone.

---

## 8. ScopeGuard — Change Order & Scope-Creep Addendum Generator

**Pitch:** Freelance developers/designers describe the extra work a client is asking for outside the original contract; ScopeGuard generates a signable change-order addendum (extra cost, extra timeline, client-initials clause) as a PDF/link in under a minute.

**Target user & pain:** Freelance devs, designers, and small agencies who eat scope creep because pausing to draft a formal change order feels like more friction than just doing the extra work — so they never protect themselves.

**Monetization:** $19 one-time for 10 generated addendums, or $9/mo unlimited + e-signature-request link (via a simple email-based sign flow, no fulfillment).

**First distribution channel:** r/freelance, r/webdev, r/agency; Indie Hackers; keywords "change order template freelance", "how to charge for scope creep".

**Competition snapshot:** Generic contract-template sites (Bonsai, downloadable Word templates) exist but none focus narrowly on the "5-minute mid-project addendum" moment — most require setting up a whole client/invoicing system first.

**Scores:** Buildable 5, CF fit 5, Payment-light 5, Organic marketability 3, Defensibility 2, Low support 5 — **Total 25/30**

**Biggest risk:** Generated legal-adjacent documents create liability/quality expectations that are hard to fully satisfy with a template generator — risk of "this addendum wasn't valid in my state" complaints even without a support desk.

---

## 9. LocalAI Visibility Report — AI Search Citation Snapshot for Local Businesses

**Pitch:** Enter a local business + city, get a one-off PDF report showing whether/how it's mentioned when ChatGPT, Perplexity, and Google AI Overviews are asked "best [category] in [city]" — built for local SEO consultants to resell to clients, not an ongoing dashboard.

**Target user & pain:** Local SEO freelancers/agencies who want to show clients "here's your current AI visibility" as a sales or reporting artifact, but don't want (or can't afford) a full enterprise AI-monitoring platform subscription.

**Monetization:** $29 one-time per report (single business, ~15 query variants, live LLM API calls at generation time — no persistent monitoring infra). $99/mo for agencies generating up to 20 reports/month, white-labeled.

**First distribution channel:** r/SEO, r/LocalSEO, r/juststart; Facebook local-SEO agency groups; keywords "AI visibility report local business", "does ChatGPT recommend my business".

**Competition snapshot:** Well-funded ongoing-tracking platforms exist (Ahrefs Brand Radar, LLM Pulse, Scrunch AI) but they're subscription dashboards aimed at brand marketers. A cheap, one-off, resellable *report* for the long-tail local-agency market is a different product shape.

**Scores:** Buildable 3, CF fit 4, Payment-light 5, Organic marketability 3, Defensibility 1, Low support 4 — **Total 20/30**

**Biggest risk:** Direct collision course with well-funded competitors who could ship a "one-off report" SKU in a week; LLM API call costs per report also eat into the thin margin at $29.

---

## 10. PulseWatch — Hosted, No-Setup Status Page for Solo SaaS Founders

**Pitch:** A branded status page + uptime pinger that's live in under 2 minutes with no GitHub account, no YAML config, and no self-hosting — for indie founders who want Instatus-style polish without Instatus pricing.

**Target user & pain:** Solo/indie SaaS founders who need a public status page for trust/compliance but find free open-source options (Upptime, CState) require GitHub/Git familiarity and ongoing maintenance they don't want to own.

**Monetization:** Free for 1 monitor + shared subdomain. $5/mo for custom domain, 5 monitors, and email/webhook alerts on downtime.

**First distribution channel:** r/SaaS, r/indiehackers "show off your stack" threads; keywords "simple status page indie developer", "cheap statuspage alternative".

**Competition snapshot:** Crowded on the free/open-source side (Upptime, UptimeFlare — itself CF-Workers-native, CState, Tinystatus) and on the paid side (Instatus, Hyperping). The differentiator has to be zero-setup hosted convenience — a real but narrow wedge.

**Scores:** Buildable 4, CF fit 5, Payment-light 5, Organic marketability 2, Defensibility 1, Low support 4 — **Total 21/30**

**Biggest risk:** UptimeFlare is already free, open-source, and Cloudflare-Workers-native — nearly identical positioning at zero cost — makes conversion from free-tier users very hard.

---

## Ranked Top 3

| Rank | Idea | Total /30 |
|---|---|---|
| 1 (tie) | CrawlCheck — AI Crawler Access Auditor | 26 |
| 1 (tie) | ProrateTuition — Daycare Tuition Calculator | 26 |
| 1 (tie) | BakerScale — Recipe Scaler & Baker's-Percentage Converter | 26 |
| 4 | CronCraft API | 25 |
| 4 | ScopeGuard | 25 |

## The Bet (research subagent's recommendation)

**Bet on CrawlCheck (AI Crawler Access Auditor).** It rides a genuinely current, rising search trend (AI-crawler policy is a live, unresolved question every site owner has right now, unlike the evergreen-but-flat demand behind BakerScale or the small-TAM ceiling on ProrateTuition), it's pure static-analysis logic with zero per-customer judgment calls, and the free-tier check itself is the exact hook that drives Reddit/HN sharing — paid conversion (scheduled monitoring + alerts) is a natural, low-friction upsell once someone's had one unpleasant surprise. The defensibility is thin, but a week's head start with decent SEO on "llms.txt checker" long-tail terms is enough runway to prove out demand before anyone bothers copying it.

> Final selection happens in tick 2 after independent validation of the top 3 (demand signals, competition depth). This recommendation is input, not the decision.
