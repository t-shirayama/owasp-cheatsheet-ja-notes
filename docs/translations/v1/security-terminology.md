# セキュリティ用語チートシート 日本語訳

## Attribution

- Original: Security Terminology Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Security_Terminology_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../../summaries/v1/security-terminology.md](../../summaries/v1/security-terminology.md)
- 開発チェックリスト: [../../checklists/v1/security-terminology.md](../../checklists/v1/security-terminology.md)

## 日本語訳

このチートシートは、開発者が混同しやすいセキュリティ用語を整理し、OWASP ASVSなどの要件を正しく実装するための共通語彙を提供します。

エンコーディングは公開された方式でデータ形式を変換することであり、それ自体はセキュリティ管理策ではありません。エスケープは、パーサがデータをコードや制御文字として解釈しないようにするエンコーディングの一種です。サニタイゼーションは危険な入力を削除、置換、変更する処理ですが、主要な防御ではなく補助的な防御として扱います。シリアライゼーションは保存や送信のためにオブジェクトを別形式へ変換する処理であり、信頼できないデータの復元はリモートコード実行などにつながることがあります。

暗号化は機密性のためにデータを復号可能な暗号文へ変換します。ハッシュは整合性確認などのために不可逆の固定長値を生成します。デジタル署名は送信元の真正性と改ざん検出を提供します。認証(AuthN)は利用者が誰かを確認する処理であり、認可(AuthZ)はその利用者が何を実行できるかを確認する処理です。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V1.1 | セキュリティ要件とアーキテクチャで用語を一貫させる |
| V6.1 | 暗号化、ハッシュ、署名を正しく区別する |
| V8.1 | データ保護とデータ処理の語彙を明確にする |
| V11.1 | 入力、出力、エンコーディングの用語を明確にする |
| V15.1 | セキュリティ管理プロセスで共通語彙を使う |

