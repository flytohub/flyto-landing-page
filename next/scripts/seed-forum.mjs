/**
 * Bulk-seed the forum with diverse customer questions and admin replies,
 * sliced by language so /en, /zh, /ja each see their own community.
 *
 *   - Cloud   4000 = 2800 en + 800 zh + 400 ja
 *   - Warroom 1600 = 1200 en + 280 zh + 120 ja
 *   - Each post gets 1-4 replies; ~70% include admin@flyto2.com answer
 *   - Voices, topics, padding, admin replies all picked from same lang pool
 *
 *   GOOGLE_APPLICATION_CREDENTIALS=path/to/sa.json node scripts/seed-forum.mjs --apply
 *   (no --apply prints sample 5 per (product, lang) and exits)
 */

import { initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { readFileSync } from 'node:fs';
import {
  SLOTS, VOICES, TOPICS, BODY_PADDING,
  ADMIN_REPLIES, COMMUNITY_REPLIES, TAGS,
} from './seed-voices.mjs';

// ============================================================
// CLI / config
// ============================================================

const APPLY = process.argv.includes('--apply');
const RESET = process.argv.includes('--reset');
const ONLY  = process.argv.find((a) => a.startsWith('--only='))?.split('=')[1]; // 'cloud' | 'code'
const SAMPLE_ONLY = !APPLY && !RESET;

const TARGETS = {
  cloud: ONLY === 'code' ? { en: 0, zh: 0, ja: 0 } : { en: 2800, zh: 800, ja: 400 },
  code:  ONLY === 'cloud' ? { en: 0, zh: 0, ja: 0 } : { en: 1200, zh: 280, ja: 120 },
};

const ADMIN_EMAIL = 'admin@flyto2.com';
const ADMIN_PASSWORD = '@Wen9520520!';

// ============================================================
// Firebase admin init
// ============================================================

function loadServiceAccount() {
  const path = process.env.GOOGLE_APPLICATION_CREDENTIALS
            || process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!path) return null;
  // Quietly skip if the path is set but the file doesn't exist (.env.local
  // points at a placeholder by default). Falls through to ADC.
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

const sa = loadServiceAccount();
const projectId = sa?.project_id
  || process.env.GOOGLE_CLOUD_PROJECT
  || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  || 'ticket-helper-dbc0e';

initializeApp(sa
  ? { credential: cert(sa), projectId }
  : { credential: applicationDefault(), projectId }
);

console.log(sa
  ? `[init] using service account for project ${projectId}`
  : `[init] using gcloud ADC for project ${projectId}`);

const db   = getFirestore();
const auth = getAuth();

// ============================================================
// Helpers
// ============================================================

const PRODUCTS = ['cloud', 'code'];
const LANGS    = ['en', 'zh', 'ja'];

const rand    = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pick    = (n, arr) => Array.from({ length: n }, () => rand(arr));
const chance  = (p) => Math.random() < p;

/** Resolve {slot} placeholders, caching picks so title and body stay in sync */
function expandWithSlots(template, product, cache = {}) {
  const out = template.replace(/\{(\w+)\}/g, (_, slot) => {
    if (cache[slot]) return cache[slot];
    const pool = SLOTS[product]?.[slot];
    if (!pool) return `{${slot}}`;
    const v = rand(pool);
    cache[slot] = v;
    return v;
  });
  return { text: out, cache };
}

function expand(template, product, cache = {}) {
  return expandWithSlots(template, product, cache).text;
}

function renderPost(template, product, voice) {
  const { text: resolvedTopic, cache } = expandWithSlots(template, product);

  // Title is just the resolved topic — voice prefixes ending in comma read
  // awkward when glued before another sentence, so we keep them out of the
  // title and let voice show in the body paragraph instead.
  const title = resolvedTopic.trim().slice(0, 200);

  const bodyPrefix = rand(voice.prefix);
  const padding = BODY_PADDING[product]?.[voice.lang] ?? BODY_PADDING[product].en;
  const padding1 = expandWithSlots(rand(padding), product, cache).text;
  const length = voice.length;

  let body;
  if (length === 'micro') {
    body = resolvedTopic;
  } else if (length === 'short') {
    body = `${bodyPrefix ? bodyPrefix + ' ' : ''}${resolvedTopic}\n\n${padding1}`;
  } else if (length === 'medium') {
    body = `${bodyPrefix ? bodyPrefix + '\n\n' : ''}${resolvedTopic}\n\n${padding1}`;
  } else {
    const padding2 = expandWithSlots(rand(padding), product, cache).text;
    body = `${bodyPrefix ? bodyPrefix + '\n\n' : ''}${resolvedTopic}\n\n${padding1}\n\n${padding2}`;
  }

  return { title, body, slotCache: cache };
}

// ============================================================
// Author pools per lang
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
for (const lang of LANGS) {
  AUTHOR_POOL[lang] = NAMES[lang].map((name, i) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12) || 'user';
    const tld = lang === 'ja' ? 'jp' : (lang === 'zh' ? 'tw' : rand(['com', 'io', 'co']));
    const suffix = Math.floor(Math.random() * 9999);
    return {
      user_id:    `seed-uid-${lang}-${i.toString().padStart(3, '0')}-${Math.random().toString(36).slice(2, 8)}`,
      user_name:  name,
      user_email: `${slug}${suffix}@example.${tld}`,
      user_avatar: null,
    };
  });
}

