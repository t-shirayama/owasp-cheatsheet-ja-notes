# ソフトウェアサプライチェーンセキュリティチートシート 要約

## Attribution

- Original: Software Supply Chain Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Software_Supply_Chain_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/software-supply-chain-security.md](../translations/software-supply-chain-security.md)
- 開発チェックリスト: [../checklists/software-supply-chain-security.md](../checklists/software-supply-chain-security.md)

## 概要

ソフトウェアサプライチェーンは、依存関係、ビルド、CI/CD、署名、成果物、配布経路を含みます。改ざんや依存関係リスクを継続的に管理します。

## 要点

- 依存関係とビルド成果物を追跡する。
- CI/CDの権限とシークレットを保護する。
- 署名やSBOMで成果物の信頼性を高める。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15 | ソフトウェアサプライチェーンセキュリティチートシート の主要な管理策 |

