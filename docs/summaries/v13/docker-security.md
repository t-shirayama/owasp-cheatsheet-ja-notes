# Dockerセキュリティチートシート 要約

## Attribution

- Original: Docker Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v13/docker-security.md](../../translations/v13/docker-security.md)
- 開発チェックリスト: [../../checklists/v13/docker-security.md](../../checklists/v13/docker-security.md)

## 概要

Docker環境では、イメージ、Dockerfile、権限、ネットワーク、シークレット、ホスト境界を安全に扱う必要があります。コンテナは万能な防御境界ではありません。

## 要点

- 最小イメージと不要パッケージ削減を行う。
- root実行を避ける。
- ホストへの過剰なマウントや特権を避ける。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V13.2 | Dockerセキュリティチートシート の主要な管理策 |

