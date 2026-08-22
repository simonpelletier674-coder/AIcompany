# Voice-of-Customer Report — Sample Output

**Category analyzed:** Dresses
**Reviews in scope:** 6,145 (all Dresses reviews with review text, out of 6,319 total Dresses rows)
**Report generated:** 2026-08-22 (single-period sample; see *Methodology* for why no month-over-month deltas appear)

> **Data & license disclosure.** Sample generated from the public-domain **Women's Clothing E-Commerce Reviews** dataset — 23,486 real, anonymized customer reviews of a real apparel retailer (the retailer's name has been redacted from the review text by the dataset's original publisher and replaced with "retailer"). The dataset is released **CC0 (public domain)**. Undertone is not affiliated with the retailer, the dataset's publisher, or Kaggle. This report exists to show, with a clean license, exactly the shape of report Undertone generates monthly from a merchant's own Shopify reviews — it replaces an earlier illustrative/mocked-up example on the landing page.
>
> **Source file used:** `Womens Clothing E-Commerce Reviews.csv`, retrieved from a GitHub mirror at
> `https://raw.githubusercontent.com/AFAgarap/ecommerce-reviews-analysis/master/Womens%20Clothing%20E-Commerce%20Reviews.csv`
> (verified byte-identical — md5 `0a739940276c8d252de145f7d5f830b2` — to two further independent mirrors, `nethajinirmal13/Training-datasets` and `msanchez50/Train`; 23,486 rows, columns `Clothing ID, Age, Title, Review Text, Rating, Recommended IND, Positive Feedback Count, Division Name, Department Name, Class Name` match the known schema of the original Kaggle CC0 release by Nick Brooks).

---

## Methodology

- **Category:** "Dresses" was selected as the highest-volume `Class Name` in the dataset (6,319 rows), giving enough depth for reliable theme counts.
- **No fabricated trend / no fake dates:** the dataset carries no timestamps, so this report does **not** invent "month-over-month" deltas. Instead it splits Dresses reviews by the dataset's real `Rating` field into two honest cohorts, exactly as Undertone would split a merchant's low-star vs. high-star reviews within one reporting window:
  - **Critical cohort** — Rating ≤ 3 stars — **n = 1,511**
  - **Positive cohort** — Rating ≥ 4 stars — **n = 4,634**
- **Theme extraction:** mechanical keyword/regex counting (Python, `analyze_dresses.py`, included alongside this report) over `Review Text`, cross-checked by manually reading matching reviews to confirm each pattern was catching genuine instances of the theme (not just coincidental word overlap). Complaint themes were counted against the Critical cohort, praise themes against the Positive cohort, feature requests across all 6,145 Dresses reviews. All percentages are of the cohort searched, not of the full 6,145.
- **Quotes:** every quote below is copy-pasted verbatim from the `Review Text` column (lightly ellipsis-trimmed for length only, never edited in wording) and was programmatically re-verified to exist in the source CSV and to match the stated theme's search pattern before inclusion.

---

## Theme Summary

### Complaint themes (Critical cohort, n = 1,511)

