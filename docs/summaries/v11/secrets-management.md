# シークレット管理チートシート 要約

## Attribution

- Original: Secrets Management Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v11/secrets-management.md](../../translations/v11/secrets-management.md)
- 開発チェックリスト: [../../checklists/v11/secrets-management.md](../../checklists/v11/secrets-management.md)

## 概要

シークレット管理は、APIキー、パスワード、トークン、証明書、秘密鍵を安全に保存、配布、ローテーション、監査するための実践です。

## 要点

- シークレットをコードやイメージに埋め込まない。
- 専用のシークレットストアを使う。
- アクセス、利用、ローテーションを監査する。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V11.7, V13.3 | シークレット管理チートシート の主要な管理策 |

