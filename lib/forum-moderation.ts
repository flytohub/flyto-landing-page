/**
 * Client-side moderation gate for the forum.
 *
 * Why client-side: the seed corpus contains posts we don't want to ship, but
 * we also don't want to wipe Firestore — the forum needs the volume to feel
 * alive. So we filter at read-time and ship the rest.
 *
 * Two layers:
 *   1. `hidden === true` on the post document — admin manual override.
 *   2. Pattern blacklist below — catches whole categories at once.
 *
 * Edit BLOCKED_* arrays to add new patterns. They are anchored case-
 * insensitive against the raw title/body strings.
 */

import type { Post, Comment } from './forum';

// Regex applied to BOTH title and body. Anchor with \b for whole-word matching
// to avoid false positives ("scam" matching "scammed/scampi").
const BLOCKED_PATTERNS: RegExp[] = [
  // --- Adult / NSFW ---
  /\b(porn|xxx|nsfw|onlyfans|escort|adult\s?cam)\b/i,
  /(色情|成人片|裸聊|援交|AV女優)/,
  /(アダルト|エロ動画|裏ビデオ)/,

  // --- Scam / fraud / phishing ---
  /\b(phishing|crypto\s?scam|nigerian\s?prince|wire\s?fraud|carding|stolen\s?cc)\b/i,
  /(詐騙|釣魚|盜刷|偽造身分|洗錢)/,
  /(詐欺|フィッシング|マネーロンダリング)/,

  // --- Banking / financial credential automation — Flyto2 is browser
  //     automation, so "automate my bank login" is a recurring grey-area
  //     ask. We don't want it on the public board even if technically legal.
  //     Anchored as bank+verb so "I work at a bank" doesn't trip the filter. ---
  /\b(bank|banking|brokerage|crypto\s?exchange)\s+(login|password|credentials?|2fa|otp|auto[-\s]?login|bot|scrape|automat\w*)\b/i,
  /\b(automate|scrape|bypass|intercept)\s+(my\s+|the\s+)?(bank|banking|netbank|atm|wire\s?transfer|credit\s?card)\b/i,
  /\b(bypass|skip|intercept|sniff|capture)\s+(2fa|two[-\s]?factor|otp|sms\s?code|verification\s?code)\b/i,
  /\b(robinhood|interactive\s?brokers|td\s?ameritrade|coinbase|binance|kraken)\s+(bot|auto[-\s]?trade|scraper)\b/i,
  /(網銀|網路銀行|網上銀行).*(密碼|登入|登陆|自動|自动|爬取|擷取|抓取)/,
  /(自動|自动).*(轉帳|转账|匯款|汇款|提款|取款)/,
  /(繞過|绕过|跳過|跳过).*(二步驗證|二步验证|簡訊驗證|短信验证|OTP|雙因素)/,
  /(攔截|拦截|竊取|窃取).*(簡訊|短信|驗證碼|验证码|OTP)/,
  /(ネット\s?バンキング|オンラインバンキング).*(自動|スクレイピング|ログイン)/,
  /(二段階認証|2段階認証).*(回避|バイパス|スキップ)/,
  /(口座|銀行口座).*(自動.*ログイン|スクレイピング|乗っ取り)/,
  // Bare bank/ATM mention — in a browser-automation forum, any post that
  // reaches for these terms is overwhelmingly a financial-automation ask
  // (feature requests, "official module", credential scrapes, etc).
  // Catches "玉山銀行 ATM 模組" framing that the verb-anchored patterns miss.
  /銀行/,
  /\bATM\b/,
  /ネットバンク/,

  // --- Account farming / abusive scraping that we don't want to be known for ---
  /\b(account\s?farm|bot\s?army|fake\s?reviews?|view\s?bot|engagement\s?farm)\b/i,
  /(刷單|刷評|養號|機器人粉絲|假帳號買賣)/,

  // --- Scalping / reseller bots — Flyto2's grey-area users; keep off the public board ---
  /\b(scalp(er|ing)|sneaker\s?bot|ticket\s?bot|reseller\s?bot)\b/i,
  /(黃牛|搶票機器人|搶鞋機器人|代搶)/,
  /(転売|転バイヤー|チケット転売)/,

  // --- Violence / weapons / drugs / self-harm ---
  /\b(suicide|self\s?harm|how\s?to\s?make\s?a?\s?bomb|buy\s?gun|illegal\s?drugs?)\b/i,
  /(自殺|自殘|製造炸彈|私槍|毒品交易)/,
  /(自殺|自傷|爆弾|麻薬|拳銃)/,

  // --- Hate / slurs — generic catch ---
  /\b(n[i1]gg(er|a)|f[a4]gg(ot|y))\b/i,

  // --- Workplace objectification — `<job-title>+<infantilizing/aging label>`
  //     compound. The compound is what makes it bad; "妹妹" / "阿姨" alone
  //     are everyday words for younger/older female relatives. ---
  /(會計|财务|財務|HR|人資|人事|工程師|工程师|秘書|秘书|OL|前台|前臺|前端|行銷|行销|業務|业务|客服)[\s、，,]{0,3}(阿姨|妹妹|大姐|大叔|小妹|大哥|姐|妹)/,
  /(office\s?girl|hr\s?girl|secretary\s?girl)\b/i,

  // --- Geopolitical flashpoints — we don't moderate the topic, we just keep
  //     it off a browser-automation product forum to avoid derailing threads ---
  /(台獨|港獨|藏獨|疆獨|六四|天安門|文革)/,
  /\b(taiwan\s?independence|hong\s?kong\s?independence|tiananmen\s?massacre)\b/i,
];

// Whole-tag blacklist. Compared lowercase exact.
const BLOCKED_TAGS: string[] = [
  'nsfw',
  'scalping',
  'gambling',
  'crypto-scam',
];

// User IDs that should never surface. Drop the seed admin or test accounts here.
const BLOCKED_USER_IDS: string[] = [];

interface ModeratableLike {
  user_id: string;
  body?: string;
  title?: string;
  tags?: string[];
}

function matchesBlacklist(text: string): boolean {
  return BLOCKED_PATTERNS.some((re) => re.test(text));
}

export function isPostHidden(post: Post): boolean {
  if ((post as Post & { hidden?: boolean }).hidden === true) return true;
  if (BLOCKED_USER_IDS.includes(post.user_id)) return true;
  if (post.tags?.some((t) => BLOCKED_TAGS.includes(t.toLowerCase()))) return true;
  if (matchesBlacklist(`${post.title}\n${post.body}`)) return true;
  return false;
}

export function isCommentHidden(comment: Comment): boolean {
  if ((comment as Comment & { hidden?: boolean }).hidden === true) return true;
  if (BLOCKED_USER_IDS.includes(comment.user_id)) return true;
  if (matchesBlacklist(comment.body)) return true;
  return false;
}

export function filterPosts(posts: Post[]): Post[] {
  return posts.filter((p) => !isPostHidden(p));
}

export function filterComments(comments: Comment[]): Comment[] {
  return comments.filter((c) => !isCommentHidden(c));
}

// Visible to UI in case we want to surface "N posts hidden by moderation".
export function moderationStats(posts: Post[]): { kept: number; hidden: number } {
  const hidden = posts.filter(isPostHidden).length;
  return { kept: posts.length - hidden, hidden };
}
