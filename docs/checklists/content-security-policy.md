# Content Security Policy チートシート 開発チェックリスト

## Attribution

- Original: Content Security Policy Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/content-security-policy.md](../translations/content-security-policy.md)
- 要約: [../summaries/content-security-policy.md](../summaries/content-security-policy.md)

## 開発チェックリスト

- [ ] `Content-Security-Policy` ヘッダーを全 HTTP レスポンスへ設定する。
- [ ] `Content-Security-Policy-Report-Only` で破壊的影響を確認してから強制モードへ移行する。
- [ ] `default-src` を最小許可に設定する。
- [ ] `script-src` で nonce または hash ベースの strict CSP を検討する。
- [ ] nonce をレスポンスごとにランダム生成し、許可する script タグだけへ付与する。
- [ ] 攻撃者が挿入した script へ nonce を自動付与する置換ミドルウェアを禁止する。
- [ ] `unsafe-inline` と `unsafe-eval` を禁止または移行計画つきで削減する。
- [ ] `object-src 'none'` と `base-uri` を設定し、レガシー実行要素と base tag 悪用を抑える。
- [ ] `form-action` でフォーム送信先を制限する。
- [ ] `frame-ancestors` でクリックジャッキング対策を行う。
- [ ] `connect-src`、`img-src`、`font-src`、`style-src` を必要最小限にする。
- [ ] `upgrade-insecure-requests` の適用可否を確認する。
- [ ] `report-to` または `report-uri` で違反レポートを収集する。
- [ ] 違反レポートから正規機能の破壊と攻撃兆候を分類する。
- [ ] CSP を XSS 修正の代替にせず、出力エンコーディングと安全な DOM 操作も確認する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V3.1 | CSP ヘッダー、strict CSP、nonce/hash、frame-ancestors、違反レポート |
| V3.2 | XSS、DOM XSS、クリックジャッキング、XS-Leaks に対する防御の多層化 |

