# 脆弱な依存関係管理チートシート 開発チェックリスト

## Attribution

- Original: Vulnerable Dependency Management Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Vulnerable_Dependency_Management_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: 2026-05-20

## 関連ファイル

- 日本語訳: [../../translations/v15/vulnerable-dependency-management.md](../../translations/v15/vulnerable-dependency-management.md)
- 要約: [../../summaries/v15/vulnerable-dependency-management.md](../../summaries/v15/vulnerable-dependency-management.md)

## 開発チェックリスト

- [ ] 直接依存と推移的依存を一覧化する。
- [ ] 依存関係の脆弱性スキャンをCIまたは定期ジョブに組み込む。
- [ ] 検出されたCVEについて、影響バージョン、修正版、悪用条件を確認する。
- [ ] 脆弱な依存関係がアプリケーション内で実際に呼び出されるか確認する。
- [ ] 修正版がある場合は更新し、単体テスト、統合テスト、回帰テストを実行する。
- [ ] 修正版がない場合は、保護コード、設定変更、利用停止、代替コンポーネントを検討する。
- [ ] 重大な依存関係リスクに対応期限、所有者、受容判断を記録する。
- [ ] 依存関係の追加時に保守状況、ライセンス、既知脆弱性をレビューする。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.2 | 依存関係の脆弱性検出、更新、緩和、記録 |

