/**
 * LLM-rewrite seed: ask Claude to generate diverse, natural Flyto2 forum
 * posts in batches. Replaces the template-based generator with one that
 * produces idiomatic prose (no slot-mismatch artefacts, no glued-on voice
 * prefixes). Comments still use the templated path — they're short and
 * less artefact-prone.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-ant-... \
 *     GOOGLE_CLOUD_PROJECT=ticket-helper-dbc0e \
 *     node scripts/seed-llm.mjs --apply
 *
 *   Optional flags:
 *     --limit=N    cap total posts (testing — try `--limit=60` first)
 *     --concurrency=N    parallel API calls (default 3)
 *     --batch-size=N     posts per LLM call (default 30)
 *     --only=cloud|code  only one product
 *     --reset            wipe existing forum_posts first (uses firebase admin)
 *     --model=ID         override model (default claude-opus-4-7)
 *
 * Estimated cost (full 5,600 posts, claude-opus-4-7):
 *   ~190 API calls × ~12K output tokens × $25/1M = ~$57
 *   With prompt caching, input cost is negligible (~$1).
 *   For ~5x cheaper, set --model=claude-sonnet-4-6 (~$15 total).
 */

import Anthropic from '@anthropic-ai/sdk';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { ADMIN_REPLIES, COMMUNITY_REPLIES, SLOTS, TAGS } from './seed-voices.mjs';

// ============================================================
// CLI
// ============================================================

const args = process.argv.slice(2);
const has  = (flag) => args.includes(flag);
const valOf = (name, dflt) =>
  args.find((a) => a.startsWith(`${name}=`))?.split('=')[1] ?? dflt;

const APPLY       = has('--apply');
const RESET       = has('--reset');
const LIMIT       = parseInt(valOf('--limit', '0'), 10) || 0;
const CONCURRENCY = parseInt(valOf('--concurrency', '3'), 10);
const BATCH_SIZE  = parseInt(valOf('--batch-size', '30'), 10);
const ONLY        = valOf('--only', '');  // 'cloud' | 'code' | ''
const MODEL       = valOf('--model', 'claude-opus-4-7');

if (!APPLY && !RESET && !LIMIT) {
  console.log('Dry-run only. Add --apply to actually write to Firestore.');
  console.log('First-time test: node scripts/seed-llm.mjs --limit=60 --apply');
  console.log('Full run:        node scripts/seed-llm.mjs --apply');
  console.log('Wipe + reseed:   node scripts/seed-llm.mjs --reset --apply');
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('Set ANTHROPIC_API_KEY before running.');
  process.exit(1);
}

// ============================================================
// Targets — same proportions as the template seed
// ============================================================

const TARGETS = {
  cloud: ONLY === 'code' ? null : { en: 2800, zh: 800, ja: 400 },
  code:  ONLY === 'cloud' ? null : { en: 1200, zh: 280, ja: 120 },
};

if (LIMIT > 0) {
  // Scale targets proportionally to LIMIT.
  const totalDefault = Object.values(TARGETS)
    .filter(Boolean)
    .flatMap((v) => Object.values(v))
    .reduce((a, b) => a + b, 0);
  const ratio = LIMIT / totalDefault;
  for (const p of Object.keys(TARGETS)) {
    if (!TARGETS[p]) continue;
    for (const l of Object.keys(TARGETS[p])) {
      TARGETS[p][l] = Math.max(0, Math.round(TARGETS[p][l] * ratio));
    }
  }
}

// ============================================================
// Init
// ============================================================

const claude = new Anthropic();
initializeApp({
  credential: applicationDefault(),
  projectId:
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    'ticket-helper-dbc0e',
});
const db   = getFirestore();
const auth = getAuth();

// ============================================================
// System prompts per (product) — language-agnostic. Lang goes
// in the user message to keep the cached prefix stable.
// ============================================================

