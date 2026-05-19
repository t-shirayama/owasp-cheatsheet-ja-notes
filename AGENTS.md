# AGENTS.md

## Project Overview

This repository contains unofficial Japanese translations, summaries, and development checklists derived from OWASP Cheat Sheet Series pages mapped through the ASVS index.

Primary source:

- https://cheatsheetseries.owasp.org/IndexASVS.html

This is a documentation-first repository. Treat accuracy, attribution, and license handling as part of the deliverable, not as optional polish.

## Source And License Rules

- Use official OWASP pages as the primary source. Prefer `cheatsheetseries.owasp.org`, `owasp.org`, and official OWASP GitHub repositories.
- Verify the current source URL before creating or substantially updating a document.
- Do not present this repository as an official OWASP translation.
- OWASP Cheat Sheet Series and ASVS materials are generally published under Creative Commons Attribution-ShareAlike 4.0 International. When deriving from them, preserve CC BY-SA 4.0 obligations.
- Every translated, summarized, or checklist document derived from OWASP content must include an `Attribution` section near the top.
- The `Attribution` section must include original title, source URL, copyright or author information available from the source, license name, license URL, change description, and retrieval date.
- Mark adaptations honestly, for example: `Japanese translation, summary, and development checklist added.`
- If a document incorporates non-OWASP third-party material, record that source and license separately.
- Do not copy large unrelated sections from source documents. Translate and summarize only the material needed for the target page.

## Required Document Shape

Use this structure for new documents unless the user asks for a different shape:

```markdown
# <Japanese title>

## Attribution

- Original: <Original title>
- Source: <Source URL>
- Copyright: <Copyright holder or author shown by source>
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation, summary, and development checklist added.
- Retrieved: YYYY-MM-DD

## 概要

## 日本語訳・要約

## 開発チェックリスト

## 実装時の注意点

## 参考資料
```

## Japanese Writing Style

- Write in clear, practical Japanese for software developers.
- Keep security terms consistent. Prefer commonly used terms such as 認証, 認可, 入力検証, 出力エンコーディング, セッション管理, 監査ログ, 脅威モデリング.
- Preserve normative strength. Translate MUST, SHOULD, and MAY as 必須, 推奨, and 許容 or 可能 where appropriate.
- Do not soften security requirements into vague advice.
- Keep checklists action-oriented. Start checklist items with verbs such as 確認する, 実装する, 禁止する, 記録する, テストする.
- If a term is ambiguous, include the English term in parentheses on first use.
- If the source is unclear or version-dependent, add a short note instead of guessing.

## Development Checklist Rules

- Convert guidance into implementation checks that a developer can verify.
- Include test or review checks when the source implies verifiable behavior.
- Keep checklist items specific enough to become issue tasks.
- Avoid broad items such as `セキュリティを考慮する`.
- Mention relevant failure modes, for example bypass, injection, privilege escalation, data leakage, replay, tampering, or logging gaps.
- Do not invent controls that are not supported by the source unless clearly marked as an additional note.

## Repository Conventions

- Use Markdown files.
- Prefer ASCII filenames with kebab-case, for example `docs/asvs/v2-authentication/password-storage.md`.
- Keep generated documents under `docs/` when adding topic files.
- Use `docs/asvs/` as the ASVS-first navigation layer.
- Use `docs/cheatsheets/` as the canonical home for Japanese translations, summaries, and development checklists.
- Do not duplicate a Cheat Sheet translation across multiple ASVS chapter files. Link to the canonical file instead.
- Use `docs/checklists/` for cross-cutting review checklists.
- Use `docs/templates/` for reusable document templates.
- Use `references/source-map.md` for ASVS-to-source-to-local-file mapping.
- Use `references/license-notes.md` for license and attribution operating notes.
- Use relative links for internal repository references.
- Do not add build systems, formatters, or package managers unless the user explicitly asks.
- Before editing, check the working tree with `git status --short`.
- Use `rg` or `rg --files` for searching when available.

## Validation

- For Markdown-only changes, review headings, links, attribution fields, and checklist completeness manually.
- If a Markdown linter or link checker is later added to this repository, run it before finalizing relevant changes.
- When source URLs are used, ensure they point to official pages and include the retrieval date in the document.

## Codex Workflow

- Read the relevant source page before drafting.
- Identify title, source URL, copyright or author statement, license statement, and retrieval date.
- Draft the Japanese document using the required shape.
- Preserve the original meaning and mark changes in the Attribution section.
- Summarize completed changes in the final response and mention any source or license uncertainty.
