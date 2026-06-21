#!/usr/bin/env node
/**
 * Offline GEO/AEO crawler log analyzer.
 *
 * Reads nginx/common/combined logs or JSON log lines and reports whether AI
 * search, user-triggered browsing, and training crawlers reached citation-ready
 * Flyto2 pages. The script is intentionally stdlib-only so it can run in CI,
 * Cloudflare export jobs, or airgapped support bundles.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const AI_UA_RULES = [
  ['realtime_browse', 'Claude-Web', /Claude-Web/i],
  ['realtime_browse', 'Claude-User', /Claude-User/i],
  ['realtime_browse', 'ChatGPT-User', /ChatGPT-User/i],
  ['realtime_browse', 'Perplexity-User', /Perplexity-User/i],
  ['search_index_crawler', 'Claude-SearchBot', /Claude-SearchBot/i],
  ['search_index_crawler', 'OAI-SearchBot', /OAI-SearchBot/i],
  ['search_index_crawler', 'PerplexityBot', /PerplexityBot/i],
  ['search_index_crawler', 'Googlebot', /Googlebot/i],
  ['search_index_crawler', 'Bingbot', /Bingbot/i],
  ['training_crawler', 'ClaudeBot', /ClaudeBot/i],
  ['training_crawler', 'anthropic-ai', /anthropic-ai/i],
  ['training_crawler', 'GPTBot', /GPTBot/i],
  ['training_crawler', 'Google-Extended', /Google-Extended/i],
  ['training_crawler', 'Bytespider', /Bytespider/i],
  ['training_crawler', 'CCBot', /CCBot/i],
  ['training_crawler', 'Meta-ExternalAgent', /Meta-ExternalAgent/i],
  ['training_crawler', 'FacebookBot', /FacebookBot/i],
  ['training_crawler', 'Applebot-Extended', /Applebot-Extended/i],
  ['search_index_crawler', 'Applebot', /\bApplebot\b/i],
];

const IMPORTANT_PATHS = [
  ['/robots.txt', (p) => p === '/robots.txt'],
  ['/sitemap.xml', (p) => p === '/sitemap.xml'],
  ['/llms.txt', (p) => p === '/llms.txt'],
  ['/docs', (p) => p === '/docs' || p.startsWith('/docs/')],
  ['/pricing', (p) => p.includes('/pricing')],
  ['/security', (p) => p.includes('/security')],
  ['/enterprise', (p) => p.includes('/enterprise')],
];

const SUSPICIOUS_PATHS = [
  /^\/\.env(?:$|[/?#])/i,
  /^\/credentials\.json(?:$|[/?#])/i,
  /^\/secrets\.json(?:$|[/?#])/i,
  /^\/wp-admin(?:\/|$)/i,
  /^\/phpmyadmin(?:\/|$)/i,
  /^\/\.git\/config(?:$|[/?#])/i,
  /^\/config\.json(?:$|[/?#])/i,
  /^\/admin(?:\/|$)/i,
  /^\/backup\.zip(?:$|[/?#])/i,
];

const TAIPEI_FORMAT = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Taipei',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  hourCycle: 'h23',
});

function parseArgs(argv) {
  const args = {
    files: [],
    json: '',
    csv: '',
    markdown: '',
    asnMap: '',
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--json') args.json = argv[++i];
    else if (arg === '--csv') args.csv = argv[++i];
    else if (arg === '--markdown' || arg === '--md') args.markdown = argv[++i];
    else if (arg === '--asn-map') args.asnMap = argv[++i];
    else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else {
      args.files.push(arg);
    }
  }

  if (args.files.length === 0) {
    printHelp();
    process.exit(1);
  }

  return args;
}

function printHelp() {
  console.log(`Usage:
  node scripts/analyze-ai-crawler-logs.mjs [--json out.json] [--csv out.csv] [--markdown report.md] [--asn-map ip-asn.csv] access.log [...]

Supported input:
  - nginx/apache combined log lines
  - JSON log lines with userAgent/UserAgent/ClientRequestUserAgent, path/url/request, ip fields

ASN map CSV columns:
  ip,asn,provider,country`);
}

function parseJsonLine(line) {
  try {
    const obj = JSON.parse(line);
    const userAgent = obj.userAgent || obj.UserAgent || obj.ClientRequestUserAgent || obj.ua || '';
    const request = obj.request || obj.Request || obj.ClientRequestURI || obj.url || obj.path || '';
    const ip = obj.ip || obj.clientIp || obj.ClientIP || obj.remoteAddr || obj.RemoteAddr || '';
    const timestamp = obj.timestamp || obj.time || obj.Datetime || obj.EdgeStartTimestamp || '';
    return {
      ip,
      path: extractPath(String(request)),
      userAgent: String(userAgent),
      timestamp: timestamp ? new Date(timestamp) : null,
      raw: line,
    };
  } catch {
    return null;
  }
}

function parseCombinedLine(line) {
  const match = line.match(/^(\S+) \S+ \S+ \[([^\]]+)\] "(?:\S+)\s+([^"\s]+)(?:\s+[^"]*)?" \d{3} \S+ "[^"]*" "([^"]*)"/);
  if (!match) return null;
  return {
    ip: match[1],
    timestamp: parseNginxDate(match[2]),
    path: extractPath(match[3]),
    userAgent: match[4],
    raw: line,
  };
}

function parseNginxDate(value) {
  const match = value.match(/^(\d{2})\/([A-Za-z]{3})\/(\d{4}):(\d{2}):(\d{2}):(\d{2}) ([+-]\d{4})$/);
  if (!match) return null;
  const [, day, mon, year, hour, minute, second, offset] = match;
  const month = {
    Jan: '01',
    Feb: '02',
    Mar: '03',
    Apr: '04',
    May: '05',
    Jun: '06',
    Jul: '07',
    Aug: '08',
    Sep: '09',
    Oct: '10',
    Nov: '11',
    Dec: '12',
  }[mon];
  if (!month) return null;
  return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}${offset.slice(0, 3)}:${offset.slice(3)}`);
}

function extractPath(value) {
  if (!value) return '/';
  try {
    const parsed = value.startsWith('http') ? new URL(value) : new URL(value, 'https://flyto2.com');
    return parsed.pathname || '/';
  } catch {
    const noQuery = value.split(/[?#]/, 1)[0];
    return noQuery.startsWith('/') ? noQuery : `/${noQuery}`;
  }
}

function classifyUserAgent(userAgent, pathName) {
  if (/Claude-User/i.test(userAgent) && /claude-code/i.test(userAgent)) {
    return { type: 'excluded', label: 'Claude-User claude-code', excludedReason: 'claude_code_user_agent' };
  }

  for (const [type, label, regex] of AI_UA_RULES) {
    if (regex.test(userAgent)) {
      const suspicious = SUSPICIOUS_PATHS.some((rule) => rule.test(pathName));
      return {
        type: suspicious ? 'suspected_fake_bot' : type,
        label,
        excludedReason: suspicious ? 'suspicious_probe_path' : '',
      };
    }
  }

  return null;
}

function increment(map, key, amount = 1) {
  map.set(key, (map.get(key) || 0) + amount);
}

function topEntries(map, limit = 10) {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([key, count]) => ({ key, count }));
}

function hourBucket(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return 'unknown';
  const parts = Object.fromEntries(TAIPEI_FORMAT.formatToParts(date).map((part) => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:00 Asia/Taipei`;
}

function readAsnMap(filePath) {
  if (!filePath) return new Map();
  const rows = readFileSync(filePath, 'utf8').split(/\r?\n/).filter(Boolean);
  const map = new Map();
  for (const row of rows) {
    const [ip, asn = '', provider = '', country = ''] = row.split(',').map((part) => part.trim());
    if (ip && ip !== 'ip') map.set(ip, { asn, provider, country });
  }
  return map;
}

function analyze(files, asnMapFile) {
  const asnMap = readAsnMap(asnMapFile);
  const uaCounts = new Map();
  const typeCounts = new Map();
  const pathCounts = new Map();
  const ipCounts = new Map();
  const hourCounts = new Map();
  const excludedCounts = new Map();
  const importantHits = Object.fromEntries(IMPORTANT_PATHS.map(([label]) => [label, 0]));
  const suspiciousSamples = [];
  const asnLookupRequired = new Set();
  let totalLines = 0;
  let aiLines = 0;
  let meaningfulAiLines = 0;

  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    for (const line of text.split(/\r?\n/)) {
      if (!line.trim()) continue;
      totalLines += 1;
      const record = parseJsonLine(line) || parseCombinedLine(line);
      if (!record) continue;
      const classification = classifyUserAgent(record.userAgent, record.path);
      if (!classification) continue;

      aiLines += 1;
      if (classification.type === 'excluded' || classification.type === 'suspected_fake_bot') {
        increment(excludedCounts, classification.excludedReason || classification.type);
        if (suspiciousSamples.length < 25) {
          suspiciousSamples.push({
            ip: record.ip,
            path: record.path,
            userAgent: record.userAgent,
            reason: classification.excludedReason,
          });
        }
        continue;
      }

      meaningfulAiLines += 1;
      increment(uaCounts, classification.label);
      increment(typeCounts, classification.type);
      increment(pathCounts, record.path);
      increment(ipCounts, record.ip || 'unknown');
      increment(hourCounts, hourBucket(record.timestamp));
      if (record.ip && !asnMap.has(record.ip)) asnLookupRequired.add(record.ip);

      for (const [label, matches] of IMPORTANT_PATHS) {
        if (matches(record.path)) importantHits[label] += 1;
      }
    }
  }

  const topIps = topEntries(ipCounts).map((entry) => ({
    ...entry,
    asn: asnMap.get(entry.key) || null,
  }));

  return {
    generated_at: new Date().toISOString(),
    timezone: 'Asia/Taipei',
    inputs: files.map((file) => path.resolve(file)),
    total_lines: totalLines,
    ai_candidate_lines: aiLines,
    meaningful_ai_lines: meaningfulAiLines,
    excluded: Object.fromEntries(excludedCounts),
    crawler_counts_by_ua: Object.fromEntries(uaCounts),
    crawler_counts_by_type: Object.fromEntries(typeCounts),
    top_paths: topEntries(pathCounts),
    top_ips: topIps,
    time_distribution: topEntries(hourCounts, 100),
    important_path_hits: importantHits,
    suspicious_samples: suspiciousSamples,
    asn_lookup_required: [...asnLookupRequired].sort(),
    geo_readiness_score: readinessScore({
      meaningfulAiLines,
      typeCounts,
      importantHits,
      excludedCounts,
    }),
  };
}

function readinessScore({ meaningfulAiLines, typeCounts, importantHits, excludedCounts }) {
  let score = 0;
  if (meaningfulAiLines > 0) score += 15;
  if ((typeCounts.get('search_index_crawler') || 0) > 0) score += 20;
  if ((typeCounts.get('realtime_browse') || 0) > 0) score += 20;
  if (importantHits['/robots.txt'] > 0) score += 8;
  if (importantHits['/sitemap.xml'] > 0) score += 8;
  if (importantHits['/llms.txt'] > 0) score += 10;
  if (importantHits['/docs'] > 0) score += 6;
  if (importantHits['/pricing'] > 0) score += 5;
  if (importantHits['/security'] > 0) score += 5;
  if (importantHits['/enterprise'] > 0) score += 3;
  if ((excludedCounts.get('suspicious_probe_path') || 0) > meaningfulAiLines) score -= 10;
  return Math.max(0, Math.min(100, score));
}

function toCsv(report) {
  const rows = [['section', 'key', 'count', 'extra']];
  for (const [ua, count] of Object.entries(report.crawler_counts_by_ua)) rows.push(['ua', ua, count, '']);
  for (const [type, count] of Object.entries(report.crawler_counts_by_type)) rows.push(['type', type, count, '']);
  for (const item of report.top_paths) rows.push(['path', item.key, item.count, '']);
  for (const item of report.top_ips) {
    const extra = item.asn ? `${item.asn.asn} ${item.asn.provider} ${item.asn.country}`.trim() : '';
    rows.push(['ip', item.key, item.count, extra]);
  }
  for (const item of report.time_distribution) rows.push(['hour_asia_taipei', item.key, item.count, '']);
  for (const [route, count] of Object.entries(report.important_path_hits)) rows.push(['important_path', route, count, '']);
  return rows.map((row) => row.map(csvCell).join(',')).join('\n') + '\n';
}

function csvCell(value) {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function toMarkdown(report) {
  const lines = [
    '# Flyto2 AI Crawler GEO Report',
    '',
    `Generated: ${report.generated_at}`,
    `Timezone: ${report.timezone}`,
    `GEO readiness score: ${report.geo_readiness_score}/100`,
    '',
    '## Summary',
    '',
    `- Total log lines: ${report.total_lines}`,
    `- AI candidate lines: ${report.ai_candidate_lines}`,
    `- Meaningful AI crawler lines after exclusions: ${report.meaningful_ai_lines}`,
    `- Excluded: ${JSON.stringify(report.excluded)}`,
    '',
    '## Crawler Types',
    '',
    markdownTable(['Type', 'Count'], Object.entries(report.crawler_counts_by_type)),
    '',
    '## User Agents',
    '',
    markdownTable(['UA', 'Count'], Object.entries(report.crawler_counts_by_ua)),
    '',
    '## Important Path Hits',
    '',
    markdownTable(['Path', 'Hits'], Object.entries(report.important_path_hits)),
    '',
    '## Top Paths',
    '',
    markdownTable(['Path', 'Count'], report.top_paths.map((item) => [item.key, item.count])),
    '',
    '## Top IPs',
    '',
    markdownTable(
      ['IP', 'Count', 'ASN'],
      report.top_ips.map((item) => [
        item.key,
        item.count,
        item.asn ? `${item.asn.asn} ${item.asn.provider} ${item.asn.country}`.trim() : 'lookup required',
      ]),
    ),
    '',
    '## Time Distribution',
    '',
    markdownTable(['Hour', 'Count'], report.time_distribution.map((item) => [item.key, item.count])),
    '',
    '## Suspicious Samples',
    '',
    markdownTable(
      ['IP', 'Path', 'Reason'],
      report.suspicious_samples.map((item) => [item.ip, item.path, item.reason]),
    ),
    '',
  ];
  return lines.join('\n');
}

function markdownTable(headers, rows) {
  const safeRows = rows.length ? rows : [['none', 0]];
  const header = `| ${headers.join(' | ')} |`;
  const sep = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = safeRows.map((row) => `| ${row.map((cell) => String(cell ?? '').replaceAll('|', '\\|')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

const args = parseArgs(process.argv.slice(2));
const report = analyze(args.files, args.asnMap);

if (args.json) writeFileSync(args.json, JSON.stringify(report, null, 2) + '\n');
if (args.csv) writeFileSync(args.csv, toCsv(report));
if (args.markdown) writeFileSync(args.markdown, toMarkdown(report));

if (!args.json && !args.csv && !args.markdown) {
  console.log(toMarkdown(report));
}
