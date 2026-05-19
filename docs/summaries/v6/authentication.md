# 認証チートシート 要約

## Attribution

- Original: Authentication Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v6/authentication.md](../../translations/v6/authentication.md)
- 開発チェックリスト: [../../checklists/v6/authentication.md](../../checklists/v6/authentication.md)

## 概要

認証は主体の身元を確認する機能です。パスワード、MFA、セッション、リカバリ、レート制限、エラーメッセージ、ログを一貫して設計します。

## 要点

- 安全な認証要素と検証処理を使う。
- アカウント列挙と総当たりを防ぐ。
- 認証イベントを監視する。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V6 | 認証チートシート の主要な管理策 |

