# Change and Review History Policy

このメモは、変更履歴とレビュー履歴をどこに、どの粒度で記録するかを定めるものです。

## 基本方針

- 正式な変更履歴は Git のコミット履歴で管理する。
- ページ本文には、通常の編集履歴を逐一追記しない。
- 原文由来の変更、Attribution、Retrieved、ASVS 対応、レビュー状態は [source-map.md](source-map.md) と関連 reference ファイルで追跡する。
- 重要なレビュー完了や作業計画は [todo.md](todo.md)、[non-priority-detailing-plan.md](non-priority-detailing-plan.md)、このメモのルールに従って記録する。

## コミット粒度

| 変更種別 | 推奨粒度 | コミットメッセージ例 |
| --- | --- | --- |
| 1つの Cheat Sheet の翻訳、要約、チェックリスト更新 | 対象 Cheat Sheet 単位 | `docs: expand password storage translation` |
| 同一重点領域の複数ページレビュー | 領域単位 | `docs: expand xss adjacent priority review` |
| source map や TODO の状態整理 | 状態更新単位 | `docs: complete high priority todo scope` |
| 検査スクリプト、運用ルール | 目的単位 | `tools: add markdown validation checks` |
| 誤字、リンク、表記ゆれ | 小さな横断修正単位 | `docs: normalize authorization terminology` |

## source map の状態

[source-map.md](source-map.md) の `状態` は次の値を使う。

| 状態 | 意味 |
| --- | --- |
| 作成済み | ASVS Index coverage として翻訳、要約、チェックリストが存在する。 |
| 詳細化済み | 原文を確認し、翻訳、要約、チェックリストを実装・レビューに使える粒度へ拡張済み。 |
| 要再確認 | 原文 URL、ライセンス、ASVS 対応、本文のいずれかに確認が必要。 |

`備考` には、レビューの文脈を短く記録する。

- `ASVS Index coverage`
- `OAuth/OIDC priority review V1`
- `Non-priority detailing Wave 1`
- `Source URL updated`

## レビュー記録

レビュー履歴は、ページ本文ではなく次の場所に残す。

| 記録したい内容 | 記録場所 |
| --- | --- |
| 優先度タスクの完了 | [todo.md](todo.md) |
| 原文確認日と追従手順 | [source-update-policy.md](source-update-policy.md) |
| 非重点ページの詳細化順 | [non-priority-detailing-plan.md](non-priority-detailing-plan.md) |
| 対象 Cheat Sheet の状態 | [source-map.md](source-map.md) |
| 実際の差分 | Git コミット履歴 |

## 本文に履歴を書いてよい場合

次の場合だけ、本文または近い reference ファイルへ補足を残す。

- 原文の推奨値が変更され、古い値との違いを利用者が知る必要がある。
- 原文に曖昧さがあり、翻訳・要約で意図的な解釈や制限を加えた。
- 非 OWASP の第三者資料を取り込んだため、別途出典とライセンスを明記する必要がある。
- 互換性や運用上の理由で、推奨策をすぐ適用できない例外を記録する必要がある。

## 検証

履歴や状態を更新したら、次を実行する。

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/Invoke-MarkdownLint.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File tools/Invoke-LinkCheck.ps1
```
