// Undertone landing page + waitlist API — Cloudflare Worker
// Waitlist: D1 table `waitlist` (database "undertone").
// CSV-upload MVP: D1 table `reports` (see schema.sql). Mechanical (regex)
// clustering — no LLM key yet — ported from samples/analyze_dresses.py.

import { analyzeReviews, randomId } from './analyzer.js';

const HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Undertone — your reviews already know what to fix</title>
<meta name="description" content="Undertone reads every review across your Shopify store each month and delivers the report: complaint clusters, month-over-month trends, and drafted fixes. $29 first report.">
<meta property="og:type" content="website">
<meta property="og:title" content="Undertone — your reviews already know what to fix">
<meta property="og:description" content="A monthly Voice-of-Customer report for Shopify merchants: complaint clusters per product, trend drift caught early, fixes already drafted. Complement to Judge.me/Yotpo/Loox.">
<meta property="og:image" content="__ORIGIN__/og.png">
<meta property="og:image:width" content="2400">
<meta property="og:image:height" content="1260">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="__ORIGIN__/og.png">
<meta name="twitter:title" content="Undertone — your reviews already know what to fix">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23fbbf24'/%3E%3Cstop offset='1' stop-color='%23fb7185'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='64' height='64' rx='14' fill='%230e0c12'/%3E%3Crect x='14' y='17' width='36' height='6' rx='3' fill='%23382f47'/%3E%3Crect x='14' y='29' width='36' height='6' rx='3' fill='%23382f47'/%3E%3Crect x='14' y='41' width='36' height='6' rx='3' fill='url(%23g)'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap" rel="stylesheet">
<style>
  :root{
    --bg:#0e0c12; --bg2:#121017; --panel:#191621; --panel2:#201c2a; --text:#f4f0f7; --muted:#a99fb5;
    --accent:#fbbf24; --accent2:#fb7185; --border:#2c2637; --border2:#382f47; --good:#4ade80; --bad:#f87171;
    --grad:linear-gradient(90deg,#fbbf24,#fb7185);
  }
  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{background:var(--bg);color:var(--text);font:16px/1.6 Inter,-apple-system,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
  h1,h2,h3,.logo,.amt{font-family:Sora,Inter,sans-serif}
  .wrap{max-width:1080px;margin:0 auto;padding:0 24px}
  section{position:relative}

  nav{display:flex;align-items:center;justify-content:space-between;padding:22px 0}
  .logo{display:flex;align-items:center;gap:10px;font-weight:700;font-size:19px;letter-spacing:-.02em}
  .logo svg{width:24px;height:24px}
  .logo b span{background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent}
  .navcta{font-size:14px;font-weight:600;color:#2b1503;background:var(--grad);border-radius:999px;padding:9px 18px;text-decoration:none}

  .hero{padding:64px 0 30px;text-align:center}
  .hero h1{font-size:clamp(34px,5.6vw,58px);font-weight:800;letter-spacing:-.03em;line-height:1.08;max-width:18ch;margin:0 auto}
  .hero h1 em{font-style:normal;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent}
  .hero .sub{margin:18px auto 0;font-size:18px;color:var(--muted);max-width:54ch}
  .cta{margin:28px auto 0;display:flex;gap:10px;flex-wrap:wrap;justify-content:center;max-width:470px}
  .cta input{flex:1 1 230px;padding:13px 16px;border-radius:12px;border:1px solid var(--border2);background:var(--panel);color:var(--text);font-size:16px}
  .cta input:focus{outline:2px solid var(--accent2);border-color:transparent}
  .cta button{padding:13px 22px;border-radius:12px;border:0;background:var(--grad);color:#2b1503;font-weight:700;font-size:16px;cursor:pointer}
  .cta button:hover{filter:brightness(1.08)}
  .msg{margin-top:10px;font-size:15px;min-height:20px}
  .msg.ok{color:var(--good)}.msg.err{color:#f87171}
  .ghost{display:inline-block;margin-top:12px;color:var(--muted);font-size:15px;text-decoration:none;border-bottom:1px dashed var(--border2)}
  .ghost:hover{color:var(--accent)}
  .ghostRow{display:flex;gap:22px;flex-wrap:wrap;justify-content:center}

  .mock{margin:52px auto 0;max-width:960px;position:relative}
  .glow{position:absolute;inset:-40px -80px;background:radial-gradient(600px 300px at 30% 20%,rgba(251,191,36,.09),transparent 60%),radial-gradient(600px 300px at 75% 80%,rgba(251,113,133,.09),transparent 60%);pointer-events:none}
  .browser{position:relative;background:var(--bg2);border:1px solid var(--border);border-radius:16px;box-shadow:0 30px 80px rgba(0,0,0,.5);overflow:hidden}
  .chrome{display:flex;align-items:center;gap:6px;padding:12px 16px;border-bottom:1px solid var(--border)}
  .dot{width:10px;height:10px;border-radius:50%;background:var(--border2)}
  .chrome .url{margin-left:12px;font-size:12px;color:var(--muted);background:var(--panel);border-radius:6px;padding:4px 12px}
  .stage{display:grid;grid-template-columns:1fr auto 1.35fr;gap:0;align-items:center;padding:34px 30px}
  .revcard{background:var(--panel);border:1px solid var(--border2);border-radius:14px;padding:16px}
  .revcard .lbl{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-bottom:10px}
  .rev{border-bottom:1px solid var(--border);padding:8px 0;font-size:12.5px;color:#d8cfe3}
  .rev:last-child{border-bottom:0}
  .rev .stars{color:var(--accent);font-size:11px;letter-spacing:1px}
  .rev .stars.low{color:var(--bad)}
  .revcard .sum{margin-top:10px;font-size:12px;color:var(--muted)}
  .arrow{padding:0 22px;display:flex;flex-direction:column;align-items:center;gap:6px}
  .arrow .line{width:64px;height:3px;border-radius:2px;background:var(--grad);position:relative}
  .arrow .line::after{content:"";position:absolute;right:-1px;top:-5px;border-left:10px solid #fb7185;border-top:6.5px solid transparent;border-bottom:6.5px solid transparent}
  .arrow .cap{font-size:11px;color:var(--muted);letter-spacing:.06em;text-transform:uppercase}
  .repcard{background:var(--panel2);border:1px solid var(--border2);border-radius:14px;padding:18px;box-shadow:0 18px 44px rgba(0,0,0,.45)}
  .repcard .rh{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
  .repcard .rh b{font-family:Sora;font-size:15px}
  .badge{font-size:10.5px;font-weight:700;letter-spacing:.05em;border:1px solid var(--accent);color:var(--accent);border-radius:999px;padding:3px 10px}
  .theme{display:flex;justify-content:space-between;align-items:center;background:var(--panel);border:1px solid var(--border);border-radius:10px;padding:10px 12px;margin-top:8px;font-size:13px}
  .theme .up{color:var(--bad);font-weight:600;font-size:12px}
  .theme .dn{color:var(--good);font-weight:600;font-size:12px}
  .fix{margin-top:10px;background:rgba(251,191,36,.07);border:1px solid rgba(251,191,36,.3);border-radius:10px;padding:10px 12px;font-size:12.5px;color:#e8dff0}
  .fix b{color:var(--accent);font-size:11px;letter-spacing:.05em;text-transform:uppercase;display:block;margin-bottom:4px}

  .sec{padding:84px 0 0}
  .sec h2{font-size:clamp(24px,3.4vw,34px);font-weight:700;letter-spacing:-.02em;text-align:center}
  .sec .lead{text-align:center;color:var(--muted);max-width:58ch;margin:12px auto 0;font-size:16.5px}
  .kicker{display:block;text-align:center;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent;margin-bottom:12px}

  .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:0;margin-top:44px;position:relative}
  .steps::before{content:"";position:absolute;top:26px;left:16%;right:16%;height:2px;background:var(--grad);opacity:.5}
  .step{text-align:center;padding:0 18px;position:relative}
  .stepN{width:52px;height:52px;border-radius:50%;margin:0 auto;background:var(--panel);border:2px solid var(--accent);display:flex;align-items:center;justify-content:center;font-family:Sora;font-weight:700;color:var(--accent);position:relative;z-index:1}
  .step b{display:block;margin-top:14px;font-size:16px}
  .step p{margin-top:6px;font-size:14px;color:var(--muted)}

  .repWin{max-width:860px;margin:44px auto 0;background:var(--bg2);border:1px solid var(--border);border-radius:16px;overflow:hidden}
  .repHead{display:flex;justify-content:space-between;align-items:center;padding:16px 22px;border-bottom:1px solid var(--border)}
  .repHead b{font-family:Sora;font-size:16px}
  .repBody{padding:22px;display:grid;grid-template-columns:1.1fr .9fr;gap:18px}
  .tbl{width:100%;border-collapse:collapse;font-size:13.5px}
  .tbl th{text-align:left;color:var(--muted);font-size:11px;letter-spacing:.06em;text-transform:uppercase;padding:0 8px 8px 0;font-weight:600}
  .tbl td{border-top:1px solid var(--border);padding:9px 8px 9px 0}
  .tbl .up{color:var(--bad);font-weight:600}
  .tbl .dn{color:var(--good);font-weight:600}
  .drafts .fix{margin-top:0;margin-bottom:10px}
  .exNote{text-align:center;font-size:13px;color:var(--muted);margin-top:16px}

  .memViz{margin:46px auto 0;max-width:760px;background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:34px 30px}
  .epRow{display:flex;align-items:center;justify-content:space-between;position:relative}
  .epRow::before{content:"";position:absolute;left:6%;right:6%;top:50%;border-top:2px dotted var(--border2)}
  .pill{position:relative;z-index:1;background:var(--panel);border:1px solid var(--border2);border-radius:999px;font-size:12.5px;color:var(--muted);padding:7px 14px}
  .pill.hot{border-color:var(--accent);color:var(--accent);box-shadow:0 0 22px rgba(251,191,36,.22)}
  .memNote{margin:26px auto 0;max-width:560px;background:var(--panel2);border:1px solid var(--border2);border-left:3px solid var(--accent);border-radius:12px;padding:14px 18px;font-size:14px;color:#e8dff0}
  .memNote small{display:block;margin-top:6px;color:var(--muted)}

  .who{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:44px}
  .whoCard{background:var(--panel);border:1px solid var(--border);border-radius:14px;padding:22px;transition:border-color .2s}
  .whoCard:hover{border-color:var(--accent)}
  .whoCard .ic{font-size:22px}
  .whoCard b{display:block;margin-top:10px;font-size:15.5px}
  .whoCard p{margin-top:6px;font-size:13.5px;color:var(--muted)}

  .honest{margin-top:44px;background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:30px;display:grid;grid-template-columns:auto 1fr;gap:20px;align-items:center;max-width:820px;margin-left:auto;margin-right:auto}
  .honest .mark{width:52px;height:52px;border-radius:14px;background:var(--grad);display:flex;align-items:center;justify-content:center}
  .honest .mark svg{width:30px;height:30px}
  .honest p{font-size:15.5px;color:#e8dff0}
  .honest small{display:block;margin-top:8px;color:var(--muted);font-size:13.5px}

  .tiers{display:grid;grid-template-columns:repeat(2,minmax(240px,300px));gap:18px;justify-content:center;margin-top:44px}
  .tier{background:var(--panel);border:1px solid var(--border);border-radius:16px;padding:26px}
  .tier.rec{border:1.5px solid transparent;background:linear-gradient(var(--panel),var(--panel)) padding-box,var(--grad) border-box}
  .tier .name{font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
  .amt{font-size:38px;font-weight:800;margin-top:8px}
  .amt small{font-size:15px;color:var(--muted);font-weight:400}
  .tier ul{list-style:none;margin-top:16px}
  .tier li{padding:5px 0;color:var(--muted);font-size:14.5px}
  .tier li::before{content:"✓  ";color:var(--accent)}
  .pause{text-align:center;color:var(--muted);font-size:14px;margin-top:18px}
  .pause b{color:var(--text)}

  .faq{max-width:720px;margin:44px auto 0}
  .faq details{background:var(--panel);border:1px solid var(--border);border-radius:12px;padding:16px 18px;margin-bottom:10px}
  .faq summary{cursor:pointer;font-weight:600;font-size:15.5px}
  .faq p{margin-top:10px;color:var(--muted);font-size:14.5px}

  .final{margin:90px 0 0;padding:56px 24px;text-align:center;background:linear-gradient(180deg,transparent,rgba(251,191,36,.05));border-top:1px solid var(--border)}
  .final h2{font-size:clamp(24px,3.4vw,32px)}

  footer{border-top:1px solid var(--border);padding:26px 0 44px;color:var(--muted);font-size:13.5px}
  footer .ai{margin-top:6px;max-width:70ch}

  @media (max-width:860px){
    .stage{grid-template-columns:1fr;gap:18px}
    .arrow{flex-direction:row;padding:0}
    .arrow .line{width:40px}
    .repBody,.who,.steps{grid-template-columns:1fr}
    .steps{gap:26px}.steps::before{display:none}
    .tiers{grid-template-columns:1fr}
    .honest{grid-template-columns:1fr}
    .epRow{flex-wrap:wrap;gap:8px}.epRow::before{display:none}
  }
</style>
</head>
<body>
<div class="wrap">
  <nav>
    <div class="logo"><svg viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="ug" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbbf24"/><stop offset="1" stop-color="#fb7185"/></linearGradient></defs><rect x="10" y="14" width="44" height="7" rx="3.5" fill="#382f47"/><rect x="10" y="28" width="44" height="7" rx="3.5" fill="#382f47"/><rect x="10" y="42" width="44" height="7" rx="3.5" fill="url(#ug)"/></svg><b>Under<span>tone</span></b></div>
    <a class="navcta" href="#join">Join early access</a>
  </nav>

  <section class="hero">
    <h1>Your reviews already know <em>what to fix.</em></h1>
    <p class="sub">Undertone reads every review across your store each month and hands you the report: what's breaking, what's trending — and the fixes, already drafted. For Shopify merchants using Judge.me, Yotpo or Loox.</p>
    <form class="cta" id="wl">
      <input type="email" id="email" name="email" placeholder="you@yourstore.com" required autocomplete="email">
      <input type="text" name="company" id="hp" style="display:none" tabindex="-1" autocomplete="off">
      <button type="submit">Join early access</button>
    </form>
    <div class="msg" id="msg"></div>
    <div class="ghostRow">
      <a class="ghost" href="#report">or see what a report looks like ↓</a>
      <a class="ghost" href="/app">or analyze your reviews free →</a>
    </div>

    <div class="mock">
      <div class="glow"></div>
      <div class="browser">
        <div class="chrome"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="url">undertone · monthly voice-of-customer report</span></div>
        <div class="stage">
          <div class="revcard">
            <div class="lbl">Your reviews this month</div>
            <div class="rev"><span class="stars low">★★☆☆☆</span> "Runs small — had to return for a size up…"</div>
            <div class="rev"><span class="stars">★★★★★</span> "The linen quality is unreal for the price…"</div>
            <div class="rev"><span class="stars low">★★☆☆☆</span> "Stitching came loose after two washes…"</div>
            <div class="sum">+ 213 more across 32 products</div>
          </div>
          <div class="arrow"><div class="line"></div><div class="cap">monthly</div></div>
          <div class="repcard">
            <div class="rh"><b>August report</b><span class="badge">3 actions drafted</span></div>
            <div class="theme"><span>Sizing runs small — Linen Shirt</span><span class="up">41 mentions ↑ 32%</span></div>
            <div class="theme"><span>Stitching durability — new batch</span><span class="up">17 mentions ↑ new</span></div>
            <div class="theme"><span>"Quality for the price"</span><span class="dn">88 mentions ↑ praise</span></div>
            <div class="fix"><b>Drafted fix · product page</b>"Fits snug — most customers size up. See the size guide."</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="sec">
    <span class="kicker">How it works</span>
    <h2>Upload your reviews. Get the report.</h2>
    <div class="steps">
      <div class="step"><div class="stepN">1</div><b>Export from your review app</b><p>A 2-minute CSV export from Judge.me, Yotpo or Loox. Shopify connect coming next.</p></div>
      <div class="step"><div class="stepN">2</div><b>Undertone clusters & compares</b><p>Every theme tracked per product, month over month — praise, complaints, requests.</p></div>
      <div class="step"><div class="stepN">3</div><b>Your report arrives</b><p>Issues ranked by trend, drafted description fixes, supplier alerts, response templates.</p></div>
    </div>
  </section>

  <section class="sec" id="report">
    <span class="kicker">The deliverable</span>
    <h2>An analyst's monthly report. Without the analyst.</h2>
    <p class="lead">Real output below â generated from 6,145 genuine dress reviews in a public-domain dataset (23,486 real, anonymized reviews of a real apparel retailer). Every count and quote is reproducible from the data.</p>
    <div class="repWin">
      <div class="repHead"><b>Voice of Customer â Dresses</b><span class="badge">6,145 real reviews</span></div>
      <div class="repBody">
        <div>
          <table class="tbl">
            <tr><th>Theme</th><th>Mentions</th><th>Share</th></tr>
            <tr><td>Sizing inconsistency (runs large + small)</td><td>233</td><td class="up">15.4% of critical</td></tr>
            <tr><td>Unflattering silhouette / cut</td><td>150</td><td class="up">9.9% of critical</td></tr>
            <tr><td>Cheap / poor-quality fabric</td><td>134</td><td class="up">8.9% of critical</td></tr>
            <tr><td>Zipper defects (broken, won't close)</td><td>86</td><td class="up">5.7% of critical</td></tr>
            <tr><td>Praise: flattering / great fit</td><td>1,454</td><td class="dn">31.4% of positive</td></tr>
          </table>
        </div>
        <div class="drafts">
          <div class="fix"><b>Drafted description edit</b>"Fit note: this style runs [large/small] through the [bust/waist]. Reviewers who found it snug recommend sizing up." â addressing the 233-mention sizing cluster.</div>
          <div class="fix"><b>Supplier alert</b>Zipper defects: 86 independent reports of the identical failure mode ("won't even zip up on the hanger") â a QC signal, not a sizing issue. Inspect zipper hardware before the next production run.</div>
          <div class="fix"><b>Response template</b>"A few customers told us this style runs [large/small], so we've updated the fit notes. I'd love to get you the right size â free exchange or full refund, your pick."</div>
        </div>
      </div>
    </div>
    <p class="exNote">Sample from the CC0 Women’s Clothing E-Commerce Reviews dataset; Undertone is not affiliated with the retailer. Every quote verified verbatim against the source data. Reports arrive as a web page + PDF — nothing shopper-facing.</p>
  </section>

  <section class="sec">
    <span class="kicker">The difference</span>
    <h2>Dashboards score sentiment. Undertone tracks change.</h2>
    <p class="lead">Your review app tells you today's rating. Undertone remembers every month — so drift gets caught while it's one bad batch, not one bad quarter.</p>
    <div class="memViz">
      <div class="epRow">
        <span class="pill">May · baseline</span>
        <span class="pill">June · clear</span>
        <span class="pill">July · restock</span>
        <span class="pill hot">Aug · drift caught</span>
      </div>
      <div class="memNote">"Stitching complaints started with the July restock and tripled in August — the batch is the problem, not the product."<small>← only visible with month-over-month memory</small></div>
    </div>
  </section>

  <section class="sec">
    <span class="kicker">Built for</span>
    <h2>Stores with reviews nobody has time to read.</h2>
    <div class="who">
      <div class="whoCard"><div class="ic">🧵</div><b>Solo store owners</b><p>You are the analyst. Undertone gives you the hour back.</p></div>
      <div class="whoCard"><div class="ic">📦</div><b>Small teams, no analyst</b><p>100+ reviews a month is signal — if anyone could read them all.</p></div>
      <div class="whoCard"><div class="ic">🧰</div><b>Agencies with client stores</b><p>A branded monthly VoC report per client, generated not written.</p></div>
    </div>
    <div class="honest">
      <div class="mark"><svg viewBox="0 0 64 64"><rect x="12" y="16" width="40" height="6" rx="3" fill="#2b1503" opacity=".45"/><rect x="12" y="29" width="40" height="6" rx="3" fill="#2b1503" opacity=".45"/><rect x="12" y="42" width="40" height="6" rx="3" fill="#2b1503"/></svg></div>
      <div>
        <p>Undertone is brand new — no testimonials yet, on purpose. The example report above is exactly the shape of what you get. If that's not worth $29 once, don't subscribe to anything.</p>
        <small>Built and operated autonomously by an AI, supervised by its human owner — which is why reading 2,000 reviews a month costs you almost nothing.</small>
      </div>
    </div>
  </section>

  <section class="sec">
    <span class="kicker">Pricing</span>
    <h2>Try it once for $29. Subscribe only if it earns it.</h2>
    <div class="tiers">
      <div class="tier rec"><div class="name">First report</div><div class="amt">$29<small> one-time</small></div><ul><li>Full report on your current reviews</li><li>Up to 2,000 reviews processed</li><li>Drafted fixes included</li><li>No subscription required</li></ul></div>
      <div class="tier"><div class="name">Monthly digest</div><div class="amt">$19–39<small>/mo</small></div><ul><li>Report every month, automatically</li><li>Month-over-month trend memory</li><li>Tiered by review volume</li><li>Cancel anytime — reports are yours</li></ul></div>
    </div>
    <p class="pause">Slow season? <b>Skip a month</b> — your trend history is kept.</p>
  </section>

  <section class="sec">
    <span class="kicker">Honest questions</span>
    <h2>Asked and answered.</h2>
    <div class="faq">
      <details><summary>I already have Judge.me / Yotpo — why this?</summary><p>Keep them — they collect reviews and show shopper-facing widgets. Undertone is the merchant-facing layer they don't do: the monthly ops report with trend memory and drafted fixes. Complement, not replacement.</p></details>
      <details><summary>Isn't this just ChatGPT with my reviews pasted in?</summary><p>For 20 reviews, sure. For 500+ across dozens of SKUs, with month-over-month deltas and per-product clustering — that's a pipeline with memory, not a prompt.</p></details>
      <details><summary>How do you get my reviews?</summary><p>You export a CSV from your review app (2 minutes) and upload it. Direct Shopify connect is being submitted for App Store review and comes next.</p></details>
      <details><summary>What happens to my data?</summary><p>Your reviews are processed for your report only, never shared or used elsewhere, deleted on request.</p></details>
    </div>
  </section>
</div>

<div class="final" id="join">
  <div class="wrap">
    <h2>Find out what your customers keep <em style="font-style:normal;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent">trying to tell you.</em></h2>
    <form class="cta" id="wl2">
      <input type="email" id="email2" placeholder="you@yourstore.com" required autocomplete="email">
      <button type="submit">Join early access</button>
    </form>
    <div class="msg" id="msg2"></div>
    <p class="pause" style="margin-top:14px">Early-access members get their first report free. One launch email, nothing else.</p>
  </div>
</div>

<footer>
  <div class="wrap">
    <div>© 2026 Undertone</div>
    <div class="ai">Transparency: Undertone is built and operated autonomously by an AI, supervised by its human owner. No fake testimonials, no invented numbers — the example report is labeled as illustrative until a real public-data sample replaces it.</div>
  </div>
</footer>

<script>
function wire(formId, emailId, msgId){
  document.getElementById(formId).addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById(msgId);
    const email = document.getElementById(emailId).value.trim();
    const hp = (document.getElementById('hp')||{}).value || '';
    msg.className = 'msg'; msg.textContent = '…';
    try {
      const r = await fetch('/api/waitlist', {method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({email, hp})});
      const j = await r.json();
      if (j.ok) { msg.className='msg ok'; msg.textContent = "You're on the list. One email at launch."; e.target.reset(); }
      else { msg.className='msg err'; msg.textContent = j.error || 'Something went wrong — try again?'; }
    } catch { msg.className='msg err'; msg.textContent = 'Network hiccup — try again?'; }
  });
}
wire('wl','email','msg'); wire('wl2','email2','msg2');
<\/script>
</body>
</html>
`;

const APP_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Undertone — analyze your reviews free</title>
<meta name="description" content="Upload a Judge.me, Yotpo or Loox review export and get a free early-access Voice-of-Customer report: complaint clusters, praise themes, and drafted fixes.">
<meta name="robots" content="noindex">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23fbbf24'/%3E%3Cstop offset='1' stop-color='%23fb7185'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='64' height='64' rx='14' fill='%230e0c12'/%3E%3Crect x='14' y='17' width='36' height='6' rx='3' fill='%23382f47'/%3E%3Crect x='14' y='29' width='36' height='6' rx='3' fill='%23382f47'/%3E%3Crect x='14' y='41' width='36' height='6' rx='3' fill='url(%23g)'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap" rel="stylesheet">
<style>
  :root{
    --bg:#0e0c12; --bg2:#121017; --panel:#191621; --panel2:#201c2a; --text:#f4f0f7; --muted:#a99fb5;
    --accent:#fbbf24; --accent2:#fb7185; --border:#2c2637; --border2:#382f47; --good:#4ade80; --bad:#f87171;
    --grad:linear-gradient(90deg,#fbbf24,#fb7185);
  }
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:var(--bg);color:var(--text);font:16px/1.6 Inter,-apple-system,sans-serif;-webkit-font-smoothing:antialiased}
  h1,h2,h3,.logo{font-family:Sora,Inter,sans-serif}
  .wrap{max-width:760px;margin:0 auto;padding:0 24px}
  nav{display:flex;align-items:center;justify-content:space-between;padding:22px 0}
  .logo{display:flex;align-items:center;gap:10px;font-weight:700;font-size:19px;letter-spacing:-.02em;text-decoration:none;color:var(--text)}
  .logo svg{width:24px;height:24px}
  .logo b span{background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent}
  .navcta{font-size:14px;font-weight:600;color:var(--muted);text-decoration:none;border-bottom:1px dashed var(--border2)}
  .hero{padding:28px 0 8px}
  .kicker{display:block;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent;margin-bottom:12px}
  .hero h1{font-size:clamp(28px,4.6vw,42px);font-weight:800;letter-spacing:-.03em;line-height:1.12}
  .hero h1 em{font-style:normal;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent}
  .hero .sub{margin:14px 0 0;font-size:16px;color:var(--muted);max-width:60ch}
  .panel{margin:30px 0 60px;background:var(--panel);border:1px solid var(--border2);border-radius:16px;padding:28px}
  .field{display:block;margin-bottom:18px}
  .field .lbl{display:block;font-size:12.5px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--muted);margin-bottom:8px}
  .field input[type=email]{width:100%;padding:13px 14px;border-radius:10px;border:1px solid var(--border2);background:var(--bg2);color:var(--text);font-size:15.5px}
  .field input[type=email]:focus{outline:2px solid var(--accent2);border-color:transparent}
  .filebox{border:1.5px dashed var(--border2);border-radius:12px;padding:22px;text-align:center;background:var(--bg2)}
  .filebox input[type=file]{display:block;margin:0 auto;color:var(--muted);font-size:14px;max-width:100%}
  .filebox .fname{margin-top:10px;font-size:13.5px;color:var(--accent)}
  .hint{margin-top:16px;font-size:13.5px;color:var(--muted);background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:12px 14px}
  .hint b{color:#e8dff0}
  button.go{margin-top:20px;width:100%;padding:14px 22px;border-radius:12px;border:0;background:var(--grad);color:#2b1503;font-weight:700;font-size:16px;cursor:pointer}
  button.go:hover{filter:brightness(1.08)}
  button.go:disabled{opacity:.6;cursor:default;filter:none}
  .msg{margin-top:14px;font-size:14.5px;min-height:20px}
  .msg.ok{color:var(--good)}.msg.err{color:#f87171}.msg.warn{color:var(--accent)}
  .privacy{margin-top:10px;font-size:12.5px;color:var(--muted)}
  footer{border-top:1px solid var(--border);padding:26px 0 44px;color:var(--muted);font-size:13.5px}
</style>
</head>
<body>
<div class="wrap">
  <nav>
    <a class="logo" href="/"><svg viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="ug" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbbf24"/><stop offset="1" stop-color="#fb7185"/></linearGradient></defs><rect x="10" y="14" width="44" height="7" rx="3.5" fill="#382f47"/><rect x="10" y="28" width="44" height="7" rx="3.5" fill="#382f47"/><rect x="10" y="42" width="44" height="7" rx="3.5" fill="url(#ug)"/></svg><b>Under<span>tone</span></b></a>
    <a class="navcta" href="/">← back to home</a>
  </nav>

  <section class="hero">
    <span class="kicker">Free · early access</span>
    <h1>Upload your reviews. <em>See what they're really telling you.</em></h1>
    <p class="sub">Export a CSV from Judge.me, Yotpo, or Loox — or any review app — and Undertone clusters the complaints, praise, and requests. This early-access tier runs a mechanical (regex-based) analyzer, so it's free while the AI deep-clustering tier is built. Your report is saved to a link tied to your email.</p>
  </section>

  <div class="panel">
    <form id="analyzeForm">
      <label class="field">
        <span class="lbl">Your email</span>
        <input type="email" id="email" required placeholder="you@yourstore.com" autocomplete="email">
      </label>
      <label class="field">
        <span class="lbl">Reviews CSV</span>
        <div class="filebox">
          <input type="file" id="csvFile" accept=".csv,text/csv" required>
          <div class="fname" id="fname"></div>
        </div>
      </label>
      <div class="hint">
        <b>Accepted formats:</b> Judge.me export, Yotpo export, Loox export, or any CSV with a review-text column and a rating column (1–5 stars). A product/title column is optional but unlocks per-product breakdowns. Columns are auto-detected from the header row. Up to 5,000 rows per report — need at least 20 usable reviews.
      </div>
      <button type="submit" class="go" id="goBtn">Analyze my reviews</button>
      <div class="msg" id="msg"></div>
      <p class="privacy">Processed for your report only, never shared. This report joins Undertone's early-access waitlist — one launch email, nothing else.</p>
    </form>
  </div>
</div>

<footer>
  <div class="wrap">
    <div>© 2026 Undertone</div>
  </div>
</footer>

<script>
(function () {
  var MAX_ROWS = 5000;
  var MIN_ROWS = 20;

  function parseCSV(text) {
    var rows = [];
    var field = '';
    var row = [];
    var inQuotes = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; }
          else { inQuotes = false; }
        } else {
          field += c;
        }
      } else if (c === '"') {
        inQuotes = true;
      } else if (c === ',') {
        row.push(field); field = '';
      } else if (c === '\\r') {
        // skip; \\n (below) closes the row for both \\n and \\r\\n
      } else if (c === '\\n') {
        row.push(field); field = ''; rows.push(row); row = [];
      } else {
        field += c;
      }
    }
    if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
    return rows.filter(function (r) { return !(r.length === 1 && r[0] === ''); });
  }

  function findColumn(headers, priorityPatterns, claimed) {
    for (var p = 0; p < priorityPatterns.length; p++) {
      for (var h = 0; h < headers.length; h++) {
        if (claimed.indexOf(h) !== -1) continue;
        if (priorityPatterns[p].test(headers[h])) return h;
      }
    }
    return -1;
  }

  function detectColumns(headers) {
    var claimed = [];
    var reviewPatterns = [
      /^review[\\s_-]*text$/i, /^review[\\s_-]*body$/i, /^body$/i, /^content$/i,
      /^review[\\s_-]*content$/i, /^comment(s)?$/i, /^text$/i,
      /review/i, /description/i
    ];
    var ratingPatterns = [/^rating$/i, /^stars?$/i, /^score$/i, /rating/i, /star/i, /score/i];
    var productPatterns = [
      /^product[\\s_-]*title$/i, /^product[\\s_-]*name$/i, /^item[\\s_-]*name$/i,
      /^product$/i, /product/i, /item/i, /sku/i, /^title$/i, /^name$/i
    ];
    var reviewIdx = findColumn(headers, reviewPatterns, claimed);
    if (reviewIdx !== -1) claimed.push(reviewIdx);
    var ratingIdx = findColumn(headers, ratingPatterns, claimed);
    if (ratingIdx !== -1) claimed.push(ratingIdx);
    var productIdx = findColumn(headers, productPatterns, claimed);
    return { reviewIdx: reviewIdx, ratingIdx: ratingIdx, productIdx: productIdx };
  }

  var form = document.getElementById('analyzeForm');
  var msg = document.getElementById('msg');
  var goBtn = document.getElementById('goBtn');
  var fileInput = document.getElementById('csvFile');
  var fname = document.getElementById('fname');

  fileInput.addEventListener('change', function () {
    fname.textContent = fileInput.files[0] ? fileInput.files[0].name : '';
  });

  function setMsg(cls, text) {
    msg.className = 'msg ' + cls;
    msg.textContent = text;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = document.getElementById('email').value.trim();
    var file = fileInput.files[0];
    if (!file) { setMsg('err', 'Choose a CSV file first.'); return; }

    goBtn.disabled = true;
    setMsg('', 'Reading your file…');

    var reader = new FileReader();
    reader.onerror = function () {
      goBtn.disabled = false;
      setMsg('err', 'Could not read that file — try again?');
    };
    reader.onload = function () {
      try {
        var table = parseCSV(String(reader.result || ''));
        if (table.length < 2) throw new Error('That CSV looks empty.');
        var headers = table[0].map(function (h) { return String(h || '').trim(); });
        var cols = detectColumns(headers);
        if (cols.reviewIdx === -1) throw new Error('Could not find a review-text column. Rename it to "Review Text" or "Body" and try again.');
        if (cols.ratingIdx === -1) throw new Error('Could not find a rating column. Rename it to "Rating" or "Stars" and try again.');

        var rows = [];
        for (var i = 1; i < table.length; i++) {
          var r = table[i];
          var review = (r[cols.reviewIdx] || '').trim();
          var rating = (r[cols.ratingIdx] || '').trim();
          var product = cols.productIdx !== -1 ? (r[cols.productIdx] || '').trim() : '';
          if (!review || !rating) continue;
          rows.push({ review: review, rating: rating, product: product });
        }

        var note = '';
        if (rows.length > MAX_ROWS) {
          note = 'Using the first ' + MAX_ROWS.toLocaleString() + ' of ' + rows.length.toLocaleString() + ' rows (that is the per-report cap). ';
          rows = rows.slice(0, MAX_ROWS);
        }
        if (rows.length < MIN_ROWS) {
          goBtn.disabled = false;
          setMsg('err', 'Found only ' + rows.length + ' usable rows — need at least ' + MIN_ROWS + ' reviews with text and a rating.');
          return;
        }

        setMsg('warn', note + 'Analyzing ' + rows.length.toLocaleString() + ' reviews…');

        fetch('/api/analyze', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ email: email, filename: file.name, rows: rows })
        }).then(function (r) { return r.json(); }).then(function (j) {
          if (j.ok) {
            setMsg('ok', 'Report ready — redirecting…');
            window.location.href = '/report/' + j.id;
          } else {
            goBtn.disabled = false;
            setMsg('err', j.error || 'Something went wrong — try again?');
          }
        }).catch(function () {
          goBtn.disabled = false;
          setMsg('err', 'Network hiccup — try again?');
        });
      } catch (err) {
        goBtn.disabled = false;
        setMsg('err', err.message || 'Could not parse that CSV.');
      }
    };
    reader.readAsText(file);
  });
})();
<\/script>
</body>
</html>
`;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/waitlist' && request.method === 'POST') {
      let body;
      try { body = await request.json(); } catch { return json({ ok: false, error: 'Bad request' }, 400); }
      if (body.hp) return json({ ok: true });
      const email = String(body.email || '').trim().toLowerCase();
      if (!EMAIL_RE.test(email) || email.length > 254) return json({ ok: false, error: 'That email does not look right.' }, 400);
      await env.DB.prepare('INSERT OR IGNORE INTO waitlist (email, ts, ua, ref, country) VALUES (?1, ?2, ?3, ?4, ?5)')
        .bind(email, new Date().toISOString(), request.headers.get('user-agent') || '', request.headers.get('referer') || '', request.cf && request.cf.country || '').run();
      return json({ ok: true });
    }

    if (url.pathname === '/api/waitlist/count') {
      const row = await env.DB.prepare('SELECT COUNT(*) AS n FROM waitlist').first();
      return json({ ok: true, count: row ? row.n : 0 });
    }

    if (url.pathname === '/app' && request.method === 'GET') {
      return new Response(APP_HTML, { headers: { 'content-type': 'text/html;charset=utf-8', 'cache-control': 'no-store' } });
    }

    if (url.pathname === '/api/analyze' && request.method === 'POST') {
      let body;
      try { body = await request.json(); } catch { return json({ ok: false, error: 'Bad request' }, 400); }

      const email = String(body.email || '').trim().toLowerCase();
      if (!EMAIL_RE.test(email) || email.length > 254) return json({ ok: false, error: 'That email does not look right.' }, 400);

      const rows = body.rows;
      if (!Array.isArray(rows) || rows.length === 0) return json({ ok: false, error: 'No rows received — check your CSV.' }, 400);
      if (rows.length > 5000) return json({ ok: false, error: 'Too many rows — cap is 5,000 reviews per report.' }, 400);

      let report;
      try {
        report = analyzeReviews(rows);
      } catch (err) {
        return json({ ok: false, error: (err && err.message) || 'Could not analyze this file.' }, 400);
      }

      const id = randomId();
      const createdTs = new Date().toISOString();
      await env.DB.prepare('INSERT INTO reports (id, email, created_ts, review_count, report_json) VALUES (?1, ?2, ?3, ?4, ?5)')
        .bind(id, email, createdTs, report.meta.totalReviews, JSON.stringify(report)).run();
      await env.DB.prepare('INSERT OR IGNORE INTO waitlist (email, ts, ua, ref, country) VALUES (?1, ?2, ?3, ?4, ?5)')
        .bind(email, createdTs, request.headers.get('user-agent') || '', 'app-upload', (request.cf && request.cf.country) || '').run();

      return json({ ok: true, id });
    }

    const reportMatch = url.pathname.match(/^\/report\/([a-f0-9]{16,64})$/i);
    if (reportMatch && request.method === 'GET') {
      const id = reportMatch[1].toLowerCase();
      const row = await env.DB.prepare('SELECT id, created_ts, review_count, report_json FROM reports WHERE id = ?1').bind(id).first();
      if (!row) return new Response(renderNotFound(), { status: 404, headers: { 'content-type': 'text/html;charset=utf-8' } });
      let report = null;
      try { report = JSON.parse(row.report_json); } catch { report = null; }
      if (!report) return new Response(renderNotFound(), { status: 404, headers: { 'content-type': 'text/html;charset=utf-8' } });
      return new Response(renderReportPage(report, row), { headers: { 'content-type': 'text/html;charset=utf-8', 'cache-control': 'no-store' } });
    }

    if (url.pathname === '/health') return json({ ok: true });

    return new Response(HTML.replaceAll('__ORIGIN__', url.origin), { headers: { 'content-type': 'text/html;charset=utf-8', 'cache-control': 'public, max-age=300' } });
  }
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const REPORT_STYLE = `
  :root{
    --bg:#0e0c12; --bg2:#121017; --panel:#191621; --panel2:#201c2a; --text:#f4f0f7; --muted:#a99fb5;
    --accent:#fbbf24; --accent2:#fb7185; --border:#2c2637; --border2:#382f47; --good:#4ade80; --bad:#f87171;
    --grad:linear-gradient(90deg,#fbbf24,#fb7185);
  }
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:var(--bg);color:var(--text);font:16px/1.6 Inter,-apple-system,sans-serif;-webkit-font-smoothing:antialiased}
  h1,h2,h3,.logo{font-family:Sora,Inter,sans-serif}
  .wrap{max-width:900px;margin:0 auto;padding:0 24px}
  nav{display:flex;align-items:center;justify-content:space-between;padding:22px 0}
  .logo{display:flex;align-items:center;gap:10px;font-weight:700;font-size:19px;letter-spacing:-.02em;text-decoration:none;color:var(--text)}
  .logo svg{width:24px;height:24px}
  .logo b span{background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent}
  .navcta{font-size:14px;font-weight:600;color:#2b1503;background:var(--grad);border-radius:999px;padding:9px 18px;text-decoration:none}
  .repHead{padding:20px 0 8px}
  .kicker{display:block;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent;margin-bottom:10px}
  h1{font-size:clamp(24px,4vw,34px);font-weight:800;letter-spacing:-.02em}
  .stats{display:flex;gap:12px;flex-wrap:wrap;margin-top:16px}
  .stat{background:var(--panel);border:1px solid var(--border2);border-radius:12px;padding:12px 16px;min-width:130px}
  .stat b{display:block;font-family:Sora;font-size:22px}
  .stat span{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em}
  .early{margin-top:18px;background:var(--panel2);border:1px solid var(--border2);border-left:3px solid var(--accent);border-radius:10px;padding:12px 16px;font-size:13.5px;color:#e8dff0}
  .sec{margin-top:38px}
  .sec h2{font-size:19px;font-weight:700;margin-bottom:14px}
  .tbl{width:100%;border-collapse:collapse;font-size:14px;background:var(--panel);border:1px solid var(--border);border-radius:12px;overflow:hidden}
  .tbl th{text-align:left;color:var(--muted);font-size:11px;letter-spacing:.06em;text-transform:uppercase;padding:10px 12px;font-weight:600;background:var(--bg2)}
  .tbl td{border-top:1px solid var(--border);padding:10px 12px}
  .tbl .n{color:var(--bad);font-weight:600;white-space:nowrap}
  .tbl.praise .n{color:var(--good)}
  .tbl .prod{font-size:12px;color:var(--muted);margin-top:2px}
  .quotes{margin-top:18px;display:grid;gap:14px}
  .qcard{background:var(--panel);border:1px solid var(--border);border-radius:12px;padding:16px 18px}
  .qcard .qtheme{font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--accent);margin-bottom:10px}
  .qcard blockquote{border-left:2px solid var(--border2);padding-left:12px;margin:0 0 10px;font-size:14.5px;color:#e8dff0}
  .qcard blockquote:last-child{margin-bottom:0}
  .qcard .qmeta{font-size:12px;color:var(--muted);margin-top:4px}
  .actions{display:grid;gap:12px;margin-top:14px}
  .fix{background:rgba(251,191,36,.07);border:1px solid rgba(251,191,36,.3);border-radius:10px;padding:14px 16px;font-size:14px;color:#e8dff0}
  .fix b{color:var(--accent);font-size:11px;letter-spacing:.05em;text-transform:uppercase;display:block;margin-bottom:6px}
  .fix.alert{background:rgba(251,113,133,.08);border-color:rgba(251,113,133,.35)}
  .fix.alert b{color:var(--accent2)}
  .cta{margin:44px 0 60px;background:var(--panel2);border:1px solid var(--border2);border-radius:16px;padding:26px;text-align:center}
  .cta h3{font-size:18px;margin-bottom:8px}
  .cta p{color:var(--muted);font-size:14px;margin-bottom:16px}
  .cta a.btn{display:inline-block;padding:12px 22px;border-radius:10px;background:var(--grad);color:#2b1503;font-weight:700;text-decoration:none;font-size:15px}
  footer{border-top:1px solid var(--border);padding:26px 0 44px;color:var(--muted);font-size:13.5px}
  .empty{color:var(--muted);font-size:14px;font-style:italic}
`;

const LOGO_SVG = '<svg viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="ug" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbbf24"/><stop offset="1" stop-color="#fb7185"/></linearGradient></defs><rect x="10" y="14" width="44" height="7" rx="3.5" fill="#382f47"/><rect x="10" y="28" width="44" height="7" rx="3.5" fill="#382f47"/><rect x="10" y="42" width="44" height="7" rx="3.5" fill="url(#ug)"/></svg>';

function renderThemeRows(themes, cohortLabel, cls) {
  if (!themes.length) return `<tr><td colspan="3" class="empty">No matching themes found in this batch.</td></tr>`;
  return themes.map((t) => {
    const products = t.topProducts && t.topProducts.length
      ? `<div class="prod">Top: ${t.topProducts.map((p) => `${esc(p.name)} (${p.count})`).join(', ')}</div>`
      : '';
    return `<tr><td>${esc(t.label)}${products}</td><td class="n">${t.count}</td><td>${t.pct}% of ${cohortLabel}</td></tr>`;
  }).join('');
}

function renderQuoteCards(themes) {
  const withQuotes = themes.filter((t) => t.quotes && t.quotes.length).slice(0, 3);
  if (!withQuotes.length) return '<p class="empty">No representative quotes to show.</p>';
  return withQuotes.map((t) => {
    const bq = t.quotes.map((q) => {
      const meta = [q.rating ? `${q.rating}★` : '', q.product ? esc(q.product) : ''].filter(Boolean).join(' · ');
      return `<blockquote>“${esc(q.text)}”<div class="qmeta">${meta}</div></blockquote>`;
    }).join('');
    return `<div class="qcard"><div class="qtheme">${esc(t.label)} (${t.count} mentions)</div>${bq}</div>`;
  }).join('');
}

function renderActions(actions) {
  if (!actions.length) return '<p class="empty">No drafted actions — no significant complaint clusters found in this batch.</p>';
  return actions.map((a) => {
    const cls = a.type === 'supplier-alert' ? 'fix alert' : 'fix';
    return `<div class="${cls}"><b>${esc(a.title)}</b>${esc(a.body)}</div>`;
  }).join('');
}

function renderReportPage(report, row) {
  const m = report.meta;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Undertone — Voice-of-Customer report</title>
<meta name="robots" content="noindex">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap" rel="stylesheet">
<style>${REPORT_STYLE}</style>
</head>
<body>
<div class="wrap">
  <nav>
    <a class="logo" href="/">${LOGO_SVG}<b>Under<span>tone</span></b></a>
    <a class="navcta" href="/app">New report</a>
  </nav>

  <div class="repHead">
    <span class="kicker">Voice-of-customer report</span>
    <h1>What your reviews are telling you</h1>
    <div class="stats">
      <div class="stat"><b>${m.totalReviews.toLocaleString()}</b><span>Reviews analyzed</span></div>
      <div class="stat"><b>${m.criticalCount.toLocaleString()}</b><span>Critical (≤3★)</span></div>
      <div class="stat"><b>${m.positiveCount.toLocaleString()}</b><span>Positive (≥4★)</span></div>
      <div class="stat"><b>${report.actions.length}</b><span>Actions drafted</span></div>
    </div>
    <div class="early">Early-access report — generated by Undertone's mechanical (regex) analyzer. The AI deep-clustering tier arrives at launch, with month-over-month trend memory and per-SKU breakdowns.</div>
  </div>

  <div class="sec">
    <h2>Complaint themes <span style="color:var(--muted);font-weight:400;font-size:14px">(critical reviews, ${m.criticalCount.toLocaleString()})</span></h2>
    <table class="tbl">
      <tr><th>Theme</th><th>Mentions</th><th>Share</th></tr>
      ${renderThemeRows(report.complaintThemes, 'critical', 'n')}
    </table>
  </div>

  <div class="sec">
    <h2>Praise themes <span style="color:var(--muted);font-weight:400;font-size:14px">(positive reviews, ${m.positiveCount.toLocaleString()})</span></h2>
    <table class="tbl praise">
      <tr><th>Theme</th><th>Mentions</th><th>Share</th></tr>
      ${renderThemeRows(report.praiseThemes, 'positive', 'n')}
    </table>
  </div>

  ${report.requestThemes.length ? `<div class="sec">
    <h2>Requests mentioned <span style="color:var(--muted);font-weight:400;font-size:14px">(all reviews)</span></h2>
    <table class="tbl">
      <tr><th>Theme</th><th>Mentions</th><th>Share</th></tr>
      ${renderThemeRows(report.requestThemes, 'all reviews', 'n')}
    </table>
  </div>` : ''}

  <div class="sec">
    <h2>Representative quotes</h2>
    <div class="quotes">${renderQuoteCards(report.complaintThemes)}</div>
  </div>

  <div class="sec">
    <h2>Drafted actions</h2>
    <div class="actions">${renderActions(report.actions)}</div>
  </div>

  <div class="cta">
    <h3>Want this every month, with trend memory?</h3>
    <p>Early-access members get notified first when monthly digests and AI deep-clustering launch. Share this report, or run another one free.</p>
    <a class="btn" href="/app">Analyze another CSV</a>
  </div>
</div>

<footer>
  <div class="wrap">
    <div>© 2026 Undertone</div>
    <div style="margin-top:6px">Report ${esc(row.id)} · generated ${esc(m.generatedAt)}</div>
  </div>
</footer>
</body>
</html>
`;
}

function renderNotFound() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Report not found — Undertone</title>
<meta name="robots" content="noindex">
<style>
  :root{--bg:#0e0c12;--text:#f4f0f7;--muted:#a99fb5;--accent:#fbbf24;--accent2:#fb7185;--grad:linear-gradient(90deg,#fbbf24,#fb7185)}
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:var(--bg);color:var(--text);font:16px/1.6 Inter,-apple-system,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px}
  h1{font-size:28px;margin-bottom:10px}
  p{color:var(--muted);margin-bottom:20px}
  a{color:#2b1503;background:var(--grad);border-radius:999px;padding:11px 20px;text-decoration:none;font-weight:700}
</style>
</head>
<body>
  <div>
    <h1>Report not found</h1>
    <p>This report link doesn't exist, or has expired. Reports aren't deleted automatically today, so double-check the link — or run a new one.</p>
    <a href="/app">Analyze your reviews</a>
  </div>
</body>
</html>
`;
}
