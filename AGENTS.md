# AGENTS.md

## Project Overview

This repository contains the unofficial Japanese edition of an OWASP ASVS-focused Cheat Sheet index. It maintains local English originals, Japanese translations, and web-facing bilingual pages derived from OWASP Cheat Sheet Series pages mapped through the ASVS index.

Primary source:

- https://cheatsheetseries.owasp.org/IndexASVS.html

This is a documentation-first repository. Treat accuracy, attribution, license handling, and clear unofficial status as part of the deliverable.

## Source And License Rules

- Use official OWASP pages as the primary source. Prefer `cheatsheetseries.owasp.org`, `owasp.org`, and official OWASP GitHub repositories.
- Verify the current source URL before creating or substantially updating a document.
- Do not present this repository as an official OWASP translation.
- OWASP Cheat Sheet Series and ASVS materials are generally published under Creative Commons Attribution-ShareAlike 4.0 International. Preserve CC BY-SA 4.0 obligations when deriving from them.
- Every translated, original-reference, or bilingual document derived from OWASP content must include Attribution.
- Attribution must include original title, source URL, copyright or author information available from the source, license name, license URL, change description, and retrieval date.
- Mark adaptations honestly, for example `Japanese translation added.` or `English original retained for comparison. Japanese translation added.`
- If a document incorporates non-OWASP third-party material, record that source and license separately.
- Store reused source images locally instead of hotlinking to the official site. Place them under `static/img/owasp-cheatsheets/<slug>/` and record image source URLs and change notes in Attribution.
- Treat OWASP logos and trademarks separately from CC BY-SA content. Do not use OWASP branding in a way that suggests official endorsement.

## Document Shape

Translation files live directly under `docs/translations/`.

```markdown
# <日本語タイトル> 日本語訳

## Attribution

- Original: <Original title>
- Source: <Source URL>
- Copyright: <Copyright holder or author shown by source>
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: YYYY-MM-DD

## 日本語訳

## ASVS との対応
```

Original files live directly under `docs/originals/` and should preserve the official English Markdown as closely as practical, with only the local Attribution wrapper added.

Bilingual pages live directly under `docs/bilingual/` and are the public reading layer. They should be generated or updated from the original and translation source layers.

## Japanese Writing Style

- Write in clear, practical Japanese for software developers.
- Keep security terms consistent. Prefer commonly used terms such as 認証, 認可, 入力検証, 出力エンコーディング, セッション管理, 監査ログ, 脅威モデリング.
- Preserve normative strength. Translate MUST, SHOULD, and MAY as 必須, 推奨, and 許容 or 可能 where appropriate.
- Do not soften security requirements into vague advice.
- If a term is ambiguous, include the English term in parentheses on first use.
- If the source is unclear or version-dependent, add a short note instead of guessing.
- Keep original code, configuration, commands, identifiers, protocol names, and product names unchanged unless the source itself is being corrected.

## Repository Conventions

- Use Markdown files.
- Prefer ASCII filenames with kebab-case, for example `docs/translations/password-storage.md`.
- Use `docs/asvs/` as the ASVS-first navigation layer.
- Use `docs/originals/`, `docs/translations/`, and `docs/bilingual/` directly. Do not create ASVS chapter subdirectories such as `v1/`.
- Do not duplicate a source Cheat Sheet across multiple ASVS chapter files. Link to the single slug-named original, translation, or bilingual page instead.
- Use `docs/templates/` for reusable document templates.
- Use `references/source-map.md` for ASVS-to-source-to-local-file mapping.
- Use `references/bilingual-map.md` for public bilingual page coverage and local file mappings.
- Treat `references/catalog.json` as the machine-readable source for generated maps and public listings.
- Use `references/license-notes.md` for license and attribution operating notes.
- Use `references/todo.md` only for unfinished work. Remove completed tasks instead of leaving `[x]` entries behind.
- Use relative links for internal repository references.
- Before editing, check the working tree with `git status --short`.
- Use `rg` or `rg --files` for searching when available.

## Docusaurus Site Rules

