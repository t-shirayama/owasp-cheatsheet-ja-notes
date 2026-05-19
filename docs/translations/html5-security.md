# HTML5セキュリティチートシート 日本語訳

## Attribution

- Original: HTML5 Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../summaries/html5-security.md](../summaries/html5-security.md)
- 開発チェックリスト: [../checklists/html5-security.md](../checklists/html5-security.md)

## 日本語訳

HTML5の各種APIは、ストレージ、通信、位置情報、CORS、postMessageなど強力な機能を提供します。APIごとの信頼境界とデータ保護が必要です。

## 主要な観点

- Web Storageに秘密情報を保存しない。
- postMessageのoriginとメッセージ形式を検証する。
- CORSを必要最小限に設定する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V3, V14 | HTML5セキュリティチートシート の主要な管理策 |

