import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const catalogPath = path.join(root, 'references', 'catalog.json');
const sourceMapPath = path.join(root, 'references', 'source-map.md');
const bilingualMapPath = path.join(root, 'references', 'bilingual-map.md');

const args = new Set(process.argv.slice(2));

function mdPath(...parts) {
  return path.join(root, ...parts);
}

function normalizeCell(value) {
  return value.trim().replace(/\s+/g, ' ');
}

function splitTableRow(row) {
  return row
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map(normalizeCell);
}

function extractLinkTarget(cell) {
  const match = cell.match(/\]\(([^)]+)\)/);
  return match?.[1] ?? null;
}

function slugFromPath(target) {
  if (!target || target === '未作成') {
    return null;
  }
  const normalized = target.replace(/\\/g, '/');
  const match = normalized.match(/(?:^|\/)([^/]+)\.md$/);
  return match?.[1] ?? null;
}

function markdownLink(label, target) {
  if (!target) {
    return '未作成';
  }
  return `[${label}](${target})`;
}

function repoLink(target) {
  if (!target) {
    return '未作成';
  }
  return target.replace(/^\.\.\//, '');
}

async function parseMap(filePath, expectedColumns) {
  const content = await fs.readFile(filePath, 'utf8');
  const rows = [];

  for (const line of content.split(/\r?\n/)) {
    if (!line.startsWith('| ')) {
      continue;
    }
    if (line.includes('| --- |')) {
      continue;
    }
    const cells = splitTableRow(line);
    if (cells.length !== expectedColumns) {
      continue;
    }
    rows.push(cells);
  }

  return rows.slice(1);
}

async function importExistingMaps() {
  const entries = new Map();
  const order = [];

  const sourceRows = await parseMap(sourceMapPath, 6);
  for (const [asvs, title, sourceUrl, translationCell, status, notes] of sourceRows) {
    const translationPath = extractLinkTarget(translationCell);
    const slug = slugFromPath(translationPath);
    if (!slug) {
      continue;
    }
    if (!entries.has(slug)) {
      entries.set(slug, { slug });
      order.push(slug);
    }
    const entry = entries.get(slug);
    entry.title = entry.title ?? title;
    entry.sourceUrl = entry.sourceUrl ?? sourceUrl;
    entry.translationPath = repoLink(translationPath);
    entry.source = {
      asvs,
      status,
      notes,
    };
  }

  const bilingualRows = await parseMap(bilingualMapPath, 7);
  for (const [asvs, title, sourceUrl, bilingualCell, originalCell, translationCell, status] of bilingualRows) {
    const bilingualPath = extractLinkTarget(bilingualCell);
    const slug = slugFromPath(bilingualPath);
    if (!slug) {
      continue;
    }
    if (!entries.has(slug)) {
      entries.set(slug, { slug });
      order.push(slug);
    }
    const entry = entries.get(slug);
    entry.title = title;
    entry.sourceUrl = sourceUrl;
    entry.bilingualPath = repoLink(bilingualPath);
    entry.originalPath = repoLink(extractLinkTarget(originalCell));
    entry.translationPath = translationCell === '未作成'
      ? null
      : repoLink(extractLinkTarget(translationCell));
    entry.bilingual = {
      asvs,
      status,
    };
    entry.source ??= {
      asvs,
      status: entry.translationPath ? '作成済み' : '未作成',
      notes: 'bilingual catalog entry',
    };
  }

  const catalog = {
    schemaVersion: 1,
    generatedFrom: [
      'references/source-map.md',
      'references/bilingual-map.md',
    ],
    maps: {
      sourceIndexUrl: 'https://cheatsheetseries.owasp.org/IndexASVS.html',
      asvsVersion: '5.0.x',
      retrieved: '2026-05-20',
    },
    entries: order.map((slug) => {
      const entry = entries.get(slug);
      entry.originalPath ??= `docs/originals/${slug}.md`;
      entry.bilingualPath ??= `docs/bilingual/${slug}.md`;
      if (entry.translationPath === undefined) {
        entry.translationPath = `docs/translations/${slug}.md`;
      }
      entry.source ??= {
        asvs: entry.bilingual?.asvs ?? '',
        status: entry.translationPath ? '作成済み' : '未作成',
        notes: 'catalog entry',
      };
      entry.bilingual ??= {
        asvs: entry.source.asvs,
        status: '未作成',
      };
      return entry;
    }),
  };

  await fs.writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
}

async function readCatalog() {
  return JSON.parse(await fs.readFile(catalogPath, 'utf8'));
}

function sourceMapContent(catalog) {
  const rows = catalog.entries
    .filter((entry) => entry.translationPath)
    .map((entry) => {
      const translation = markdownLink(entry.translationPath, `../${entry.translationPath}`);
      return `| ${entry.source.asvs} | ${entry.title} | ${entry.sourceUrl} | ${translation} | ${entry.source.status} | ${entry.source.notes} |`;
    })
    .join('\n');

  return `# Source Map

ASVS 項目、公式 Cheat Sheet、ローカルの翻訳ファイルの対応表です。

このファイルは [catalog.json](catalog.json) から生成しています。対応情報を更新する場合は catalog を更新し、\`node tools/generate-catalog.mjs\` を実行してください。

## 方針

- docs/asvs/ の章ページは、この対応表をもとに更新します。
- 同じ原文につき、翻訳ファイルを1つ作成し、公開用の英日対訳ページから参照します。
- 公式ページの URL、ローカルファイル、作成状況を catalog で追跡します。
- 英日対訳表示の公開ページは [bilingual-map.md](bilingual-map.md) に生成します。

## 対応表

| ASVS 項目 | 公式 Cheat Sheet | 公式 URL | 翻訳 | 状態 | 備考 |
| --- | --- | --- | --- | --- | --- |
${rows}

## 参考資料

- Source: ${catalog.maps.sourceIndexUrl}
- ASVS version: ${catalog.maps.asvsVersion}
- Retrieved: ${catalog.maps.retrieved}
`;
}

function bilingualMapContent(catalog) {
  const rows = catalog.entries
    .map((entry) => {
      const bilingual = markdownLink(entry.bilingualPath, `../${entry.bilingualPath}`);
      const original = markdownLink(entry.originalPath, `../${entry.originalPath}`);
      const translation = entry.translationPath
        ? markdownLink(entry.translationPath, `../${entry.translationPath}`)
        : '未作成';
      return `| ${entry.bilingual.asvs} | ${entry.title} | ${entry.sourceUrl} | ${bilingual} | ${original} | ${translation} | ${entry.bilingual.status} |`;
    })
    .join('\n');

  return `# Bilingual Map

パラグラフ単位で英語原文と日本語訳を上下に並べる対訳ドキュメントの対応表です。

このファイルは [catalog.json](catalog.json) から生成しています。対応情報を更新する場合は catalog を更新し、\`node tools/generate-catalog.mjs\` を実行してください。

## 方針

- 対訳ファイルは \`docs/bilingual/<slug>.md\` に置く。
- 英語原文のローカル参照ファイルは \`docs/originals/<slug>.md\` に置く。
- 既存の \`docs/translations/\` は翻訳の維持管理元として残し、対訳表示は \`docs/bilingual/\` で管理する。
- Full/Sample に進めるページでは、公式ページの見出し、段落、箇条書き、表、コードブロック、画像を可能な限り同じ順序で再現する。
- 公式ページ内の画像は、必要に応じてローカル保存し、対訳ページから \`static/img/owasp-cheatsheets/<slug>/\` 配下のファイルを参照する。
- 各対訳ファイルには Attribution を置き、英語原文を比較用に保持していることを \`Changes\` に明記する。
- Docusaurus のサイドバーは OWASP ASVS Index と同じ V1〜V17 章ベースで構成し、複数章対応ページは該当するすべての章に掲載する。

## 対応表

| ASVS 項目 | 公式 Cheat Sheet | 公式 URL | 対訳 | 英語原文 | 翻訳 | 状態 |
| --- | --- | --- | --- | --- | --- | --- |
${rows}
`;
}

async function writeGeneratedMaps({ check = false } = {}) {
  const catalog = await readCatalog();
  const outputs = [
    [sourceMapPath, sourceMapContent(catalog)],
    [bilingualMapPath, bilingualMapContent(catalog)],
  ];

  if (check) {
    const mismatches = [];
    for (const [filePath, expected] of outputs) {
      const actual = await fs.readFile(filePath, 'utf8');
      if (actual !== expected) {
        mismatches.push(path.relative(root, filePath));
      }
    }
    if (mismatches.length > 0) {
      throw new Error(`Generated files are out of date: ${mismatches.join(', ')}`);
    }
    return;
  }

  for (const [filePath, content] of outputs) {
    await fs.writeFile(filePath, content, 'utf8');
  }
}

if (args.has('--init-from-maps')) {
  await importExistingMaps();
}

await writeGeneratedMaps({ check: args.has('--check') });
