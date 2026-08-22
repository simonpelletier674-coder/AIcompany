// Undertone mechanical review analyzer.
//
// Ports the regex-clustering methodology from samples/analyze_dresses.py
// (rating-based cohort split + curated theme regexes + verbatim quote
// extraction) and generalizes the theme library beyond apparel so it works
// reasonably across e-commerce categories. No LLM involved — this is the
// "early access" mechanical tier; the AI deep-clustering tier arrives later.

const COMPLAINT_THEMES = [
  { key: 'size-small', label: 'Sizing runs small / tight fit',
    rx: /\b(run(s|ning)? small|ran small|too small|too tight|smaller than (expected|usual|described)|sized? down)\b/i },
  { key: 'size-large', label: 'Sizing runs large / loose fit',
    rx: /\b(run(s|ning)? large|ran large|too (big|large)|boxy|larger than (expected|usual|described)|sized? up)\b/i },
  { key: 'fit-poor', label: 'Poor / unflattering fit',
    rx: /\b(unflattering|not flattering|didn'?t flatter|doesn'?t fit|didn'?t fit|awkward fit|weird fit)\b/i },
  { key: 'quality-cheap', label: 'Cheap / poor-quality material',
    rx: /\b(cheap(ly)?( made| looking)?|flimsy|poor quality|low quality|thin (fabric|material|plastic)|scratchy|itchy|feels cheap)\b/i },
  { key: 'defect-broken', label: 'Arrived broken / stopped working',
    rx: /\b(arrived broken|broke (after|within|in)|broken on arrival|stopped working|doesn'?t work|does not work|defective|malfunction(ed|ing)?|dead on arrival|d\.?o\.?a\.?|quit working|died after)\b/i,
    isDefect: true },
  { key: 'defect-hardware', label: 'Zipper / button / strap / hardware failure',
    rx: /\b(zip(per)?( is| was)? (broken|stuck|jammed|won'?t (close|zip)|snapped)|button(s)? (fell|broke|broken|popped) off|strap(s)? (broke|broken|snapped|ripped)|clasp (broke|broken)|buckle (broke|broken)|hinge (broke|broken))\b/i,
    isDefect: true },
  { key: 'sheer', label: 'Sheer / see-through / thin fabric',
    rx: /\b(sheer|see.?through|see thru|too thin)\b/i },
  { key: 'color-mismatch', label: "Color differs from photos",
    rx: /\b((color|colour) (was )?(different|didn'?t match|not the same|nothing like)|not as pictured|doesn'?t (look|match) (like )?(the )?(photo|picture|image)s?)\b/i },
  { key: 'shipping', label: 'Shipping delay / damage / packaging',
    rx: /\b(shipping (was |took )?(late|slow|forever)|took (forever|weeks) to (arrive|ship)|arrived (late|damaged|crushed|broken)|damaged (in )?(transit|shipping)|poor(ly)? packag(ed|ing)|bad packaging)\b/i },
  { key: 'missing-parts', label: 'Missing parts / incomplete',
    rx: /\b(missing (a |the )?(part|piece|screw|instructions|charger|manual|item)s?|incomplete|didn'?t (come|include|arrive) with)\b/i },
  { key: 'battery', label: 'Battery / charging issues',
    rx: /\b(battery (dies|died|drains|life)|batteries (die|died)|won'?t charge|doesn'?t charge|stopped? charging|charging (problem|issue)|drains? (fast|quickly))\b/i },
  { key: 'smell', label: 'Smell / scent / odor',
    rx: /\b(smells? (bad|weird|off|chemical)|bad smell|foul odor|odor|stinks?|chemical smell)\b/i },
  { key: 'return', label: '(Context) explicitly returned / returning',
    rx: /\b(returning|returned|will be returning|had to return|sending it back|going back|sent it back)\b/i },
  { key: 'cs-frustration', label: 'Customer service / refund friction',
    rx: /\b((customer service|support) (was |is )?(useless|unresponsive|terrible|awful|no help)|no response from (support|customer service)|never (responded|heard back)|refund (denied|refused|never came|took forever))\b/i },
];

const PRAISE_THEMES = [
  { key: 'fit-great', label: 'Flattering / great fit / true to size',
    rx: /\b(flattering|flatters|fits? (perfectly|great|well|true to size)|true to size|great fit|perfect fit)\b/i },
  { key: 'comfortable', label: 'Comfortable',
    rx: /\b(comfortable|comfy|cozy)\b/i },
  { key: 'quality-praise', label: 'Great quality / well made',
    rx: /\b(beautiful|gorgeous|stunning|well made|great quality|high quality|excellent quality|sturdy|durable)\b/i },
  { key: 'compliments', label: 'Compliments received',
    rx: /\bcompliment(s|ed)?\b/i },
  { key: 'value', label: 'Good value for the price',
    rx: /\b(worth (it|the price|every penny)|great value|good value|great price for)\b/i },
  { key: 'shipping-fast', label: 'Fast shipping / arrived quickly',
    rx: /\b(fast shipping|arrived (quickly|fast|early)|quick delivery|shipped fast)\b/i },
  { key: 'works-well', label: 'Works great / as described',
    rx: /\b(works? (great|perfectly|well|as described|like a charm)|exactly as described)\b/i },
];

const REQUEST_THEMES = [
  { key: 'req-size-chart', label: 'Wants a size chart / more sizing info',
    rx: /\b(size chart|sizing chart|sizing info|wish (there was|they had) a size chart)\b/i },
  { key: 'req-pockets', label: 'Wants pockets',
    rx: /\b(no pockets|doesn'?t have (any )?pockets|wish (it |this )?(had|has|came with) pockets|needs? pockets|lack(s|ing)? pockets)\b/i },
  { key: 'req-lining', label: 'Wants lining / less sheer fabric',
    rx: /\b(not lined|needs? (a )?lining|need(s|ed)? a slip|requires? a slip|isn'?t lined)\b/i },
  { key: 'req-colors', label: 'Wants more color options',
    rx: /\b(wish (it|this) (came|comes|would come) in (other|more|different) colors?|more color options|wish there were more colors)\b/i },
];

function randomId() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

function toRating(v) {
  if (typeof v === 'number') return v;
  const n = parseFloat(String(v == null ? '' : v).replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : NaN;
}

function normalizeRows(rawRows) {
  const out = [];
  for (const r of rawRows) {
    if (!r || typeof r !== 'object') continue;
    const review = String(r.review == null ? '' : r.review).trim().slice(0, 4000);
    const rating = toRating(r.rating);
    const product = String(r.product == null ? '' : r.product).trim().slice(0, 200);
    if (review.length < 3) continue;
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) continue;
    out.push({ review, rating, product });
  }
  return out;
}

function trimQuote(text, max) {
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + '…';
}

function topProductsFor(matches, hasProduct) {
  if (!hasProduct) return null;
  const counts = new Map();
  for (const m of matches) {
    if (!m.product) continue;
    counts.set(m.product, (counts.get(m.product) || 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 3)
    .map(([name, count]) => ({ name, count }));
}

function buildThemeStat(cohort, theme, hasProduct) {
  const matches = cohort.filter((r) => theme.rx.test(r.review));
  const count = matches.length;
  const pct = cohort.length ? +(100 * count / cohort.length).toFixed(1) : 0;
  const quotes = matches
    .slice()
    .sort((a, b) => a.review.length - b.review.length)
    .slice(0, 3)
    .map((m) => ({ text: trimQuote(m.review, 220), rating: m.rating, product: m.product || '' }));
  return {
    key: theme.key,
    label: theme.label,
    count,
    pct,
    quotes,
    topProducts: topProductsFor(matches, hasProduct),
    isDefect: !!theme.isDefect,
  };
}

function descriptionEditDraft(theme) {
  const n = theme.count;
  const pct = theme.pct;
  if (theme.key === 'size-small' || theme.key === 'size-large') {
    const dir = theme.key === 'size-small' ? 'small — many reviewers say to size up' : 'large — many reviewers say to size down';
    return `Fit note: add a line like "Runs ${dir}." to the product description or size guide — addressing the ${n}-mention (${pct}% of critical reviews) sizing cluster.`;
  }
  if (theme.key === 'sheer') {
    return `Fabric transparency note: ${n} reviewers (${pct}% of critical reviews) reported the fabric is sheer/see-through. Add a line disclosing fabric weight/opacity and suggest a liner where relevant.`;
  }
  if (theme.key === 'quality-cheap') {
    return `Material-quality expectations: ${n} reviewers (${pct}% of critical reviews) described the material as cheap or flimsy relative to price. Revise the materials copy to set accurate expectations, or review the spec with the supplier.`;
  }
  if (theme.key === 'color-mismatch') {
    return `Photo accuracy note: ${n} reviewers (${pct}% of critical reviews) said the color didn't match the listing photos. Update product photography/lighting or add a note about color variation across displays.`;
  }
  if (theme.key === 'fit-poor') {
    return `Fit guidance: ${n} reviewers (${pct}% of critical reviews) described a poor or unflattering fit. Add fit-context notes (body type, model's size worn) to the product page.`;
  }
  return `Address "${theme.label}": ${n} mentions (${pct}% of critical reviews) — the top complaint cluster in this batch. Consider a product-page note or FAQ entry addressing it directly.`;
}

function cannedResponseFor(theme) {
  if (theme && (theme.key === 'size-small' || theme.key === 'size-large')) {
    const dir = theme.key === 'size-small' ? 'small' : 'large';
    return `Hi [Name], thank you for the honest feedback, and I'm sorry this didn't fit the way you expected. A few customers have told us this item runs ${dir}, so we've updated the product page with fit notes to help future shoppers. I'd love to get you into the right size — I can process a free exchange, or a full refund if you'd rather. Just let me know which you prefer!`;
  }
  const label = theme ? theme.label.toLowerCase() : 'this issue';
  return `Hi [Name], thank you for flagging this — I'm sorry ${label} affected your experience. I've noted it for our team to review. I'd like to make it right: I can offer a full refund, a replacement, or store credit. Which would you prefer?`;
}

function draftActions(complaintThemes) {
  const actions = [];
  const ranked = complaintThemes.filter((t) => t.key !== 'return' && t.key !== 'cs-frustration' && t.count > 0);
  if (!ranked.length) return actions;

  const top1 = ranked[0];
  actions.push({
    type: 'description-edit',
    title: 'Drafted description edit',
    body: descriptionEditDraft(top1),
  });

  const editKeys = ['sheer', 'quality-cheap', 'color-mismatch', 'size-small', 'size-large', 'fit-poor'];
  const second = ranked.find((t) => t.key !== top1.key && editKeys.includes(t.key));
  if (second) {
    actions.push({
      type: 'description-edit',
      title: 'Drafted description edit',
      body: descriptionEditDraft(second),
    });
  }

  const defectTheme = ranked.find((t) => t.isDefect);
  if (defectTheme && defectTheme.count >= 3) {
    actions.push({
      type: 'supplier-alert',
      title: 'Supplier / QC alert',
      body: `Flag: ${defectTheme.label} — ${defectTheme.count} independent reports (${defectTheme.pct}% of critical reviews) describing the same failure pattern. That many unrelated customers hitting an identical failure mode reads as a manufacturing/QC signal, not normal variation. Recommend inspecting the affected batch/SKU before the next production run, and consider proactive replacements (rather than standard returns) for customers reporting this specific issue.`,
    });
  }

  const sizingTheme = ranked.find((t) => t.key === 'size-small' || t.key === 'size-large');
  const respondTarget = sizingTheme || top1;
  actions.push({
    type: 'canned-response',
    title: 'Canned response — ' + (sizingTheme ? 'sizing complaint' : 'top complaint'),
    body: cannedResponseFor(respondTarget),
  });

  actions.push({
    type: 'canned-response',
    title: 'Canned response — quality / refund',
    body: `Hi [Name], thank you for the honest feedback — I'm sorry this didn't meet expectations. I've flagged this with our quality team so we can look into it. In the meantime I'd like to make it right: a full refund, a replacement, or store credit with an added discount toward a different item. Which would you prefer?`,
  });

  return actions;
}

// analyzeReviews(rawRows) -> report object. Throws { message } on invalid input.
export function analyzeReviews(rawRows) {
  const valid = normalizeRows(rawRows).slice(0, 5000);
  if (valid.length < 20) {
    const err = new Error('Need at least 20 usable reviews (with review text + a 1–5 rating) to build a report.');
    throw err;
  }

  const hasProduct = valid.some((r) => r.product.length > 0);
  const critical = valid.filter((r) => r.rating <= 3);
  const positive = valid.filter((r) => r.rating >= 4);

  const complaintThemes = COMPLAINT_THEMES
    .map((t) => buildThemeStat(critical, t, hasProduct))
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count);

  const praiseThemes = PRAISE_THEMES
    .map((t) => buildThemeStat(positive, t, hasProduct))
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count);

  const requestThemes = REQUEST_THEMES
    .map((t) => buildThemeStat(valid, t, hasProduct))
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count);

  const actions = draftActions(complaintThemes);

  return {
    meta: {
      totalReviews: valid.length,
      criticalCount: critical.length,
      positiveCount: positive.length,
      hasProduct,
      generatedAt: new Date().toISOString(),
    },
    complaintThemes: complaintThemes.slice(0, 10),
    praiseThemes: praiseThemes.slice(0, 8),
    requestThemes: requestThemes.slice(0, 6),
    actions,
  };
}

export { randomId };
