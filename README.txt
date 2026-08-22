DEPA FX v4.0 — NANPIN / MARTINGALE PLANNER

Deploy these files to the GitHub Pages repository root:
- index.html
- manifest.webmanifest
- service-worker.js
- icon-192.png
- icon-512.png
- icon-maskable-512.png
- apple-touch-icon.png
- .nojekyll
- manual.pdf
- UPDATE_REPORT_v4.0.md

New in v4.0:
- Adds NANPIN / MARTINGALE as a separate mode from GRID.
- Inputs: direction, ATR step, planned levels, base lot, ADD/MULT progression,
  add-lot or multiplier, per-position SL ATR and TP ATR.
- Displays every planned position's Entry / Lot / cumulative Lot / SL / TP / cost-adjusted BE.
- ADD formula: Base + (level-1)*AddLot.
- MULT formula: Base * Multiplier^(level-1).
- Saves detailed multiPositionPlan into Journal / Trade / Portfolio/Evidence.
- Risk Engine uses cumulative planned individual-SL losses plus costs.
- Margin display uses an all-levels-simultaneously-open upper-bound assumption.
- WATCH fixes the armed first-entry price.
- Position Map shows representative NANPIN levels while the table remains the full plan.
- No automatic order placement or automatic lot escalation.
- UI level limit 50 is a technical display/calculation limit, not a safety threshold.
- Service Worker cache: depa-fx-v4-0-v1.
- manual.pdf is synchronized to v4.0.

Important:
Basket BE assumes earlier positions are still open. If an earlier individual SL is
reached before a later Entry, the actual basket composition and BE will differ.
The cumulative planned SL loss is not necessarily a single-price-point maximum loss.