// ============================================================
// Build one post (no replies yet)
// ============================================================

function buildPost(product, lang, idx, seenTitles) {
  const voicePool = VOICES[product][lang];
  const topicPool = TOPICS[product][lang];
  if (!voicePool?.length || !topicPool?.length) {
    throw new Error(`empty pool for ${product}/${lang}`);
  }

  const voice = { ...rand(voicePool), lang };
  let topic, rendered;
  let attempts = 0;
  do {
    topic = rand(topicPool);
    rendered = renderPost(topic.t, product, voice);
    attempts++;
  } while (seenTitles.has(rendered.title.toLowerCase()) && attempts < 6);
  seenTitles.add(rendered.title.toLowerCase());

  const author = rand(AUTHOR_POOL[lang]);
  const { title, body, slotCache } = rendered;

  const tagPool   = TAGS[product][topic.cat] ?? [];
  const tagCount  = Math.floor(Math.random() * 4);
  const tags      = pick(tagCount, tagPool).filter((v, i, a) => a.indexOf(v) === i);

  const ageMs = Math.random() * 1000 * 60 * 60 * 24 * 540;
  const createdAt = new Date(Date.now() - ageMs);

  const pinned = idx < 3;
  const reactionSum = Math.floor(Math.random() ** 4 * 80);
  const ageDays = ageMs / 86_400_000;
  const viewCount = Math.floor(ageDays * (3 + Math.random() * 25) + reactionSum * (5 + Math.random() * 15));

  return {
    product,
    lang,
    category:     topic.cat,
    user_id:      author.user_id,
    user_email:   author.user_email,
    user_name:    author.user_name,
    user_avatar:  author.user_avatar,
    title,
    body,
    tags,
    pinned,
    locked:       false,
    solution_id:  null,
    view_count:   viewCount,
    reply_count:  0,
    reaction_sum: reactionSum,
    is_official:  false,
    created_at:   Timestamp.fromDate(createdAt),
    updated_at:   Timestamp.fromDate(createdAt),
    _slotCache:   slotCache,
  };
}

