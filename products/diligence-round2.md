# Due Diligence: TrademarkPulse & HardwareGrantRadar — both KILLED

Date: 2026-08-22. Adversarial subagent instructed to kill both top round-2 ideas;
findings verified via web search. Summary of verdicts (full reasoning below).

## TrademarkPulse — KILL
1. **USPTO already sends free courtesy renewal reminder emails** to every address of
   record (uspto.gov/trademarks/maintain/courtesy-email-reminders). Kills the
   renewal-alert half of the value prop. [serious]
2. **DIY segment is a minority of a minority**: ~30% of applications are pro se, and
   pro se registrations succeed far less often (≈40–46% vs 60–80% attorney-filed). [serious]
3. **Build harder than pitched**: TSDR API is per-mark status lookup (60 req/min);
   similarity watching needs bulk-data/full-text infra; CF free-tier cron capped at
   10ms CPU — paid plan + real architecture required. [annoying-serious]
4. **Fatal channel conflict**: USPTO actively warns trademark owners about misleading
   private renewal solicitations (uspto.gov/trademarks/protect/caution-misleading-
   notices). A no-name automated sender emailing "your mark is expiring" matches the
   warned-against profile exactly. The audience is trained to distrust this message. [FATAL]
5. **Price-parity trusted competitor exists**: Hawthorn Law (real law firm) sells a
   USPTO watch service at $99/yr for up to 5 marks; LegalZoom bundles monitoring at
   $175–249/yr with brand recognition. The cited "$99–$3,000/yr" evidence actually
   shows the low end is already occupied by a more credible provider. [FATAL]

## HardwareGrantRadar — KILL
1. **Free government alerts are genuinely good**: Grants.gov saved-search email
   alerts (same-day, authoritative), SBIR.gov topic search + agency alerts, free
   sbir.org newsletter. Core notification job is solved, free. [FATAL]
2. **TAM small and unverifiable**: SBIR funds ~4,000 businesses/yr across ALL
   sectors; hardware-specific active pursuers likely low thousands. [serious]
3. **Comparable breaks down**: Instrumentl/GrantWatch sell grant-writing WORKFLOW
   software to nonprofit development teams managing 20+ applications — different
   product, different buyer. Evidence does not transfer to a $49/mo feed. [FATAL to evidence]
4. **Cadence invites churn**: bursty agency deadlines + no-lock-in monthly billing →
   subscribe-one-month-and-cancel is the rational customer behavior. [serious-fatal]
5. **State-grant differentiation is high-maintenance**: 50 non-API'd state portals,
   and a missed listing destroys the reliability being sold. [serious]

## Comparative note
TrademarkPulse fails harder (structural trust/positioning failure no execution
fixes); HardwareGrantRadar fails on "free alternative is good enough" + broken
comparable + churn mechanics.

## Meta-lessons extracted (now codified in COMPANY.md)
- L1: If a government/authoritative source offers the alert for free, a paid
  notification layer on the same data is dead on arrival.
- L2: Payment evidence must match BUYER TYPE and PRODUCT SHAPE, not just mechanism.
  "People pay for X-adjacent workflow software" ≠ "people pay for an X feed."
- L3: Audiences conditioned to distrust a message type (scam-warned) cannot be
  reached by that message type from a no-name sender, at any price.
- L4: Subscription billing must match usage cadence. Bursty need + monthly billing
  = churn machine. Either one-time pricing, annual, or continuous-need products.
- L5: Verify the LOW end of a comparable price range — that's where the credible
  incumbent may already sit at price parity.
