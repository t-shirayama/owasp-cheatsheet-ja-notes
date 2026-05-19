# NPMセキュリティチートシート 日本語訳

## Attribution

- Original: NPM Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/NPM_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../../summaries/v15/npm-security.md](../../summaries/v15/npm-security.md)
- 開発チェックリスト: [../../checklists/v15/npm-security.md](../../checklists/v15/npm-security.md)

## 日本語訳

NPM エコシステムでは、依存関係の数、推移的依存、インストールスクリプト、パッケージ公開権限、アクセストークン、typosquatting、依存関係混乱、パッケージ乗っ取りがリスクになる。Node.js アプリケーションでは、パッケージの選定、ロック、監査、公開、CI/CD 実行を一体で管理する。

依存関係は最小化し、不要なパッケージ、未使用の devDependency、メンテナンスされていないパッケージを削除する。ロックファイルをコミットし、CI では `npm ci` など再現性のあるインストールを使う。更新は自動化しても、変更内容、メジャーバージョン、メンテナ、公開元、スクリプトの変化をレビューする。

`preinstall`、`install`、`postinstall` などの lifecycle script は任意コード実行経路である。CI や本番ビルドでスクリプト実行を許可するかを明示し、必要な場合だけ許可する。npm audit や SCA を使い、脆弱性を検出し、修正不能な場合はリスク受容と代替策を記録する。

公開側では、パッケージ所有者に MFA を必須化し、公開トークンを最小権限かつ短寿命にし、CI/CD の OIDC trusted publishing などを検討する。パッケージ名、scope、公開設定、アクセス権、退職者や不要なメンテナ権限を管理し、パッケージ乗っ取りを防ぐ。

設定では、信頼するレジストリ、scope 別レジストリ、`.npmrc`、プロキシ、トークン保存場所を確認する。依存関係混乱を防ぐため、内部パッケージ名、scope、レジストリ解決順序、プライベートパッケージの公開可否を管理する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.1 | npm 依存関係、ロックファイル、SBOM、パッケージ出所の管理 |
| V15.2 | 脆弱な npm 依存関係、インストールスクリプト、トークン、公開権限、依存関係混乱対策 |

