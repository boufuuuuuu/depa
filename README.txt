DEPA FX v3.9 FINAL SYNC
Research Validation / Parity / Shadow / Release Governance

Upload the contents of this folder to the GitHub Pages repository root:
- index.html
- manifest.webmanifest
- service-worker.js
- icon-192.png
- icon-512.png
- icon-maskable-512.png
- apple-touch-icon.png
- .nojekyll
- manual.pdf
- UPDATE_REPORT_v3.9.md

After GitHub Pages deploys:
1. Open the site once online in Safari.
2. If the Home Screen app is already installed, launch it online once.
3. The v3.9-v2 Service Worker cache will replace older DEPA FX caches.
4. If the old screen remains temporarily, close the Home Screen app and reopen it online.

v3.9 final pipeline:
Evidence -> Hypothesis -> Candidate -> Rule Spec
-> VALIDATING -> Validation Run -> VALIDATED
-> Parity -> Shadow -> Limited Release -> Monitoring

Final synchronized additions:
- Prospective vs retrospective validation:
  * PROSPECTIVE_LOCKED only when confirm-start is after Hypothesis registration and Rule freeze.
  * RETROSPECTIVE_ONLY cannot be used as the promotion PASS.
- Validation metrics include AvgR, PF, Win%, Max DD R, Trade Sharpe,
  Downside Deviation R and empirical worst-5% Expected Shortfall R.
- Validation dataVersion covers Evidence plus outcome/cost/review inputs that affect the Run.
- Validation stores compact Explore / Confirm / Purged / Embargoed sample ledgers.
- Release binds Rule version, Validation Data version, Parity, Shadow,
  EA/Adapter Code Version and Config Version.
- Release limits include Risk, Lot, Trades/Session, Spread, Slippage,
  Daily Loss, Max DD, Loss Streak and Allowed DQ.
- Monitoring shows Observed vs Validation-Expected AvgR/Win%,
  Avg Loss R, Trades/Day, Avg Spread/Slippage and Session-distribution TVD.
- APP STOP is an in-app control record only; it does not physically stop an external EA or broker.
- The bundled manual.pdf is synchronized to this final v3.9 behavior.
- Service Worker cache: depa-fx-v3-9-v2.

Important boundaries:
- Validation uses recorded Evidence + Journal outcomes; it is not a complete tick/bid-ask market replay.
- Parity currently verifies Rule decisions on frozen features; full indicator/runtime/broker parity is separate.
- Shadow operates only while the app is active and sends no broker orders.
- No automatic broker ordering, MQL/Pine generation, or automatic parameter optimization is enabled.
- PASS/COMPLETE/Release do not guarantee future profitability.

Existing localStorage data is preserved by the app update.
Normal JSON Backup includes the v3.9 research stores.
