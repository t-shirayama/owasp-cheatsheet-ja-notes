import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

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

const asvsChapters = [
  {
    id: 1,
    title: 'Encoding and Sanitization',
    sections: [
      { id: 'V1.1', title: 'Encoding and Sanitization Architecture' },
      { id: 'V1.2', title: 'Injection Prevention' },
      { id: 'V1.3', title: 'Sanitization' },
      { id: 'V1.4', title: 'Memory, String, and Unmanaged Code' },
      { id: 'V1.5', title: 'Safe Deserialization' },
    ],
  },
  {
    id: 2,
    title: 'Validation and Business Logic',
    sections: [
      { id: 'V2.1', title: 'Validation and Business Logic Documentation' },
      { id: 'V2.2', title: 'Input Validation' },
      { id: 'V2.3', title: 'Business Logic Security' },
      { id: 'V2.4', title: 'Anti-automation' },
    ],
  },
  {
    id: 3,
    title: 'Web Frontend Security',
    sections: [
      { id: 'V3.1', title: 'Web Frontend Security Documentation' },
      { id: 'V3.2', title: 'Unintended Content Interpretation' },
      { id: 'V3.3', title: 'Cookie Setup' },
      { id: 'V3.4', title: 'Browser Security Mechanism Headers' },
      { id: 'V3.5', title: 'Browser Origin Separation' },
      { id: 'V3.6', title: 'External Resource Integrity' },
      { id: 'V3.7', title: 'Other Browser Security Considerations' },
    ],
  },
  {
    id: 4,
    title: 'API and Web Service',
    sections: [
      { id: 'V4.1', title: 'Generic Web Service Security' },
      { id: 'V4.2', title: 'HTTP Message Structure Validation' },
      { id: 'V4.3', title: 'GraphQL' },
      { id: 'V4.4', title: 'WebSocket' },
    ],
  },
  {
    id: 5,
    title: 'File Handling',
    sections: [
      { id: 'V5.1', title: 'File Handling Documentation' },
      { id: 'V5.2', title: 'File Upload and Content' },
      { id: 'V5.3', title: 'File Storage' },
      { id: 'V5.4', title: 'File Download' },
    ],
  },
  {
    id: 6,
    title: 'Authentication',
    sections: [
      { id: 'V6.1', title: 'Authentication Documentation' },
      { id: 'V6.2', title: 'Password Security' },
      { id: 'V6.3', title: 'General Authentication Security' },
      { id: 'V6.4', title: 'Authentication Factor Lifecycle and Recovery' },
      { id: 'V6.5', title: 'General Multi-factor authentication requirements' },
      { id: 'V6.6', title: 'Out-of-Band authentication mechanisms' },
      { id: 'V6.7', title: 'Cryptographic authentication mechanism' },
      { id: 'V6.8', title: 'Authentication with an Identity Provider' },
    ],
  },
  {
    id: 7,
    title: 'Session Management',
    sections: [
      { id: 'V7.1', title: 'Session Management Documentation' },
      { id: 'V7.2', title: 'Fundamental Session Management Security' },
      { id: 'V7.3', title: 'Session Timeout' },
      { id: 'V7.4', title: 'Session Termination' },
      { id: 'V7.5', title: 'Defenses Against Session Abuse' },
      { id: 'V7.6', title: 'Federated Re-authentication' },
    ],
  },
  {
    id: 8,
    title: 'Authorization',
    sections: [
      { id: 'V8.1', title: 'Authorization Documentation' },
      { id: 'V8.2', title: 'General Authorization Design' },
      { id: 'V8.3', title: 'Operation Level Authorization' },
      { id: 'V8.4', title: 'Other Authorization Considerations' },
    ],
  },
  {
    id: 9,
    title: 'Self-contained Tokens',
    sections: [
      { id: 'V9.1', title: 'Token source and integrity' },
      { id: 'V9.2', title: 'Token content' },
    ],
  },
  {
    id: 10,
    title: 'OAuth and OIDC',
    sections: [
      { id: 'V10.1', title: 'Generic OAuth and OIDC Security' },
      { id: 'V10.2', title: 'OAuth Client' },
      { id: 'V10.3', title: 'OAuth Resource Server' },
      { id: 'V10.4', title: 'OAuth Authorization Server' },
      { id: 'V10.5', title: 'OIDC Client' },
      { id: 'V10.6', title: 'OpenID Provider' },
      { id: 'V10.7', title: 'Consent Management' },
    ],
  },
  {
    id: 11,
    title: 'Cryptography',
    sections: [
      { id: 'V11.1', title: 'Cryptographic Inventory and Documentation' },
      { id: 'V11.2', title: 'Secure Cryptography Implementation' },
      { id: 'V11.3', title: 'Encryption Algorithms' },
      { id: 'V11.4', title: 'Hashing and Hash-based Functions' },
      { id: 'V11.5', title: 'Random Values' },
      { id: 'V11.6', title: 'Public Key Cryptography' },
      { id: 'V11.7', title: 'In-Use Data Cryptography' },
    ],
  },
  {
    id: 12,
    title: 'Secure Communication',
    sections: [
      { id: 'V12.1', title: 'General TLS Security Guidance' },
      { id: 'V12.2', title: 'HTTPS Communication with External Facing Services' },
      { id: 'V12.3', title: 'General Service to Service Communication Security' },
    ],
  },
  {
    id: 13,
    title: 'Configuration',
    sections: [
      { id: 'V13.1', title: 'Configuration Documentation' },
      { id: 'V13.2', title: 'Backend Communication Configuration' },
      { id: 'V13.3', title: 'Secret Management' },
      { id: 'V13.4', title: 'Unintended Information Leakage' },
    ],
  },
  {
    id: 14,
    title: 'Data Protection',
    sections: [
      { id: 'V14.1', title: 'Data Protection Documentation' },
      { id: 'V14.2', title: 'General Data Protection' },
      { id: 'V14.3', title: 'Client-side Data Protection' },
    ],
  },
  {
    id: 15,
    title: 'Secure Coding and Architecture',
    sections: [
      { id: 'V15.1', title: 'Secure Coding and Architecture Documentation' },
      { id: 'V15.2', title: 'Security Architecture and Dependencies' },
      { id: 'V15.3', title: 'Defensive Coding' },
      { id: 'V15.4', title: 'Safe Concurrency' },
    ],
  },
  {
    id: 16,
    title: 'Security Logging and Error Handling',
    sections: [
      { id: 'V16.1', title: 'Security Logging Documentation' },
      { id: 'V16.2', title: 'General Logging' },
      { id: 'V16.3', title: 'Security Events' },
      { id: 'V16.4', title: 'Log Protection' },
      { id: 'V16.5', title: 'Error Handling' },
    ],
  },
  {
    id: 17,
    title: 'WebRTC',
    sections: [
      { id: 'V17.1', title: 'TURN Server' },
      { id: 'V17.2', title: 'Media' },
      { id: 'V17.3', title: 'Signaling' },
    ],
  },
];

