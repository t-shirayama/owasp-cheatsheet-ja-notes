# NPMセキュリティチートシート 開発チェックリスト

## Attribution

- Original: NPM Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/NPM_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../translations/npm-security.md](../translations/npm-security.md)
- 要約: [../summaries/npm-security.md](../summaries/npm-security.md)

## 開発チェックリスト

- [ ] `package-lock.json` などの lockfile をコミットする。
- [ ] CI では `npm ci` を使い、再現性のあるインストールを行う。
- [ ] 不要な依存関係と未使用 devDependency を削除する。
- [ ] 依存関係追加時に、メンテナンス状況、公開元、メンテナ、ダウンロード数、更新履歴を確認する。
- [ ] 更新時にメジャーバージョン、メンテナ変更、lifecycle script の変化をレビューする。
- [ ] `preinstall`、`install`、`postinstall` を任意コード実行経路として扱い、必要な場合だけ許可する。
- [ ] npm audit、SCA、Dependabot などで脆弱性を継続検出する。
- [ ] 修正不能な脆弱性に例外承認、期限、代替策を設定する。
- [ ] `.npmrc`、scope 別レジストリ、プロキシ、トークン保存場所をレビューする。
- [ ] 内部パッケージ名、scope、レジストリ解決順序で依存関係混乱を防ぐ。
- [ ] 公開トークンを最小権限、短寿命にし、CI/CD では OIDC trusted publishing を検討する。
- [ ] パッケージ所有者とメンテナに MFA を必須化する。
- [ ] 退職者、不要なメンテナ、不要な公開権限を削除する。
- [ ] パッケージ公開設定、scope、アクセス権を定期的に監査する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.1 | npm 依存関係、ロックファイル、SBOM、パッケージ出所の管理 |
| V15.2 | 脆弱な npm 依存関係、インストールスクリプト、トークン、公開権限、依存関係混乱対策 |

