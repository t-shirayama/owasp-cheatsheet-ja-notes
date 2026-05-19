# Djangoセキュリティチートシート 日本語訳

## Attribution

- Original: Django Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Django_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../summaries/django-security.md](../summaries/django-security.md)
- 開発チェックリスト: [../checklists/django-security.md](../checklists/django-security.md)

## 日本語訳

Djangoのセキュリティ設定では、DEBUG無効化、ALLOWED_HOSTS、CSRF、Cookie属性、HTTPS、シークレット管理、ORMの安全な利用が重要です。

## 主要な観点

- 本番でDEBUGを無効化する。
- Django標準のCSRFや認証機構を活用する。
- 設定とシークレットを環境ごとに管理する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V13.4 | Djangoセキュリティチートシート の主要な管理策 |

