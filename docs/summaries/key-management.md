# 鍵管理チートシート 要約

## Attribution

- Original: Key Management Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/key-management.md](../translations/key-management.md)
- 開発チェックリスト: [../checklists/key-management.md](../checklists/key-management.md)

## 概要

鍵管理は、暗号鍵の生成、配布、保管、利用、ローテーション、失効、バックアップ、復旧、廃棄を扱う。暗号方式が強くても、鍵が弱い乱数で生成される、コードに埋め込まれる、用途が混在する、失効できない場合は保護が破綻する。

## 要点

- 暗号目的から鍵種別、アルゴリズム、鍵長、プロトコル、保管場所を選ぶ。
- 鍵を承認された暗号学的乱数生成器で生成する。
- 鍵の用途を分離し、鍵暗号化鍵とデータ暗号化鍵を分ける。
- KMS、HSM、シークレット保管庫などで鍵を保護する。
- 鍵の所有者、用途、作成日、有効期限、保管場所、アクセス権を追跡する。
- ローテーション、失効、廃棄、ゼロ化、侵害時復旧を手順化する。

## 実装時の注意点

- 鍵をコード、設定ファイル、ログ、コンテナイメージ、ビルド成果物に埋め込まない。
- 鍵材料をメモリ、コアダンプ、スワップ、例外、デバッグ出力へ漏らさない。
- 信頼ストア、証明書チェーン、信頼アンカーも運用管理対象にする。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V11.1 | 暗号目的、鍵種別、アルゴリズム、鍵長、用途分離の設計 |
| V11.2 | 安全な乱数生成、鍵生成、鍵合意、鍵強度 |
| V11.3 | KMS、HSM、シークレット保管庫、鍵暗号化鍵、保存時保護 |
| V11.5 | ローテーション、失効、廃棄、ゼロ化、侵害時復旧 |
| V13.3 | 証明書、信頼ストア、鍵配送、信頼アンカーの管理 |

