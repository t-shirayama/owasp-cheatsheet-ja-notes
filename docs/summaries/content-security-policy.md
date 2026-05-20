# Content Security Policy チートシート 要約

## Attribution

- Original: Content Security Policy Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/content-security-policy.md](../translations/content-security-policy.md)
- 開発チェックリスト: [../checklists/content-security-policy.md](../checklists/content-security-policy.md)

## 概要

Content Security Policy (CSP) は、ブラウザにスクリプト、スタイル、画像、フォーム送信先、フレーム、オブジェクトなどの読み込み元と実行条件を制限させる防御層である。XSS やクリックジャッキングの影響を下げるが、コンテキスト別エンコーディングや安全な DOM 操作の代替ではない。

## 要点

- HTTP レスポンスヘッダーで CSP を配信し、全レスポンスに適用する。
- Report-Only で違反を収集し、正規機能への影響を確認してから強制モードへ移行する。
- strict CSP を目指し、nonce または hash と `strict-dynamic` を検討する。
- nonce はレスポンスごとに一度だけ使い、攻撃者が挿入した script へ機械的に付与しない。
- `unsafe-inline`、`unsafe-eval`、過剰なワイルドカード、広すぎる CDN 許可を避ける。
- `frame-ancestors`、`form-action`、`object-src`、`base-uri`、`connect-src`、違反レポートを用途に合わせて設定する。

## 実装時の注意点

- meta タグによる CSP は機能制限があるため、ヘッダー配信を優先する。
- CSP 違反レポートには正規機能の破壊と攻撃兆候の両方が含まれるため、監視と調整を継続する。
- CSP は防御の多層化であり、XSS 原因の修正を先送りする理由にしない。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V3.1 | CSP ヘッダー、strict CSP、nonce/hash、frame-ancestors、違反レポート |
| V3.2 | XSS、DOM XSS、クリックジャッキング、XS-Leaks に対する防御の多層化 |

