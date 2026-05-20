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
# docs/translations/<slug>.md

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
# docs/summaries/<slug>.md

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
# docs/checklists/<slug>.md

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
- Prefer ASCII filenames with kebab-case, for example `docs/translations/password-storage.md`.
- Keep generated documents under `docs/` when adding topic files.
- Use `docs/asvs/` as the ASVS-first navigation layer.
- Use `docs/translations/` directly for Japanese translation files; do not create ASVS chapter subdirectories such as `v1/`.
- Use `docs/originals/` directly for English original source files. These files should keep the official English Markdown content for local reference and include Attribution.
- Use `docs/summaries/` directly for Japanese summary files; do not create ASVS chapter subdirectories such as `v1/`.
- Use `docs/checklists/` directly for development checklist files. Keep cross-cutting checklist indexes directly under `docs/checklists/`.
- Use `docs/bilingual/` directly for web-facing bilingual pages; Docusaurus doc IDs should be slug-only.
- When a Cheat Sheet maps to multiple ASVS chapters, keep one slug-named copy under the relevant parent folder and link to that single copy from all ASVS pages.
- Do not duplicate a source Cheat Sheet across multiple ASVS chapter files. Link to the translation, summary, and checklist files instead.
- Use `docs/templates/` for reusable document templates.
- Use `references/source-map.md` for ASVS-to-source-to-local-file mapping.
- Use `references/license-notes.md` for license and attribution operating notes.
- Use relative links for internal repository references.
- Do not add build systems, formatters, or package managers unless the user explicitly asks.
- Add repository-specific Codex skills, local helper hooks, or git hooks when they materially improve repeatability, validation, or maintenance safety. Keep them scoped to this repository's documentation workflow and document how they are used.
- Do not add broad automation hooks that silently rewrite content, fetch network resources, or change generated files unless the user asked for that workflow or the hook is clearly opt-in.
- Before editing, check the working tree with `git status --short`.
- Use `rg` or `rg --files` for searching when available.

## Commit Rules

- Prefer one task per commit. A task should be a coherent unit such as one document expansion, one generator behavior change plus its generated outputs, or one visual/layout adjustment.
- Do not mix unrelated documentation content changes, generator logic changes, and visual design changes in the same commit unless they are required for the same user-requested task.
- When a generator change produces broad output, commit the generator change and its necessary generated files together, but revert unrelated generated diffs before committing.
- If the user asks for multiple tasks, split commits by task or by a sensible V1/pilot-sized unit.
- Before committing, review `git status --short` and `git diff --stat` to confirm the commit scope matches the task.

## Docusaurus Site Rules

- This repository publishes an unofficial ASVS-focused bilingual site with Docusaurus. The web-facing content source is `docs/bilingual/`.
- Keep the public site clearly unofficial. The site title, page footer or attribution must not imply an official OWASP translation.
- The left sidebar is ASVS-first, not topic-category-first. Keep V1 through V17 visible in ASVS order, with Vx.y child sections below each V chapter. Place matching Cheat Sheets under the relevant Vx.y sections; if a web-facing bilingual page is not ready, use a lightweight shell page/link so the navigation structure remains complete.
- Do not add top-level navigation links such as `ASVS Cheat Sheets` or `はじめに` back into the header unless the user explicitly asks. Avoid duplicating the same page title in both header/sidebar and page content.
- The right-side page TOC is intentionally disabled. Do not reintroduce a right sidebar or right-side table of contents unless the user explicitly asks.
- Page content should be centered with left and right margin similar to the official OWASP Cheat Sheet pages. Keep the left sidebar wide enough for long ASVS and Cheat Sheet labels; the current design uses `--doc-sidebar-width` in `src/css/custom.css`.
- Cheat Sheet pages should use the banner/hero as the only page title area. Hide Docusaurus' default generated title when a `docHero` is present.
- Banner content should be minimal: page title, Japanese title where useful, last updated date, reading time, and ASVS/category. Do not show labels such as `ASVS bilingual view` in the banner.
- Banner imagery should vary by major ASVS/category theme and should use local assets under `static/img/`.
- Use the local bundled fonts (`@fontsource-variable/inter` and `@fontsource-variable/noto-sans-jp`) so the site does not depend on remote font delivery.
- Maintain both light and dark modes. In dark mode, English and Japanese bilingual blocks must be visually distinguishable by background/accent color.
- Code blocks should use fenced language identifiers where possible and keep the VS Code-like framed style and syntax highlighting.
- For visual design changes, follow the four basic design principles: proximity, alignment, repetition, and contrast. Related elements should be grouped, edges and starting positions should align intentionally, recurring UI patterns should be consistent, and meaningful differences should be visible through size, color, weight, or spacing.
- Before finishing layout work, check obvious alignment relationships such as header/sidebar spacing, breadcrumb/title start positions, tab/card widths, and footer/content alignment.

## Bilingual Page Rules

