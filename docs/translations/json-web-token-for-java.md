# Java向けJWTチートシート 日本語訳

## Attribution

- Original: JSON Web Token for Java Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 日本語訳

JWTは署名付きの自己完結型トークンです。Javaで扱う場合は、署名検証、アルゴリズム固定、期限、発行者、対象者、秘密情報の非格納を徹底します。

## 主要な観点

- 署名とアルゴリズムを必ず検証する。
- exp、iss、audなどのクレームを検証する。
- JWTに秘密情報を入れない。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V9.1 | Java向けJWTチートシート の主要な管理策 |

