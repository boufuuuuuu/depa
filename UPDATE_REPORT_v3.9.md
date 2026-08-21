# DEPA FX v3.9 更新報告

**作成日:** 2026-08-22 JST  
**目的:** 裁量観測からEA候補へ進む研究パイプラインを、Validation / Parity / Shadow / Limited Release / Monitoringまで接続する。

## 結論

v3.9では、v3.8で固定した Evidence Bundle → Hypothesis Card → Candidate Ledger → Rule Spec に続き、
P3-P6相当の検証・同値性・Forward・限定Release管理を追加しました。

**Evidence → Hypothesis → Rule Spec → Validation → Parity → Shadow → Limited Release → Monitoring**

の順序をアプリ上で保持します。各工程は、対応する証跡がない限り先へ進めません。

## Validation Run

- Candidateに固定したCOMPLETEなRule Specのみを対象にします。
- 記録済みEvidenceと実現RのあるJournalを使用します。
- PLAN / ENTRY Evidenceを選択できます。
- ExploreとConfirmを確認開始時刻で分離します。
- 分割境界をまたいで保有していたTradeはpurgeします。
- 任意Embargoを設定できます。
- UNKNOWNはFALSEへ変換しません。
- Spread倍率 / 追加Slippageでコスト悪化を別シナリオとして確認します。
- 任意の条件感度 ±% をLOW / BASE / HIGHで比較します。
- 任意のMoving Block BootstrapでAvgR分布を記録します。
- Session / EMA trend / ATR%帯 / DQ / 曜日を層別表示します。
- Rule Adherence / Decision Quality / Risk Discipline / Execution Quality / Manual Intervention / News Contextも分離集計します。
- 同じ確認母集団全体をBaselineとして、Rule MATCH群とのAvgR差を記述差として表示します。
- Min N / Min AvgR / Min PF / Max DD R / AvgR CI下限 / 感度同符号はユーザー定義です。
- 条件未登録はREVIEW_NO_CRITERIAで、自動PASSしません。
- Rule版 + Data version + Run設定のfingerprintで同一Runを再利用できます。

**重要:** これは記録済み判断サンプルの確認であり、全市場バーを再生する完全なティック/bid-askバックテストではありません。

## Parity Test

- Frozen Featureを入力としてResearch Engineの期待判定をCase JSON化します。
- 判定は MATCH / NO_MATCH / UNKNOWN の3値です。
- 外部EA / Adapter結果をcaseIdで比較します。
- mismatch / missing / extraを別々に記録します。
- すべてのテストCaseが一致した時だけPASS_TESTED_CASESです。

**境界:** Frozen Feature上のRule判定同値性です。OHLC→Indicator計算、注文執行、ブローカー制約の完全同値性はまだ証明しません。

## Shadow / Forward

- PASSしたValidationとParityが必要です。
- 注文を出さず、現在Market DataでRule判定と想定Entryを保存します。
- BAR CLOSE Ruleでは確定バーの重複観測を防ぎます。
- TICK/任意時点は手動観測です。
- Spread倍率 / 追加Slippageから想定Entryをモデル計算します。
- Min Observations / Max UNKNOWN% / Max DQ Error%を事前設定できます。
- アプリ起動中だけ動作します。

## Limited Release

Release Recordには以下を固定します。

- Candidate / Rule version
- Validation Run / Validation Data version
- Parity Report
- Shadow Session
- EA / Adapter Code Version
- Config Version
- Max Risk %
- Max Lot
- Max Trades / Session
- Max Spread
- Daily Loss Stop R
- Max DD Stop R
- Max Loss Streak
- Allowed DQ
- UTC / JST day basis
- explicit approval

Release Record作成は、ブローカー自動注文の開始ではありません。

## Monitoring / APP STOP

Monitor Event:
- Trade Result
- Data Issue
- Execution Issue
- Regime Shift
- Manual Review

保存可能:
- Realized R
- Risk %
- Lot
- Spread
- Slippage
- DQ
- Session Key
- Note

APP STOP判定:
- Risk上限
- Lot上限
- Spread上限
- DQ不許可
- Max Trades / Session
- Daily Loss Stop
- Max DD
- Max Loss Streak
- Manual Stop

