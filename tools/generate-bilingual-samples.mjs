import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();

const pages = [
  {
    slug: 'bean-validation',
    asvs: 'V1.2',
    title: 'Bean Validation Cheat Sheet',
    subtitle: 'Bean Validation チートシート',
    sourceName: 'Bean_Validation_Cheat_Sheet',
    categoryKey: 'encoding-and-sanitization',
    categoryLabel: 'Encoding and Sanitization',
    readTime: '約 12 分',
    jaMode: 'bilingualTranslationPanel',
  },
  {
    slug: 'csrf-prevention',
    asvs: 'V1.3, V3, V4',
    title: 'Cross-Site Request Forgery Prevention Cheat Sheet',
    subtitle: 'CSRF防止チートシート',
    sourceName: 'Cross-Site_Request_Forgery_Prevention_Cheat_Sheet',
    categoryKey: 'encoding-and-sanitization',
    categoryLabel: 'Encoding and Sanitization',
    readTime: '約 10 分',
    jaMode: 'bilingualTranslationPanel',
  },
  {
    slug: 'cryptographic-storage',
    asvs: 'V11.1, V11.2, V11.3, V11.5, V13.3, V14.1',
    title: 'Cryptographic Storage Cheat Sheet',
    subtitle: '暗号化ストレージチートシート',
    sourceName: 'Cryptographic_Storage_Cheat_Sheet',
    categoryKey: 'cryptographic-storage',
    categoryLabel: 'Cryptographic Storage',
    readTime: '約 9 分',
    jaMode: 'bilingualTranslationPanel',
  },
  {
    slug: 'authentication',
    asvs: 'V6.2, V6.3, V6.5, V6.7, V6.8',
    title: 'Authentication Cheat Sheet',
    subtitle: '認証チートシート',
    sourceName: 'Authentication_Cheat_Sheet',
    categoryKey: 'authentication',
    categoryLabel: 'Authentication',
    readTime: '約 20 分',
  },
  {
    slug: 'authorization',
    asvs: 'V8.1, V8.2, V8.4, V16.3',
    title: 'Authorization Cheat Sheet',
    subtitle: '認可チートシート',
    sourceName: 'Authorization_Cheat_Sheet',
    categoryKey: 'authorization',
    categoryLabel: 'Authorization',
    readTime: '約 12 分',
  },
  {
    slug: 'credential-stuffing-prevention',
    asvs: 'V6.1, V6.2, V6.3, V6.6',
    title: 'Credential Stuffing Prevention Cheat Sheet',
    subtitle: 'クレデンシャルスタッフィング防止チートシート',
    sourceName: 'Credential_Stuffing_Prevention_Cheat_Sheet',
    categoryKey: 'authentication',
    categoryLabel: 'Authentication',
    readTime: '約 10 分',
  },
  {
    slug: 'forgot-password',
    asvs: 'V6.3, V6.4, V6.6',
    title: 'Forgot Password Cheat Sheet',
    subtitle: 'パスワード忘れ対応チートシート',
    sourceName: 'Forgot_Password_Cheat_Sheet',
    categoryKey: 'authentication',
    categoryLabel: 'Authentication',
    readTime: '約 10 分',
  },
  {
    slug: 'logging',
    asvs: 'V10.7, V16.1, V16.2, V16.3, V16.4',
    title: 'Logging Cheat Sheet',
    subtitle: 'ロギングチートシート',
    sourceName: 'Logging_Cheat_Sheet',
    categoryKey: 'logging-monitoring',
    categoryLabel: 'Logging and Monitoring',
    readTime: '約 18 分',
  },
  {
    slug: 'multifactor-authentication',
    asvs: 'V6.2, V6.3, V6.4, V6.5, V6.8',
    title: 'Multifactor Authentication Cheat Sheet',
    subtitle: '多要素認証チートシート',
    sourceName: 'Multifactor_Authentication_Cheat_Sheet',
    categoryKey: 'authentication',
    categoryLabel: 'Authentication',
    readTime: '約 12 分',
  },
  {
    slug: 'oauth2',
    asvs: 'V10.1, V10.2, V10.3, V10.4, V10.5, V10.6',
    title: 'OAuth 2.0 Protocol Cheat Sheet',
    subtitle: 'OAuth 2.0 プロトコルチートシート',
    sourceName: 'OAuth2_Cheat_Sheet',
    categoryKey: 'api-and-web-service',
    categoryLabel: 'API and Web Service',
    readTime: '約 18 分',
  },
  {
    slug: 'password-storage',
    asvs: 'V6.5, V11.4',
    title: 'Password Storage Cheat Sheet',
    subtitle: 'パスワード保存チートシート',
    sourceName: 'Password_Storage_Cheat_Sheet',
    categoryKey: 'cryptographic-storage',
    categoryLabel: 'Cryptographic Storage',
    readTime: '約 10 分',
  },
  {
    slug: 'rest-security',
    asvs: 'V4.1, V4.2, V4.3, V4.4, V9.2',
    title: 'REST Security Cheat Sheet',
    subtitle: 'REST セキュリティチートシート',
    sourceName: 'REST_Security_Cheat_Sheet',
    categoryKey: 'api-and-web-service',
    categoryLabel: 'API and Web Service',
    readTime: '約 16 分',
  },
  {
    slug: 'session-management',
    asvs: 'V7, V16.2',
    title: 'Session Management Cheat Sheet',
    subtitle: 'セッション管理チートシート',
    sourceName: 'Session_Management_Cheat_Sheet',
    categoryKey: 'session-management',
    categoryLabel: 'Session Management',
    readTime: '約 14 分',
  },
];

