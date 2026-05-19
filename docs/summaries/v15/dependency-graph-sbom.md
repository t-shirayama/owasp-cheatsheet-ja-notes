# 依存関係グラフとSBOMチートシート 要約

## Attribution

- Original: Dependency Graph and SBOM Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Dependency_Graph_SBOM_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v15/dependency-graph-sbom.md](../../translations/v15/dependency-graph-sbom.md)
- 開発チェックリスト: [../../checklists/v15/dependency-graph-sbom.md](../../checklists/v15/dependency-graph-sbom.md)

## 概要

依存関係グラフとSBOMは、利用しているライブラリ、バージョン、推移的依存関係、ライセンス、脆弱性影響を把握するための基礎資料です。

## 要点

- 直接依存と推移的依存を把握する。
- SBOMを生成しリリース単位で保管する。
- 脆弱性情報と依存関係を継続的に照合する。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.1 | 依存関係グラフとSBOMチートシート の主要な管理策 |

