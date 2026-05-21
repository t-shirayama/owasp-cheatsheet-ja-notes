import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const localSources = process.argv.includes('--local-sources');

const { pages, sheetCatalog } = await readDataFile('cheatsheet-catalog.yml');
const { asvsChapters, asvsIndexSections } = await readDataFile('asvs-chapters.yml');
const catalogStatusBySlug = readCatalogStatusBySlug();

function hasLocalTranslation(slug) {
  return fsSync.existsSync(mdPath('docs', 'translations', `${slug}.md`));
}

async function readDataFile(fileName) {
  const content = await fs.readFile(mdPath('references', fileName), 'utf8');
  // The .yml data files are kept as JSON-compatible YAML so generation has no extra dependency.
  return JSON.parse(content);
}

function readCatalogStatusBySlug() {
  const catalogPath = mdPath('references', 'catalog.json');
  if (!fsSync.existsSync(catalogPath)) {
    return new Map();
  }
  const catalog = JSON.parse(fsSync.readFileSync(catalogPath, 'utf8'));
  return new Map(
    catalog.entries.map((entry) => [entry.slug, entry.bilingual?.status ?? 'Shell']),
  );
}

const v1FullSlugs = [
  ...new Set(
    asvsIndexSections
      .filter((section) => section.id.startsWith('V1.'))
      .flatMap((section) => section.slugs),
  ),
];

for (const slug of v1FullSlugs) {
  if (pages.some((page) => page.slug === slug)) {
    continue;
  }
  const catalogPage = sheetCatalog[slug];
  if (!catalogPage) {
    throw new Error(`Missing sheet catalog entry for V1 full page ${slug}`);
  }
  pages.push({
    slug,
    ...catalogPage,
    categoryKey: 'encoding-and-sanitization',
    categoryLabel: 'Encoding and Sanitization',
    readTime: '約 15 分',
    jaMode: 'bilingualTranslationPanel',
  });
}

const chapterJapaneseTitles = {
  1: '入力検証とサニタイズ',
  2: '検証とビジネスロジック',
  3: 'Web フロントエンドセキュリティ',
  4: 'API と Web サービス',
  5: 'ファイル処理',
  6: '認証',
  7: 'セッション管理',
  8: '認可',
  9: 'セルフコンテインドトークン',
  10: 'OAuth と OIDC',
  11: '暗号',
  12: '安全な通信',
  13: '設定',
  14: 'データ保護',
  15: 'セキュアコーディングとアーキテクチャ',
  16: 'セキュリティログとエラーハンドリング',
  17: 'WebRTC',
};

const sectionJapaneseTitles = {
  'V1.1': '入力検証アーキテクチャ',
  'V1.2': 'インジェクション対策',
  'V1.3': 'データサニタイズ',
  'V1.4': 'メモリ・文字列・アンマネージドコード',
  'V1.5': '安全なシリアライズ',
  'V2.1': '検証とビジネスロジック文書化',
  'V2.2': '入力検証',
  'V2.3': 'ビジネスロジックセキュリティ',
  'V2.4': '自動化対策',
  'V3.1': 'Web フロントエンド文書化',
  'V3.2': '意図しないコンテンツ解釈',
  'V3.3': 'Cookie 設定',
  'V3.4': 'ブラウザセキュリティヘッダー',
  'V3.5': 'ブラウザオリジン分離',
  'V3.6': '外部リソース完全性',
  'V3.7': 'その他のブラウザセキュリティ考慮事項',
  'V4.1': '一般的な Web サービスセキュリティ',
  'V4.2': 'HTTP メッセージ構造検証',
  'V4.3': 'GraphQL',
  'V4.4': 'WebSocket',
  'V5.1': 'ファイル処理文書化',
  'V5.2': 'ファイルアップロードとコンテンツ',
  'V5.3': 'ファイル保存',
  'V5.4': 'ファイルダウンロード',
  'V6.1': '認証文書化',
  'V6.2': 'パスワードセキュリティ',
  'V6.3': '一般的な認証セキュリティ',
  'V6.4': '認証要素のライフサイクルと復旧',
  'V6.5': '一般的な多要素認証要件',
  'V6.6': 'アウトオブバンド認証機構',
  'V6.7': '暗号学的認証機構',
  'V6.8': 'ID プロバイダによる認証',
  'V7.1': 'セッション管理文書化',
  'V7.2': '基本的なセッション管理セキュリティ',
  'V7.3': 'セッションタイムアウト',
  'V7.4': 'セッション終了',
  'V7.5': 'セッション悪用への防御',
  'V7.6': '連携再認証',
  'V8.1': '認可文書化',
  'V8.2': '一般的な認可設計',
  'V8.3': '操作レベル認可',
  'V8.4': 'その他の認可考慮事項',
  'V9.1': 'トークンの出所と完全性',
  'V9.2': 'トークン内容',
  'V10.1': '一般的な OAuth / OIDC セキュリティ',
  'V10.2': 'OAuth クライアント',
  'V10.3': 'OAuth リソースサーバ',
  'V10.4': 'OAuth 認可サーバ',
  'V10.5': 'OIDC クライアント',
  'V10.6': 'OpenID Provider',
  'V10.7': '同意管理',
  'V11.1': '暗号インベントリと文書化',
  'V11.2': '安全な暗号実装',
  'V11.3': '暗号アルゴリズム',
  'V11.4': 'ハッシュとハッシュベース関数',
  'V11.5': '乱数値',
  'V11.6': '公開鍵暗号',
  'V11.7': '使用中データの暗号化',
  'V12.1': '一般的な TLS セキュリティガイダンス',
  'V12.2': '外部公開サービスとの HTTPS 通信',
  'V12.3': 'サービス間通信セキュリティ',
  'V13.1': '設定文書化',
  'V13.2': 'バックエンド通信設定',
  'V13.3': 'シークレット管理',
  'V13.4': '意図しない情報漏えい',
  'V14.1': 'データ保護文書化',
  'V14.2': '一般的なデータ保護',
  'V14.3': 'クライアント側データ保護',
  'V15.1': 'セキュアコーディングとアーキテクチャ文書化',
  'V15.2': 'セキュリティアーキテクチャと依存関係',
  'V15.3': '防御的コーディング',
  'V15.4': '安全な並行処理',
  'V16.1': 'セキュリティログ文書化',
  'V16.2': '一般的なロギング',
  'V16.3': 'セキュリティイベント',
  'V16.4': 'ログ保護',
  'V16.5': 'エラーハンドリング',
  'V17.1': 'TURN サーバ',
  'V17.2': 'メディア',
  'V17.3': 'シグナリング',
};