const SYS_CLOUD = `You are generating realistic forum posts for Flyto2 Cloud — a no-code browser automation tool that records and replays browser tasks. Posts come from real-feeling users.

Product context:
- Flyto2 Cloud records what users do in a browser, then replays the workflow.
- Users automate sites like Shopee, Notion, Salesforce, Stripe, Sheets, vendor portals, internal ERPs, GitHub Actions logs, etc.
- Modules they reference: browser.click, browser.fill, browser.scrape, sheets.append, csv.read, pdf.extract, http.batch, llm.extract, flow.if, flow.foreach, flow.retry, storage.put, image.crop.
- Common pain points: selectors breaking after redesigns, CAPTCHAs, 2FA, iframes, modals, Cloudflare challenges, headless detection, scheduling, credential handling, multi-tab batching, OOM on large files.
- Common joys: replacing manual ops work, automating reports, running things at 3am while sleeping.

Voice diversity is essential. Vary across:
- Formality: corporate IT proc / Slack-y dev / late-night frustration / new-user uncertainty / experienced sharing-back / curious wondering / one-line gripes
- Length: from 1-line questions to 3-paragraph rambles
- Style: with code snippets / bullet points / log dumps / typo-laden phone-typed / formal mail
- Topic: bug reports, feature requests, how-to questions, comparison-shopping (vs Zapier/Make/n8n), philosophical, "just shipped this", privacy paranoia, pricing, self-host, integration asks
- Emotional register: frustrated / grateful / curious / urgent / detached / confused

Categories (you must label each):
- question  — asking how / why
- bug       — reporting broken behavior with repro hints
- feature   — wishing for something not yet there
- discussion — open-ended community talk, "what do you think", showcases

Output format: JSON object with a \`posts\` array. Each post has { category, voice, title, body }. \`voice\` is a short label you choose (e.g. "frustrated-ops", "polite-corp", "late-night", "casual-en") — useful for our analytics. \`title\` is a single line, 5–200 chars. \`body\` is 10–4000 chars; use \\n for line breaks. Markdown is welcome (code blocks via three backticks, lists, etc.) — but don't force it.

Hard rules:
- Each post in a batch must feel different from the others. No two posts share the same opening word or phrasing pattern.
- Don't be salesy or generic. Real users vent, joke, get specific.
- Reference real-feeling site names, file names, errors. Made-up details are fine if they're plausible.
- Don't use the word "automation" reflexively. Vary vocabulary.
- The text must read as if a different real human wrote each post.`;

const SYS_CODE = `You are generating realistic forum posts for Flyto2 Warroom — an application security war room that does SCA, SAST, secret detection, license audit, CVE triage, and pentest-as-code, plus closed-loop verification (proves a finding is exploitable by replaying it against staging).

Product context:
- Indexer (\`flyto-indexer\`) does the static scanning: dependency_scanner, secret_scanner, license_scanner, taint analysis (SAST), reachability.
- Engine handles AutoFix PRs, CSPM (planned), runtime probes (planned).
- Closed-loop: turns each finding into a YAML pentest workflow, runs it in real Chrome against staging, marks it exploitable / sanitized / unreachable.
- Audience: security engineers, CTOs, redteamers, devops who integrate to CI (GitHub Actions, GitLab CI, Jenkins, Buildkite), compliance folks chasing SOC 2 / ISO 27001 / PCI.
- Common topics: false positives in rules, reachability disputes, AutoFix conflicts with Renovate, EPSS prioritization, IDE integrations (VSCode, Cursor, JetBrains), languages (TS/Python/Go/Rust/Java), self-hosting / air-gapped, comparison with Snyk / Aikido / CodeQL / Semgrep.
- Common pain: scanner crashes on big monorepos, token rotation, false positives in test fixtures, AutoFix touching lockfiles unexpectedly.

Voice diversity is essential. Vary across:
- Role: security eng, CTO, redteamer, devops, individual dev whose PR got blocked, compliance auditor, OSS contributor, enterprise procurement
- Formality: formal audit-room / casual Slack / frustrated PR-blocked / philosophical "open question to the community"
- Length: 1-line to multi-paragraph
- Style: with code snippets, error logs, with finding IDs, with playbook references

Categories (you must label each):
- question
- bug       — false positives, scanner crashes, AutoFix glitches
- feature   — language support, IDE plugins, EPSS sort, IaC, etc.
- discussion — methodology debates, real-talk tier comparisons, redteam stories

Output format: same as Cloud. JSON object with \`posts\` array, each item { category, voice, title, body }.

Hard rules: same as Cloud — diversity is the entire point. No two posts in a batch share opening phrasing.`;

