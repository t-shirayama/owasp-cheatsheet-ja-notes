# NPMセキュリティチートシート 要約

## Attribution

- Original: NPM Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/NPM_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v15/npm-security.md](../../translations/v15/npm-security.md)
- 開発チェックリスト: [../../checklists/v15/npm-security.md](../../checklists/v15/npm-security.md)

## 概要

NPMエコシステムでは、依存関係、スクリプト、ロックファイル、公開設定、トークン、パッケージ乗っ取りを管理する必要があります。

## 要点

- 依存関係とロックファイルを管理する。
- npm scriptsとインストール時フックを注意深く扱う。
- 公開トークンとパッケージ権限を保護する。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.2 | NPMセキュリティチートシート の主要な管理策 |

