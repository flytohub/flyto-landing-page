/**
 * Bulk forum seeder — reads `scripts/forum-bulk.mjs` (hand-authored corpus
 * by Claude in-conversation) and writes the combined exemplars + bulk to
 * Firestore. No external API calls — pure local JSON pipe.
 *
 * Auth: uses gcloud Application Default Credentials. Run
 *   `gcloud auth application-default login`
 * once (already done) — no service-account JSON needed.
 *
 * Usage:
 *   npm install --no-save firebase-admin
 *
 *   # dry-run (prints stats only):
 *   node scripts/seed-bulk.mjs
 *
 *   # destructive: wipes forum_posts, writes 24 exemplars + bulk corpus
 *   node scripts/seed-bulk.mjs --apply
 */

import { initializeApp, cert, applicationDefault, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'node:fs';
import { POSTS as EXEMPLARS, PERSONAS as CURATED_PERSONAS } from './seed-curated.mjs';
import { BULK_POSTS, BULK_PERSONAS } from './forum-bulk.mjs';

const APPLY = process.argv.includes('--apply');

// ----------------------------------------------------------------
// Init — idempotent against seed-curated.mjs being imported too.
// ----------------------------------------------------------------

function ensureFirebase() {
  if (getApps().length > 0) return getFirestore();
  const saPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (saPath && existsSync(saPath)) {
    initializeApp({ credential: cert(JSON.parse(readFileSync(saPath, 'utf8'))) });
  } else {
    initializeApp({ credential: applicationDefault() });
  }
  return getFirestore();
}
const db = ensureFirebase();

const PERSONAS = { ...CURATED_PERSONAS, ...BULK_PERSONAS };

function authorFields(key) {
  const p = PERSONAS[key];
  if (!p) throw new Error(`Unknown persona: ${key}`);
  return {
    user_id:     p.uid,
    user_email:  p.email,
    user_name:   p.name,
    user_avatar: null,
    is_official: !!p.official,
  };
}

function tsFromDaysAgo(daysAgo, hoursOffset = 0) {
  return Timestamp.fromMillis(
    Date.now() - daysAgo * 24 * 3600 * 1000 + hoursOffset * 3600 * 1000,
  );
}

// ----------------------------------------------------------------
// Apply
// ----------------------------------------------------------------

async function applyToFirestore(allPosts) {
  console.log('\nWiping forum_posts (recursive)…');
  await db.recursiveDelete(db.collection('forum_posts'));

  console.log(`Writing ${allPosts.length} posts…`);
  let i = 0;
  for (const p of allPosts) {
    const postCreated = tsFromDaysAgo(p.days_ago ?? 1);
    const a = authorFields(p.author);

    const postRef = await db.collection('forum_posts').add({
      product:      p.product,
      lang:         p.lang,
      category:     p.category,
      title:        p.title,
      body:         p.body,
      tags:         p.tags || [],
      ...a,
      pinned:       !!p.pinned,
      locked:       false,
      solution_id:  null,
      view_count:   p.views ?? 0,
      reply_count:  (p.comments || []).length,
      reaction_sum: p.reactions ?? 0,
      created_at:   postCreated,
      updated_at:   postCreated,
    });

    const commentRefs = [];
    for (const c of p.comments || []) {
      const ca = authorFields(c.author);
      const offsetMs =
        ((c.hours_after ?? 0) * 3600 +
          (c.minutes_after ?? 0) * 60 +
          (c.days_after ?? 0) * 86400) *
        1000;
      const createdAt = Timestamp.fromMillis(postCreated.toMillis() + offsetMs);
      const parentId =
        c.parent_idx !== undefined && c.parent_idx !== null && commentRefs[c.parent_idx]
          ? commentRefs[c.parent_idx].id
          : null;

      const ref = await postRef.collection('comments').add({
        parent_id:    parentId,
        ...ca,
        body:         c.body,
        reaction_sum: 0,
        is_solution:  false,
        created_at:   createdAt,
      });
      commentRefs.push(ref);
    }

    i++;
    if (i % 10 === 0 || i === allPosts.length) {
      process.stdout.write(`\r  written: ${i}/${allPosts.length}    `);
    }
  }
  console.log('');
}

// ----------------------------------------------------------------
// Main
// ----------------------------------------------------------------

async function main() {
  const combined = [...EXEMPLARS, ...BULK_POSTS];

  const byLang = {}, byCat = {}, byProduct = {};
  for (const p of combined) {
    byLang[p.lang]       = (byLang[p.lang]       ?? 0) + 1;
    byCat[p.category]    = (byCat[p.category]    ?? 0) + 1;
    byProduct[p.product] = (byProduct[p.product] ?? 0) + 1;
  }

  console.log(`Total corpus: ${combined.length} posts (${EXEMPLARS.length} curated + ${BULK_POSTS.length} bulk)`);
  console.log('  by language:', byLang);
  console.log('  by category:', byCat);
  console.log('  by product: ', byProduct);

  if (!APPLY) {
    console.log(`\nDry-run. Re-run with --apply to wipe forum_posts and write ${combined.length} posts.`);
    return;
  }

  await applyToFirestore(combined);
  console.log(`\nDone. forum_posts now contains ${combined.length} posts.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