function chapterLabel(chapter) {
  return `V${chapter.id}: ${chapterJapaneseTitles[chapter.id] ?? chapter.title}`;
}

function sectionLabel(section) {
  return `${section.id}: ${sectionJapaneseTitles[section.id] ?? section.title}`;
}

function pageDisplayTitle(page) {
  return page.subtitle || page.title.replace(/\bCheat Sheet\b/g, 'チートシート').replace(/\bCheatsheet\b/g, 'チートシート');
}

function pageCategoryLabel(page) {
  const [firstSection] = asvsSectionIds(page.asvs);
  const chapter = firstSection ? chapterForSection(firstSection) : asvsChapters.find((candidate) => asvsChapterIds(page.asvs).includes(candidate.id));
  return chapter ? chapterJapaneseTitles[chapter.id] ?? chapter.title : page.categoryLabel;
}

function mdPath(...parts) {
  return path.join(root, ...parts);
}

function officialPageUrl(page) {
  return `https://cheatsheetseries.owasp.org/cheatsheets/${page.sourceName}.html`;
}

function originalSourceMarkdown(page, official) {
  const original = smoothHeadings(rewriteOfficialLinks(normalizeNewlines(official).trim()))
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/g, ''))
    .join('\n');
  return `# ${page.title}

## Attribution

- Original: ${page.title}
- Source: ${officialPageUrl(page)}
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original source Markdown stored locally for reference.
- Retrieved: 2026-05-20

## English Original

${original}
`;
}

function chapterForSection(sectionId) {
  const chapterId = Number.parseInt(sectionId.match(/^V(\d{1,2})\./)?.[1] ?? '0', 10);
  return asvsChapters.find((chapter) => chapter.id === chapterId);
}

function buildPageIndex() {
  const generated = new Map(
    pages.map((page) => [
      page.slug,
      {
        ...page,
        status: catalogStatusBySlug.get(page.slug) ?? (page.jaMode === 'bilingualTranslationPanel' ? 'Full' : 'Sample'),
      },
    ]),
  );
  const merged = new Map();

  for (const section of asvsIndexSections) {
    const chapter = chapterForSection(section.id);
    for (const slug of section.slugs) {
      const catalogPage = sheetCatalog[slug];
      if (!catalogPage) {
        throw new Error(`Missing sheet catalog entry for ${slug}`);
      }
      const current = merged.get(slug);
      const asvs = current?.asvs ? `${current.asvs}, ${section.id}` : section.id;
      const base = generated.get(slug) ?? {};
      merged.set(slug, {
        slug,
        ...catalogPage,
        categoryKey: base.categoryKey ?? `asvs-v${chapter?.id ?? 0}`,
        categoryLabel: base.categoryLabel ?? chapter?.title ?? 'ASVS',
        readTime: base.readTime ?? '準備中',
        ...base,
        asvs,
        status: catalogStatusBySlug.get(slug) ?? base.status ?? 'Shell',
      });
    }
  }

  return [...merged.values()].sort((left, right) => left.title.localeCompare(right.title, 'en'));
}

function pageBySlug(slug) {
  const page = buildPageIndex().find((candidate) => candidate.slug === slug);
  if (!page) {
    throw new Error(`Missing page entry for ${slug}`);
  }
  return page;
}

function asvsChapterIds(asvs) {
  const ids = new Set();
  for (const match of asvs.matchAll(/\bV(\d{1,2})(?:\.\d+)?\b/g)) {
    const id = Number.parseInt(match[1], 10);
    if (id >= 1 && id <= 17) {
      ids.add(id);
    }
  }
  return [...ids].sort((left, right) => left - right);
}

