# DEPA FX v4.1 更新報告

**作成日:** 2026-08-22 JST  
**テーマ:** Multi-Timeframe MA Mini Charts / 資産クラス・銘柄別レバレッジ

## 結論

v4.1では、Multi-Timeframeの数値表を残したまま、各時間足へEMA20 / EMA50 / EMA200だけを描く小型チャートを追加しました。

レバレッジは、従来の共通値だけでなく、
- 銘柄個別 override
- 資産クラス別
- 共通 fallback
の3層で管理できるようにしました。

適用順は次の通りです。

`銘柄個別 > 資産クラス > 共通fallback`

## Multi-Timeframe MA Mini Charts

対象:
- M1
- M3
- M5
- M15
- M30
- H1
- H4
- D1

表示:
- EMA20
- EMA50
- EMA200

表示しないもの:
- ローソク足
- Price line

既存の数値表はそのまま残します。

各時間足について、既存MTF取得データからEMA20 / EMA50 / EMA200の直近60点を保存して描画します。
ミニチャート専用の追加APIリクエストは行いません。

MTF cache schemaは13へ更新しました。
旧cacheにはMA seriesがないため、旧データでは「再取得でMAチャート表示」と出ます。

MA Mini Chartsは観測表示です。
複数時間足でMAが同じ向きに見えても、それだけでGate、Edge Score、WATCH、ENTRY、EA昇格条件へ自動反映しません。

## レバレッジ管理

### 共通fallback

従来の `leverage` は残し、資産クラスや銘柄個別の指定がない場合に使います。
これにより旧Workspace / 旧Presetとの後方互換性を維持します。

### 資産クラス別

入力欄:
- FX
- 貴金属
- Index
- Energy / WTI
- Crypto

現在の銘柄区分:
- 28 FX pairs: FX
- XAU/USD / XAG/USD: METALS
- JP225 / NAS100: INDEX
- WTI: ENERGY
- BTC/USD / ETH/USD: CRYPTO

資産クラス欄が空欄なら共通fallbackを使います。
資産クラス欄へ0以下や不正値を明示入力した場合は、共通値へ黙ってfallbackせず入力不完全として止めます。

### 銘柄個別 override

現在選択中の銘柄へ個別レバレッジを保存できます。

例:
- XAUUSDだけ別倍率
- XAGUSDはMetals class値
- NAS100だけIndex class値と違う倍率

銘柄個別値は `depaFX.symbolLeverageOverrides.v1` に保存します。

ボタン:
- この銘柄へ保存
- この銘柄の上書きを解除

## 適用レバレッジ

Account画面に、
`適用レバレッジ 1:X`
と取得元を表示します。

取得元例:
- 銘柄個別 override
- 貴金属 override
- Index override
- 共通 fallback

GRID / NANPIN / 通常Tradeの証拠金計算は、このeffective leverageを使います。
Margin GateとRisk表示にも倍率と取得元を表示します。

## Evidence / Research

Research / Evidenceでは以下を保存します。
- effective leverage
- leverage source
- leverage asset class
- common leverage
- FX / Metals / Index / Energy / Crypto class settings

Numeric Snapshot schemaは5、numericEvidenceVersionは5へ更新しました。

銘柄個別overrideが使われた場合、Evidenceのeffective leverageとsourceにその結果を残します。

## Workspace / Broker Preset / WATCH / Backup

資産クラス別レバレッジは以下へ追加しました。
- Workspace autosave
- Broker Preset
- WATCH signature
- input change handling

銘柄個別overrideは独立した `depaFX.*` storageなので通常のJSON Backup対象です。

既存Presetに新しい資産クラス項目がなくても、共通fallbackが残っているため従来設定は維持されます。

## 重要な境界

同一Brokerでもレバレッジ・必要証拠金率は、
- 資産クラス
- 個別銘柄
- 口座種別
- 規制地域
- 建玉量 / notional tier
- Brokerのリスク制限
などで異なる場合があります。

DEPA FXはBrokerの倍率やMargin Rateを自動推定しません。
入力値はBrokerの契約仕様・Margin Tableで確認してください。

特にIndex / Energy / CryptoなどCFD系では、Brokerが単純な `notional / leverage` 以外のMargin ruleを採用する場合があります。
DEPA FXの証拠金表示は現在の契約サイズ・価格・換算・effective leverageを使う簡易モデルであり、Brokerの正式な必要証拠金を保証しません。
