# DEPA FX v4.0 更新報告

**作成日:** 2026-08-22 JST  
**テーマ:** GRIDとは別のNANPIN / MARTINGALE計画

## 結論

v4.0では、既存GRIDを変更せず、別モードとして `NANPIN` を追加しました。

入力:
- BUY / 買い下がり、SELL / 売り上がり
- ナンピン間隔 ATR倍
- 予定段数
- 初期Lot
- Lot増加方式: ADD / MULT
- ADD時の加算Lot
- MULT時の倍率
- 各ポジションSL ATR倍
- 各ポジションTP ATR倍

## Lot計算

ADD:
`Lot_n = BaseLot + (n - 1) * AddLot`

MULT:
`Lot_n = BaseLot * Multiplier^(n - 1)`

入力値は推奨値ではありません。BrokerのMin/Max/Stepに適合しない予定LotはGateで止めます。

## 各ポジション表示

NANPIN / MARTINGALE画面では、各段について以下を表示します。

- Entry
- Lot
- Cumulative Lot
- SL
- TP
- Cost-adjusted Basket BE

初回Entryは計算時の現在値です。以後は選択方向に対してATR間隔で逆行側へ並べます。

BUY:
`Entry_n = Price - ATR * StepATR * (n - 1)`

SELL:
`Entry_n = Price + ATR * StepATR * (n - 1)`

SL / TPは各Entryから個別計算します。

## BE

Gross Basket Average:
`sum(Entry_i * Lot_i) / sum(Lot_i)`

Cost-adjusted BE:
- BUY: `Average + CostPips * PipSize`
- SELL: `Average - CostPips * PipSize`

CostPipsには現在のSpread / Slippage / Commission換算を使用します。

BEは「その段までの先行ポジションがすべて未決済」の仮定値です。
個別SLが次段Entryより先に成立する設計では、実際の保有構成とBEは変わります。
画面に `BE同時保有仮定` を表示し、この条件を区別します。

## Risk

NANPINでは各ポジションについて、
`Entry -> 個別SL` の価格損失 + Spread + Slippage + Commissionを計算し、
全段分を合計した `全段累積SL損失` をRisk budgetと比較します。

この値は、各段がそれぞれ個別SLへ到達する計画損失の合計です。
単一価格時点の最大損失とは同じ意味ではありません。

証拠金は全段が同時に残る仮定の上限値を表示します。
これは保守的な上限で、個別SLが先に成立する場合の実同時Lotとは異なることがあります。

## Gate

- NP-0: Lot仕様
- G-06: 個別SL / TP距離
- NP-1: 全段累積SL損失
- NP-2: 全段同時保有の証拠金上限
- NP-3: 方向
- NP-4: Lot増加方式

## 保存

NANPIN計画は以下へ接続しました。

- Portfolio Risk
- Trade Journal
- Trade Lifecycle
- WATCH
- Evidence Bundle / Research export
- Stress Test
- Position Map

Journal / Tradeでは各段の計画を `multiPositionPlan` として保存します。

## WATCH

NANPIN WATCHはARM時の第1段Entryを固定して監視します。
その後のMarket Data更新によって監視Entryを追従移動させません。

## Position Map

全段を描くとモバイル画面が読みにくくなるため、
Position MapはCURRENT / Basket Avg / Cost BEと、
初段・中間・最終段の代表Entry / SL / TPを表示します。
全段詳細はNANPIN画面の表を正とします。

## 境界

- 自動注文は行いません。
- 到達時の自動ナンピンは行いません。
- Broker側SL / TPの自動変更は行いません。
- 予定段数50はUI計算上の上限で、安全基準・推奨段数ではありません。
- Basket BEは実約定後のBroker損益分岐を保証するものではありません。
