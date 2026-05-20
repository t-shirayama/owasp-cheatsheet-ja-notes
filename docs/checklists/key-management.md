# 鍵管理チートシート 開発チェックリスト

## Attribution

- Original: Key Management Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/key-management.md](../translations/key-management.md)
- 要約: [../summaries/key-management.md](../summaries/key-management.md)

## 開発チェックリスト

- [ ] アプリケーションの暗号目的を定義し、必要な鍵種別を棚卸しする。
- [ ] 鍵生成に承認された CSPRNG を使う。
- [ ] 鍵をソースコード、設定ファイル、ログ、イメージ、ビルド成果物に埋め込まない。
- [ ] データ暗号化鍵と鍵暗号化鍵を分離する。
- [ ] KMS、HSM、シークレット保管庫など安全な保管場所を選ぶ。
- [ ] 鍵の用途を限定し、暗号化、署名、MAC、鍵ラップで使い回さない。
- [ ] 鍵アクセス権を最小化し、サービスアカウント単位で監査する。
- [ ] 鍵所有者、用途、アルゴリズム、鍵長、作成日、有効期限、保管場所を記録する。
- [ ] ローテーション、失効、廃棄、ゼロ化の手順を定義する。
- [ ] 鍵侵害時の影響範囲特定、再発行、再暗号化、旧鍵失効をテストする。
- [ ] メモリ、コアダンプ、スワップ、例外、デバッグ出力へ鍵材料が漏れないことを確認する。
- [ ] 信頼ストア、証明書チェーン、信頼アンカーの更新と期限切れを監視する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V11.1 | 暗号目的、鍵種別、アルゴリズム、鍵長、用途分離の設計 |
| V11.2 | 安全な乱数生成、鍵生成、鍵合意、鍵強度 |
| V11.3 | KMS、HSM、シークレット保管庫、鍵暗号化鍵、保存時保護 |
| V11.5 | ローテーション、失効、廃棄、ゼロ化、侵害時復旧 |
| V13.3 | 証明書、信頼ストア、鍵配送、信頼アンカーの管理 |

