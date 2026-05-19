# CSRF防止チートシート 要約

## Attribution

- Original: Cross-Site Request Forgery Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v1/csrf-prevention.md](../../translations/v1/csrf-prevention.md)
- 開発チェックリスト: [../../checklists/v1/csrf-prevention.md](../../checklists/v1/csrf-prevention.md)

## 概要

CSRFは、ユーザーの認証済み状態を悪用して意図しないリクエストを送らせる攻撃です。トークン、SameSite Cookie、Origin/Referer検証、危険操作の再認証を組み合わせて防ぎます。

## 要点

- 状態変更リクエストにCSRFトークンを要求する。
- CookieにSameSite属性を設定する。
- OriginまたはRefererを補助的に検証する。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.3, V3, V4 | CSRF防止チートシート の主要な管理策 |