Daily Lossは、その日の最終損益ではなく、時系列途中で一度でもStop閾値を超えたかを履歴から確認します。

**重要:** APP STOPはDEPA FX内のRelease状態を停止として記録するControlです。
外部EAやブローカー注文を物理的に停止する機能ではありません。

## 裁量トレーダー学習ループ

新規PLAN時:
- Pre-decision Confidence 0-100
- 事前の反証 / 見送り条件
- 記録時刻

Journal Review:
- Rule Adherence
- Decision Quality
- Risk Discipline
- Manual Intervention
- Execution Quality
- News Context
- Exception Reason

これにより、WIN/LOSSと「判断の質」「ルール順守」「執行」「Risk discipline」を分離できます。
事前記録時刻と実Entry時刻が両方ある場合、PRE_ENTRY / POST_ENTRYをEvidenceとCSVで区別します。

## Hypothesis / Rule Spec追加

Hypothesis Card:
- Automation Target
- Human Boundary
を必須化しました。

Rule Spec:
- BUY / SELL Directionを必須化しました。
- v3.8の旧COMPLETE RuleでもDirectionがない場合、v3.9では実効COMPLETEとして扱いません。

## Candidate state

- REGISTERED
- SPECIFIED
- VALIDATING
- VALIDATED
- PARITY
- SHADOW
- RELEASED
- MONITORING
- PARKED
- REJECTED
- RETIRED

すべての状態変更に理由を保存します。
次工程へ進むには対応証跡が必要です。

## Research JSON / CSV

Research JSON:
- Evidence
- Hypothesis
- Candidate
- Rule Spec
- Validation Run
- Parity Case / Report
- Shadow Session
- Release Record
- Monitor Event

Trade Journal CSVには、Basis provenanceに加えて以下を追加しました。
- predecision_recorded_at_utc
- predecision_timing_status
- predecision_confidence
- predecision_falsifier
- rule_adherence
- decision_quality
- risk_discipline
- manual_intervention
- execution_quality
- news_context
- exception_reason
- review_updated_at_utc

## v3.9で意図的に未実装

- ブローカーへの自動注文送信
- DEPA FXのAPP STOPから外部EAを物理停止する機能
- 全市場履歴を自動取得する完全なtick / bid-askバックテスター
- MQL / Pineの自動コード生成
- 自動パラメータ最適化
- Discovery順位や中央値閾値の自動採用

これらを未実装にしているのは、研究証拠と実装同値性がない状態で自動化範囲を先に広げないためです。

## 最終同期追記

最終配布版では、アプリ本体と大きな文字版manual.pdfを同じv3.9仕様へ同期しました。

追加で反映した点:
- `SPECIFIED -> VALIDATING -> Validation Run -> VALIDATED` の工程順を固定。
- 確認期間開始がHypothesis登録 / Rule Spec凍結より後かを記録し、
  `PROSPECTIVE_LOCKED` と `RETROSPECTIVE_ONLY` を分離。
- `RETROSPECTIVE_ONLY` は昇格用 `PASS_USER_CRITERIA` として扱わない。
- Downside Deviation R / Empirical worst-5% Expected Shortfall Rを追加。
- Validation `dataVersion`をEvidence IDだけでなく、実現R、Risk、Lot、pip value、
  Spread、Review項目などRun結果へ影響する入力まで含めて計算。
- Explore / Confirm / Purged / EmbargoedのSample LedgerをValidation Runへ保存。
- ReleaseへMax Slippageを追加。
- Validation時のExpected ProfileをReleaseへ固定。
- MonitoringへObserved vs Expected AvgR / Win%、Avg Loss R、Trades/Day、
  Avg Spread / Slippage、Session Distribution TVDを追加。
- 監視指標は記述値であり、市場変化の原因を自動判定するものではない。
- Service Worker cacheを `depa-fx-v3-9-v2` へ更新し、既存Home Screen版でも
  旧v3.9 cacheを置き換えられるようにした。

APP STOPは引き続きDEPA FX内のControl stateです。
外部EA / ブローカー注文を物理的に停止するControl effectivenessは別途EA側で実装・検証が必要です。

