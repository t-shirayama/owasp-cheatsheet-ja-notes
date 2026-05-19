# 脆弱な依存関係管理チートシート 要約

## Attribution

- Original: Vulnerable Dependency Management Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Vulnerable_Dependency_Management_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v15/vulnerable-dependency-management.md](../../translations/v15/vulnerable-dependency-management.md)
- 開発チェックリスト: [../../checklists/v15/vulnerable-dependency-management.md](../../checklists/v15/vulnerable-dependency-management.md)

## 概要

依存関係に既知脆弱性が見つかったとき、単にスキャン結果を見るだけでなく、影響範囲、悪用可能性、修正版、暫定緩和、テストを含めて対応します。

## 要点

- 依存関係スキャンはプロジェクト初期から自動化する。
- 直接依存と推移的依存の両方を把握する。
- 修正版がある場合は更新し、互換性と回帰をテストする。
- 修正版がない場合は利用箇所を特定し、保護コードや代替依存関係を検討する。
- 脆弱性対応はチケット化し、リスク判断と期限を明確にする。

## 実装時の注意点

- スキャン結果の重大度だけでなく、アプリケーション内で実際に到達可能かを確認する。
- 依存関係更新で安全性が上がっても、機能回帰や設定変更が起きないことを検証する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.2 | 依存関係の脆弱性対応とパッチ管理 |

