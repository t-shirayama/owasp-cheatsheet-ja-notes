# マイクロサービスセキュリティチートシート 日本語訳

## Attribution

- Original: Microservices Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Microservices_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 日本語訳

マイクロサービスでは、サービス間通信、認証、認可、設定、シークレット、可観測性、障害分離を分散環境で一貫して管理する必要があります。

## 主要な観点

- サービス間通信を認証・暗号化する。
- 境界ごとに認可を実施する。
- 集中設定とシークレット管理を安全に行う。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V2.2, V11.7 | マイクロサービスセキュリティチートシート の主要な管理策 |

