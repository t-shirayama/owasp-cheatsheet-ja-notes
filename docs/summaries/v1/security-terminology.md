# セキュリティ用語チートシート 要約

## Attribution

- Original: Security Terminology Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Security_Terminology_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v1/security-terminology.md](../../translations/v1/security-terminology.md)
- 開発チェックリスト: [../../checklists/v1/security-terminology.md](../../checklists/v1/security-terminology.md)

## 概要

セキュリティ用語を正しく区別することで、要件、設計、レビュー、テストの誤解を減らします。特に、エンコーディングとエスケープ、サニタイゼーション、暗号化とハッシュ、認証と認可の違いを明確にします。

## 要点

- エンコーディングは互換性のための形式変換であり、単独では防御策ではない。
- エスケープはインタプリタが入力をコードとして解釈しないようにする。
- サニタイゼーションは補助的な防御であり、パラメータ化や出力エンコーディングを優先する。
- 暗号化、ハッシュ、署名は目的と可逆性が異なる。
- 認証は「誰か」、認可は「何を許可するか」を扱う。

## 実装時の注意点

- 設計書、レビューコメント、テストケースで同じ用語を同じ意味で使う。
- 用語の誤用が実装バグにつながる箇所は、原文や関連チートシートで確認する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.1, V6.1, V8.1, V11.1, V15.1 | セキュリティ用語の共通理解と適切な管理策選択 |