function buildComments(product, post, slotCache = {}) {
  const replyCount = chance(0.05) ? 4 + Math.floor(Math.random() * 6)
                  :  chance(0.4)  ? 2 + Math.floor(Math.random() * 2)
                                  : 1;
  const comments = [];
  let lastTime = post.created_at.toDate();
  const hasAdminReply = chance(0.7);
  const lang = post.lang;

  for (let i = 0; i < replyCount; i++) {
    const isAdmin = hasAdminReply && (i === 0 || (i === 1 && chance(0.3)));
    lastTime = new Date(lastTime.getTime() + (5 * 60_000) + Math.random() * 4 * 3600_000);

    const author = isAdmin
      ? {
          user_id:    'admin-flyto2',
          user_email: ADMIN_EMAIL,
          user_name:  'Flyto2 Team',
          user_avatar: null,
        }
      : rand(AUTHOR_POOL[lang]);

    const replyPool = isAdmin
      ? (ADMIN_REPLIES[product][lang] ?? ADMIN_REPLIES[product].en)
      : (COMMUNITY_REPLIES[product][lang] ?? COMMUNITY_REPLIES[product].en);
    const body = expand(rand(replyPool), product, slotCache);

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
// Apply
// ============================================================

async function resetCollection() {
  console.log('[reset] deleting all forum_posts (and subcollections)…');
  let deleted = 0;
  while (true) {
    const snap = await db.collection('forum_posts').limit(200).get();
    if (snap.empty) break;
    // Delete subcollections (comments, reactions) first per doc.
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
    deleted += snap.size;
    process.stdout.write(`\r[reset] deleted: ${deleted}`);
  }
  process.stdout.write('\n');
  console.log(`[reset] done. ${deleted} posts removed.`);
}

async function ensureAdminUser() {
  try {
    await auth.getUserByEmail(ADMIN_EMAIL);
    console.log(`[admin] ${ADMIN_EMAIL} already exists.`);
  } catch {
    await auth.createUser({
      email:         ADMIN_EMAIL,
      password:      ADMIN_PASSWORD,
      displayName:   'Flyto2 Team',
      emailVerified: true,
    });
    console.log(`[admin] created ${ADMIN_EMAIL}`);
  }
  const u = await auth.getUserByEmail(ADMIN_EMAIL);
  await auth.setCustomUserClaims(u.uid, { admin: true });
  console.log(`[admin] custom claim {admin:true} set on ${u.uid}`);
}

async function applyAll() {
  const posts = [];
  const seenTitles = new Set();

  for (const product of PRODUCTS) {
    for (const lang of LANGS) {
      const target = TARGETS[product][lang];
      for (let i = 0; i < target; i++) {
        posts.push(buildPost(product, lang, i, seenTitles));
      }
      console.log(`[seed] ${product}/${lang}: ${target} posts`);
    }
  }

  console.log(`[seed] total ${posts.length} posts`);

  // Smaller batches + per-batch retry — Firestore over the public network
  // sees occasional ECONNRESET / DEADLINE_EXCEEDED, especially on long runs.
  // Tightening the per-call payload and retrying transient failures lets the
  // overall seed survive a flaky link.
  const CHUNK = 150;
  let written = 0;
  const postIds = [];

  for (let i = 0; i < posts.length; i += CHUNK) {
    const slice = posts.slice(i, i + CHUNK);
    await commitWithRetry(`posts ${i}-${i + slice.length}`, async () => {
      const batch = db.batch();
      const newRefs = [];
      for (const p of slice) {
        const ref = db.collection('forum_posts').doc();
        const { _slotCache, ...storable } = p;
        batch.set(ref, storable);
        newRefs.push({ id: ref.id, post: p, slotCache: _slotCache ?? {} });
      }
      await batch.commit();
      postIds.push(...newRefs);
    });
    written += slice.length;
    console.log(`[seed] posts: ${written}/${posts.length}`);
  }

  const POSTS_PER_BATCH = 30;  // smaller — comments fan out 1–9 per post
  let cWritten = 0;
  for (let i = 0; i < postIds.length; i += POSTS_PER_BATCH) {
    const slice = postIds.slice(i, i + POSTS_PER_BATCH);
    let sliceComments = 0;
    await commitWithRetry(`comments for posts ${i}-${i + slice.length}`, async () => {
      const batch = db.batch();
      sliceComments = 0;
      for (const { id, post, slotCache } of slice) {
        const { comments, hasAdminReply } = buildComments(post.product, post, slotCache);
        let solutionId = null;
        let lastTs = post.created_at;
        for (const c of comments) {
          const cRef = db.collection('forum_posts').doc(id).collection('comments').doc();
          if (hasAdminReply && c.is_official && post.category === 'question'
              && !solutionId && chance(0.35)) {
            c.is_solution = true;
            solutionId = cRef.id;
          }
          batch.set(cRef, c);
          sliceComments++;
          if (c.created_at && c.created_at.toMillis() > lastTs.toMillis()) {
            lastTs = c.created_at;
          }
        }
        batch.update(db.collection('forum_posts').doc(id), {
          reply_count: comments.length,
          updated_at:  lastTs,
          solution_id: solutionId,
        });
      }
      await batch.commit();
    });
    cWritten += sliceComments;
    if ((i / POSTS_PER_BATCH) % 10 === 0) {
      console.log(`[seed] comments so far: ${cWritten}`);
    }
  }

  console.log(`[seed] done. ${written} posts + ${cWritten} comments.`);
}

/**
 * Wrap a batch.commit() with exponential backoff on transient network errors.
 * Logs each failure so progress is visible.
 */
async function commitWithRetry(label, fn) {
  const MAX_ATTEMPTS = 5;
  const BASE_DELAY_MS = 2000;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      await fn();
      return;
    } catch (e) {
      const transient = /UNAVAILABLE|DEADLINE_EXCEEDED|ECONNRESET|ENETUNREACH|ETIMEDOUT|RST_STREAM|10|14|4/i.test(
        e?.code != null ? String(e.code) : ''
      ) || /UNAVAILABLE|DEADLINE_EXCEEDED|ECONNRESET|RST_STREAM/i.test(e?.message ?? '');
      const last = attempt === MAX_ATTEMPTS;
      if (last || !transient) {
        console.error(`[seed] ${label}: failed permanently after ${attempt} attempt(s)`);
        throw e;
      }
      const delay = BASE_DELAY_MS * 2 ** (attempt - 1);
      console.warn(`[seed] ${label}: transient error, retrying in ${delay}ms (attempt ${attempt}/${MAX_ATTEMPTS}) — ${e?.message ?? e?.code}`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

// ============================================================
// Sample mode
// ============================================================

function sample() {
  console.log('SAMPLE MODE (no writes). Run with --apply to seed.\n');
  for (const product of PRODUCTS) {
    for (const lang of LANGS) {
      console.log(`\n========== ${product.toUpperCase()} / ${lang.toUpperCase()} (sample 3) ==========\n`);
      const seen = new Set();
      for (let i = 0; i < 3; i++) {
        const p = buildPost(product, lang, i, seen);
        console.log(`[${p.category}] ${p.user_name}: ${p.title}`);
        console.log(`  ${p.body.slice(0, 180).replace(/\n/g, ' ')}…`);
        console.log('');
      }
    }
  }
  console.log('\nTo apply: GOOGLE_APPLICATION_CREDENTIALS=path/to/sa.json node scripts/seed-forum.mjs --apply');
}

// ============================================================
// Run
// ============================================================

(async () => {
  if (SAMPLE_ONLY) { sample(); return; }
  if (RESET) {
    await resetCollection();
    if (!APPLY) return;
  }
  const total = Object.values(TARGETS).reduce((s, p) => s + Object.values(p).reduce((a, b) => a + b, 0), 0);
  console.log(`[seed] applying ${total} posts to Firestore`);
  await ensureAdminUser();
  await applyAll();
})();
