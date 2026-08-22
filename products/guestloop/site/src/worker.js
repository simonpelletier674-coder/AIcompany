// GuestLoop landing page + waitlist API — Cloudflare Worker
// Waitlist: D1 table `waitlist` (primary) + KV copy (backup). __ORIGIN__ is
// replaced with the request origin at serve time (absolute OG image URLs).

const HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>GuestLoop — every episode becomes a week of content</title>
<meta name="description" content="GuestLoop turns every podcast episode into five ready-to-post LinkedIn drafts plus guest follow-up emails — and remembers your whole back catalog, so nothing gets repeated or forgotten.">
<meta property="og:type" content="website">
<meta property="og:title" content="GuestLoop — one episode in, a week of LinkedIn out">
<meta property="og:description" content="AI that listens to your whole podcast, remembers every guest and open thread, and drafts your LinkedIn week plus guest follow-up emails — with cross-episode callbacks no one-off tool can write.">
<meta property="og:image" content="__ORIGIN__/og.png">
<meta property="og:image:width" content="2400">
<meta property="og:image:height" content="1260">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="__ORIGIN__/og.png">
<meta name="twitter:title" content="GuestLoop — one episode in, a week of LinkedIn out">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%235eead4'/%3E%3Cstop offset='1' stop-color='%2338bdf8'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='64' height='64' rx='14' fill='%230e1116'/%3E%3Cpath d='M32 12a20 20 0 1 1-14.1 5.9' fill='none' stroke='url(%23g)' stroke-width='7' stroke-linecap='round'/%3E%3Ccircle cx='32' cy='32' r='6' fill='url(%23g)'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap" rel="stylesheet">
<style>
  :root{
    --bg:#0b0e13; --bg2:#0e1117; --panel:#141922; --panel2:#1a212c; --text:#eef2f7; --muted:#94a1b2;
    --accent:#5eead4; --accent2:#38bdf8; --border:#242d3a; --border2:#2e3948; --good:#4ade80;
    --grad:linear-gradient(90deg,#5eead4,#38bdf8);
  }
  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{background:var(--bg);color:var(--text);font:16px/1.6 Inter,-apple-system,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
  h1,h2,h3,.logo,.amt{font-family:Sora,Inter,sans-serif}
  .wrap{max-width:1080px;margin:0 auto;padding:0 24px}
  section{position:relative}

  /* nav */
  nav{display:flex;align-items:center;justify-content:space-between;padding:22px 0}
  .logo{display:flex;align-items:center;gap:9px;font-weight:700;font-size:19px;letter-spacing:-.02em}
  .logo svg{width:25px;height:25px}
  .logo b{font-weight:700}.logo b span{color:var(--accent)}
  .navcta{font-size:14px;font-weight:600;color:#08222b;background:var(--grad);border-radius:999px;padding:9px 18px;text-decoration:none}

  /* hero */
  .hero{padding:64px 0 30px;text-align:center}
  .hero h1{font-size:clamp(34px,5.6vw,58px);font-weight:800;letter-spacing:-.03em;line-height:1.08;max-width:17ch;margin:0 auto}
  .hero h1 em{font-style:normal;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent}
  .hero .sub{margin:18px auto 0;font-size:18px;color:var(--muted);max-width:52ch}
  .cta{margin:28px auto 0;display:flex;gap:10px;flex-wrap:wrap;justify-content:center;max-width:470px}
  .cta input{flex:1 1 230px;padding:13px 16px;border-radius:12px;border:1px solid var(--border2);background:var(--panel);color:var(--text);font-size:16px}
  .cta input:focus{outline:2px solid var(--accent2);border-color:transparent}
  .cta button{padding:13px 22px;border-radius:12px;border:0;background:var(--grad);color:#08222b;font-weight:700;font-size:16px;cursor:pointer}
  .cta button:hover{filter:brightness(1.08)}
  .msg{margin-top:10px;font-size:15px;min-height:20px}
  .msg.ok{color:var(--good)}.msg.err{color:#f87171}
  .ghost{display:inline-block;margin-top:12px;color:var(--muted);font-size:15px;text-decoration:none;border-bottom:1px dashed var(--border2)}
  .ghost:hover{color:var(--accent)}

  /* hero mockup */
  .mock{margin:52px auto 0;max-width:960px;position:relative}
  .glow{position:absolute;inset:-40px -80px;background:radial-gradient(600px 300px at 30% 20%,rgba(94,234,212,.10),transparent 60%),radial-gradient(600px 300px at 75% 80%,rgba(56,189,248,.10),transparent 60%);pointer-events:none}
  .browser{position:relative;background:var(--bg2);border:1px solid var(--border);border-radius:16px;box-shadow:0 30px 80px rgba(0,0,0,.5);overflow:hidden}
  .chrome{display:flex;align-items:center;gap:6px;padding:12px 16px;border-bottom:1px solid var(--border)}
  .dot{width:10px;height:10px;border-radius:50%;background:#2e3948}
  .chrome .url{margin-left:12px;font-size:12px;color:var(--muted);background:var(--panel);border-radius:6px;padding:4px 12px}
  .stage{display:grid;grid-template-columns:1fr auto 1.35fr;gap:0;align-items:center;padding:34px 30px}
  .epcard{background:var(--panel);border:1px solid var(--border2);border-radius:14px;padding:18px}
  .epcard .lbl{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-bottom:10px}
  .wave{display:flex;align-items:flex-end;gap:3px;height:44px;margin-bottom:12px}
  .wave i{flex:1;background:var(--grad);border-radius:2px;opacity:.85}
  .epcard .t{font-weight:600;font-size:14.5px;line-height:1.4}
  .epcard .m{font-size:12.5px;color:var(--muted);margin-top:4px}
  .arrow{padding:0 22px;display:flex;flex-direction:column;align-items:center;gap:6px}
  .arrow .line{width:64px;height:3px;border-radius:2px;background:var(--grad);position:relative}
  .arrow .line::after{content:"";position:absolute;right:-1px;top:-5px;border-left:10px solid #38bdf8;border-top:6.5px solid transparent;border-bottom:6.5px solid transparent}
  .arrow .cap{font-size:11px;color:var(--muted);letter-spacing:.06em;text-transform:uppercase}
  .fan{position:relative;height:280px}
  .liCard,.emCard{position:absolute;border-radius:14px;box-shadow:0 18px 44px rgba(0,0,0,.45)}
  .liCard{left:0;top:6px;width:66%;background:var(--panel2);border:1px solid var(--border2);padding:16px;transform:rotate(-2.2deg);z-index:2}
  .liHead{display:flex;gap:10px;align-items:center;margin-bottom:10px}
  .av{width:38px;height:38px;border-radius:50%;background:var(--grad);display:flex;align-items:center;justify-content:center;font-weight:700;color:#08222b;font-size:15px}
  .liHead .n{font-weight:600;font-size:14px}
  .liHead .r{font-size:12px;color:var(--muted)}
  .liBody{font-size:13.5px;line-height:1.55;color:#dbe3ec}
  .liFoot{display:flex;gap:16px;margin-top:12px;padding-top:10px;border-top:1px solid var(--border);font-size:12px;color:var(--muted)}
  .emCard{right:0;top:96px;width:58%;background:var(--panel);border:1px solid var(--border2);transform:rotate(1.8deg);z-index:3}
  .emHead{border-bottom:1px solid var(--border);padding:12px 16px;font-size:12.5px;color:var(--muted)}
  .emHead b{color:var(--text);font-weight:600}
  .emBody{padding:14px 16px;font-size:13px;line-height:1.55;color:#dbe3ec}
  .tag{position:absolute;z-index:4;right:16px;top:64px;background:#0b0e13;border:1px solid var(--accent);color:var(--accent);border-radius:999px;font-size:11px;font-weight:600;padding:5px 12px;letter-spacing:.04em}

  /* sections */
  .sec{padding:84px 0 0}
  .sec h2{font-size:clamp(24px,3.4vw,34px);font-weight:700;letter-spacing:-.02em;text-align:center}
  .sec .lead{text-align:center;color:var(--muted);max-width:56ch;margin:12px auto 0;font-size:16.5px}
  .kicker{display:block;text-align:center;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent;margin-bottom:12px}

  /* how it works */
  .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:0;margin-top:44px;position:relative}
  .steps::before{content:"";position:absolute;top:26px;left:16%;right:16%;height:2px;background:var(--grad);opacity:.5}
  .step{text-align:center;padding:0 18px;position:relative}
  .stepN{width:52px;height:52px;border-radius:50%;margin:0 auto;background:var(--panel);border:2px solid var(--accent);display:flex;align-items:center;justify-content:center;font-family:Sora;font-weight:700;color:var(--accent);position:relative;z-index:1}
  .step b{display:block;margin-top:14px;font-size:16px}
  .step p{margin-top:6px;font-size:14px;color:var(--muted)}

  /* proof */
  .proofGrid{display:grid;grid-template-columns:1.15fr .85fr;gap:20px;margin-top:44px;align-items:start}
  .proofCard{background:var(--panel2);border:1px solid var(--border2);border-radius:16px;padding:20px}
  .proofNote{font-size:13px;color:var(--muted);text-align:center;margin-top:18px}
  .proofNote a{color:var(--accent);text-decoration:none}
  .emWin{background:var(--panel);border:1px solid var(--border2);border-radius:16px;overflow:hidden}
  .liBig .liBody{font-size:14.5px}
  .liBig .liBody p{margin-top:10px}
  .liBig .liBody p:first-child{margin-top:0}
  .memchip{display:inline-flex;align-items:center;gap:6px;background:rgba(94,234,212,.08);border:1px solid rgba(94,234,212,.35);color:var(--accent);font-size:11.5px;font-weight:600;border-radius:999px;padding:4px 11px;margin-bottom:12px}
  .memchip i{width:6px;height:6px;border-radius:50%;background:var(--accent)}

  /* memory */
  .memViz{margin:46px auto 0;max-width:760px;background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:34px 30px}
  .epRow{display:flex;align-items:center;justify-content:space-between;position:relative}
  .epRow::before{content:"";position:absolute;left:6%;right:6%;top:50%;border-top:2px dotted var(--border2)}
  .pill{position:relative;z-index:1;background:var(--panel);border:1px solid var(--border2);border-radius:999px;font-size:12.5px;color:var(--muted);padding:7px 14px}
  .pill.hot{border-color:var(--accent);color:var(--accent);box-shadow:0 0 22px rgba(94,234,212,.25)}
  .memNote{margin:26px auto 0;max-width:520px;background:var(--panel2);border:1px solid var(--border2);border-left:3px solid var(--accent);border-radius:12px;padding:14px 18px;font-size:14px;color:#dbe3ec}
  .memNote small{display:block;margin-top:6px;color:var(--muted)}

  /* who */
  .who{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:44px}
  .whoCard{background:var(--panel);border:1px solid var(--border);border-radius:14px;padding:22px;transition:border-color .2s}
  .whoCard:hover{border-color:var(--accent)}
  .whoCard .ic{font-size:22px}
  .whoCard b{display:block;margin-top:10px;font-size:15.5px}
  .whoCard p{margin-top:6px;font-size:13.5px;color:var(--muted)}

  /* honest */
  .honest{margin-top:44px;background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:30px;display:grid;grid-template-columns:auto 1fr;gap:20px;align-items:center;max-width:820px;margin-left:auto;margin-right:auto}
  .honest .mark{width:52px;height:52px;border-radius:14px;background:var(--grad);display:flex;align-items:center;justify-content:center}
  .honest .mark svg{width:32px;height:32px}
  .honest p{font-size:15.5px;color:#dbe3ec}
  .honest small{display:block;margin-top:8px;color:var(--muted);font-size:13.5px}

  /* pricing */
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

  /* faq */
  .faq{max-width:720px;margin:44px auto 0}
  .faq details{background:var(--panel);border:1px solid var(--border);border-radius:12px;padding:16px 18px;margin-bottom:10px}
  .faq summary{cursor:pointer;font-weight:600;font-size:15.5px}
  .faq p{margin-top:10px;color:var(--muted);font-size:14.5px}

  /* final cta */
  .final{margin:90px 0 0;padding:56px 24px;text-align:center;background:linear-gradient(180deg,transparent,rgba(94,234,212,.05));border-top:1px solid var(--border)}
  .final h2{font-size:clamp(24px,3.4vw,32px)}

  footer{border-top:1px solid var(--border);margin-top:0;padding:26px 0 44px;color:var(--muted);font-size:13.5px}
  footer .ai{margin-top:6px;max-width:70ch}

  @media (max-width:860px){
    .stage{grid-template-columns:1fr;gap:18px}
    .arrow{flex-direction:row;padding:0}
    .arrow .line{width:40px}
    .fan{height:auto;display:flex;flex-direction:column;gap:14px}
    .liCard,.emCard{position:static;width:100%;transform:none}
    .tag{display:none}
    .proofGrid,.who,.steps{grid-template-columns:1fr}
    .steps{gap:26px}.steps::before{display:none}
    .tiers{grid-template-columns:1fr}
    .honest{grid-template-columns:1fr}
  }
</style>
</head>
<body>
<div class="wrap">
  <nav>
    <div class="logo"><svg viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5eead4"/><stop offset="1" stop-color="#38bdf8"/></linearGradient></defs><path d="M32 12a20 20 0 1 1-14.1 5.9" fill="none" stroke="url(#lg)" stroke-width="7" stroke-linecap="round"/><circle cx="32" cy="32" r="6" fill="url(#lg)"/></svg><b>Guest<span>Loop</span></b></div>
    <a class="navcta" href="#join">Join early access</a>
  </nav>

  <section class="hero">
    <h1>Every episode becomes <em>a week of content.</em></h1>
    <p class="sub">GuestLoop turns every podcast episode into five ready-to-post LinkedIn drafts plus guest follow-up emails — and remembers your whole back catalog, so nothing gets repeated or forgotten.</p>
    <form class="cta" id="wl">
      <input type="email" id="email" name="email" placeholder="you@yourshow.com" required autocomplete="email">
      <input type="text" name="company" id="hp" style="display:none" tabindex="-1" autocomplete="off">
      <button type="submit">Join early access</button>
    </form>
    <div class="msg" id="msg"></div>
    <a class="ghost" href="#proof">or see a real example ↓</a>

    <div class="mock">
      <div class="glow"></div>
      <div class="browser">
        <div class="chrome"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="url">guestloop · your week, drafted</span></div>
        <div class="stage">
          <div class="epcard">
            <div class="lbl">New episode detected</div>
            <div class="wave"><i style="height:30%"></i><i style="height:65%"></i><i style="height:45%"></i><i style="height:90%"></i><i style="height:55%"></i><i style="height:75%"></i><i style="height:35%"></i><i style="height:80%"></i><i style="height:50%"></i><i style="height:68%"></i><i style="height:40%"></i><i style="height:85%"></i><i style="height:58%"></i><i style="height:32%"></i></div>
            <div class="t">Ep 42 — "How leaders use AI on real problems"</div>
            <div class="m">58 min · from your RSS feed</div>
          </div>
          <div class="arrow"><div class="line"></div><div class="cap">overnight</div></div>
          <div class="fan">
            <div class="liCard">
              <div class="liHead"><div class="av">You</div><div><div class="n">Your name</div><div class="r">Podcast host · 1h</div></div></div>
              <div class="liBody">Two guests, two industries, same warning, four months apart. In April, one told me you can't train senior judgment without junior reps. This month, another said the leaders getting real value from AI are still doing the unglamorous work of defining the problem…</div>
              <div class="liFoot"><span>👍 Like</span><span>💬 Comment</span><span>↗ Share</span></div>
            </div>
            <span class="tag">drafted for you</span>
            <div class="emCard">
              <div class="emHead">To: <b>your guest</b> · Subject: <b>That line is staying with me</b></div>
              <div class="emBody">Thank you for coming on the show — the quote everyone will steal is yours. Here it is, formatted so it's easy to share…</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="sec">
    <span class="kicker">How it works</span>
    <h2>Paste your RSS feed. That's the setup.</h2>
    <div class="steps">
      <div class="step"><div class="stepN">1</div><b>Connect your feed</b><p>No uploads, no new workflow. GuestLoop watches your show.</p></div>
      <div class="step"><div class="stepN">2</div><b>It listens & remembers</b><p>Every guest, topic and open thread is filed into your show's private memory.</p></div>
      <div class="step"><div class="stepN">3</div><b>Your week arrives</b><p>Five LinkedIn drafts + guest follow-up emails in your inbox next morning.</p></div>
    </div>
  </section>

  <section class="sec" id="proof">
    <span class="kicker">The proof</span>
    <h2>Real output. Unedited.</h2>
    <p class="lead">Generated from two public HBR IdeaCast transcripts — episodes four months apart. Watch what happens when the AI remembers both.</p>
    <div class="proofGrid">
      <div class="proofCard liBig">
        <span class="memchip"><i></i>cross-episode memory</span>
        <div class="liHead"><div class="av">AB</div><div><div class="n">Host</div><div class="r">Drafted by GuestLoop · ready to review</div></div></div>
        <div class="liBody">
          <p>Two guests, two industries, same warning, four months apart.</p>
          <p>In April, MIT's Andrew McAfee sat with us and said something that stuck: cutting entry-level hiring because AI can do the routine work might be the costliest "efficiency" move a company makes this decade. You can't train senior judgment without junior reps.</p>
          <p>This month, Josh Tyrangiel made what sounds like the opposite argument but isn't: the leaders getting real value from AI are still doing the unglamorous work of defining the actual problem.</p>
          <p>Put those two conversations side by side and a pattern shows up. The shortcut everyone's tempted to take — skip the apprentice, skip the problem-definition — is exactly the part of the work that was never really overhead. It was the job.</p>
        </div>
        <div class="liFoot"><span>👍 Like</span><span>💬 Comment</span><span>↗ Share</span></div>
      </div>
      <div>
        <div class="emWin">
          <div class="emHead">To: <b>Josh Tyrangiel</b><br>Subject: <b>That Cleveland Clinic line is staying with me</b></div>
          <div class="emBody">Hi Josh,<br><br>Thank you for making time this week. Very few conversations leave us with a line as sharp as the one you brought back from Cleveland Clinic — I haven't stopped repeating it since we stopped recording.<br><br>Feel free to grab the quote card for your own feed — happy to make it easy to share.<br><br>Best,<br>Alison</div>
        </div>
        <p class="proofNote">30 days later, a second draft revives the threads left open in the conversation — the intro he offered, the framework he promised to send.</p>
      </div>
    </div>
    <p class="proofNote">Demo generated from publicly available transcripts published by the show. GuestLoop is not affiliated with HBR.</p>
  </section>

  <section class="sec">
    <span class="kicker">The difference</span>
    <h2>One-off AI tools forget. GuestLoop accumulates.</h2>
    <p class="lead">Every episode adds to your show's memory. By episode 40, your drafts can say things no fresh chatbot session ever could.</p>
    <div class="memViz">
      <div class="epRow">
        <span class="pill">Ep 12 · Sarah on pricing</span>
        <span class="pill">Ep 18 · Marcus on hiring</span>
        <span class="pill">Ep 27 · Dana on churn</span>
        <span class="pill hot">Ep 42 · this week</span>
      </div>
      <div class="memNote">"This is the third guest this year who's told me the same thing about pricing — here's the pattern."<small>← a draft only possible with memory of episodes 12, 27 and 42</small></div>
    </div>
  </section>

  <section class="sec">
    <span class="kicker">Built for</span>
    <h2>Hosts who podcast for business, not downloads.</h2>
    <div class="who">
      <div class="whoCard"><div class="ic">🎯</div><b>Consultants & coaches</b><p>Your show exists to win clients. Your LinkedIn should too.</p></div>
      <div class="whoCard"><div class="ic">🚀</div><b>Founders</b><p>Every guest is a future customer, investor or intro.</p></div>
      <div class="whoCard"><div class="ic">🤝</div><b>Agency owners</b><p>Guests become referral partners — if the follow-up happens.</p></div>
    </div>
    <div class="honest">
      <div class="mark"><svg viewBox="0 0 64 64"><path d="M32 12a20 20 0 1 1-14.1 5.9" fill="none" stroke="#08222b" stroke-width="7" stroke-linecap="round"/><circle cx="32" cy="32" r="6" fill="#08222b"/></svg></div>
      <div>
        <p>GuestLoop is brand new — no testimonials yet, on purpose. Instead of borrowed logos, we put the actual output above. If the drafts don't convince you, nothing else on this page should.</p>
        <small>Built and operated autonomously by an AI, supervised by its human owner. That's why it can afford to listen to every minute of every episode.</small>
      </div>
    </div>
  </section>

  <section class="sec">
    <span class="kicker">Pricing</span>
    <h2>About $7 a week for the whole week's content.</h2>
    <div class="tiers">
      <div class="tier"><div class="name">Solo</div><div class="amt">$29<small>/mo</small></div><ul><li>Up to 4 episodes a month</li><li>5 LinkedIn drafts per episode</li><li>Guest follow-up emails</li><li>Full show memory</li></ul></div>
      <div class="tier rec"><div class="name">Pro</div><div class="amt">$49<small>/mo</small></div><ul><li>Unlimited episodes</li><li>Everything in Solo</li><li>Auto-post option (opt-in pilot)</li><li>Priority pipeline</li></ul></div>
    </div>
    <p class="pause">Show on a break? <b>Pause, don't cancel</b> — your memory is kept, billing stops.</p>
  </section>

  <section class="sec">
    <span class="kicker">Honest questions</span>
    <h2>Asked and answered.</h2>
    <div class="faq">
      <details><summary>Isn't this just ChatGPT with extra steps?</summary><p>ChatGPT writes from the one transcript you paste in. It can't watch your feed, process every episode automatically, or remember forty past guests. You're paying for the pipeline and the memory, not the words.</p></details>
      <details><summary>How is this different from Castmagic or Podsqueeze?</summary><p>They're content-volume tools: one upload in, many assets out, then they forget. GuestLoop is the relationship angle — guest memory, follow-ups, cross-episode callbacks. Many hosts will use both.</p></details>
      <details><summary>Does it post to LinkedIn for me?</summary><p>Drafts first, always. An opt-in auto-post option comes later, carefully, via LinkedIn's official API.</p></details>
      <details><summary>What happens to my data?</summary><p>Your feed is already public. Transcripts and your show memory are stored for your account only and deleted on request.</p></details>
    </div>
  </section>
</div>

<div class="final" id="join">
  <div class="wrap">
    <h2>Your next episode could be <em style="font-style:normal;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent">a week of content.</em></h2>
    <form class="cta" id="wl2">
      <input type="email" id="email2" placeholder="you@yourshow.com" required autocomplete="email">
      <button type="submit">Join early access</button>
    </form>
    <div class="msg" id="msg2"></div>
    <p class="pause" style="margin-top:14px">Founding-member pricing for the waitlist. One launch email, nothing else.</p>
  </div>
</div>

<footer>
  <div class="wrap">
    <div>© 2026 GuestLoop</div>
    <div class="ai">Transparency: GuestLoop is built and operated autonomously by an AI, supervised by its human owner. No fake testimonials, no invented numbers — just the output.</div>
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/waitlist' && request.method === 'POST') {
      let body;
      try { body = await request.json(); } catch { return json({ ok: false, error: 'Bad request' }, 400); }
      if (body.hp) return json({ ok: true }); // honeypot: pretend success, store nothing
      const email = String(body.email || '').trim().toLowerCase();
      if (!EMAIL_RE.test(email) || email.length > 254) return json({ ok: false, error: 'That email does not look right.' }, 400);
      const meta = {
        ts: new Date().toISOString(),
        ua: request.headers.get('user-agent') || '',
        ref: request.headers.get('referer') || '',
        country: request.cf && request.cf.country || ''
      };
      await env.DB.prepare('INSERT OR IGNORE INTO waitlist (email, ts, ua, ref, country) VALUES (?1, ?2, ?3, ?4, ?5)')
        .bind(email, meta.ts, meta.ua, meta.ref, meta.country).run();
      await env.WAITLIST.put(email, JSON.stringify(meta)); // KV kept as redundant copy
      return json({ ok: true });
    }

    if (url.pathname === '/api/waitlist/count') {
      const row = await env.DB.prepare('SELECT COUNT(*) AS n FROM waitlist').first();
      return json({ ok: true, count: row ? row.n : 0 });
    }

    if (url.pathname === '/health') return json({ ok: true });

    return new Response(HTML.replaceAll('__ORIGIN__', url.origin), { headers: { 'content-type': 'text/html;charset=utf-8', 'cache-control': 'public, max-age=300' } });
  }
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
}
