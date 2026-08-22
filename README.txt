DEPA FX v4.1 — MTF MA MINI CHARTS / ASSET & SYMBOL LEVERAGE

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
- UPDATE_REPORT_v4.1.md

New in v4.1:
- Multi-Timeframe keeps the numeric table and adds tiny EMA-only charts.
- Each selected timeframe shows EMA20 / EMA50 / EMA200 using the last 60 stored points.
- Candles and price line are not drawn.
- No extra API request is used for the mini charts.
- MTF cache schema: 13.

Leverage:
- Existing common leverage remains as fallback.
- Optional class leverage: FX / Metals / Index / Energy / Crypto.
- Optional per-symbol leverage override.
- Precedence: symbol override > asset class > common fallback.
- Current effective leverage and source are visible in Account, Risk and Margin Gates.
- Per-symbol overrides are stored in depaFX.symbolLeverageOverrides.v1.
- Class leverage settings are included in Workspace / Broker Preset / WATCH signature.
- Effective leverage provenance is saved into Research/Evidence.
- Numeric Snapshot schema / numericEvidenceVersion: 5.

Service Worker cache:
- depa-fx-v4-1-v1

Important boundaries:
- A broker can apply different leverage or margin requirements by asset class, symbol,
  account type, regulation, position size or other broker rules.
- DEPA FX does not infer broker leverage/margin terms.
- For CFDs/crypto/index/energy, the current margin calculation remains a simplified
  notional/leverage model using the configured contract specification.
- It may differ from the broker's official margin engine.
- MTF MA mini charts are observational display only and do not automatically change
  Gate, Edge Score, WATCH, Entry or EA promotion.