const POST_SCHEMA = {
  type: 'object',
  properties: {
    posts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          category: { type: 'string', enum: ['question', 'bug', 'feature', 'discussion'] },
          voice:    { type: 'string' },
          title:    { type: 'string', minLength: 5, maxLength: 200 },
          body:     { type: 'string', minLength: 10, maxLength: 4000 },
        },
        required: ['category', 'voice', 'title', 'body'],
        additionalProperties: false,
      },
    },
  },
  required: ['posts'],
  additionalProperties: false,
};

const LANG_INSTRUCTION = {
  en: 'Write in natural English. Mix US and UK conventions, casual and formal, sometimes ESL non-native English.',
  zh: 'Write in Traditional Chinese (繁體中文) primarily, mixed with some Simplified Chinese (簡體中文) posts. Mix Taiwan and Mainland phrasing. Some posts can include English technical terms inline (台灣工程師混 zh+en 是很自然的).',
  ja: 'Write in Japanese. Mix formal keigo and casual short posts. Use natural Japanese — don\'t over-translate technical terms; \'workflow\' and \'browser\' are fine in katakana or English.',
};

// ============================================================
// Generate one batch via Claude
// ============================================================

async function generateBatch({ product, lang, n, avoidTitles }) {
  const system = product === 'cloud' ? SYS_CLOUD : SYS_CODE;
  const userPrompt = [
    `Generate exactly ${n} forum posts for Flyto2 ${product === 'cloud' ? 'Cloud' : 'Warroom'}.`,
    `Language: ${LANG_INSTRUCTION[lang]}`,
    `Mix categories: aim for roughly 45% question, 25% bug, 15% feature, 15% discussion. Don't be exact — natural distribution wins over arithmetic.`,
    avoidTitles.length > 0
      ? `Avoid producing titles overlapping these recent ones: ${avoidTitles.slice(-50).map((t) => `"${t.slice(0, 80)}"`).join(', ')}.`
      : '',
    'Return JSON only. No commentary.',
  ].filter(Boolean).join('\n\n');

  const response = await claude.messages.create({
    model: MODEL,
    max_tokens: 16000,
    thinking: { type: 'adaptive' },
    system: [
      { type: 'text', text: system, cache_control: { type: 'ephemeral' } },
    ],
    messages: [{ role: 'user', content: userPrompt }],
    output_config: {
      format: { type: 'json_schema', schema: POST_SCHEMA },
    },
  });

  // Extract the text content (json_schema returns text containing JSON)
  const textBlock = response.content.find((b) => b.type === 'text');
  if (!textBlock) throw new Error('no text content in response');
  let parsed;
  try {
    parsed = JSON.parse(textBlock.text);
  } catch (e) {
    throw new Error(`could not parse JSON: ${textBlock.text.slice(0, 200)}`);
  }
  if (!parsed?.posts?.length) {
    throw new Error('parsed response had no posts');
  }
  return {
    posts: parsed.posts,
    usage: response.usage,
  };
}

// ============================================================
// Comment building (templated, same as before)
// ============================================================

const NAMES = {
  en: [
    'James Wu', 'Sandra Lin', 'David Chen', 'Echo Lai', 'Alex K.', 'Sam Patel',
    'Priya Reddy', 'Maria García', 'João Silva', 'Luca Romano', 'Sofia Schmidt',
    'Anastasia V.', 'Michael Becker', 'Hans Müller', 'Lucas Lee', 'Frank Huang',
    'Eric Tsai', 'Olivia Brown', 'Noah Davis', 'Emma Wilson', 'Liam Garcia',
    'Ava Martinez', 'Mateusz K.', 'Anna Nowak', 'Anh Nguyễn', 'Linh Trần',
    'Somsak C.', 'Budi P.', 'Siti R.', 'Ravi S.', 'Anil M.', 'Mehmet Y.',
    'casey-dev', 'patrick-builds', 'vivian-ops', 'devon-eng',
    'ops-noobie', 'late-night-coder', 'csv-warrior', 'bot-tamer',
  ],
  zh: [
    '陳怡婷', '王宇', '張哲豪', '林宗翰', '李雅婷', '黃昕儀',
    '阿傑', '阿凱', '小明', '志豪', '怡君', 'Wen', 'Cathy Chen', 'Frank Wang',
    '小張', '工程師 Ken', 'PM 妹妹', '資安阿伯', 'devops_TW',
    '李雷', '韩梅梅', '小王', '老李', '阿珍',
  ],
  ja: [
    'もも', 'タロウ', 'なつみ', 'Hiroshi Tanaka', 'Kenji Sato', 'Yuki Mori',
    'みさき', 'けんじ', 'あかり', '佐藤太郎', '鈴木花子', '高橋一郎',
  ],
};