function asvsSectionIds(asvs) {
  const ids = new Set();
  for (const match of asvs.matchAll(/\bV(\d{1,2})\.(\d+)\b/g)) {
    const chapter = Number.parseInt(match[1], 10);
    const section = Number.parseInt(match[2], 10);
    if (chapter >= 1 && chapter <= 17) {
      ids.add(`V${chapter}.${section}`);
    }
  }
  return [...ids].sort((left, right) => {
    const [leftChapter, leftSection] = left.slice(1).split('.').map(Number);
    const [rightChapter, rightSection] = right.slice(1).split('.').map(Number);
    return leftChapter - rightChapter || leftSection - rightSection;
  });
}

function pagesForChapter(chapterId) {
  return buildPageIndex().filter((page) => asvsChapterIds(page.asvs).includes(chapterId));
}

function pagesForSection(sectionId) {
  const section = asvsIndexSections.find((candidate) => candidate.id === sectionId);
  return section ? section.slugs.map(pageBySlug) : [];
}

function pagesForWholeChapter(chapterId) {
  return buildPageIndex().filter((page) => {
    const chapters = asvsChapterIds(page.asvs);
    const sections = asvsSectionIds(page.asvs);
    return chapters.includes(chapterId) && !sections.some((sectionId) => sectionId.startsWith(`V${chapterId}.`));
  });
}

async function readIfExists(file) {
  try {
    return await fs.readFile(file, 'utf8');
  } catch {
    return '';
  }
}

function readFromHead(repoPath) {
  try {
    return execFileSync('git', ['show', `HEAD:${repoPath}`], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch {
    return '';
  }
}

function normalizeNewlines(text) {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function normalizeInlineFences(text) {
  return normalizeNewlines(text).replace(/^```([^`\n]+)```$/gm, '```text\n$1\n```');
}

function stripAttributionSections(text) {
  let value = normalizeNewlines(text);
  value = value.replace(/^---\n[\s\S]*?\n---\n+/, '');
  value = value.replace(/^# .+?\n+/, '');
  value = value.replace(/## Attribution[\s\S]*?(?=\n## |\n$)/, '');
  value = value.replace(/## 関連ファイル[\s\S]*?(?=\n## |\n$)/, '');
  return value.trim();
}

function stripLeadingTitle(text) {
  return normalizeNewlines(text).replace(/^# .+?\n+/, '').trim();
}

function extractSection(text, heading, stopHeadings = []) {
  const normalized = normalizeNewlines(text);
  const start = normalized.indexOf(`\n## ${heading}`);
  if (start === -1 && !normalized.startsWith(`## ${heading}`)) {
    return '';
  }
  const sectionStart = start === -1 ? 0 : start + 1;
  const contentStart = normalized.indexOf('\n', sectionStart) + 1;
  const stops = stopHeadings
    .map((stop) => normalized.indexOf(`\n## ${stop}`, contentStart))
    .filter((index) => index !== -1);
  const end = stops.length > 0 ? Math.min(...stops) : normalized.length;
  return normalized.slice(contentStart, end).trim();
}

function extractPanel(text, panelClass) {
  const normalized = normalizeNewlines(text);
  const start = normalized.search(new RegExp(`<section[^>]*${panelClass}[^>]*>`));
  if (start === -1) {
    return '';
  }
  const contentStart = normalized.indexOf('\n', start) + 1;
  const closing = /\n\s*<\/section>/.exec(normalized.slice(contentStart));
  if (!closing) {
    return '';
  }
  return normalized.slice(contentStart, contentStart + closing.index).trim();
}

function splitReferenceSection(markdown) {
  const normalized = normalizeNewlines(markdown).trim();
  const lines = normalized.split('\n');
  const body = [];
  const references = [];
  let index = 0;

  const heading = (line) => /^(#{2,6})\s+(.+?)\s*$/.exec(line.trim());
  const isReferenceHeading = (title) => /\breferences?\b|^reference\b|参考資料|リファレンス/i.test(title);

  while (index < lines.length) {
    const match = heading(lines[index]);
    if (!match || !isReferenceHeading(match[2])) {
      body.push(lines[index]);
      index += 1;
      continue;
    }

    const level = match[1].length;
    const section = [lines[index]];
    index += 1;
    while (index < lines.length) {
      const nextHeading = heading(lines[index]);
      if (nextHeading && nextHeading[1].length <= level) {
        break;
      }
      section.push(lines[index]);
      index += 1;
    }
    references.push(section.join('\n').trim());
  }

  return {
    body: body.join('\n').replace(/\n{3,}/g, '\n\n').replace(/\n{0,2}---\s*$/, '').trim(),
    references: references.join('\n\n').replace(/\n{3,}/g, '\n\n').trim(),
  };
}

function stripReferenceSections(markdown) {
  return splitReferenceSection(markdown).body;
}

function sanitizeMarkdown(text) {
  const lines = normalizeNewlines(text).split('\n');
  let inFence = false;
  return lines
    .map((line) => {
      const trimmedLine = line.replace(/[ \t]+$/g, '');
      if (line.trim().startsWith('```')) {
        inFence = !inFence;
        return trimmedLine;
      }
      if (inFence) {
        return trimmedLine;
      }
      return trimmedLine
        .replace(/\\/g, '\\\\')
        .replace(/\{/g, '&#123;')
        .replace(/\}/g, '&#125;')
        .replace(/<=/g, '&lt;=')
        .replace(/<details\b([^>]*)>/gi, '&lt;details$1&gt;')
        .replace(/<\/details>/gi, '&lt;/details&gt;')
        .replace(/<summary\b([^>]*)>/gi, '&lt;summary$1&gt;')
        .replace(/<\/summary>/gi, '&lt;/summary&gt;')
        .replace(/<([A-Z][A-Za-z0-9]*)/g, '&lt;$1')
        .replace(/<\/([A-Z][A-Za-z0-9]*)>/g, '&lt;/$1&gt;');
    })
    .join('\n');
}

function encodeUrlParens(text) {
  const angleLinks = text.replace(/(^|[^\(])<((?:https?|mailto):[^>]+)>/gm, (match, prefix, url) =>
    `${prefix}[${url}](${url})`,
  );
  const angleEncoded = angleLinks.replace(/<https?:\/\/[^>]+>/g, (url) =>
    url.replace(/\(/g, '%28').replace(/\)/g, '%29'),
  );
  return angleEncoded.replace(/https?:\/\/[^\s<>)]+(?:\([^\s<>)]*\)[^\s<>)]*)*/g, (url) =>
    url.replace(/\(/g, '%28').replace(/\)/g, '%29'),
  );
}

function officialLinkTarget(target) {
  const trimmed = target.trim();
  const wrapped = trimmed.startsWith('<') && trimmed.endsWith('>');
  const raw = wrapped ? trimmed.slice(1, -1) : trimmed;
  const [pathPart, anchorPart] = raw.split('#', 2);
  const anchor = anchorPart ? `#${anchorPart}` : '';
  let resolved = raw;

  if (pathPart.startsWith('/img/')) {
    return raw;
  }

  if (!/^(https?|mailto):/.test(pathPart) && pathPart.length > 0) {
    const normalized = pathPart.replace(/^\.\//, '').replace(/^\.\.\//, '');
    if (normalized.endsWith('.md')) {
      resolved = `https://cheatsheetseries.owasp.org/cheatsheets/${path.basename(normalized, '.md')}.html${anchor}`;
    } else if (normalized.startsWith('assets/')) {
      resolved = `https://cheatsheetseries.owasp.org/${normalized}${anchor}`;
    } else if (normalized.endsWith('.html')) {
      resolved = `https://cheatsheetseries.owasp.org/cheatsheets/${path.basename(normalized)}${anchor}`;
    } else if (normalized.startsWith('/')) {
      resolved = `https://cheatsheetseries.owasp.org${normalized}${anchor}`;
    }
  }

  const encoded = resolved.replace(/\(/g, '%28').replace(/\)/g, '%29');
  return encoded;
}

function rewriteOfficialLinks(text) {
  return encodeUrlParens(text).replace(/\]\(([^)]+)\)/g, (match, target) => {
    const trimmed = target.trim();
    if (trimmed.startsWith('#') || /^(https?|mailto):/.test(trimmed)) {
      return `](${officialLinkTarget(trimmed)})`;
    }
    return `](${officialLinkTarget(trimmed)})`;
  });
}