- Web-facing bilingual pages live directly under `docs/bilingual/<slug>.md`; do not place them under `v1/` through `v17/` folders.
- English original source documents live directly under `docs/originals/<slug>.md`; keep them separate from `docs/translations/` and `docs/bilingual/`.
- `docs/originals/<slug>.md` should preserve the official English source Markdown as closely as practical. Add only the local Attribution wrapper and do not translate or summarize that body.
- Bilingual pages should have five display modes in this order: `原本`, `翻訳`, `要点`, `チェックリスト`, and `対比表示`. Only the selected mode should be visible.
- The `原本` mode should show the English original before translation so readers can inspect the source text without the bilingual comparison cards.
- The web-facing `要点` mode should be a simple summary of the translation. Do not include `実装時の注意点` or `ASVS との対応` in that tab; keep implementation checks in `チェックリスト` and ASVS mapping in source/reference files.
- `翻訳`, `要点`, and `チェックリスト` should not show repository maintenance sections such as `関連ファイル` on the web page.
- Source reference/link sections such as `References` should not be translated. Move them out of the main reading tabs and render them near the bottom as English reference metadata, similar to Attribution.
- Place web-facing Attribution near the bottom of the page, after the main reading experience, while still preserving all required attribution fields.
- `対比表示` must preserve the official source order and should be full-page coverage for Full pages.
- For Full bilingual pages, the Japanese translation must be a full translation of the same source coverage, not a short summary. Do not rely on a summary-style translation panel to satisfy a Full page.
- Every meaningful English heading, paragraph, list item, and table row in a Full bilingual page should have a corresponding Japanese translation. Avoid leaving English-only bilingual pair cards unless the segment is a shared code block, image, separator, or intentionally untranslated technical artifact.
- When expanding a page from Sample to Full, update the source translation file under `docs/translations/<slug>.md` first, then regenerate `docs/bilingual/<slug>.md` so the translation tab and comparison tab stay aligned.
- Before finalizing Full bilingual work, inspect the generated page for missing `日本語 (翻訳)` blocks and for translation panels that are substantially shorter than the source.
- In `対比表示`, keep each English original segment and corresponding Japanese translation in the same bilingual pair card. Split long text by paragraph, but keep each contiguous bullet or numbered list block together in one card so list context is not lost. Align English and Japanese card granularity; do not let one side split list items into separate cards when the other side presents the list as one block.
- Shared code blocks and images must not be inserted between `English (原文)` and `日本語 (翻訳)`. Put shared code/images after the Japanese translation in a separate `コード・画像 (共通)` card.
- Do not duplicate identical code blocks or images in both English and Japanese blocks. Shared technical artifacts should appear once in the common card.
- If a heading applies only to a following code block or image, attach that heading to the common card instead of creating an empty English/Japanese text pair.
- Keep original code, configuration, commands, identifiers, and protocol names unchanged unless the source itself is being corrected. Add Japanese explanation around them rather than translating identifiers.
- When updating `tools/generate-bilingual-samples.mjs`, regenerate the affected pages and inspect the diff. If the generator updates unrelated pages, revert unrelated generated diffs before committing unless the user asked for a broad regeneration.

## Documentation Maintenance Order

For each Cheat Sheet maintenance or expansion task, proceed in this order unless the user explicitly requests a different scope:

1. Update the English original source document under `docs/originals/<slug>.md` from the current official OWASP source.
2. Update the Japanese translation under `docs/translations/<slug>.md` so it tracks the current English source without omitting meaningful content.
3. Update the Japanese summary under `docs/summaries/<slug>.md`, reflecting the revised source and translation.
4. Update the development checklist under `docs/checklists/<slug>.md`, keeping checks actionable and source-backed.
5. Regenerate or update the web-facing bilingual page under `docs/bilingual/<slug>.md`, including `原本`, `翻訳`, `要点`, `チェックリスト`, and `対比表示`.

Do not update the bilingual display first and leave the source documents stale. The bilingual page is a generated/public reading layer, while `docs/originals/`, `docs/translations/`, `docs/summaries/`, and `docs/checklists/` are the maintainable source layers.

## Validation

- For Markdown-only changes, review headings, links, attribution fields, and checklist completeness manually.
- If a Markdown linter or link checker is later added to this repository, run it before finalizing relevant changes.
- When source URLs are used, ensure they point to official pages and include the retrieval date in the document.
- For Docusaurus/site changes, run `npm run build` and `git diff --check`.
- If a change affects generated bilingual pages, run `node tools\generate-bilingual-samples.mjs` when needed and verify that changed files match the requested scope.
- For layout or visual changes, prefer a local browser check when tooling is available. If browser automation is unavailable, state that limitation and still run build/static checks.

## Codex Workflow

- Read the relevant source page before drafting.
- Identify title, source URL, copyright or author statement, license statement, and retrieval date.
- Draft separate translation, summary, and checklist files using the required shape.
- Preserve the original meaning and mark changes in the Attribution section.
- Summarize completed changes in the final response and mention any source or license uncertainty.
