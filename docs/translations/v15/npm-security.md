# NPMセキュリティチートシート 日本語訳

## Attribution

- Original: NPM Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/NPM_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../../summaries/v15/npm-security.md](../../summaries/v15/npm-security.md)
- 開発チェックリスト: [../../checklists/v15/npm-security.md](../../checklists/v15/npm-security.md)

## 日本語訳

NPMエコシステムでは、依存関係、スクリプト、ロックファイル、公開設定、トークン、パッケージ乗っ取りを管理する必要があります。

## 主要な観点

- 依存関係とロックファイルを管理する。
- npm scriptsとインストール時フックを注意深く扱う。
- 公開トークンとパッケージ権限を保護する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.2 | NPMセキュリティチートシート の主要な管理策 |