function smoothHeadings(text) {
  const lines = normalizeNewlines(text).split('\n');
  let inFence = false;
  let previousLevel = 1;

  return lines
    .map((line) => {
      if (line.trim().startsWith('```')) {
        inFence = !inFence;
        return line;
      }
      if (inFence) {
        return line;
      }
      const match = /^(#{1,6})\s+(.+)$/.exec(line);
      if (!match) {
        return line;
      }
      let level = match[1].length;
      if (level > previousLevel + 1) {
        level = previousLevel + 1;
      }
      previousLevel = level;
      return `${'#'.repeat(level)} ${match[2]}`;
    })
    .join('\n');
}

function normalizeOfficialMarkdown(text, page) {
  let value = normalizeNewlines(text).trim();
  value = value.replace(/^---\n[\s\S]*?\n---\n+/, '');
  value = value.replace(/^# .+?\n+/, '');
  if (page.slug === 'bean-validation') {
    value = value
      .replace(/\]\([^)]*Bean_Validation_Cheat_Sheet_Typical\.png\)/g, '](/img/owasp-cheatsheets/bean-validation/typical.png)')
      .replace(/\]\([^)]*Bean_Validation_Cheat_Sheet_JSR\.png\)/g, '](/img/owasp-cheatsheets/bean-validation/jsr.png)');
  }
  return smoothHeadings(sanitizeMarkdown(rewriteOfficialLinks(value)));
}

function splitSections(text) {
  const lines = normalizeInlineFences(text).trim().split('\n');
  const sections = [];
  let current = [];
  let inFence = false;

  const flush = () => {
    const section = current.join('\n').trim();
    if (section) {
      sections.push(section);
    }
    current = [];
  };

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      current.push(line);
      inFence = !inFence;
      if (!inFence) {
        flush();
      }
      continue;
    }
    if (inFence) {
      current.push(line);
      continue;
    }
    if (line.match(/^#{2,6}\s+/)) {
      flush();
      current.push(line);
      continue;
    }
    current.push(line);
  }
  flush();
  return sections;
}

