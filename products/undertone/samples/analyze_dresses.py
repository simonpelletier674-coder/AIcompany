#!/usr/bin/env python3
"""
Undertone sample-report analysis script.

Input:  Women's Clothing E-Commerce Reviews.csv (23,486 rows, public domain / CC0)
        Source used for this report:
        https://raw.githubusercontent.com/AFAgarap/ecommerce-reviews-analysis/master/Womens%20Clothing%20E-Commerce%20Reviews.csv
        (byte-identical, md5 0a739940276c8d252de145f7d5f830b2, to at least two other
        independent GitHub mirrors of the same Kaggle CC0 dataset checked on 2026-08-22:
        nethajinirmal13/Training-datasets and msanchez50/Train)

What it does:
  1. Loads the full CSV and filters to Class Name == "Dresses" (the highest-volume
     category, 6,319 rows / 6,145 with non-empty review text).
  2. Splits Dresses reviews into two REAL cohorts by the dataset's own Rating field
     (no invented dates or trends):
       - "Critical"  = Rating <= 3  (n = 1,511)
       - "Positive"  = Rating >= 4  (n = 4,634)
  3. Counts mentions of hand-built regex theme patterns (complaint themes on the
     Critical cohort, praise themes on the Positive cohort, feature-request patterns
     across all Dresses reviews).
  4. Prints counts + a handful of matching verbatim quotes per theme, which were
     manually curated (for length/clarity) into sample-report.md. All quotes are
     copy-pasted verbatim from the Review Text column -- nothing paraphrased or
     invented.

Run:
  python3 analyze_dresses.py /path/to/womens_clothing_ecommerce_reviews_full.csv
"""
import csv
import re
import sys
import collections

CSV_PATH = sys.argv[1] if len(sys.argv) > 1 else "womens_clothing_ecommerce_reviews_full.csv"

COMPLAINT_THEMES = {
    "Sizing runs small / tight fit": r"\b(run(s|ning)? small|ran small|too small|too tight|smaller than (expected|usual))\b",
    "Sizing runs large / boxy fit": r"\b(run(s|ning)? large|ran large|too big|too large|boxy|larger than (expected|usual))\b",
    "Unflattering silhouette": r"\bunflattering|not flattering|didn'?t flatter\b",
    "Cheap / poor-quality fabric": r"\b(cheap|cheaply made|flimsy|poor quality|thin (fabric|material)|scratchy|itchy)\b",
    "Zipper issues": r"\bzip(per)?\b",
    "Sheer / see-through fabric": r"\b(sheer|see.?through|see thru)\b",
    "Return / had to return (outcome)": r"\b(returning|returned|will be returning|had to return|going back)\b",
}

PRAISE_THEMES = {
    "Flattering / great fit": r"\b(flattering|flatters|fits (perfectly|great|well|true to size)|true to size|great fit|perfect fit)\b",
    "Beautiful / pretty design": r"\b(beautiful|gorgeous|so pretty|stunning|elegant)\b",
    "Comfortable": r"\b(comfortable|comfy)\b",
    "Compliments received": r"\b(compliment(s|ed)?)\b",
    "True to size (sizing accuracy)": r"\btrue to size\b",
}

FEATURE_REQUESTS = {
    "Wants pockets": r"\b(no pockets|doesn'?t have (any )?pockets|wish (it |this )?(had|has|came with) pockets|needs? pockets|lack(s|ing)? pockets)\b",
    "Needs lining / slip required": r"\b(not lined|needs? (a )?lining|need(s|ed)? a slip|requires? a slip|should be lined|wish it (was|were) lined|isn'?t lined)\b",
    "Wants more color options": r"\bwish (it|this)( it)? (came|comes|would come) in (other|more|different) colors?|more color options|wish there were more colors",
}


def load_dresses(path):
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = [r for r in reader if r["Class Name"] == "Dresses" and r["Review Text"].strip()]
    return rows


def count_theme(rows, pattern):
    rx = re.compile(pattern, re.IGNORECASE)
    return [r for r in rows if rx.search(r["Review Text"])]


def main():
    rows = load_dresses(CSV_PATH)
    print(f"Dresses reviews with non-empty text: {len(rows)}")

    ratings = collections.Counter(r["Rating"] for r in rows)
    print("Rating distribution:", dict(sorted(ratings.items())))

    critical = [r for r in rows if int(r["Rating"]) <= 3]
    positive = [r for r in rows if int(r["Rating"]) >= 4]
    print(f"Critical cohort (rating<=3): {len(critical)}")
    print(f"Positive cohort (rating>=4): {len(positive)}")

    print("\n=== COMPLAINT THEMES (critical cohort) ===")
    for name, pat in COMPLAINT_THEMES.items():
        m = count_theme(critical, pat)
        pct = 100 * len(m) / len(critical)
        print(f"{len(m):4d}  ({pct:4.1f}%)  {name}")

    print("\n=== PRAISE THEMES (positive cohort) ===")
    for name, pat in PRAISE_THEMES.items():
        m = count_theme(positive, pat)
        pct = 100 * len(m) / len(positive)
        print(f"{len(m):4d}  ({pct:4.1f}%)  {name}")

    print("\n=== FEATURE REQUESTS (all dresses reviews) ===")
    for name, pat in FEATURE_REQUESTS.items():
        m = count_theme(rows, pat)
        pct = 100 * len(m) / len(rows)
        print(f"{len(m):4d}  ({pct:4.2f}%)  {name}")


if __name__ == "__main__":
    main()
