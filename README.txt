DEPA FX v3.2 (Edge Discovery + Playbook)

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

v2.11-P8.4:
- Strategy mini chart now overlays EMA20, EMA50 and EMA200.
- RSI13 is rendered in a separate lower panel with 70 / 50 / 30 reference levels.
- EMA uses SMA seed then standard exponential smoothing alpha=2/(period+1).
- RSI13 uses Wilder average gain/loss smoothing.
- Fetch target increased to 350 effective bars so EMA200 has warm-up history.
- M3 fetches 1050 one-minute bars, aggregates to 3-minute OHLC, then computes EMA/RSI.
- Only the latest 100 candles and indicator values are rendered.
- Latest EMA20/50/200 and RSI13 values are shown in the chart footer.


v3.0 Risk Ops Suite:
- Data Quality Guard: API context, source bar count, EMA/RSI/ATR readiness, fetch/bar age, required FX conversion freshness, manual-adjustment state.
- User-adjustable provisional stale thresholds: timeframe bars and conversion-rate minutes.
- Trade Lifecycle: PLANNED -> WATCH -> ENTRY -> OPEN -> MANAGE -> CLOSED, plus CANCEL; linked Trade ID across Journal and Portfolio.
- Trade creation is blocked when Data Quality is ERROR/STALE or Portfolio gates would be exceeded.
- WATCH arm is also blocked on Data Quality ERROR/STALE.
- Journal Analytics: realized-R N, total/average R, avg win/loss R, win %, profit factor, max drawdown R, win/loss streaks, filters and grouped breakdown.
- Multi-Timeframe Dashboard: manual fetch of selected timeframes; close vs EMA20/50/200, EMA relationships, RSI13, ATR14 and 100-bar range position. No automatic buy/sell score.
- Scenario Stress Test: user-defined spread multiplier, extra slippage and gap ATR; compares stressed loss with risk allowance and portfolio nominal stop risk.
- Backup/Restore: JSON export/import for depaFX.* localStorage. API key excluded by default; optional inclusion.
- Existing Phase 1-8 features remain in place.

v3.1 Bug Fix + Edge Score:
[BUG FIX 1] Counter-trend direction is now an explicit selector (counterDir).
  Previously dir was derived from d1bias while G-02 required RANGE, which made
  SELL counter-trend entries structurally impossible. Both directions now work.
[BUG FIX 1b] Counter-trend SL buffer is now configurable (counterSlAtr, default 1.0 ATR)
  and G-07's floor is configurable (slFloorAtr, default 1.0 ATR).
  Previously the counter SL buffer was hardcoded at 0.5 ATR while G-07 demanded
  1.0 ATR, so counter-trend always failed G-07.
[BUG FIX 2] Changing symbol or timeframe now clears price / atr / swingHigh /
  swingLow / slAnchor. Data Quality also reports STALE when API metadata exists
  for a different context. Previously stale prices from the previous symbol
  survived the switch, DQ reported PARTIAL, and trade creation was not blocked.
[BUG FIX 3] Grid direction is now an explicit selector (gridDir) and is reported
  as gate GR-4. Previously d1bias=RANGE silently became a buy grid.

Edge Score layer:
- Eight mechanical factors E-01..E-08 evaluated on every calculation.
- Each factor has an editable weight and a status of 未検証 / 検証中 / 採用.
- Only 採用 factors contribute to the score. Threshold defaults to 0, so the
  layer changes nothing until the user deliberately activates it.
- Gate E-00 enforces the threshold when active.
- Fired factor IDs are stored on each Journal entry (edgeFactors).
- Journal Analytics adds a per-factor stratified table: N, Avg R, Win %, and the
  difference from the overall baseline. Rows with N<20 are marked.
- Edge Score is a condition-satisfaction count. It is not a probability and not
  a win rate.

v3.1.1:
- Symbol/timeframe context change now clears market inputs and immediately recalculates/renders the UI.
- Known API metadata from another symbol/timeframe is classified as Data Quality STALE/MISMATCH during the transition.
- Journal normal-trade snapshots now store all Edge factor states as true / false / null (edgeEvidenceVersion=2).
- GRID explicitly stores no Edge factor evaluation.
- Factor Analytics compares ON vs OFF only inside records with full-state Edge Evidence.
- Legacy v3.1 fired-ID-only records and null evaluations remain Unknown; absence is never inferred as OFF.
- Factor table shows ON/OFF N, AvgR, Win%, delta ON-OFF, and Unknown.
- Both groups N>=20 is only a provisional color-display threshold, not an adoption/significance rule.
- E-01/E-02 D1/H4 MTF evidence is ignored (Unknown) if fetch time or latest bar time is missing/stale under the user-configured Data Quality staleBars setting.
- Stress Test assumptions are removed from WATCH setup signature.

v3.1.2:
- LONG and SHORT win/loss rates in Journal Analytics. BE/CANCEL excluded from W/L denominator.
- Realized pips calculated from actual entry/exit execution price and stored pip size. Legacy standard FX/metals can use stable symbol pip; broker-dependent custom instruments require a stored pipSize.
- Optional explicit actual P/L amount added to Trade Lifecycle and Journal editor.
- Amount analytics prefer explicit actualAmount; otherwise use realizedR * saved risk as a derived amount.
- Today's realized performance uses the device-local calendar date of actualExitAt.
- Total hourly performance groups closed records by device-local actualEntryAt hour.
- Legacy histories with unknown entry/exit time are not guessed; they appear as unknown / are excluded from the relevant time bucket.
- Different account currencies are displayed separately and never summed together.

v3.2:
- Adds Edge Discovery page with single-factor and 2-factor / 3-factor combination comparisons.
- Combination ON = all component factor states are true.
- Combination OFF = all component states are known and at least one is false.
- Null/missing/legacy unknown factor states are excluded from ON/OFF and counted as Unknown.
- Displays ON/OFF N, win rates, delta AvgR, chronological first-half delta, recent-half delta and sign-direction consistency.
- Combination table is exploratory and sorted by absolute observed delta only for scanning. It never auto-adopts an Edge.
- Stores a numeric setup snapshot in new Journal records: ATR, EMA20/50/200, RSI13, EMA distance in ATR, swing range position, leg/ATR, depth, planned RR, risk %, SL/ATR, distance-to-entry/ATR, spread/slippage and fresh D1/H4 MTF frames where available.
- Adds Observed Playbook: deterministic Japanese prose describing the most frequently observed mode/direction/symbol/timeframe/D1 bias, median numeric setup traits, EMA-alignment rates, RSI behavior and common entry hours.
- Adds Declared Method structured inputs and free-text description.
- Adds Declared vs Observed comparison as per-rule historical match rate and eligible N.
- Free-text Declared Method is stored/displayed but is not silently NLP-parsed; only structured declared rules are compared.
- Existing v3.1.1 full Edge Evidence remains usable for factor/combination discovery. Numeric snapshot metrics begin accumulating with v3.2 records.
