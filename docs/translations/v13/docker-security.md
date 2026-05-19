# Dockerセキュリティチートシート 日本語訳

## Attribution

- Original: Docker Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-20

## 関連ファイル

- 要約: [../../summaries/v13/docker-security.md](../../summaries/v13/docker-security.md)
- 開発チェックリスト: [../../checklists/v13/docker-security.md](../../checklists/v13/docker-security.md)

## 日本語訳

Docker環境では、イメージ、Dockerfile、権限、ネットワーク、シークレット、ホスト境界を安全に扱う必要があります。コンテナは万能な防御境界ではありません。

## 主要な観点

- 最小イメージと不要パッケージ削減を行う。
- root実行を避ける。
- ホストへの過剰なマウントや特権を避ける。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V13.2 | Dockerセキュリティチートシート の主要な管理策 |