const AUTHOR_POOL = {};
for (const lang of ['en', 'zh', 'ja']) {
  AUTHOR_POOL[lang] = NAMES[lang].map((name, i) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12) || 'user';
    const tld = lang === 'ja' ? 'jp' : (lang === 'zh' ? 'tw' : ['com', 'io', 'co'][i % 3]);
    const suffix = Math.floor(Math.random() * 9999);
    return {
      user_id:    `seed-uid-${lang}-${i.toString().padStart(3, '0')}-${Math.random().toString(36).slice(2, 8)}`,
      user_name:  name,
      user_email: `${slug}${suffix}@example.${tld}`,
      user_avatar: null,
    };
  });
}

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const chance = (p) => Math.random() < p;

function expand(template, product) {
  return template.replace(/\{(\w+)\}/g, (_, slot) => {
    const pool = SLOTS[product]?.[slot];
    if (!pool) return `{${slot}}`;
    return rand(pool);
  });
}

function buildComments(product, lang, post, postCreatedAt) {
  const replyCount = chance(0.05) ? 4 + Math.floor(Math.random() * 6)
                  :  chance(0.4)  ? 2 + Math.floor(Math.random() * 2)
                                  : 1;
  const comments = [];
  let lastTime = postCreatedAt.toDate();
  const hasAdminReply = chance(0.7);
  const ADMIN = {
    user_id:    'admin-flyto2',
    user_email: 'admin@flyto2.com',
    user_name:  'Flyto2 Team',
    user_avatar: null,
  };

  for (let i = 0; i < replyCount; i++) {
    const isAdmin = hasAdminReply && (i === 0 || (i === 1 && chance(0.3)));
    lastTime = new Date(lastTime.getTime() + (5 * 60_000) + Math.random() * 4 * 3600_000);

    const author = isAdmin ? ADMIN : rand(AUTHOR_POOL[lang]);
    const replyPool = isAdmin
      ? (ADMIN_REPLIES[product][lang] ?? ADMIN_REPLIES[product].en)
      : (COMMUNITY_REPLIES[product][lang] ?? COMMUNITY_REPLIES[product].en);
    const body = expand(rand(replyPool), product);

    comments.push({
      parent_id:    null,
      user_id:      author.user_id,
      user_email:   author.user_email,
      user_name:    author.user_name,
      user_avatar:  author.user_avatar,
      body,
      reaction_sum: Math.floor(Math.random() ** 3 * 30),
      is_official:  isAdmin,
      is_solution:  false,
      created_at:   Timestamp.fromDate(lastTime),
    });
  }
  return { comments, hasAdminReply };
}

// ============================================================
// Resilient batch commit
// ============================================================