function mdPath(...parts) {
  return path.join(root, ...parts);
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
  return pages.filter((page) => asvsChapterIds(page.asvs).includes(chapterId));
}

function pagesForSection(sectionId) {
  return pages.filter((page) => asvsSectionIds(page.asvs).includes(sectionId));
}

function pagesForWholeChapter(chapterId) {
  return pages.filter((page) => {
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
  const closing = /\n\s*<\/section>/.exec(normalized.slice(contentStart));
  if (!closing) {
    return '';
  }
  return normalized.slice(contentStart, contentStart + closing.index).trim();
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

function extractSharedBlocks(markdown) {
  const lines = normalizeNewlines(markdown).split('\n');
  const body = [];
  const shared = [];
  let inFence = false;
  let fence = [];

  const pushFence = () => {
    const content = fence.join('\n').trim();
    if (content) {
      shared.push({ key: `code:${content}`, content });
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
    const enParts = extractSharedBlocks(englishBlocks[index] ? smoothHeadings(englishBlocks[index]) : '');
    const jaParts = extractSharedBlocks(japaneseBlocks[index] ? smoothHeadings(japaneseBlocks[index]) : '');
    const en = enParts.text;
    const ja = jaParts.text;
    const shared = uniqueSharedBlocks(enParts.shared, jaParts.shared).join('\n\n');
    const englishBlock = en
      ? `<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

${en}

</div>`
      : '';
    const sharedBlock = shared
      ? `<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

${shared}

</div>`
      : '';
    const japaneseBlock = ja
      ? `<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

${ja}

</div>`
      : '';
    chunks.push(`<div className="bilingualPair">
${englishBlock}
${sharedBlock}
${japaneseBlock}
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
    if (panel && panel.length > 3000) {
      return smoothHeadings(panel);
    }
    const committed = readFromHead(`docs/bilingual/${page.slug}.md`);
    const committedPanel = extractPanel(committed, 'translationPanel');
    if (committedPanel && committedPanel.length > panel.length) {
      return smoothHeadings(committedPanel);
    }
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
title: ${page.title}
hide_title: true
hide_table_of_contents: true
---

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
  const groups = asvsChapters
    .map((chapter) => {
      const wholeChapterPages = pagesForWholeChapter(chapter.id);
      const chapterWideItems = wholeChapterPages.length > 0
        ? [`
        {
          type: 'category',
          label: 'V${chapter.id} 全般',
          collapsed: true,
          items: [
${wholeChapterPages.map((page) => `            '${page.slug}',`).join('\n')}
          ],
        },`]
        : [];
      const sectionItems = chapter.sections.map((section) => {
        const sectionPages = pagesForSection(section.id);
        return `        {
          type: 'category',
          label: '${section.id}: ${section.title}',
          collapsed: true,
          items: [
${sectionPages.length > 0 ? sectionPages.map((page) => `            '${page.slug}',`).join('\n') : `            'asvs/${section.id.toLowerCase().replace('.', '-')}',`}
          ],
        },`;
      });
      return `    {
      type: 'category',
      label: 'V${chapter.id}: ${chapter.title}',
      collapsed: ${chapter.id === 1 ? 'false' : 'true'},
      items: [
        'asvs/v${chapter.id}',
${[...chapterWideItems, ...sectionItems].join('\n')}
      ],
    }`;
    })
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

async function writeAsvsChapterPages() {
  await fs.mkdir(mdPath('docs', 'bilingual', 'asvs'), { recursive: true });

  for (const chapter of asvsChapters) {
    const chapterPages = pagesForChapter(chapter.id);
    const pageLinks = chapterPages.length > 0
      ? chapterPages.map((page) => `- [${page.title}](../${page.slug}.md)`).join('\n')
      : '- 現在、この章に対応する公開済み対訳ページはありません。';
    const sectionLinks = chapter.sections
      .map((section) => {
        const sectionPages = pagesForSection(section.id);
        const count = sectionPages.length;
        return `- [${section.id}: ${section.title}](${section.id.toLowerCase().replace('.', '-')}.md) (${count}件)`;
      })
      .join('\n');
    const content = `# V${chapter.id}: ${chapter.title}

OWASP ASVS Index の V${chapter.id} に対応する英日対訳ページの一覧です。

## ASVS 小項目

${sectionLinks}

## 掲載中の対訳ページ

${pageLinks}

## 補足

未掲載の Cheat Sheet は、対訳ページの作成後にこの章へ追加します。
`;
    await fs.writeFile(mdPath('docs', 'bilingual', 'asvs', `v${chapter.id}.md`), content, 'utf8');

    for (const section of chapter.sections) {
      const sectionPages = pagesForSection(section.id);
      const sectionPageLinks = sectionPages.length > 0
        ? sectionPages.map((page) => `- [${page.title}](../${page.slug}.md)`).join('\n')
        : '- 現在、この小項目に対応する公開済み対訳ページはありません。';
      const sectionContent = `# ${section.id}: ${section.title}

OWASP ASVS Index の ${section.id} に対応する英日対訳ページの一覧です。

## 掲載中の対訳ページ

${sectionPageLinks}

## 補足

未掲載の Cheat Sheet は、対訳ページの作成後にこの小項目へ追加します。
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
- Docusaurus のサイドバーは OWASP ASVS Index と同じ V1〜V17 章ベースで構成し、複数章対応ページは該当するすべての章に掲載する。

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
  await writeAsvsChapterPages();
  await writeBilingualIndex();
  await writeBilingualMap();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