const categoryGroups = [
  {
    label: 'Encoding and Sanitization',
    items: ['bean-validation', 'csrf-prevention'],
  },
  {
    label: 'Authentication',
    items: ['authentication', 'credential-stuffing-prevention', 'forgot-password', 'multifactor-authentication'],
  },
  {
    label: 'Authorization',
    items: ['authorization'],
  },
  {
    label: 'API and Web Service',
    items: ['oauth2', 'rest-security'],
  },
  {
    label: 'Cryptographic Storage',
    items: ['cryptographic-storage', 'password-storage'],
  },
  {
    label: 'Session Management',
    items: ['session-management'],
  },
  {
    label: 'Logging and Monitoring',
    items: ['logging'],
  },
];

function mdPath(...parts) {
  return path.join(root, ...parts);
}

async function readIfExists(file) {
  try {
    return await fs.readFile(file, 'utf8');
  } catch {
    return '';
  }
}

function normalizeNewlines(text) {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function stripAttributionSections(text) {
  let value = normalizeNewlines(text);
  value = value.replace(/^---\n[\s\S]*?\n---\n+/, '');
  value = value.replace(/^# .+?\n+/, '');
  value = value.replace(/## Attribution[\s\S]*?(?=\n## |\n$)/, '');
  value = value.replace(/## 関連ファイル[\s\S]*?(?=\n## |\n$)/, '');
  return value.trim();
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
  const end = normalized.indexOf('\n  </section>', contentStart);
  if (end === -1) {
    return '';
  }
  return normalized.slice(contentStart, end).trim();
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
        .replace(/<([A-Z][A-Za-z0-9]*)/g, '&lt;$1')
        .replace(/<\/([A-Z][A-Za-z0-9]*)>/g, '&lt;/$1&gt;');
    })
    .join('\n');
}

function encodeUrlParens(text) {
  const angleEncoded = text.replace(/<https?:\/\/[^>]+>/g, (url) =>
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
    return wrapped ? `<${raw}>` : raw;
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
  return wrapped ? `<${encoded}>` : encoded;
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
  const lines = normalizeNewlines(text).trim().split('\n');
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
    if (line.match(/^##\s+/)) {
      flush();
      current.push(line);
      continue;
    }
    current.push(line);
  }
  flush();
  return sections;
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
    const en = englishBlocks[index] ? smoothHeadings(englishBlocks[index]) : '';
    const ja = japaneseBlocks[index] ? smoothHeadings(japaneseBlocks[index]) : '';
    chunks.push(`<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

${en}

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

${ja}

</div>
</div>`);
  }

  return chunks.join('\n\n');
}

async function fetchOfficialMarkdown(page) {
  const url = `https://raw.githubusercontent.com/OWASP/CheatSheetSeries/master/cheatsheets/${page.sourceName}.md`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.text();
}

async function localJapanese(page) {
  if (page.jaMode === 'bilingualTranslationPanel') {
    const current = await readIfExists(mdPath('docs', 'bilingual', `${page.slug}.md`));
    const panel = extractPanel(current, 'translationPanel');
    if (panel) {
      return smoothHeadings(panel);
    }
  }

  const translation = await readIfExists(mdPath('docs', 'translations', `${page.slug}.md`));
  return smoothHeadings(extractSection(translation, '日本語訳', ['ASVS との対応']) || stripAttributionSections(translation));
}

async function localSummary(page) {
  const summary = await readIfExists(mdPath('docs', 'summaries', `${page.slug}.md`));
  const body = stripAttributionSections(summary)
    .replace(/^## 概要\n?/, '')
    .trim();
  return smoothHeadings(body || '<p>要点は今後拡充します。</p>');
}

async function localChecklist(page) {
  const checklist = await readIfExists(mdPath('docs', 'checklists', `${page.slug}.md`));
  const body = extractSection(checklist, '開発チェックリスト', ['ASVS との対応']) || stripAttributionSections(checklist);
  return smoothHeadings(body || '<p>チェックリストは今後拡充します。</p>');
}

function pageMarkdown(page, english, japanese, summary, checklist) {
  const sourceUrl = `https://cheatsheetseries.owasp.org/cheatsheets/${page.sourceName}.html`;
  return `---
hide_table_of_contents: true
---

# ${page.title}

<div className="docHero" data-category="${page.categoryKey}">
  <h1>${page.title}</h1>
  <p className="docSubtitle">${page.subtitle}</p>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: ${page.readTime}</span>
    <span className="docPill">カテゴリ: ${page.categoryLabel}</span>
  </div>
</div>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="${page.slug}-view" id="${page.slug}-translation" defaultChecked />
  <input className="tabInput" type="radio" name="${page.slug}-view" id="${page.slug}-summary" />
  <input className="tabInput" type="radio" name="${page.slug}-view" id="${page.slug}-checklist" />
  <input className="tabInput" type="radio" name="${page.slug}-view" id="${page.slug}-bilingual" />

  <div className="contentTabs">
    <label htmlFor="${page.slug}-translation">翻訳</label>
    <label htmlFor="${page.slug}-summary">要点</label>
    <label htmlFor="${page.slug}-checklist">チェックリスト</label>
    <label htmlFor="${page.slug}-bilingual">対比表示</label>
  </div>

<section id="${page.slug}-translation-panel" className="tabPanel translationPanel contentPanel">

${japanese}

</section>

<section id="${page.slug}-summary-panel" className="tabPanel summaryPanel contentPanel">

${summary}

</section>

<section id="${page.slug}-checklist-panel" className="tabPanel checklistPanel contentPanel">

${checklist}

</section>

<section id="${page.slug}-bilingual-panel" className="tabPanel bilingualPanel">

${bilingualPairs(english, japanese)}

</section>
</div>

## Attribution

<div className="attributionFooter">

- Original: ${page.title}
- Source: ${sourceUrl}
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese notes.
- Retrieved: 2026-05-20

</div>
`.replace(/[ \t]+$/gm, '');
}

async function writeSidebars() {
  const groups = categoryGroups
    .map((group) => `    {
      type: 'category',
      label: '${group.label}',
      collapsed: false,
      items: [
${group.items.map((item) => `        '${item}',`).join('\n')}
      ],
    }`)
    .join(',\n');

  const content = `const sidebars = {
  cheatsheetSidebar: [
    'index',
${groups},
  ],
};

module.exports = sidebars;
`;
  await fs.writeFile(mdPath('sidebars.js'), content, 'utf8');
}

async function writeBilingualIndex() {
  const cards = pages
    .map((page) => `- [${page.title}](${page.slug}.md) - ${page.categoryLabel}`)
    .join('\n');
  const content = `# ASVS Index 対応 Cheat Sheet 英日対訳

OWASP Cheat Sheet Series の ASVS Index 対応ページを、日本語訳、要点、チェックリスト、英日対比表示で確認するための Docusaurus 公開用ドキュメントです。

## 表示方針

- \`翻訳\`、\`要点\`、\`チェックリスト\`、\`対比表示\` を同じ Cheat Sheet ページ内で確認できるようにする。
- \`対比表示\` は、公式原文と日本語訳を同じ順序のブロックとして上下に並べる。
- このサイトは OWASP 公式翻訳ではありません。各ページ下部の Attribution を確認してください。

## 掲載ページ

${cards}
`;
  await fs.writeFile(mdPath('docs', 'bilingual', 'index.md'), content, 'utf8');
}

async function writeBilingualMap() {
  const rows = pages
    .map((page) => {
      const sourceUrl = `https://cheatsheetseries.owasp.org/cheatsheets/${page.sourceName}.html`;
      const status = page.jaMode === 'bilingualTranslationPanel' ? 'Full' : 'Sample';
      return `| ${page.asvs} | ${page.title} | ${sourceUrl} | [docs/bilingual/${page.slug}.md](../docs/bilingual/${page.slug}.md) | [docs/translations/${page.slug}.md](../docs/translations/${page.slug}.md) | [docs/summaries/${page.slug}.md](../docs/summaries/${page.slug}.md) | [docs/checklists/${page.slug}.md](../docs/checklists/${page.slug}.md) | ${status} |`;
    })
    .join('\n');
  const content = `# Bilingual Map

パラグラフ単位で英語原文と日本語訳を上下に並べる対訳ドキュメントの対応表です。

## 方針

- 対訳ファイルは \`docs/bilingual/<slug>.md\` に置く。
- 既存の \`docs/translations/\`、\`docs/summaries/\`、\`docs/checklists/\` は残し、対訳表示は別系統で管理する。
- Full/Sample に進めるページでは、公式ページの見出し、段落、箇条書き、表、コードブロック、画像を可能な限り同じ順序で再現する。
- 公式ページ内の画像は、必要に応じてローカル保存し、対訳ページから \`static/img/owasp-cheatsheets/<slug>/\` 配下のファイルを参照する。
- 各対訳ファイルには Attribution を置き、英語原文を比較用に保持していることを \`Changes\` に明記する。

## 対応表

| ASVS 項目 | 公式 Cheat Sheet | 公式 URL | 対訳 | 翻訳 | 要約 | チェックリスト | 状態 |
| --- | --- | --- | --- | --- | --- | --- | --- |
${rows}
`;
  await fs.writeFile(mdPath('references', 'bilingual-map.md'), content, 'utf8');
}

async function main() {
  for (const page of pages) {
    const official = await fetchOfficialMarkdown(page);
    const english = normalizeOfficialMarkdown(official, page);
    const japanese = await localJapanese(page);
    const summary = await localSummary(page);
    const checklist = await localChecklist(page);
    const content = pageMarkdown(page, english, japanese, summary, checklist);
    await fs.writeFile(mdPath('docs', 'bilingual', `${page.slug}.md`), content, 'utf8');
    console.log(`generated ${page.slug}`);
  }

  await writeSidebars();
  await writeBilingualIndex();
  await writeBilingualMap();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
