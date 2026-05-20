# Djangoセキュリティチートシート 要約

## Attribution

- Original: Django Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Django_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/django-security.md](../translations/django-security.md)
- 開発チェックリスト: [../checklists/django-security.md](../checklists/django-security.md)

## 概要

Djangoのセキュリティ設定では、DEBUG無効化、ALLOWED_HOSTS、CSRF、Cookie属性、HTTPS、シークレット管理、ORMの安全な利用が重要です。

## 要点

- 本番でDEBUGを無効化する。
- Django標準のCSRFや認証機構を活用する。
- 設定とシークレットを環境ごとに管理する。

## 実装時の注意点

- この要約はASVS Indexでの利用を前提にした実装者向け整理です。詳細確認時は原文を参照してください。
- 関連する認証、認可、ログ、入力検証、暗号、通信保護の管理策と組み合わせて適用します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V13.4 | Djangoセキュリティチートシート の主要な管理策 |