- The public site is an unofficial ASVS-focused bilingual site titled `OWASP ASVS チートシート索引 日本語版`. The web-facing content source is `docs/bilingual/`.
- Keep the public site clearly unofficial. Site title, footer, and Attribution must not imply an official OWASP translation.
- The public listing at `docs/bilingual/index.md` must reflect current mappings from `references/catalog.json` / `references/bilingual-map.md`.
- The left sidebar is ASVS-first. Keep V1 through V17 visible in ASVS order, with Vx.y child sections below each chapter.
- Do not add top-level navigation links such as `ASVS Cheat Sheets` or `はじめに` back into the header unless explicitly requested.
- The right-side page TOC is intentionally disabled. Do not reintroduce a right sidebar or right-side table of contents.
- Cheat Sheet pages should use the banner/hero as the only page title area. Hide Docusaurus' default generated title when a `docHero` is present.
- Banner content should be minimal: page title, Japanese title where useful, last updated date, reading time, and ASVS/category.
- Use local bundled fonts (`@fontsource-variable/inter` and `@fontsource-variable/noto-sans-jp`) so the site does not depend on remote font delivery.
- Maintain both light and dark modes. In dark mode, English and Japanese bilingual blocks must be visually distinguishable by background/accent color.
- Code blocks should use fenced language identifiers where possible and keep the VS Code-like framed style and syntax highlighting.
- For visual changes, check obvious alignment relationships such as header/sidebar spacing, breadcrumb/title start positions, tab widths, and footer/content alignment.

## Bilingual Page Rules

- Bilingual pages have three display modes in this order: `原文`, `翻訳`, `対比表示`.
- Only the selected mode should be visible.
- `原文` shows the English original before translation so readers can inspect the source text without comparison cards.
- `翻訳` shows the Japanese translation and should not include repository maintenance sections such as `関連ファイル`.
- `対比表示` must preserve the official source order and should cover the full public page.
- Every meaningful English heading, paragraph, list item, and table row in a public bilingual page should have a corresponding Japanese translation.
- Avoid English-only pair cards unless the segment is a shared code block, image, separator, or intentionally untranslated technical artifact.
- Shared code blocks and images must not be duplicated in both English and Japanese blocks. Put shared artifacts after the Japanese translation in a `コード・画像 (共通)` card.
- Source reference/link sections such as `References` should not be translated. Render them near the bottom as English reference metadata, similar to Attribution.
- Place public-page Attribution near the bottom of the page after the main reading experience.
- If a public bilingual page still uses large English-only and Japanese-only blocks in `対比表示`, list it in `references/todo.md` until it is converted to paragraph-level `bilingualPair` coverage.

## Maintenance Order

For each Cheat Sheet maintenance or expansion task, proceed in this order unless the user explicitly requests a different scope:

1. Update the English original under `docs/originals/<slug>.md` from the current official OWASP source.
2. Update the Japanese translation under `docs/translations/<slug>.md`.
3. Regenerate or update the public bilingual page under `docs/bilingual/<slug>.md`.
4. Update `references/source-map.md` and `references/bilingual-map.md` if source URL, coverage, or local paths changed.

Do not update the bilingual display first and leave the source documents stale. The bilingual page is a generated/public reading layer; `docs/originals/` and `docs/translations/` are the maintainable source layers.

## Generator Rules

- When updating `tools/generate-bilingual-samples.mjs`, regenerate affected pages and inspect the diff.
- Use `node tools\generate-bilingual-samples.mjs --navigation-only` when only ASVS navigation pages, sidebars, or bilingual/source maps need regeneration.
- Use `node tools\generate-bilingual-samples.mjs --originals-only` when refreshing local English originals without rebuilding public bilingual pages.
- If the generator updates unrelated pages, revert unrelated generated diffs unless the user asked for broad regeneration.
- Do not add broad automation hooks that silently rewrite content, fetch network resources, or change generated files unless explicitly requested or clearly opt-in.

## Validation

- For Markdown-only changes, review headings, links, and attribution fields manually.
- Always run `git diff --check` before finalizing code, CSS, or generated-file changes.
- Run `npm run lint:md` for broad Markdown/documentation changes.
- Run `npm run check:links` when links or file locations change.
- Run `npm run build` for final production verification, deployment-related changes, Docusaurus config changes, generator changes that affect public pages, or when the user explicitly asks for a build check.
- For layout or visual changes, prefer a local browser check when tooling is available. If browser automation is unavailable, state that limitation and still run build/static checks.

## Commit Rules

- Prefer one task per commit.
- Do not mix unrelated documentation content changes, generator logic changes, and visual design changes in the same commit unless they are required for the same user-requested task.
- When a generator change produces broad output, commit the generator change and its necessary generated files together.
- Before committing, review `git status --short` and `git diff --stat` to confirm the commit scope matches the task.

## Codex Workflow

- Read the relevant source page before drafting.
- Identify title, source URL, copyright or author statement, license statement, and retrieval date.
- Preserve the original meaning and mark changes in Attribution.
- Summarize completed changes in the final response and mention any source or license uncertainty.
