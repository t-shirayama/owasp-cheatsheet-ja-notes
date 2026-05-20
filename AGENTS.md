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
- Mark adaptations honestly, for example: `Japanese translation added.`, `Japanese summary added.`, or `Development checklist added.`
- For bilingual pages that retain the English original and add Japanese translation, use a change note such as `English original retained for comparison. Japanese translation added. Source images stored locally.`
- If a document incorporates non-OWASP third-party material, record that source and license separately.
- Do not copy large unrelated sections from source documents. Translate and summarize only the material needed for the target page.
- For web-facing bilingual pages, prefer complete page coverage: preserve the source page order and reproduce all relevant headings, paragraphs, lists, tables, code blocks, and images unless there is a documented reason to omit a section.
- Store reused source images locally instead of hotlinking to the official site. Place them under `static/img/owasp-cheatsheets/<slug>/`, preserve the original meaning, and record image source URLs and change notes in the page attribution.
- Treat OWASP logos and trademarks separately from CC BY-SA content. Do not use OWASP branding in a way that suggests official endorsement or official translation status.

## Required Document Shape

For each source Cheat Sheet, create separate translation, summary, and checklist files unless the user asks for a different shape.

```markdown
# docs/translations/v<chapter>/<slug>.md

## Attribution

- Original: <Original title>
- Source: <Source URL>
- Copyright: <Copyright holder or author shown by source>
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: YYYY-MM-DD

## 関連ファイル

## 日本語訳

## ASVS との対応
```

```markdown
# docs/summaries/v<chapter>/<slug>.md

## Attribution

- Original: <Original title>
- Source: <Source URL>
- Copyright: <Copyright holder or author shown by source>
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese summary added.
- Retrieved: YYYY-MM-DD

## 関連ファイル

## 概要

## 要点

## 実装時の注意点
```

```markdown
# docs/checklists/v<chapter>/<slug>.md

## Attribution

- Original: <Original title>
- Source: <Source URL>
- Copyright: <Copyright holder or author shown by source>
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Development checklist added.
- Retrieved: YYYY-MM-DD

## 関連ファイル

## 開発チェックリスト

## ASVS との対応

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
- Prefer ASCII filenames with kebab-case, for example `docs/translations/v6/password-storage.md`.
- Keep generated documents under `docs/` when adding topic files.
- Use `docs/asvs/` as the ASVS-first navigation layer.
- Use `docs/translations/v1/` through `docs/translations/v17/` for Japanese translation files.
- Use `docs/summaries/v1/` through `docs/summaries/v17/` for Japanese summary files.
- Use `docs/checklists/v1/` through `docs/checklists/v17/` for development checklist files. Keep cross-cutting checklist indexes directly under `docs/checklists/`.
- When a Cheat Sheet maps to multiple ASVS chapters, place the file under the first or primary ASVS chapter folder and link to that single copy from other chapters.
- Do not duplicate a source Cheat Sheet across multiple ASVS chapter files. Link to the translation, summary, and checklist files instead.
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
- Draft separate translation, summary, and checklist files using the required shape.
- Preserve the original meaning and mark changes in the Attribution section.
- Summarize completed changes in the final response and mention any source or license uncertainty.
