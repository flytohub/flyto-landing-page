'use client';

import {
  collection,
  doc,
  query,
  where,
  orderBy,
  limit as fsLimit,
  startAfter,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  increment,
  Timestamp,
  type DocumentSnapshot,
  type QueryDocumentSnapshot,
  type QueryConstraint,
} from 'firebase/firestore';
import { firestore } from './firebase';

export type Product = 'cloud' | 'code';
export type Lang = 'en' | 'zh' | 'ja';
export type Category = 'question' | 'bug' | 'feature' | 'discussion';
export type Sort = 'new' | 'top' | 'hot';
export type Emoji = 'thumbs_up' | 'heart' | 'rocket' | 'eyes';

/**
 * Map a UI locale (16 supported) to the 3 forum data buckets. Less-spoken
 * locales fall back to English so the forum still has content.
 */
export function localeToLang(locale: string): Lang {
  if (locale === 'zh' || locale === 'cn') return 'zh';
  if (locale === 'ja') return 'ja';
  return 'en';
}

export interface Author {
  user_id: string;
  user_email: string;
  user_name: string;
  user_avatar?: string;
}

export interface Post extends Author {
  id: string;
  product: Product;
  lang: Lang;
  category: Category;
  title: string;
  body: string;
  tags: string[];
  pinned: boolean;
  locked: boolean;
  solution_id: string | null;
  view_count: number;
  reply_count: number;
  reaction_sum: number;
  is_official: boolean;       // marker that the author is a Flyto2 admin
  created_at: Date;
  updated_at: Date;
}

export interface Comment extends Author {
  id: string;
  post_id: string;
  parent_id: string | null;
  body: string;
  reaction_sum: number;
  is_official: boolean;
  is_solution: boolean;
  created_at: Date;
}

// ============================================================
// Decoders — Firestore Timestamps to Dates
// ============================================================

function tsToDate(v: unknown): Date {
  if (v instanceof Timestamp) return v.toDate();
  if (typeof v === 'string') return new Date(v);
  return new Date();
}

function decodePost(snap: DocumentSnapshot): Post {
  const d = snap.data() ?? {};
  return {
    id:           snap.id,
    product:      (d.product as Product) ?? 'cloud',
    lang:         (d.lang as Lang) ?? 'en',
    category:     (d.category as Category) ?? 'discussion',
    user_id:      d.user_id ?? '',
    user_email:   d.user_email ?? '',
    user_name:    d.user_name ?? 'Anonymous',
    user_avatar:  d.user_avatar,
    title:        d.title ?? '',
    body:         d.body ?? '',
    tags:         Array.isArray(d.tags) ? d.tags : [],
    pinned:       Boolean(d.pinned),
    locked:       Boolean(d.locked),
    solution_id:  d.solution_id ?? null,
    view_count:   d.view_count ?? 0,
    reply_count:  d.reply_count ?? 0,
    reaction_sum: d.reaction_sum ?? 0,
    is_official:  Boolean(d.is_official),
    created_at:   tsToDate(d.created_at),
    updated_at:   tsToDate(d.updated_at ?? d.created_at),
  };
}

function decodeComment(snap: DocumentSnapshot, postId: string): Comment {
  const d = snap.data() ?? {};
  return {
    id:           snap.id,
    post_id:      postId,
    parent_id:    d.parent_id ?? null,
    user_id:      d.user_id ?? '',
    user_email:   d.user_email ?? '',
    user_name:    d.user_name ?? 'Anonymous',
    user_avatar:  d.user_avatar,
    body:         d.body ?? '',
    reaction_sum: d.reaction_sum ?? 0,
    is_official:  Boolean(d.is_official),
    is_solution:  Boolean(d.is_solution),
    created_at:   tsToDate(d.created_at),
  };
}

// ============================================================
// Reads
// ============================================================

export interface ListPostsParams {
  product:   Product;
  lang:      Lang;
  category?: Category | 'all';
  sort?:     Sort;
  pageSize?: number;
  /**
   * Pagination cursor — pass the previous page's `nextCursor` directly. We
   * use a DocumentSnapshot rather than a Date because Firestore's startAfter
   * needs to align with all orderBy fields, not just one.
   */
  cursor?:   QueryDocumentSnapshot | null;
}

export interface PostPage {
  posts: Post[];
  nextCursor: QueryDocumentSnapshot | null;
}

