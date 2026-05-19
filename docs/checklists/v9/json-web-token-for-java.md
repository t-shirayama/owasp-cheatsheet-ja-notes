# Java向けJWTチートシート 開発チェックリスト

## Attribution

- Original: JSON Web Token for Java Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v9/json-web-token-for-java.md](../../translations/v9/json-web-token-for-java.md)
- 要約: [../../summaries/v9/json-web-token-for-java.md](../../summaries/v9/json-web-token-for-java.md)

## 開発チェックリスト

- [ ] alg=noneを拒否する。
- [ ] 許可アルゴリズムを固定する。
- [ ] 署名鍵を安全に管理する。
- [ ] exp、nbf、iss、audを検証する。
- [ ] トークン失効戦略を定義する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V9.1 | Java向けJWTチートシート の主要な管理策 |

