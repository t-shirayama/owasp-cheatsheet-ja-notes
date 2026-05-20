# 仮想パッチ適用チートシート 日本語訳

## Attribution

- Original: Virtual Patching Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Virtual_Patching_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 日本語訳

仮想パッチ(Virtual Patching)は、既知の脆弱性に対する悪用試行をアプリケーション手前のセキュリティ制御層で検出、遮断、記録する手法です。ソースコード自体を変更しなくても、WAF、IPS、Webサーバプラグイン、アプリケーション層フィルタなどで攻撃トラフィックが脆弱な処理へ到達しないようにします。

コード修正が最優先であることは変わりません。ただし、修正に時間がかかる、第三者製品でコードを変更できない、外部委託の都合ですぐにリリースできない、といった状況では仮想パッチが露出時間を短縮します。仮想パッチはコード修正の代替ではなく、修正までのリスク低減策として運用します。

プロセスは、準備、識別、分析、仮想パッチ作成、実装とテスト、復旧とフォローアップで構成します。許可リスト型の正のセキュリティモデルは強い保護を提供しますが、実装と保守に労力が必要です。禁止リスト型は早く適用できますが、回避されやすいため、対象と限界を明確にします。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.2 | 脆弱性対応、リスク低減、パッチ管理プロセス |

