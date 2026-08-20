DEPA FX v2.10-P8.3 (Mini Candlestick + Auto FX Conversion + Market Data + WATCH)

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

v2.8-P8.1:
- Added M30 timeframe.
- Twelve Data M30 maps directly to interval=30min.
- On symbol or timeframe change, if an API key is available, automatically fetch:
  Price + Wilder ATR (default ATR14) + 100-bar highest High + 100-bar lowest Low.
- Direct intervals fetch 150 bars for ATR warm-up and a stable 100-bar window.
- M3 fetches 450 one-minute bars and aggregates locally into 3-minute bars.
- API values are applied atomically to price / atr / swingHigh / swingLow.
- If any fetch/calculation fails, existing manual inputs are preserved.
- After API baseline, manually editing price / ATR / swingHigh / swingLow sets status to BROKER ADJUSTED.
- Swing High/Low 100 means max(high) / min(low) over the latest 100 returned OHLC bars.

v2.9-P8.2:
- Automatically determines only the FX conversion rates needed by the selected symbol quote currency and account currency.
- Supported conversion inputs:
  USDJPY, EURUSD, GBPUSD, AUDUSD, NZDUSD, USDCAD, USDCHF.
- Examples:
  XAUUSD + JPY account -> USDJPY.
  EURGBP + JPY account -> GBPUSD + USDJPY.
  EURGBP + USD account -> GBPUSD.
  USDJPY + JPY account -> no conversion required.
  USDJPY + USD account -> USDJPY.
- Conversion rates are fetched from Twelve Data /price.
- Broker-adjusted conversion values are sticky and are not overwritten by automatic refresh.
- Pressing the manual Market Data fetch button forces a fresh API baseline for required conversions.
- Changing account currency refreshes only required conversion rates; OHLC is not refetched.
- Conversion updates are treated as dynamic market data, so they no longer invalidate an armed WATCH setup signature.

v2.10-P8.3:
- Added a mini candlestick chart below the Strategy screen.
- Uses only real OHLC already returned by Twelve Data; no synthetic candles.
- Stores the latest 100 OHLC bars in Market Data metadata.
- Shows current price, Swing High 100 and Swing Low 100 on the same axis.
- Automatically switches with symbol/timeframe selection.
- If OHLC is unavailable, shows a data-waiting placeholder instead of a fake chart.
