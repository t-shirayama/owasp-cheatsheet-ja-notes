# 脆弱な依存関係管理チートシート 日本語訳

## Attribution

- Original: Vulnerable Dependency Management Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Vulnerable_Dependency_Management_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 日本語訳

脆弱な依存関係管理は、サードパーティライブラリや推移的依存関係に既知脆弱性が見つかった場合の検出、判断、対応を扱います。多くのプロジェクトは、HTTP通信、ファイル生成、データ解析などを依存関係に委ねています。そのため、アプリケーションのセキュリティは依存先の保守状態と脆弱性対応にも左右されます。

依存関係の自動分析は、プロジェクト開始時から組み込むことが推奨されます。後から導入すると、多数の指摘を一度に処理する必要があり、開発チームの負荷やリリースの遅延につながります。脆弱性が検出されたら、公開状況、修正版の有無、影響する呼び出し箇所、悪用可能性、代替コンポーネント、暫定緩和を評価します。

修正版がある場合は更新を優先します。修正版がない場合は、利用箇所を特定し、CVEの内容から必要な保護コードや入力検証を追加します。可能であれば脆弱性を再現するテストを作成し、対応が継続的に有効であることを確認します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.2 | 依存関係の脆弱性検出、評価、更新、緩和 |

