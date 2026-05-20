# Content Security Policy チートシート 日本語訳

## Attribution

- Original: Content Security Policy Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../summaries/content-security-policy.md](../summaries/content-security-policy.md)
- 開発チェックリスト: [../checklists/content-security-policy.md](../checklists/content-security-policy.md)

## 日本語訳

Content Security Policy (CSP) は、サーバが `Content-Security-Policy` ヘッダーを返すことで、ブラウザに対してスクリプト、スタイル、画像、フォーム送信先、フレーム、オブジェクトなどの読み込み元と実行条件を制限させる防御層である。CSP は XSS、クリックジャッキング、クロスサイトリークの影響を下げるが、脆弱な出力処理そのものを修正するものではない。XSS 防止の基本であるコンテキスト別出力エンコーディングと安全な DOM 操作の上に追加する。

XSS 対策としての CSP は、インラインスクリプト、任意ドメインからのリモートスクリプト、`eval` などの危険な JavaScript、攻撃者が挿入したフォーム送信、`object` などのレガシー実行要素を制限する。クリックジャッキング対策では、旧来の `X-Frame-Options` より `frame-ancestors` を優先する。

CSP は HTTP レスポンスヘッダーで配信するのが推奨であり、全レスポンスに適用する。`Content-Security-Policy-Report-Only` は破壊的変更を避けながら違反を収集する移行段階に使う。meta タグによる CSP は一部機能、特にフレーム制御、sandbox、違反報告エンドポイントが使えないため制約を理解して使う。`X-Content-Security-Policy` や `X-WebKit-CSP` は古く不安定なため使わない。

現在の推奨は、過剰な許可リストではなく strict CSP を目指すことである。nonce ベースでは、各 HTTP レスポンスごとに一度だけ使うランダム値を生成し、その nonce を許可する script タグだけへ付与する。攻撃者が挿入した script タグにも nonce を機械的に付けるミドルウェアは危険である。hash ベースでは、許可するインラインスクリプトの内容に対するハッシュを `script-src` に指定するが、空白や整形変更でもハッシュが変わる点に注意する。`strict-dynamic` は、nonce または hash で信頼されたスクリプトが追加するスクリプトを信頼するために使える。

CSP の設計では、`default-src` を基準にしつつ、`script-src`、`style-src`、`img-src`、`connect-src`、`font-src`、`form-action`、`object-src`、`base-uri`、`frame-ancestors`、`upgrade-insecure-requests`、`report-to` または `report-uri` を用途に合わせて定義する。`unsafe-inline`、`unsafe-eval`、過剰なワイルドカード、広すぎる CDN 許可は避ける。違反レポートは監視し、正規機能の破壊と攻撃兆候の両方を確認する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V3.1 | CSP ヘッダー、strict CSP、nonce/hash、frame-ancestors、違反レポートによるクライアント側防御 |
| V3.2 | XSS、DOM XSS、クリックジャッキング、XS-Leaks に対する防御の多層化 |

