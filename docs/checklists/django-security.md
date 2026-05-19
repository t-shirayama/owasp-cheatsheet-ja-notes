# Djangoセキュリティチートシート 開発チェックリスト

## Attribution

- Original: Django Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Django_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/django-security.md](../translations/django-security.md)
- 要約: [../summaries/django-security.md](../summaries/django-security.md)

## 開発チェックリスト

- [ ] DEBUG=Falseを本番で設定する。
- [ ] ALLOWED_HOSTSを明示する。
- [ ] CSRFミドルウェアを有効にする。
- [ ] SESSION_COOKIE_SECUREとCSRF_COOKIE_SECUREを設定する。
- [ ] SECRET_KEYを安全に管理する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V13.4 | Djangoセキュリティチートシート の主要な管理策 |