function imageKey(line) {
  const markdown = /!\[[^\]]*]\(([^)]+)\)/.exec(line);
  if (markdown) {
    return `image:${markdown[1].trim()}`;
  }
  const html = /<img[^>]+src=["']([^"']+)["'][^>]*>/i.exec(line);
  if (html) {
    return `image:${html[1].trim()}`;
  }
  return `image:${line.trim()}`;
}

function codeKey(content) {
  const normalized = normalizeNewlines(content)
    .replace(/\u00a0/g, ' ')
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/g, '').replace(/[ \t]+/g, ' ').trim())
    .join('\n')
    .trim();
  return `code:${normalized}`;
}

function extractSharedBlocks(markdown) {
  const lines = normalizeInlineFences(markdown).split('\n');
  const body = [];
  const shared = [];
  let inFence = false;
  let fence = [];

  const pushFence = () => {
    const content = fence.join('\n').trim();
    if (content) {
      shared.push({ key: codeKey(content), content });
    }
    fence = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) {
      fence.push(line);
      inFence = !inFence;
      if (!inFence) {
        pushFence();
      }
      continue;
    }
    if (inFence) {
      fence.push(line);
      continue;
    }
    if (/^!\[[^\]]*]\([^)]+\)\s*$/.test(trimmed) || /^<img\b/i.test(trimmed)) {
      shared.push({ key: imageKey(trimmed), content: trimmed });
      continue;
    }
    body.push(line);
  }

  if (fence.length > 0) {
    body.push(...fence);
  }

  return {
    text: body.join('\n').replace(/\n{3,}/g, '\n\n').trim(),
    shared,
  };
}

function splitSharedSegments(markdown) {
  const segment = extractSharedBlocks(markdown);
  return segment.text || segment.shared.length > 0 ? [segment] : [];
}

function uniqueSharedBlocks(...groups) {
  const seen = new Set();
  const shared = [];
  for (const group of groups) {
    for (const block of group) {
      if (seen.has(block.key)) {
        continue;
      }
      seen.add(block.key);
      shared.push(block.content);
    }
  }
  return shared;
}

function takeTrailingHeading(text, options = {}) {
  const lines = normalizeNewlines(text).trimEnd().split('\n');
  while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
    lines.pop();
  }
  const lastLine = lines[lines.length - 1] ?? '';
  const headingMatch = /^(#{2,6})\s+(.+?)\s*$/.exec(lastLine);
  if (headingMatch) {
    lines.pop();
    return {
      text: lines.join('\n').replace(/\n{3,}/g, '\n\n').trim(),
      heading: {
        level: headingMatch[1].length,
        title: headingMatch[2],
      },
    };
  }

  const labelMatch = /^\*\*(.+?)\*\*:\s*$/.exec(lastLine) || /^(.+?):\s*$/.exec(lastLine);
  if (!labelMatch || labelMatch[1].length > 80) {
    const plainLine = lastLine.trim();
    const canTreatPlainLineAsHeading =
      options.allowPlainLine &&
      plainLine.length > 0 &&
      plainLine.length <= 120 &&
      !plainLine.startsWith('#') &&
      !plainLine.startsWith('- ') &&
      !plainLine.startsWith('|') &&
      !plainLine.startsWith('```');
    if (canTreatPlainLineAsHeading) {
      lines.pop();
      return {
        text: lines.join('\n').replace(/\n{3,}/g, '\n\n').trim(),
        heading: {
          level: 4,
          title: plainLine,
        },
      };
    }
    return { text: text.trim(), heading: null };
  }
  lines.pop();
  return {
    text: lines.join('\n').replace(/\n{3,}/g, '\n\n').trim(),
    heading: {
      level: 4,
      title: labelMatch[1],
    },
  };
}

function sharedHeading(englishHeading, japaneseHeading) {
  if (!englishHeading && !japaneseHeading) {
    return null;
  }
  return {
    level: englishHeading?.level ?? japaneseHeading.level,
    title: englishHeading?.title ?? japaneseHeading.title,
  };
}

function splitTextCards(text) {
  const blocks = normalizeNewlines(text)
    .trim()
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter((block) => block && !/^(?:-{3,}|\*{3,}|_{3,})$/.test(block));
  const isListBlock = (block) => /^\s{0,3}(?:[-*+]|\d+[.)])\s+/.test(block);
  const mergedBlocks = [];
  for (const block of blocks) {
    const previous = mergedBlocks.at(-1);
    if (previous && isListBlock(previous) && isListBlock(block)) {
      mergedBlocks[mergedBlocks.length - 1] = `${previous}\n\n${block}`;
      continue;
    }
    mergedBlocks.push(block);
  }
  const cards = [];
  let pendingHeading = '';

  for (const block of mergedBlocks) {
    const isHeadingOnly = /^#{2,6}\s+.+$/.test(block);
    if (isHeadingOnly) {
      pendingHeading = pendingHeading ? `${pendingHeading}\n\n${block}` : block;
      continue;
    }

    cards.push(pendingHeading ? `${pendingHeading}\n\n${block}` : block);
    pendingHeading = '';
  }

  if (pendingHeading) {
    cards.push(pendingHeading);
  }

  return cards;
}