export async function listPosts({
  product,
  lang,
  category = 'all',
  sort = 'new',
  pageSize = 20,
  cursor = null,
}: ListPostsParams): Promise<PostPage> {
  const constraints: QueryConstraint[] = [
    where('lang',    '==', lang),
    where('product', '==', product),
  ];

  if (category !== 'all') constraints.push(where('category', '==', category));

  if (sort === 'top') {
    constraints.push(orderBy('reaction_sum', 'desc'), orderBy('created_at', 'desc'));
  } else if (sort === 'hot') {
    constraints.push(orderBy('reply_count', 'desc'), orderBy('created_at', 'desc'));
  } else {
    constraints.push(orderBy('pinned', 'desc'), orderBy('created_at', 'desc'));
  }

  if (cursor) constraints.push(startAfter(cursor));
  constraints.push(fsLimit(pageSize));

  const q = query(collection(firestore(), 'forum_posts'), ...constraints);
  const snap = await getDocs(q);
  const posts = snap.docs.map((d) => decodePost(d));

  const lastDoc = snap.docs[snap.docs.length - 1];
  return {
    posts,
    nextCursor: posts.length === pageSize && lastDoc ? lastDoc : null,
  };
}

export async function getPost(id: string): Promise<Post | null> {
  const ref = doc(firestore(), 'forum_posts', id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return decodePost(snap);
}

export async function listComments(postId: string): Promise<Comment[]> {
  const q = query(
    collection(firestore(), 'forum_posts', postId, 'comments'),
    orderBy('created_at', 'asc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => decodeComment(d, postId));
}

// ============================================================
// Writes
// ============================================================

export interface CreatePostInput {
  product:  Product;
  lang:     Lang;
  category: Category;
  title:    string;
  body:     string;
  tags:     string[];
}

export async function createPost(
  author: Author,
  input: CreatePostInput,
): Promise<string> {
  const ref = await addDoc(collection(firestore(), 'forum_posts'), {
    product:      input.product,
    lang:         input.lang,
    category:     input.category,
    title:        input.title,
    body:         input.body,
    tags:         input.tags,
    user_id:      author.user_id,
    user_email:   author.user_email,
    user_name:    author.user_name,
    user_avatar:  author.user_avatar ?? null,
    pinned:       false,
    locked:       false,
    solution_id:  null,
    view_count:   0,
    reply_count:  0,
    reaction_sum: 0,
    is_official:  author.user_email === 'admin@flyto2.com',
    created_at:   serverTimestamp(),
    updated_at:   serverTimestamp(),
  });
  return ref.id;
}

export async function createComment(
  postId: string,
  author: Author,
  body: string,
  parentId: string | null = null,
): Promise<string> {
  const commentRef = await addDoc(
    collection(firestore(), 'forum_posts', postId, 'comments'),
    {
      parent_id:    parentId,
      user_id:      author.user_id,
      user_email:   author.user_email,
      user_name:    author.user_name,
      user_avatar:  author.user_avatar ?? null,
      body,
      reaction_sum: 0,
      is_official:  author.user_email === 'admin@flyto2.com',
      is_solution:  false,
      created_at:   serverTimestamp(),
    },
  );

  // Bump the parent post's reply_count + updated_at — counters allowed by rules.
  await updateDoc(doc(firestore(), 'forum_posts', postId), {
    reply_count: increment(1),
    updated_at:  serverTimestamp(),
  });

  return commentRef.id;
}

export async function bumpView(postId: string): Promise<void> {
  // Best-effort; we don't await on the UI thread.
  try {
    await updateDoc(doc(firestore(), 'forum_posts', postId), {
      view_count: increment(1),
    });
  } catch {
    // Anonymous viewers can't write — silent.
  }
}

export async function toggleReaction(
  postId: string,
  userId: string,
  emoji: Emoji,
  on: boolean,
): Promise<void> {
  const id = `${userId}_${emoji}`;
  const ref = doc(firestore(), 'forum_posts', postId, 'reactions', id);
  if (on) {
    await setDoc(ref, { user_id: userId, emoji, created_at: serverTimestamp() });
    await updateDoc(doc(firestore(), 'forum_posts', postId), {
      reaction_sum: increment(1),
    });
  } else {
    await deleteDoc(ref);
    await updateDoc(doc(firestore(), 'forum_posts', postId), {
      reaction_sum: increment(-1),
    });
  }
}