| Theme | Mentions | % of critical reviews |
|---|---:|---:|
| Sizing runs large / boxy fit | 140 | 9.3% |
| Unflattering silhouette / cut | 150 | 9.9% |
| Sizing runs small / tight fit | 93 | 6.2% |
| Cheap / poor-quality fabric | 134 | 8.9% |
| Zipper issues (breaks, jams, won't close) | 86 | 5.7% |
| Sheer / see-through fabric | 60 | 4.0% |
| *(context)* Explicitly says item was/will be returned | 265 | 17.5% |

*Sizing inconsistency, combined (runs-large + runs-small): **233 mentions, 15.4%** of critical reviews — the single biggest complaint surface when both directions are counted together.*

### Praise themes (Positive cohort, n = 4,634)

| Theme | Mentions | % of positive reviews |
|---|---:|---:|
| Flattering / great fit | 1,454 | 31.4% |
| Beautiful / pretty design | 1,177 | 25.4% |
| Comfortable | 925 | 20.0% |
| Compliments received while wearing | 357 | 7.7% |
| Explicitly "true to size" | 288 | 6.2% |

### Feature requests (all 6,145 Dresses reviews)

| Request | Mentions | % of all Dresses reviews |
|---|---:|---:|
| Add lining, or disclose fabric needs a slip | 46 | 0.75% |
| More color options | 9 | 0.15% |
| Add pockets | 6 | 0.10% |

These are low-volume relative to fit/fabric complaints — flagged as directional, not headline, findings.

---

## Representative Verbatim Quotes

**Sizing runs large / boxy (140 mentions)**
- "Beautiful dress but have to return. way too big & long for me. medium is the size i wear but i think i would need an extra small." — 2★
- "This is a pretty dress, but it runs at least one size too large. the silk is of good quality. it would be good for somebody who is slim and tall." — 3★
- "This dress has a beautiful color and design. however it runs too big. i'm usually between size 2 or 4 on antropologie's cloths. i had to size down to size 0 to get a more fitted look like the model." — 3★
- "The dress is adorable and has a very nice fabric and a slip that goes underneath. it was just too big for me even as a swing dress." — 3★
- "I was extremely disappointed when this arrived. it's nothing like the red color shown, rather it's a very dull reddish color. as other reviews have suggested, it is very thin and runs large. i have to return." — 1★

**Sizing runs small / tight (93 mentions)**
- "This is a lovely dress, with great fabrication. nice detail on the zipper placket. good material. however, it runs small in the waist, if you had a nymph waist this is for you! i couldn't get it zipped." — 3★
- "Here's an example of lowering a hemline and slapping the term 'petite' on it. too much fabric, was bulky, and ran too small. the fabric was thin and pulled awkwardly over the bust. returned.." — 2★
- "Love the dress and went a size up as recommended by other reviewers. but it was still too small. it's just not roomy enough in the chest--total boob squash. had to return it." — 3★
- "I loved this dress. it fit perfectly everywhere except for the sleeves. the dress has an overall relaxed fit, but the sleeves were way too tight. i had to send back because of sleeves." — 2★
- "Material cheap. too small. good idea for design. love princess cut but bad material. good idea though. sending back" — 2★

**Unflattering silhouette (150 mentions)**
- "This dress was pretty but had a weird fit. the waist droops down in the middle instead of going straight across, which i found unflattering. i ended up returning it." — 3★
- "No. this is one of the most unflattering things i've ever put on my body. i'm a very well-proportioned hourglass - i tend to wear a small despite a booty and 36d chest - this made me look huge. don't do it." — 1★
- "It is a beautiful top but runs huge!!! i followed other reviews and ordered a size down hoping it would work but it was totally unflattering! i wanted so bad to love it but there was no way i could keep it!!" — 2★
- "My v-shape figure (broad shoulder, narrow hips, waist not well defined) looked completely square in this. not flattering at all. perhaps better for other figures." — 2★

**Cheap / poor-quality fabric (134 mentions)**
- "Very cheap looking material. looks cheap to cost $158." — 1★
- "There is no way this is worth the price. i was deeply disappointed when it arrived. the material is thin and feels cheap. i love the design, and anna sui, but this is just so overpriced." — 1★
- "I like the design of the dress, but the fabric makes it look cheap. for an expensive dress, i had expected better quality." — 2★
- "I tried this dress on in store. i loved it online, but in person....not so much. it looked and felt like a cheap halloween costume. the fabric was bad. really bad.. the mustard color was beautiful.... boo" — 1★
- "This dress looks and feels cheap. the white material is stiff and does not iron nicely. the grey sweater is super thin and very cheap looking. overall, a pretty horrible dress. save your money," — 1★

**Zipper issues (86 mentions)**
- "I received this in the mail and it looked beautiful but the zipper was broken just like one of the other reviews. normally i would just exchange but i don't know if it's worth getting another broken one." — 2★
- "This dress is so cute but it's going back. the zipper is horrible and all of the other reviews are true - you'll need to size up." — 2★
- "Beautiful dress appears well-made, but unfortunately i wasn't able to get it on! about 6 inch gap in the zipper over chest area. first time i've ever sent something back to retailer for not fitting." — 3★
- "This product has a terrible zipper that ultimately caused me to return the dress. it's pretty bad when it won't even zip up on the hanger. such a beautiful dress; it broke my heart!" — 1★

**Sheer / see-through fabric (60 mentions)**
- "The fabric is too sheer, also looks like sleepwear. just not my thing." — 2★
- "I'm usually a fan of maeve, but this dress is just bad. the fabric is thin and filmy, and it stretches to sheer over your chest. the turtleneck is neither tight nor loose, it just droops in a most unfortunate way." — 1★
- "I read all the reviews about the fabric being see through, but liked the dress enough to give it a shot. it is soooo see through. this trally could only be worn on a beach. very disappointed." — 1★
- "This dress is thin and completely see through. it is definitely not worth the price tag. would be really cute in a thicker material." — 1★

**Flattering / great fit (1,454 mentions — top praise theme)**
- "This dress is comfortable and stylish at the same time. it runs true to size. i'm 5'1" 113 lbs and got the xs petite. wore it once so far for a few hours and got a few compliments on it!" — 5★
- "Absolutely love this dress! fits true to size and makes anyone look fabulous" — 5★
- "This is an absolutely gorgeous dress that stands out everywhere i go. it runs true to size and has a slimming effect because of the detail running down the sides." — 5★

**Beautiful design / Comfortable / Compliments (1,177 / 925 / 357 mentions)**
- "This elegant white lace dress attracted compliments everywhere i wore it. it is classic with just the right amount of quirkiness . i like everything about it!" — 5★
- "Many compliments - great color and so comfy. most of my dresses from retailer are maeve brand, and i have never been disappointed." — 5★
- "This dress is comfortable as well as flattering, which does not happen very often! looks good with navy tights too!" — 5★

**Feature requests — lining/slip (46), pockets (6), colors (9)**
- "I love the colors. however, $200 is a lot to pay for a small piece of fabric , no lining what so ever. the fabric is very thin. you will need a slip. looks just like a cover-up. going back." — cheap/lining overlap
- "The dress is very comfortable and the fit is very flattering. i really like the colors and the design. the only con is that it isn't lined." — 4★
- "I was disappointed that this dress had no pockets, as every picture on this website suggests. otherwise, it is a great color and shape. still sad though..." — 4★
- "The design and quality are fantastic! i had to order a little larger because of my bust and shoulders - it's still flattering though. can be dressed up or casual. i wish it came in more colors!" — 5★

---

## Drafted Actions

*(This is what Undertone hands the merchant each month — ready-to-review drafts, not auto-published. A human clicks approve/edit/reject on each one.)*

### 1. Product-description edit — sizing/fit guidance

**Problem it addresses:** sizing inconsistency is the single largest complaint surface in the critical cohort (233 mentions combined, 15.4%) — customers report the *same category* running both large ("way too big," "runs at least one size too large") and small ("couldn't get it zipped," "total boob squash") depending on the specific dress, meaning generic "true to size" copy is actively misleading buyers.

**Drafted copy addition** (append to product description, per-SKU where fit data exists):
> **Fit note:** This style runs [true to size / large / small] through the [bust / waist]. Reviewers who found it snug recommend sizing up; if you prefer a relaxed fit, this dress already runs generous. Model is 5'7" and wearing a size [S], shown [true to her usual size / sized down one].

### 2. Product-description edit — fabric transparency (sheer + lining)

**Problem it addresses:** 60 sheer/see-through complaints plus 46 "needs a slip / not lined" mentions — both are the same underlying issue (customers not warned the fabric is lightweight/unlined) and both are cheap, high-leverage fixes since they require no product change, only disclosure.

**Drafted copy addition:**
> **Fabric & lining:** This dress is unlined and made from a lightweight, semi-sheer fabric — we recommend wearing it with a slip. If you prefer full coverage, see our lined alternative in [related style].

### 3. Supplier / quality alert

**Flag:** Zipper defects — 86 mentions in the critical cohort (5.7% of all critical Dresses reviews), including multiple independent reports of zippers arriving already broken or physically unable to close ("about 6 inch gap in the zipper," "won't even zip up on the hanger," "the zipper was broken just like one of the other reviews").

**Recommended action:** This pattern — several *unrelated* customers describing the identical failure mode (zipper won't close / arrives broken) — is a stronger signal of a manufacturing/QC defect than of a sizing mismatch. Flag to the supplier/QC team for zipper-hardware inspection on affected SKUs before the next production run, and consider a proactive size-exchange offer (rather than standard return) for customers reporting this specific issue, since the fabric and design are otherwise well-reviewed on the same items.

### 4. Canned response — sizing complaint

> Hi [Name], thank you for the honest feedback, and I'm sorry this one didn't fit the way you expected. A few customers have told us this style runs [large/small] through the [bust/waist], so we've updated the product page with fit notes to help future shoppers. I'd love to get you into the right size — I can process a free exchange for [size], or a full refund if you'd rather. Just let me know which you prefer!

### 5. Canned response — fabric/quality complaint (sheer, cheap-feeling, or zipper defect)

> Hi [Name], I'm really sorry the dress didn't meet expectations on quality — that's not the experience we want you to have. I've flagged this with our quality team so we can look into it on our end. In the meantime, I'd like to make this right: I can offer a full refund, a replacement, or store credit with an added discount toward a different style. Which would you prefer?

---

## Files accompanying this report

- `analyze_dresses.py` — the analysis script (regex theme counts, cohort split), runnable against the source CSV to reproduce every count above.
- `data_excerpt_200rows.csv` — a 200-row random excerpt (seed 42) of the full 23,486-row dataset, included for reference/reproducibility without redistributing the entire file.