async function commitWithRetry(label, fn) {
  const MAX = 5;
  for (let attempt = 1; attempt <= MAX; attempt++) {
    try {
      await fn();
      return;
    } catch (e) {
      const msg = e?.message ?? String(e);
      const transient = /UNAVAILABLE|DEADLINE_EXCEEDED|ECONNRESET|RST_STREAM|ETIMEDOUT/i.test(msg);
      if (attempt === MAX || !transient) {
        console.error(`[seed] ${label}: failed permanently`);
        throw e;
      }
      const delay = 2000 * 2 ** (attempt - 1);
      console.warn(`[seed] ${label}: ${msg}. retry in ${delay}ms`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

// ============================================================
// Reset
// ============================================================

async function resetCollection() {
  console.log('[reset] deleting forum_posts (and subcollections)…');
  // Recursive delete via the admin SDK's batched delete pattern
  let totalDeleted = 0;
  while (true) {
    const snap = await db.collection('forum_posts').limit(100).get();
    if (snap.empty) break;
    for (const docSnap of snap.docs) {
      for (const subName of ['comments', 'reactions']) {
        const sub = await docSnap.ref.collection(subName).limit(500).get();
        if (!sub.empty) {
          const batch = db.batch();
          sub.docs.forEach((s) => batch.delete(s.ref));
          await batch.commit();
        }
      }
    }
    const batch = db.batch();
    snap.docs.forEach((s) => batch.delete(s.ref));
    await batch.commit();
    totalDeleted += snap.size;
    console.log(`[reset] deleted ${totalDeleted}…`);
  }
  console.log(`[reset] done. ${totalDeleted} posts removed.`);
}

// ============================================================
// Ensure admin user
// ============================================================

async function ensureAdminUser() {
  const ADMIN_EMAIL = 'admin@flyto2.com';
  const ADMIN_PASSWORD = '@Wen9520520!';
  try {
    await auth.getUserByEmail(ADMIN_EMAIL);
    console.log(`[admin] ${ADMIN_EMAIL} already exists.`);
  } catch {
    await auth.createUser({
      email: ADMIN_EMAIL, password: ADMIN_PASSWORD,
      displayName: 'Flyto2 Team', emailVerified: true,
    });
    console.log(`[admin] created ${ADMIN_EMAIL}`);
  }
  const u = await auth.getUserByEmail(ADMIN_EMAIL);
  await auth.setCustomUserClaims(u.uid, { admin: true });
  console.log(`[admin] {admin:true} claim set on ${u.uid}`);
}

// ============================================================
// Main loop with bounded concurrency
// ============================================================

async function pool(items, concurrency, fn) {
  const results = [];
  let i = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  });
  await Promise.all(workers);
  return results;
}

async function generateAllPostsFor(product, lang, total) {
  if (!total) return [];
  console.log(`[gen] ${product}/${lang}: ${total} posts (${Math.ceil(total / BATCH_SIZE)} batches)`);
  const tasks = [];
  let remaining = total;
  while (remaining > 0) {
    const n = Math.min(BATCH_SIZE, remaining);
    tasks.push(n);
    remaining -= n;
  }

  const seenTitles = new Set();
  const allPosts = [];
  let totalUsage = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 };

  // Pool the API calls. Each call gets the running list of titles to avoid.
  await pool(tasks, CONCURRENCY, async (n, i) => {
    const avoid = Array.from(seenTitles);
    let result;
    try {
      result = await commitWithRetry(`gen ${product}/${lang} batch ${i}`, async () => {
        const r = await generateBatch({ product, lang, n, avoidTitles: avoid });
        result = r;
      }) ?? null;
      if (!result) {
        // commitWithRetry doesn't return value; re-call inline (simpler):
        result = await generateBatch({ product, lang, n, avoidTitles: avoid });
      }
    } catch (e) {
      console.error(`[gen] ${product}/${lang} batch ${i}: skipping after retries — ${e.message}`);
      return;
    }
    for (const p of result.posts) {
      if (seenTitles.has(p.title.toLowerCase())) continue;
      seenTitles.add(p.title.toLowerCase());
      allPosts.push({ ...p, product, lang });
    }
    totalUsage.input      += result.usage?.input_tokens ?? 0;
    totalUsage.output     += result.usage?.output_tokens ?? 0;
    totalUsage.cacheRead  += result.usage?.cache_read_input_tokens ?? 0;
    totalUsage.cacheWrite += result.usage?.cache_creation_input_tokens ?? 0;
    console.log(`[gen] ${product}/${lang}: +${result.posts.length} (total ${allPosts.length}/${total})`);
  });

  console.log(`[gen] ${product}/${lang}: usage in=${totalUsage.input} cacheRead=${totalUsage.cacheRead} cacheWrite=${totalUsage.cacheWrite} out=${totalUsage.output}`);
  return allPosts;
}

async function writeToFirestore(allPosts) {
  console.log(`[fs] writing ${allPosts.length} posts + comments`);
  const CHUNK = 100;
  let written = 0;
  let cWritten = 0;

  for (let i = 0; i < allPosts.length; i += CHUNK) {
    const slice = allPosts.slice(i, i + CHUNK);
    await commitWithRetry(`posts ${i}-${i + slice.length}`, async () => {
      const batch = db.batch();
      const refs = [];
      for (const p of slice) {
        const ageMs = Math.random() * 1000 * 60 * 60 * 24 * 540;
        const createdAt = Timestamp.fromDate(new Date(Date.now() - ageMs));
        const tagPool = TAGS[p.product]?.[p.category] ?? [];
        const tagCount = Math.floor(Math.random() * 4);
        const tags = Array.from({ length: tagCount }, () => rand(tagPool))
          .filter((v, idx, a) => a.indexOf(v) === idx);
        const reactionSum = Math.floor(Math.random() ** 4 * 80);
        const ageDays = ageMs / 86_400_000;
        const viewCount = Math.floor(ageDays * (3 + Math.random() * 25) + reactionSum * (5 + Math.random() * 15));
        const author = rand(AUTHOR_POOL[p.lang]);
        const isPinned = i === 0 && refs.length < 3;

        const ref = db.collection('forum_posts').doc();
        const doc = {
          product:      p.product,
          lang:         p.lang,
          category:     p.category,
          user_id:      author.user_id,
          user_email:   author.user_email,
          user_name:    author.user_name,
          user_avatar:  author.user_avatar,
          title:        p.title,
          body:         p.body,
          tags,
          pinned:       isPinned,
          locked:       false,
          solution_id:  null,
          view_count:   viewCount,
          reply_count:  0,
          reaction_sum: reactionSum,
          is_official:  false,
          created_at:   createdAt,
          updated_at:   createdAt,
        };
        batch.set(ref, doc);
        refs.push({ id: ref.id, post: { ...p, ...doc, created_at: createdAt } });
      }
      await batch.commit();
      // Comments — separate batches per post group
      const COMMENT_GROUP = 20;
      for (let j = 0; j < refs.length; j += COMMENT_GROUP) {
        const group = refs.slice(j, j + COMMENT_GROUP);
        await commitWithRetry(`comments ${i + j}`, async () => {
          const cb = db.batch();
          for (const { id, post } of group) {
            const { comments, hasAdminReply } = buildComments(post.product, post.lang, post, post.created_at);
            let solutionId = null;
            let lastTs = post.created_at;
            for (const c of comments) {
              const cRef = db.collection('forum_posts').doc(id).collection('comments').doc();
              if (hasAdminReply && c.is_official && post.category === 'question'
                  && !solutionId && chance(0.35)) {
                c.is_solution = true;
                solutionId = cRef.id;
              }
              cb.set(cRef, c);
              cWritten++;
              if (c.created_at && c.created_at.toMillis() > lastTs.toMillis()) lastTs = c.created_at;
            }
            cb.update(db.collection('forum_posts').doc(id), {
              reply_count: comments.length,
              updated_at:  lastTs,
              solution_id: solutionId,
            });
          }
          await cb.commit();
        });
      }
      written += slice.length;
      console.log(`[fs] posts: ${written}/${allPosts.length} · comments: ${cWritten}`);
    });
  }
}

// ============================================================
// Run
// ============================================================

(async () => {
  if (RESET) await resetCollection();

  if (!APPLY) {
    if (RESET) console.log('[done] reset only (no --apply).');
    else       console.log('[done] dry run. Add --apply to generate + write.');
    return;
  }

  await ensureAdminUser();

  const allPosts = [];
  for (const product of ['cloud', 'code']) {
    if (!TARGETS[product]) continue;
    for (const lang of ['en', 'zh', 'ja']) {
      const t = TARGETS[product][lang] ?? 0;
      const posts = await generateAllPostsFor(product, lang, t);
      allPosts.push(...posts);
    }
  }

  console.log(`[gen] generated ${allPosts.length} unique posts`);
  await writeToFirestore(allPosts);
  console.log('[done]');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
