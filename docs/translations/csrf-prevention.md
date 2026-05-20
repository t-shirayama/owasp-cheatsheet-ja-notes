# CSRF防止チートシート 日本語訳

## Attribution

- Original: Cross-Site Request Forgery Prevention Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../summaries/csrf-prevention.md](../summaries/csrf-prevention.md)
- 開発チェックリスト: [../checklists/csrf-prevention.md](../checklists/csrf-prevention.md)

## 日本語訳

CSRFは、ユーザーの認証済み状態を悪用して意図しないリクエストを送らせる攻撃です。トークン、SameSite Cookie、Origin/Referer検証、危険操作の再認証を組み合わせて防ぎます。

## 主要な観点

- 状態変更リクエストにCSRFトークンを要求する。
- CookieにSameSite属性を設定する。
- OriginまたはRefererを補助的に検証する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.3, V3, V4 | CSRF防止チートシート の主要な管理策 |

