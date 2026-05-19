# NPMセキュリティチートシート 要約

## Attribution

- Original: NPM Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/NPM_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v15/npm-security.md](../../translations/v15/npm-security.md)
- 開発チェックリスト: [../../checklists/v15/npm-security.md](../../checklists/v15/npm-security.md)

## 概要

NPM エコシステムでは、推移的依存、インストールスクリプト、ロックファイル、公開設定、トークン、typosquatting、依存関係混乱、パッケージ乗っ取りを管理する必要がある。依存関係の選定、再現性、監査、公開権限、CI/CD 実行を一体で扱う。

## 要点

- 不要な依存関係と未使用 devDependency を削除する。
- ロックファイルをコミットし、CI では `npm ci` を使う。
- 更新時にメジャーバージョン、メンテナ、公開元、スクリプト変更を確認する。
- lifecycle script は任意コード実行経路として扱い、必要な場合だけ許可する。
- npm audit や SCA で脆弱性を検出し、例外と修正期限を管理する。
- 公開トークンは最小権限、短寿命、MFA、trusted publishing を検討する。
- 内部パッケージは scope とレジストリ設定で依存関係混乱を防ぐ。

## 実装時の注意点

- 依存関係追加はコード追加と同じレビュー対象にする。
- `.npmrc`、scope 別レジストリ、トークン保存場所を確認する。
- 退職者や不要なメンテナ権限は速やかに削除する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.1 | npm 依存関係、ロックファイル、SBOM、パッケージ出所の管理 |
| V15.2 | 脆弱な npm 依存関係、インストールスクリプト、トークン、公開権限、依存関係混乱対策 |

