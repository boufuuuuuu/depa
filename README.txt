DEPA FX Phase 8 (WATCH / Alerts + Market Data + Position Map + PWA)

Upload these files to the repository root:
- index.html
- manifest.webmanifest
- service-worker.js
- icon-192.png
- icon-512.png
- icon-maskable-512.png
- apple-touch-icon.png
- .nojekyll

After GitHub Pages deploys, open the site once online.
On iPhone Safari: Share -> Add to Home Screen.

Phase 6:
- Position Map page
- Normal: Current / Entry / SL / TP1 / TP2 / BE / Add1 / Add2 / Avg1 / Avg2
- GRID: Current / Grid levels / Average / TP All / Final SL
- No synthetic candlesticks or historical path are drawn.

Phase 7:
- Twelve Data integration using a user-supplied API key.
- API key is NOT embedded in source; optional localStorage save only.
- Atomic Price + ATR update: manual values are preserved if either fetch/calculation fails.
- Wilder ATR calculated locally.
- M3 is aggregated locally from 1-minute OHLC.
- Direct provider intervals: M1, M5, M15, H1, H4, D1.
- Optional auto-refresh: OFF / 60 seconds / 5 minutes.
- Service Worker bypasses all cross-origin requests so financial API responses are never cached.
- Default mappings include XAU/USD, WTI/USD, N225, BTC/USD and ETH/USD.
- NAS100 uses editable provisional provider mapping NDX.

Phase 8:
- One active WATCH at a time.
- ENTRY Zone using a configurable ATR multiple (default 0.25 ATR).
- Entry price crossing detection.
- Gate PASS/FAIL transition detection.
- ENTRY/WATCH/NO-TRADE state transition detection.
- Persistent Alert History.
- Optional browser notification through the Service Worker when permission is granted.
- Setup signature: strategy/risk/swing changes make the watch STALE until re-armed.
- Evaluation occurs on manual Price/ATR changes and successful Market Data refreshes.
- No background polling server and no remote Push subscription in this phase.