function groupCards(cards, targetCount) {
  if (targetCount <= 0 || cards.length <= targetCount) {
    return cards;
  }
  const groups = [];
  for (let index = 0; index < targetCount; index++) {
    const start = Math.floor((index * cards.length) / targetCount);
    const end = Math.floor(((index + 1) * cards.length) / targetCount);
    groups.push(cards.slice(start, end).join('\n\n'));
  }
  return groups;
}

function bilingualPairs(english, japanese) {
  const englishSections = splitSections(english);
  const japaneseSections = splitSections(japanese);
  const useSectionPairs =
    englishSections.length > 1 &&
    japaneseSections.length > 1 &&
    japaneseSections.length >= Math.ceil(englishSections.length * 0.5);
  const englishBlocks = useSectionPairs ? englishSections : [english.trim()];
  const japaneseBlocks = useSectionPairs ? japaneseSections : [japanese.trim()];
  const count = Math.max(englishBlocks.length, japaneseBlocks.length);
  const chunks = [];

  for (let index = 0; index < count; index++) {
    const enSegments = splitSharedSegments(englishBlocks[index] || '');
    const jaSegments = splitSharedSegments(japaneseBlocks[index] || '');
    const segmentCount = Math.max(enSegments.length, jaSegments.length);

    for (let segmentIndex = 0; segmentIndex < segmentCount; segmentIndex++) {
      const enParts = enSegments[segmentIndex] ?? { text: '', shared: [] };
      const jaParts = jaSegments[segmentIndex] ?? { text: '', shared: [] };
      const shared = uniqueSharedBlocks(enParts.shared, jaParts.shared).join('\n\n');
      const en = enParts.text;
      const ja = jaParts.text;
      let enCards = splitTextCards(en);
      let jaCards = splitTextCards(ja);
      if (enCards.length > 0 && jaCards.length > 0 && enCards.length !== jaCards.length) {
        if (enCards.length > jaCards.length) {
          enCards = groupCards(enCards, jaCards.length);
        } else {
          jaCards = groupCards(jaCards, enCards.length);
        }
      }
      const cardCount = Math.max(enCards.length, jaCards.length);

      for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
        const englishBlock = enCards[cardIndex]
          ? `<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

${enCards[cardIndex]}

</div>`
          : '';
        const japaneseBlock = jaCards[cardIndex]
          ? `<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

${jaCards[cardIndex]}

</div>`
          : '';
        if (englishBlock || japaneseBlock) {
          chunks.push(`<div className="bilingualPair">
${englishBlock}
${japaneseBlock}
</div>`);
        }
      }

      const sharedBlock = shared
        ? `<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

${shared}

</div>`
        : '';
      if (sharedBlock) {
        chunks.push(sharedBlock);
      }
    }
  }

  return smoothHeadings(chunks.join('\n\n'));
}

async function fetchOfficialMarkdown(page) {
  const url = `https://raw.githubusercontent.com/OWASP/CheatSheetSeries/master/cheatsheets/${page.sourceName}.md`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.text();
}

async function localOfficialMarkdown(page) {
  const local = await readIfExists(mdPath('docs', 'originals', `${page.slug}.md`));
  const body = extractSection(local, 'English Original') || stripAttributionSections(local);
  if (!body) {
    throw new Error(`Missing local original for ${page.slug}`);
  }
  return body;
}

async function localJapanese(page) {
  const translation = await readIfExists(mdPath('docs', 'translations', `${page.slug}.md`));
  const translationBody = smoothHeadings(sanitizeMarkdown(rewriteOfficialLinks(stripLeadingTitle(extractSection(translation, '日本語訳', ['ASVS との対応']) || stripAttributionSections(translation)))));

  if (localSources) {
    return translationBody;
  }

  if (page.jaMode === 'bilingualTranslationPanel') {
    const current = await readIfExists(mdPath('docs', 'bilingual', `${page.slug}.md`));
    const panel = extractPanel(current, 'translationPanel');
    const committed = readFromHead(`docs/bilingual/${page.slug}.md`);
    const committedPanel = extractPanel(committed, 'translationPanel');
    const existingPanel = [panel, committedPanel]
      .filter(Boolean)
      .sort((left, right) => right.length - left.length)[0];
    if (translationBody && (!existingPanel || translationBody.length >= existingPanel.length || existingPanel.length < 3000)) {
      return translationBody;
    }
    if (existingPanel) {
      return smoothHeadings(existingPanel);
    }
  }

  return translationBody;
}

