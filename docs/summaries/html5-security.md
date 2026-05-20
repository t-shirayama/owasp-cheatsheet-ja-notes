# HTML5セキュリティチートシート 要約

## Attribution

- Original: HTML5 Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/html5-security.md](../translations/html5-security.md)
- 開発チェックリスト: [../checklists/html5-security.md](../checklists/html5-security.md)

## 概要

HTML5の各種APIは、ストレージ、通信、位置情報、CORS、postMessageなど強力な機能を提供します。APIごとの信頼境界とデータ保護が必要です。

## 要点

- Web Storageに秘密情報を保存しない。
- postMessageのoriginとメッセージ形式を検証する。
- CORSを必要最小限に設定する。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V3, V14 | HTML5セキュリティチートシート の主要な管理策 |

