// GuestLoop landing page + waitlist API — Cloudflare Worker
// Waitlist entries stored in KV: key = email (lowercased), value = JSON metadata.

const HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>GuestLoop — your podcast, working for you all week</title>
<meta name="description" content="GuestLoop listens to every episode of your show, remembers every guest and open thread, and drafts your LinkedIn week plus guest follow-ups — with callbacks across your whole back catalog.">
<meta property="og:type" content="website">
<meta property="og:title" content="GuestLoop — one episode in, a week of LinkedIn out">
<meta property="og:description" content="AI that listens to your whole podcast, remembers every guest and open thread, and drafts your LinkedIn week plus guest follow-up emails — with cross-episode callbacks no one-off tool can write.">
<meta property="og:image" content="__ORIGIN__/og.png">
<meta property="og:image:width" content="2400">
<meta property="og:image:height" content="1260">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="__ORIGIN__/og.png">
<meta name="twitter:title" content="GuestLoop — one episode in, a week of LinkedIn out">
<meta name="twitter:description" content="AI that remembers your whole show: LinkedIn drafts + guest follow-ups from every episode, with cross-episode callbacks.">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%235eead4'/%3E%3Cstop offset='1' stop-color='%2338bdf8'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='64' height='64' rx='14' fill='%230e1116'/%3E%3Cpath d='M32 12a20 20 0 1 1-14.1 5.9' fill='none' stroke='url(%23g)' stroke-width='7' stroke-linecap='round'/%3E%3Ccircle cx='32' cy='32' r='6' fill='url(%23g)'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Sora:wght@600;700;800&display=swap" rel="stylesheet">
<style>
  :root{
    --bg:#0e1116; --panel:#161b23; --panel2:#1c2330; --text:#e8ecf1; --muted:#9aa7b5;
    --accent:#5eead4; --accent2:#38bdf8; --border:#2a3341; --good:#4ade80;
  }
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:var(--bg);color:var(--text);font:16px/1.65 Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}
  h1,h2,h3,.logo,.tier .amt{font-family:Sora,Inter,-apple-system,sans-serif}
  .wrap{max-width:960px;margin:0 auto;padding:0 24px}
  header{padding:28px 0;display:flex;align-items:center;justify-content:space-between}
  .logo{font-weight:700;font-size:20px;letter-spacing:-.02em;display:flex;align-items:center;gap:9px}
  .logo svg{width:26px;height:26px}
  .logo span{color:var(--accent)}
  .pill{font-size:13px;color:var(--muted);border:1px solid var(--border);border-radius:999px;padding:4px 12px}
  .hero{padding:56px 0 40px;text-align:left}
  h1{font-size:clamp(30px,5vw,46px);line-height:1.15;letter-spacing:-.02em;font-weight:800;max-width:22ch}
  h1 em{font-style:normal;background:linear-gradient(90deg,var(--accent),var(--accent2));-webkit-background-clip:text;background-clip:text;color:transparent}
  .sub{margin-top:18px;font-size:18px;color:var(--muted);max-width:58ch}
  .cta{margin-top:30px;display:flex;gap:10px;flex-wrap:wrap;max-width:480px}
  .cta input{flex:1 1 240px;padding:13px 16px;border-radius:10px;border:1px solid var(--border);background:var(--panel);color:var(--text);font-size:16px}
  .cta input:focus{outline:2px solid var(--accent2);border-color:transparent}
  .cta button{padding:13px 22px;border-radius:10px;border:0;background:linear-gradient(90deg,var(--accent),var(--accent2));color:#08222b;font-weight:700;font-size:16px;cursor:pointer}
  .cta button:hover{filter:brightness(1.08)}
  .note{margin-top:10px;font-size:13px;color:var(--muted)}
  .msg{margin-top:12px;font-size:15px;min-height:22px}
  .msg.ok{color:var(--good)} .msg.err{color:#f87171}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;margin:56px 0}
  .card{background:var(--panel);border:1px solid var(--border);border-radius:14px;padding:22px}
  .card h3{font-size:17px;margin-bottom:8px}
  .card p{color:var(--muted);font-size:15px}
  .card .k{display:inline-block;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--accent);margin-bottom:10px}
  .how{margin:24px 0 56px}
  .how h2, .price h2, .faq h2{font-size:26px;letter-spacing:-.01em;margin-bottom:18px}
  .steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}
  .step{background:var(--panel2);border:1px solid var(--border);border-radius:14px;padding:20px}
  .step b{display:block;margin-bottom:6px}
  .step small{color:var(--muted)}
  .sample{background:var(--panel);border:1px dashed var(--border);border-radius:14px;padding:22px;margin:0 0 56px;color:var(--muted);font-size:15px}
  .price{margin-bottom:56px}
  .tiers{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}
  .tier{background:var(--panel);border:1px solid var(--border);border-radius:14px;padding:24px}
  .tier .amt{font-size:34px;font-weight:800}
  .tier .amt small{font-size:15px;color:var(--muted);font-weight:400}
  .tier ul{list-style:none;margin-top:14px}
  .tier li{padding:5px 0;color:var(--muted);font-size:15px}
  .tier li::before{content:"✓  ";color:var(--accent)}
  .faq{margin-bottom:56px}
  .faq details{background:var(--panel);border:1px solid var(--border);border-radius:12px;padding:16px 18px;margin-bottom:10px}
  .faq summary{cursor:pointer;font-weight:600}
  .faq p{margin-top:10px;color:var(--muted);font-size:15px}
  footer{border-top:1px solid var(--border);padding:28px 0 48px;color:var(--muted);font-size:14px}
  footer .ai{margin-top:6px}
  @media (max-width:640px){ .hero{padding-top:32px} }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <div class="logo"><svg viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5eead4"/><stop offset="1" stop-color="#38bdf8"/></linearGradient></defs><path d="M32 12a20 20 0 1 1-14.1 5.9" fill="none" stroke="url(#lg)" stroke-width="7" stroke-linecap="round"/><circle cx="32" cy="32" r="6" fill="url(#lg)"/></svg>Guest<span>Loop</span></div>
    <div class="pill">Early access</div>
  </header>

  <section class="hero">
    <h1>One episode in. <em>A week of LinkedIn</em> — and warmer guest relationships — out.</h1>
    <p class="sub">GuestLoop listens to every episode of your show, remembers every guest and every open thread, and drafts your LinkedIn week plus guest follow-up emails — in your voice, with callbacks across your whole back catalog that make you sound like a thinker, not a content machine.</p>
    <form class="cta" id="wl">
      <input type="email" id="email" name="email" placeholder="you@yourshow.com" required autocomplete="email">
      <input type="text" name="company" id="hp" style="display:none" tabindex="-1" autocomplete="off">
      <button type="submit">Join the waitlist</button>
    </form>
    <div class="msg" id="msg"></div>
    <p class="note">Founding-member pricing for the waitlist. No spam — a launch email and nothing else.</p>
  </section>

  <section class="grid">
    <div class="card"><span class="k">Drafted</span><h3>A week of LinkedIn per episode</h3><p>Five posts drafted from each new episode, in your voice. Review, tweak, post — ten minutes instead of three hours.</p></div>
    <div class="card"><span class="k">Remembered</span><h3>A memory of your whole show</h3><p>“This is the third guest this year who's told me the same thing about pricing.” GuestLoop cross-references every past episode and guest — the thing one-off AI tools structurally can't do.</p></div>
    <div class="card"><span class="k">Followed up</span><h3>Guests become relationships</h3><p>A thank-you draft with their most quotable moment (guests love sharing those), and a 30-day follow-up draft that revives the threads left open in the conversation. Your show becomes a pipeline, not a graveyard.</p></div>
  </section>

  <section class="how">
    <h2>How it works</h2>
    <div class="steps">
      <div class="step"><b>1 · Paste your RSS feed</b><small>That's the whole setup. No uploads, no workflow change.</small></div>
      <div class="step"><b>2 · GuestLoop listens</b><small>Each new episode is transcribed and filed: guests, topics, promises, open threads — into your show's private memory.</small></div>
      <div class="step"><b>3 · Your week arrives</b><small>Next morning: five LinkedIn drafts plus guest follow-up emails in your inbox. You stay the author — nothing posts without you.</small></div>
    </div>
  </section>

  <section class="sample" id="samples" style="border-style:solid;color:var(--text)">
    <b style="color:var(--accent)">Real sample — unedited pipeline output</b>
    <p style="color:var(--muted);font-size:13px;margin:6px 0 14px">Generated from two publicly available HBR IdeaCast transcripts (episodes with Josh Tyrangiel and Andrew McAfee). GuestLoop is not affiliated with the show — this demonstrates output quality, including the cross-episode memory:</p>
    <div style="background:var(--panel2);border-left:3px solid var(--accent);border-radius:8px;padding:16px 18px;font-size:15px;line-height:1.7">
      <p>Two guests, two industries, same warning, four months apart.</p>
      <p style="margin-top:10px">In April, MIT's Andrew McAfee sat with us for our Strategy Summit and said something that stuck: cutting entry-level hiring because AI can now do the routine work might be the costliest "efficiency" move a company makes this decade. His argument — you can't train senior judgment without junior reps.</p>
      <p style="margin-top:10px">This month, Josh Tyrangiel made what sounds like the opposite argument but isn't: the leaders getting real value from AI aren't chasing the newest model, they're still doing the unglamorous work of defining the actual problem, then following through on the boring parts of solving it.</p>
      <p style="margin-top:10px">Put those two conversations side by side and a pattern shows up. The shortcut everyone's tempted to take — skip the apprentice, skip the problem-definition, just point the model at it — is exactly the part of the work that was never really overhead. It was the job.</p>
    </div>
    <p style="color:var(--muted);font-size:13px;margin-top:12px">No one-off AI tool writes that second-to-last paragraph — it requires remembering an episode from four months earlier. That's the memory you accumulate with every episode you run through GuestLoop.</p>
  </section>

  <section class="price">
    <h2>Pricing (at launch)</h2>
    <div class="tiers">
      <div class="tier"><div class="amt">$29<small>/mo</small></div><ul><li>Up to 4 episodes / month</li><li>5 LinkedIn drafts per episode</li><li>Guest follow-up drafts</li><li>Full show memory</li></ul></div>
      <div class="tier"><div class="amt">$49<small>/mo</small></div><ul><li>Unlimited episodes</li><li>Everything in Solo</li><li>Auto-post option (opt-in pilot)</li><li>Priority pipeline</li></ul></div>
    </div>
    <p class="note" style="margin-top:12px">Taking a break from the show? <b>Pause, don't cancel</b> — your show's memory is kept and billing stops until you're back.</p>
  </section>

  <section class="faq">
    <h2>Honest questions</h2>
    <details><summary>Isn't this just ChatGPT with extra steps?</summary><p>ChatGPT can write posts from one transcript you paste in. It can't watch your RSS feed, process every episode automatically, or remember what forty past guests said so your content can reference it. You're paying for the pipeline and the accumulated memory, not the writing.</p></details>
    <details><summary>How is this different from Castmagic or Podsqueeze?</summary><p>They're excellent content-volume tools: one upload in, many assets out. GuestLoop is the relationship angle — guest memory, follow-up sequences, cross-episode callbacks. Different job. Many hosts will use both.</p></details>
    <details><summary>Does it post to LinkedIn for me?</summary><p>Drafts first, always. An opt-in auto-post option (via LinkedIn's official API, to your own profile only) comes later, carefully.</p></details>
    <details><summary>What happens to my data?</summary><p>Your feed is already public; transcripts and your show memory are stored for your account only, never used for anything else, and deleted on request.</p></details>
  </section>

  <footer>
    <div>© 2026 GuestLoop</div>
    <div class="ai">Transparency note: GuestLoop is built and operated autonomously by an AI, supervised by its human owner. We think that's exactly why it can afford to listen to every minute of every episode.</div>
  </footer>
</div>
<script>
document.getElementById('wl').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = document.getElementById('msg');
  const email = document.getElementById('email').value.trim();
  const hp = document.getElementById('hp').value;
  msg.className = 'msg'; msg.textContent = '…';
  try {
    const r = await fetch('/api/waitlist', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({email, hp})
    });
    const j = await r.json();
    if (j.ok) { msg.className = 'msg ok'; msg.textContent = "You're on the list. We'll email you once, at launch."; e.target.reset(); }
    else { msg.className = 'msg err'; msg.textContent = j.error || 'Something went wrong — try again?'; }
  } catch { msg.className = 'msg err'; msg.textContent = 'Network hiccup — try again?'; }
});
</script>
</body>
</html>`;

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
      const existing = await env.WAITLIST.get(email);
      if (!existing) {
        await env.WAITLIST.put(email, JSON.stringify({
          ts: new Date().toISOString(),
          ua: request.headers.get('user-agent') || '',
          ref: request.headers.get('referer') || '',
          country: request.cf && request.cf.country || ''
        }));
      }
      return json({ ok: true });
    }

    if (url.pathname === '/health') return json({ ok: true });

    return new Response(HTML.replaceAll('__ORIGIN__', url.origin), { headers: { 'content-type': 'text/html;charset=utf-8', 'cache-control': 'public, max-age=300' } });
  }
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
}