function pageMarkdown(page, english, japanese) {
  const sourceUrl = officialPageUrl(page);
  const englishParts = splitReferenceSection(english);
  const englishBody = englishParts.body;
  const japaneseBody = stripReferenceSections(japanese);
  const referenceBody = englishParts.references
    .replace(/^#{2,6}\s+.*(?:\breferences?\b|^reference\b|参考資料|リファレンス).*$/gim, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  const references = englishParts.references
    ? `## References

<div className="referenceFooter">

${referenceBody}

</div>
`
    : '';
  return `---
title: ${page.title}
hide_title: true
---

<div className="docHero" data-category="${page.categoryKey}">
  <h1>${pageDisplayTitle(page)}</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: ${page.readTime}</span>
    <span className="docPill">カテゴリ: ${pageCategoryLabel(page)}</span>
  </div>
</div>

<p className="docLead">${page.subtitle}を、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="${page.slug}-view" id="${page.slug}-original" />
  <input className="tabInput" type="radio" name="${page.slug}-view" id="${page.slug}-translation" defaultChecked />
  <input className="tabInput" type="radio" name="${page.slug}-view" id="${page.slug}-bilingual" />

  <div className="contentTabs">
    <label htmlFor="${page.slug}-original" title="OWASP 原文">原文</label>
    <label htmlFor="${page.slug}-translation" title="日本語訳">翻訳</label>
    <label htmlFor="${page.slug}-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="${page.slug}-original-panel" className="tabPanel originalPanel contentPanel">

${englishBody}

</section>

<section id="${page.slug}-translation-panel" className="tabPanel translationPanel contentPanel">

${japaneseBody}

</section>

<section id="${page.slug}-bilingual-panel" className="tabPanel bilingualPanel">

${bilingualPairs(englishBody, japaneseBody)}

</section>
</div>

${references}

## Attribution

<div className="attributionFooter">

- Original: ${page.title}
- Source: ${sourceUrl}
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-20

</div>
`.replace(/[ \t]+$/gm, '');
}

function scaffoldMarkdown(page) {
  const sourceUrl = officialPageUrl(page);
  return `---
title: ${page.title}
hide_title: true
---

<div className="docHero" data-category="${page.categoryKey}">
  <h1>${pageDisplayTitle(page)}</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 準備中</span>
    <span className="docPill">カテゴリ: ${pageCategoryLabel(page)}</span>
  </div>
</div>

<div className="contentPanel">

このページは、OWASP ASVS Index と同じサイドメニュー構成を先に完成させるための準備中ページです。

- 公式ページ: [${page.title}](${sourceUrl})
- ASVS 対応: ${page.asvs}
- 状態: 本文、翻訳、対比表示は今後追加します。

</div>

## Attribution

<div className="attributionFooter">

- Original: ${page.title}
- Source: ${sourceUrl}
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Placeholder navigation page added. No translated OWASP body content copied yet.
- Retrieved: 2026-05-20

</div>
`.replace(/[ \t]+$/gm, '');
}

async function writeSidebars() {
  const seenSidebarDocs = new Set();
  const sidebarDocItem = (section, page) => {
    const duplicate = seenSidebarDocs.has(page.slug);
    seenSidebarDocs.add(page.slug);
    const customProps = duplicate
      ? `, customProps: { sidebarOccurrence: '${section.id}:${page.slug}', sidebarDuplicate: true }`
      : `, customProps: { sidebarOccurrence: '${section.id}:${page.slug}' }`;
    return `            { type: 'doc', id: '${page.slug}'${customProps} },`;
  };
  const groups = asvsChapters
    .map((chapter) => {
      const sectionItems = chapter.sections.map((section) => {
        const sectionPages = pagesForSection(section.id);
        return `        {
          type: 'category',
          label: '${sectionLabel(section)}',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'asvs/${section.id.toLowerCase().replace('.', '-')}',
          },
          items: [
${sectionPages.map((page) => sidebarDocItem(section, page)).join('\n')}
          ],
        },`;
      });
      return `    {
      type: 'category',
      label: '${chapterLabel(chapter)}',
      collapsed: ${chapter.id === 1 ? 'false' : 'true'},
      link: {
        type: 'doc',
        id: 'asvs/v${chapter.id}',
      },
      items: [
${sectionItems.join('\n')}
      ],
    }`;
    })
    .join(',\n');

  const content = `// Generated from references/asvs-chapters.yml and references/cheatsheet-catalog.yml.
// Do not edit manually. Run: npm run navigation

const sidebars = {
  cheatsheetSidebar: [
    'index',
${groups},
  ],
};

module.exports = sidebars;
`;
  await fs.writeFile(mdPath('sidebars.js'), content, 'utf8');
}

async function writeAsvsChapterPages() {
  await fs.mkdir(mdPath('docs', 'bilingual', 'asvs'), { recursive: true });

  for (const chapter of asvsChapters) {
    const chapterPages = pagesForChapter(chapter.id);
    const pageLinks = chapterPages.length > 0
      ? chapterPages.map((page) => `- [${page.title}](../${page.slug}.md) - ${page.status}`).join('\n')
      : '- 現在、この章に対応する公開済み対訳ページはありません。';
    const sectionLinks = chapter.sections
      .map((section) => {
        const sectionPages = pagesForSection(section.id);
        const count = sectionPages.length;
        return `- [${sectionLabel(section)}](${section.id.toLowerCase().replace('.', '-')}.md) (${count}件)`;
      })
      .join('\n');
    const chapterNote = chapterPages.some((page) => page.status === 'Shell')
      ? `\n## 補足\n\nShell のページはサイドメニュー完成用の準備中ページです。本文、翻訳、対比表示は順次追加します。\n`
      : '';
    const content = `# ${chapterLabel(chapter)}

OWASP ASVS Index の V${chapter.id} に対応する英日対訳ページの一覧です。

## ASVS 小項目

${sectionLinks}

## 掲載中の対訳ページ

${pageLinks}
${chapterNote}
`;
    await fs.writeFile(mdPath('docs', 'bilingual', 'asvs', `v${chapter.id}.md`), content, 'utf8');

    for (const section of chapter.sections) {
      const sectionPages = pagesForSection(section.id);
      const sectionPageLinks = sectionPages.length > 0
        ? sectionPages.map((page) => `- [${page.title}](../${page.slug}.md) - ${page.status}`).join('\n')
        : '- OWASP ASVS Index では、この小項目に対応する Cheat Sheet は None とされています。';
      const sectionNote = sectionPages.some((page) => page.status === 'Shell')
        ? `\n## 補足\n\nShell のページはサイドメニュー完成用の準備中ページです。本文、翻訳、対比表示は順次追加します。\n`
        : '';
      const sectionContent = `# ${sectionLabel(section)}

OWASP ASVS Index の ${section.id} に対応する英日対訳ページの一覧です。

## 掲載中の対訳ページ

${sectionPageLinks}
${sectionNote}
`;
      await fs.writeFile(
        mdPath('docs', 'bilingual', 'asvs', `${section.id.toLowerCase().replace('.', '-')}.md`),
        sectionContent,
        'utf8',
      );
    }
  }
}

async function writeBilingualIndex() {
  const cards = buildPageIndex()
    .map((page) => `- [${page.title}](${page.slug}.md) - ${page.asvs} - ${page.status}`)
    .join('\n');
  const content = `# OWASP ASVS チートシート索引 日本語版

OWASP Cheat Sheet Series の ASVS Index 対応ページを、日本語訳と英日対比表示で確認するための非公式日本語版です。

## 表示方針

- \`原文\`、\`翻訳\`、\`対比表示\` を同じ Cheat Sheet ページ内で確認できるようにする。
- \`対比表示\` は、公式原文と日本語訳を同じ順序のブロックとして上下に並べる。
- Full は原文、翻訳、公開用対訳ページが揃っているページを示す。Shell は本文未展開の準備中ページを示す。
- このサイトは OWASP 公式翻訳ではありません。各ページ下部の Attribution を確認してください。
- 段落単位の対比表示に追加修正が必要なページは \`references/todo.md\` で管理します。

## 掲載ページ

${cards}
`;
  await fs.writeFile(mdPath('docs', 'bilingual', 'index.md'), content, 'utf8');
}

async function writeBilingualMap() {
  await import('./generate-catalog.mjs');
}

async function writeOriginalSource(page, official) {
  await fs.mkdir(mdPath('docs', 'originals'), { recursive: true });
  await fs.writeFile(mdPath('docs', 'originals', `${page.slug}.md`), originalSourceMarkdown(page, official), 'utf8');
}

async function main() {
  const indexedPages = buildPageIndex();
  const indexedBySlug = new Map(indexedPages.map((page) => [page.slug, page]));
  const originalsOnly = process.argv.includes('--originals-only');
  const navigationOnly = process.argv.includes('--navigation-only');

  if (navigationOnly) {
    await writeSidebars();
    await writeAsvsChapterPages();
    await writeBilingualIndex();
    await writeBilingualMap();
    return;
  }

  const originalTargetPages = originalsOnly
    ? indexedPages
    : localSources
      ? indexedPages.filter((page) => (catalogStatusBySlug.get(page.slug) ?? page.status) !== 'Shell' || hasLocalTranslation(page.slug))
      : pages;
  const generatedSlugs = new Set(originalTargetPages.map((page) => page.slug));

  for (const configuredPage of originalTargetPages) {
    const page = indexedBySlug.get(configuredPage.slug) ?? configuredPage;
    const official = localSources ? await localOfficialMarkdown(page) : await fetchOfficialMarkdown(page);
    if (!localSources) {
      await writeOriginalSource(page, official);
    }
    if (originalsOnly) {
      console.log(`generated original ${page.slug}`);
      continue;
    }
    const english = normalizeOfficialMarkdown(official, page);
    const japanese = await localJapanese(page);
    const content = pageMarkdown(page, english, japanese);
    await fs.writeFile(mdPath('docs', 'bilingual', `${page.slug}.md`), content, 'utf8');
    console.log(`generated ${page.slug}`);
  }

  if (originalsOnly) {
    await writeBilingualMap();
    return;
  }

  for (const page of indexedPages.filter((candidate) => !generatedSlugs.has(candidate.slug))) {
    await fs.writeFile(mdPath('docs', 'bilingual', `${page.slug}.md`), scaffoldMarkdown(page), 'utf8');
    console.log(`generated shell ${page.slug}`);
  }

  await writeSidebars();
  await writeAsvsChapterPages();
  await writeBilingualIndex();
  await writeBilingualMap();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
