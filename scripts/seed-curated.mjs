/**
 * One-shot CURATED forum seed.
 *
 * Wipes `forum_posts` (and its subcollections) then writes a hand-authored
 * corpus of high-quality, English-language questions / bug reports / feature
 * requests / discussions. Each post has realistic engagement counters,
 * varied authors, and a subset of admin@flyto2.com replies that read like
 * an actual product team responded.
 *
 * Usage:
 *   npm install --no-save firebase-admin
 *
 *   # dry-run (no writes — prints what would be created):
 *   GOOGLE_APPLICATION_CREDENTIALS=./.firebase-sa.json \
 *     node scripts/seed-curated.mjs
 *
 *   # destructive: wipes existing forum_posts then writes the new corpus
 *   ... node scripts/seed-curated.mjs --apply
 */

import { initializeApp, cert, applicationDefault, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'node:fs';

const APPLY = process.argv.includes('--apply');

// ----------------------------------------------------------------
// Init — idempotent so importing this module doesn't re-initialize
// when seed-bulk.mjs (or anyone else) also calls initializeApp.
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

// ----------------------------------------------------------------
// Personas — stable identities so a few authors look like regulars.
// ----------------------------------------------------------------

export const PERSONAS = {
  admin:    { uid: 'flyto_admin',      name: 'Flyto2 Team',   email: 'admin@flyto2.com', official: true },
  jhammond: { uid: 'seed_jhammond',    name: 'James Hammond', email: 'team@flyto2.com' },
  ksong:    { uid: 'seed_ksong',       name: 'Kelly Song',    email: 'team@flyto2.com' },
  mvelasco: { uid: 'seed_mvelasco',    name: 'Miguel Velasco',email: 'team@flyto2.com' },
  rwhite:   { uid: 'seed_rwhite',      name: 'Rachel White',  email: 'team@flyto2.com' },
  kdiallo:  { uid: 'seed_kdiallo',     name: 'Khadija Diallo',email: 'team@flyto2.com' },
  tkonig:   { uid: 'seed_tkonig',      name: 'Tomáš König',   email: 'team@flyto2.com' },
  png:      { uid: 'seed_png',         name: 'Patrick Ng',    email: 'team@flyto2.com' },
  evgenia:  { uid: 'seed_evgenia',     name: 'Evgenia Sokolova', email: 'team@flyto2.com' },
  vchen:    { uid: 'seed_vchen',       name: 'Vincent Chen',  email: 'team@flyto2.com' },
  shimizu:  { uid: 'seed_shimizu',     name: 'Hiroshi Shimizu', email: 'team@flyto2.com' },
  shulin:   { uid: 'seed_shulin',      name: '林書豪',          email: 'team@flyto2.com' },
  ywang:    { uid: 'seed_ywang',       name: '王宇彤',           email: 'team@flyto2.com' },
  yuki:     { uid: 'seed_yuki',        name: '田中 雪',          email: 'team@flyto2.com' },
  sgupta:   { uid: 'seed_sgupta',      name: 'Sneha Gupta',   email: 'team@flyto2.com' },
};

function author(key) {
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

// ----------------------------------------------------------------
// Corpus — 25 curated posts. Order doesn't matter; we date them
// retroactively across the last ~5 months.
// ----------------------------------------------------------------

export const POSTS = [
  // ---------- Cloud — questions ----------
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'jhammond', pinned: false, days_ago: 4, views: 142, reactions: 11,
    title: 'Handling pages that lazy-load on scroll',
    body:
`We're capturing a Notion-style table that hydrates rows as you scroll. Our recording reliably gets the first ~50 rows then runs the next "click row" step against a row that hasn't rendered yet.

What I've tried:
- Fixed 1500ms sleeps between scrolls (flaky at the bottom)
- waitForSelector on a generic row class (returns immediately because the first batch is already present)

What's the recommended pattern for waiting on async row hydration past the initial render?`,
    tags: ['scroll', 'wait', 'scraping'],
    comments: [
      { author: 'admin', minutes_after: 38,
        body: `Use a sentinel selector that advances — e.g. \`[data-row-index="${'$'}{lastSeen+50}"]\` — and put waitForSelector on that. Pair with scrollIntoView on the last visible row instead of window scroll. The "Infinite scroll capture" template has a working version; happy to walk through it if you DM.` },
      { author: 'ksong', hours_after: 3,
        body: 'We hit the exact same thing on Linear backlog. Switched to waitForNetworkIdle after each scroll — heavier than waitForSelector but our flake rate went to zero.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'rwhite', pinned: false, days_ago: 11, views: 96, reactions: 8,
    title: 'Keeping credentials out of the recording file',
    body:
`We want to version-control our workflows in GitHub but the recordings have plaintext logins baked into the typed-text steps. Is there a recommended substitution pattern? I see references to env-var placeholders in the docs but the examples are thin.

Bonus: what about Okta SSO popups — those redirect through a separate domain which seems to confuse the recorder.`,
    tags: ['security', 'credentials', 'okta', 'sso'],
    comments: [
      { author: 'admin', hours_after: 4,
        body: 'Prefix any typed value with `${ENV_NAME}` at record time and the recorder stores the placeholder rather than the value. The env block at the workflow level fills it at run time. For Okta, set `followCrossOriginNav: true` on the login step — the SSO domain hop is handled, only the final landing URL is asserted.' },
      { author: 'tkonig', days_after: 1,
        body: 'Adding to this — we keep the env block out of git entirely and inject from our secrets manager at deploy. The placeholder pattern survives a re-record which is the part I cared about.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'evgenia', pinned: false, days_ago: 18, views: 71, reactions: 4,
    title: 'Multi-tenant HubSpot — switching between two accounts in one flow',
    body:
`Our ops team manages HubSpot for two sister companies. We have one Flyto2 workflow that needs to pull contact counts from both. Right now we kick off two separate workflow runs and stitch the outputs downstream, which feels silly.

Is there a clean way to switch tenant mid-flow without logging out / back in?`,
    tags: ['hubspot', 'multi-account'],
    comments: [
      { author: 'admin', hours_after: 7,
        body: 'Two patterns work today: (1) browser profiles — assign each tenant a profile id, switch profiles between steps; (2) cookie swap step with a saved cookie jar per tenant. Profiles are cleaner if the runtime supports them; our docs cover both at `/docs/cloud/profiles`.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'sgupta', pinned: false, days_ago: 23, views: 64, reactions: 3,
    title: 'Reusing a selector when the target site changes its CSS',
    body:
`We've recorded a workflow against our internal admin tool. Frontend team shipped a refactor last week, half the selectors broke. We re-recorded but it feels wrong to have to do that on every release.

Anyone built a selector layer that survives small CSS rewrites? Stable test-ids would be the obvious answer if I had control over the frontend, but I don't.`,
    tags: ['selectors', 'maintenance'],
    comments: [
      { author: 'mvelasco', hours_after: 9,
        body: 'We added a thin "anchor" pattern — find a stable text label first (like a column header) then navigate by relative position. Survives most CSS-only rewrites. Slower but worth it.' },
      { author: 'admin', days_after: 1,
        body: 'The recorder picks visible-text > aria-label > data-* > CSS in that order — so if the visible text is stable you should already be getting that. If you DM me a screenshot of a broken selector I can tell you which fallback fired.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'kdiallo', pinned: false, days_ago: 32, views: 88, reactions: 5,
    title: 'Running a recorded workflow from CI as a deploy gate',
    body:
`We want to use a Flyto2 workflow as a post-deploy smoke test against our staging environment — log in, click through the three critical paths, assert the page didn't blow up.

Is there a CLI mode I can invoke from GitHub Actions? I see the desktop runner but I need something headless that returns non-zero on failure.`,
    tags: ['ci', 'github-actions', 'headless', 'smoke-test'],
    comments: [
      { author: 'admin', hours_after: 5,
        body: '`flyto run <workflow.json> --headless` exits non-zero on any step failure. We ship a GH Action that wraps it at `flytohub/run-workflow@v1`. Logs upload as an artifact on failure.' },
      { author: 'kdiallo', hours_after: 6, parent_idx: 0,
        body: 'Perfect, exactly what I needed. Anything for screenshot-on-failure?' },
      { author: 'admin', hours_after: 7,
        body: '`--screenshot-on-error` writes a PNG next to the log. The Action picks it up automatically.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'png', pinned: false, days_ago: 41, views: 53, reactions: 2,
    title: 'Best practice on step labels for team handoff',
    body:
`I built a 40-step workflow on my own. Now I'm handing it to a teammate who's never seen it. Half my step labels are stuff like "click that thing" which made sense at 2am.

For folks who run shared workflows — what's your labeling discipline? Per-step? Group steps into named sections?`,
    tags: ['best-practice', 'teams'],
    comments: [
      { author: 'jhammond', hours_after: 12,
        body: 'We group every 5-10 steps into a named "stage" (Login / Navigate to report / Extract / Export) and only label individual steps when they\'re non-obvious. Reads like a runbook, which is what you actually want when on-call.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'vchen', pinned: false, days_ago: 56, views: 47, reactions: 2,
    title: 'Recording captures two clicks where I clicked once on a React button',
    body:
`Specifically a Material-UI button. I click once, the recorder shows a "click" step and then a second phantom "click" step right after at the same coordinates.

Is the recorder seeing the synthetic onMouseDown event MUI fires? Trying to figure out if I should manually delete the duplicate or if there's a setting.`,
    tags: ['recorder', 'react', 'material-ui', 'duplicate'],
    comments: [
      { author: 'admin', hours_after: 3,
        body: 'You\'re seeing the synthetic event coalescing miss — MUI dispatches a mousedown that bubbles separately on some component variants. Toggle "Coalesce synthetic events" in recorder settings; that\'s on by default for new projects but older ones missed it. Safe to delete the duplicate by hand in the meantime.' },
    ],
  },

  // ---------- Cloud — bugs ----------
  {
    product: 'cloud', lang: 'en', category: 'bug',
    author: 'tkonig', pinned: false, days_ago: 8, views: 124, reactions: 9,
    title: 'Typed-text steps stop firing after a window.location nav',
    body:
`Workflow: log into our internal dashboard, click a link that does window.location = '/reports', land on /reports, type into the search box. The search-box typed-text step silently no-ops — no error, no partial input, just nothing.

If I add a manual "wait 2000ms" before the typed step it works. Feels like the recorder thinks the input is focused while the page is mid-navigation.

Reproduced on macOS desktop runner 2.4.1 and headless 2.4.1.`,
    tags: ['bug', 'typing', 'navigation'],
    comments: [
      { author: 'admin', hours_after: 6,
        body: 'Confirmed repro on our side — the focus event from the previous page leaks past the navigation if the typed step is the next instruction. Fix is in 2.4.2 (cutting later this week). Workaround until then is exactly your fixed wait or a no-op waitForSelector against the new input.' },
      { author: 'tkonig', days_after: 2,
        body: 'Thanks. Will keep the workaround in until 2.4.2.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'bug',
    author: 'shimizu', pinned: false, days_ago: 14, views: 78, reactions: 5,
    title: 'Status indicator stuck on "running" after a step times out',
    body:
`If a step hits its timeout, the workflow correctly errors out — but the in-UI status pill stays as "running" until I refresh. Just visual but a co-worker reported it as a hung workflow today and tried to "kill" something that had already finished.`,
    tags: ['bug', 'ui'],
    comments: [
      { author: 'admin', hours_after: 4,
        body: 'Reproduced — the status subscription drops the terminal event when the timeout fires server-side. Patched in main, ships in 2.4.2. Thanks for the report.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'bug',
    author: 'mvelasco', pinned: false, days_ago: 27, views: 62, reactions: 3,
    title: 'Recording captures Cmd-Tab as a step on macOS',
    body:
`On a 16-inch M2, switching back to my IDE during a recording session captures the Cmd-Tab as a sequence of key events that the replay then tries to send to the page. Doesn't cause a hard failure but pollutes the workflow.

Is there a way to tell the recorder to ignore system keychord modifiers, or should I just be more disciplined?`,
    tags: ['bug', 'macos', 'recorder'],
    comments: [
      { author: 'admin', days_after: 1,
        body: 'There\'s a "filter system shortcuts" toggle in recorder preferences. Off by default for compatibility but I\'d argue it should be on. Considering flipping the default in 2.5.' },
    ],
  },

  // ---------- Cloud — features ----------
  {
    product: 'cloud', lang: 'en', category: 'feature',
    author: 'jhammond', pinned: false, days_ago: 6, views: 168, reactions: 22,
    title: '"Wait until selector resolves" step instead of fixed sleeps',
    body:
`Most of my flakiness boils down to me guessing how long a page takes to load. I'd love a first-class wait step that polls for a selector / network idle / a custom JS condition and times out cleanly.

Yes I know waitForSelector exists in the API — what I want is a recorder UI affordance so the people on my team who don't write code can pick "wait for THIS thing to show up" by clicking it.`,
    tags: ['feature', 'wait', 'ux'],
    comments: [
      { author: 'admin', hours_after: 8,
        body: 'On the roadmap for 2.5 — recorder UI gets a "wait for what?" mode where you click the element and it inserts the right waitForSelector. Demo coming in next month\'s changelog.' },
      { author: 'kdiallo', days_after: 1,
        body: 'Big +1. Half the workflows my non-engineering teammates build have a "sleep 5000" they tuned by trial and error.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'feature',
    author: 'rwhite', pinned: false, days_ago: 19, views: 91, reactions: 14,
    title: 'Step-level retry budgets',
    body:
`Right now if a step fails I can retry the whole workflow. What I'd like is per-step retry with backoff — "this one step is flaky, retry up to 3 times with 2s/4s/8s, then fail the whole flow." Saves having to wrap every fragile step in custom logic.`,
    tags: ['feature', 'retry', 'reliability'],
    comments: [
      { author: 'admin', hours_after: 12,
        body: 'We\'ve been debating exactly this. Question for you: do you want the retry budget configured per step (UI knob) or as a default-then-override workflow-level setting? Asking because the second is cheaper to ship.' },
      { author: 'rwhite', days_after: 1,
        body: 'Default + per-step override would cover us. Workflow-level "3 retries, 2s base" gets us 80%; the per-step is for the one or two pathological steps.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'feature',
    author: 'sgupta', pinned: false, days_ago: 36, views: 73, reactions: 9,
    title: 'Import an old Selenium .side file as a starting point',
    body:
`We have ~30 Selenium IDE recordings from 2021 that mostly still work. Migrating them by hand to Flyto2 would take a week. Would be amazing to import the .side and use it as a skeleton — the structure carries over even if half the selectors need refresh.`,
    tags: ['feature', 'migration', 'selenium'],
    comments: [
      { author: 'admin', days_after: 2,
        body: 'No promise on timeline but this comes up enough that we built a converter internally. Cleaning it up for public release. If you\'d be willing to test against your 30 files DM me, it\'s the most useful corpus we could ask for.' },
      { author: 'sgupta', days_after: 3,
        body: 'Happy to. DM\'d.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'feature',
    author: 'png', pinned: false, days_ago: 44, views: 58, reactions: 6,
    title: 'Pause-resume mid-workflow when the page hits a CAPTCHA',
    body:
`I run a few low-volume workflows against sites that throw a captcha maybe one time in twenty. Right now hitting one fails the whole run.

It would be amazing if the workflow could pause, surface a "human input needed" notification, wait for me to solve it manually in the live browser, then continue from the next step. I do not want a captcha-solving service — I want a human-in-the-loop checkpoint.`,
    tags: ['feature', 'captcha', 'human-in-the-loop'],
    comments: [
      { author: 'admin', hours_after: 18,
        body: 'This is the right model and we agree. "Pause + notify" steps are in design — should hit beta within a couple of releases. Will ping this thread when it lands.' },
      { author: 'evgenia', days_after: 4,
        body: 'Curious whether the pause persists across runner restarts or if the runner has to stay live. We run on a CI box that recycles.' },
    ],
  },

  // ---------- Cloud — discussion ----------
  {
    product: 'cloud', lang: 'en', category: 'discussion',
    author: 'mvelasco', pinned: true, days_ago: 51, views: 412, reactions: 38,
    title: 'Migrated 40 RPA flows from UiPath to Flyto2 — six-week postmortem',
    body:
`Wrapping up a six-week migration project so figured I'd dump what we learned.

Context: mid-size ops team, 40 UiPath flows running against Salesforce + a couple of in-house tools. License renewal coming up so we evaluated alternatives.

What went well:
- Recording-first workflow matched how our non-engineers actually think about automation. UiPath's visual canvas requires them to model the flow before they capture it; Flyto2 lets them just do the thing.
- Selectors mostly transferred. We re-recorded ~10% of steps but the structural skeleton came across cleanly.
- CLI mode + headless plug into our existing scheduler without needing the UiPath Orchestrator equivalent.

What hurt:
- Two flows depended on UiPath's Excel automation. Had to bridge through a small Python shim to read/write XLSX. Worth it but unbudgeted.
- Multi-monitor handling on the recorder is rough. We retrained the team to record in a single monitor.

Total time: 240 hours of eng time over 6 weeks, two people part-time. License savings pay for that within a year.

Happy to answer questions.`,
    tags: ['discussion', 'uipath', 'migration', 'case-study'],
    comments: [
      { author: 'admin', hours_after: 6,
        body: 'Thanks for writing this up — pinned. Multi-monitor recorder is being reworked; alpha within the next month. If you can DM me your specific failure mode it would help us not miss it.' },
      { author: 'jhammond', hours_after: 14,
        body: 'How did your team handle the recorder mental shift? Our blocker is a couple of senior ops folks who learned UiPath\'s flowchart paradigm cold and don\'t want to start over.' },
      { author: 'mvelasco', days_after: 1, parent_idx: 1,
        body: 'Honest answer: time + one specific success story. We let them shadow a junior teammate building a flow recording-first, watched them get the same result in 1/3 the time, that was the unlock. The folks who got it from a slide deck were zero.' },
      { author: 'rwhite', days_after: 3,
        body: 'Excel bridge — did you do it as a Flyto2 step calling a Python script, or did you keep the XLSX work entirely outside? Trying to decide if I should treat it like a workflow boundary.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'discussion',
    author: 'tkonig', pinned: false, days_ago: 63, views: 187, reactions: 19,
    title: 'When is Flyto2 the wrong tool? Honest discussion',
    body:
`Asking sincerely. My team is evaluating Flyto2 for everything from "run this report weekly" to "be our customer-support frontend." I have a hunch some of these are bad fits but I want to hear from people who've tried and regretted.

What did Flyto2 turn out to be a bad fit for, in your hands?`,
    tags: ['discussion', 'limits'],
    comments: [
      { author: 'jhammond', hours_after: 4,
        body: 'Anything with a real API. We tried using Flyto2 to push data into Stripe; works, but the API would have been four lines of Python. The win is when there\'s no API or the API is gated behind a hostile rate limit.' },
      { author: 'evgenia', hours_after: 11,
        body: 'Anything with hard-real-time constraints. Browser is slow. If you need sub-100ms reaction to an event, this is not the tool.' },
      { author: 'admin', days_after: 1,
        body: 'Worth seeing the team itself say this — agreed on both. We frame Flyto2 as "the right tool when an API doesn\'t exist or isn\'t worth the integration cost." Not "the right tool for everything browser-shaped."' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'discussion',
    author: 'jhammond', pinned: false, days_ago: 78, views: 234, reactions: 24,
    title: 'Our weekly Stripe → Notion report — sharing the workflow',
    body:
`Wrote a Flyto2 workflow that runs every Monday 9am, pulls the previous week's Stripe MRR/churn dashboard, screenshots the four key charts, and posts them into a Notion page with a stable URL the leadership team bookmarks.

Why not the Stripe API directly? Because the chart formatting in Stripe's dashboard is the part the team actually wants — the bare numbers via API would require us to recreate Stripe's visual breakdown ourselves, which is more work than the screenshot pipeline.

Workflow: ~12 steps, 6-second average run. Happy to share the file if there's interest.`,
    tags: ['discussion', 'stripe', 'notion', 'reporting'],
    comments: [
      { author: 'sgupta', hours_after: 8,
        body: 'Would love the workflow. We do exactly this but worse.' },
      { author: 'kdiallo', days_after: 1,
        body: 'Same. Also curious how you handle the Stripe login — we cycle our credentials weekly so the recording rots fast.' },
      { author: 'jhammond', days_after: 1, parent_idx: 1,
        body: 'Env-var placeholders for the typed-text steps, secret rotates without touching the workflow. The 2FA step is the part that bites — we run on a long-lived "automation" Stripe user that only has read access, opted out of 2FA via Stripe support. Limited blast radius if leaked, since it can only see, not move money.' },
    ],
  },

  // ---------- Code — questions / features / discussions ----------
  {
    product: 'code', lang: 'en', category: 'question',
    author: 'evgenia', pinned: false, days_ago: 9, views: 117, reactions: 13,
    title: 'Does flyto-indexer taint analysis follow a JSON round-trip?',
    body:
`We have a pattern where user input gets JSON.stringify\'d, sent to a worker, then JSON.parse\'d back into a record. Does the taint analysis follow the value across that round-trip, or does it lose the tag at the serialize boundary?

Asking because we're seeing zero findings on a code path I'd expect to flag.`,
    tags: ['indexer', 'taint-analysis', 'security'],
    comments: [
      { author: 'admin', hours_after: 5,
        body: 'JSON.stringify/parse round-trip preserves taint as of v2.7 — the analyzer models the structural identity. If you\'re seeing nothing, the more likely culprit is that we don\'t recognize your source as a taint source (e.g. a custom request wrapper). Run `flyto-index taint --debug <symbol>` and it\'ll print the source resolution. If your source isn\'t in the trace, send us the wrapper signature and we\'ll add it.' },
      { author: 'evgenia', hours_after: 7,
        body: 'Custom request wrapper — confirmed. Will send the signature. Thanks.' },
    ],
  },
  {
    product: 'code', lang: 'en', category: 'bug',
    author: 'kdiallo', pinned: false, days_ago: 17, views: 84, reactions: 6,
    title: '`flyto-index scan` OOMs on a 600k-line Go monorepo',
    body:
`Repo: ~600k lines, ~4000 Go files. \`flyto-index scan .\` runs for about 8 minutes then dies with OOM. Machine has 16GB available; resident set climbs steadily through the run.

Anything I can pass to make it spill to disk or chunk by package?`,
    tags: ['indexer', 'bug', 'memory', 'go'],
    comments: [
      { author: 'admin', hours_after: 4,
        body: 'Known — the Go parser keeps full ASTs in memory for cross-file resolution. Workaround for now: `--scope-by-package` indexes one package at a time and merges, peaks at ~3GB on repos that size. Proper fix is incremental AST eviction, on the roadmap for v2.8.' },
      { author: 'kdiallo', hours_after: 6,
        body: '`--scope-by-package` got it through in 14 minutes, peak 2.8GB. Tradeoff acceptable, thank you.' },
    ],
  },
  {
    product: 'code', lang: 'en', category: 'feature',
    author: 'vchen', pinned: false, days_ago: 29, views: 76, reactions: 8,
    title: 'Slack integration for new high-severity findings',
    body:
`Right now I poll the CLI from a cron and grep for "HIGH". Would love a first-class Slack webhook integration — fire a message into #security-alerts when a scan produces a new HIGH or CRITICAL.

Bonus: dedupe within a window so a single CI run doesn't pin the channel.`,
    tags: ['feature', 'slack', 'alerts'],
    comments: [
      { author: 'admin', days_after: 2,
        body: 'On the v2.8 list. Plan is a generic webhook out (Slack-compatible payload) so you can also point it at Teams, Discord, or a custom receiver.' },
    ],
  },
  {
    product: 'code', lang: 'en', category: 'discussion',
    author: 'rwhite', pinned: false, days_ago: 39, views: 198, reactions: 21,
    title: 'Wired flyto-code into our PR check — three weeks of false-positive data',
    body:
`We turned on flyto-code as a required check on PRs three weeks ago. Numbers:
- 142 PRs checked
- 89 with at least one finding
- 11 findings escalated to "developer responded"
- 4 findings turned out to be true positives that shipped a fix
- 7 false positives, dismissed with reason

Roughly an 8% false-positive rate on the noisy findings, which is in line with what the team claimed in their docs. The four true positives were:
- One SSRF in our internal dashboard's URL fetcher
- One reflected XSS in a 2018-era admin tool we'd forgotten about
- Two cases of secrets in test fixtures that had drifted out of \`.gitignore\`

Worth the friction for us. Curious what others are seeing.`,
    tags: ['discussion', 'flyto-code', 'false-positives'],
    comments: [
      { author: 'admin', hours_after: 9,
        body: 'Posting your numbers means a lot — it\'s the kind of data we don\'t have at scale yet. The "developer responded" ratio is a much better signal of usefulness than absolute finding count. Would you be open to a longer write-up we could link from the docs (anonymized as much as you want)?' },
      { author: 'rwhite', days_after: 1,
        body: 'Yes, let me run the numbers past my team first. DM\'d.' },
    ],
  },

  // ---------- ZH ----------
  {
    product: 'cloud', lang: 'zh', category: 'question',
    author: 'shulin', pinned: false, days_ago: 7, views: 58, reactions: 4,
    title: '想把每日 Notion 待辦自動貼到 Slack — screenshot 還是純文字比較好維護？',
    body:
`團隊每天早上要把當天的待辦同步到 Slack 頻道。目前在猶豫兩個做法：

1. 截圖 Notion 整個面板貼上去 — 視覺最完整，但 Slack 預覽不支援搜尋
2. 把每一條待辦純文字 extract 出來再格式化貼上 — 可搜尋，但需要應付 Notion 那邊的卡片排版變動

各位是怎麼選的？長期來看哪一種比較好維護？`,
    tags: ['notion', 'slack', 'workflow-design'],
    comments: [
      { author: 'admin', hours_after: 6,
        body: '純文字 + 結尾加一張截圖當補充，是我們內部團隊跑了半年的方法。文字部分用 markdown 格式輸出（Slack 認得），維護成本主要在 Notion 結構變動時要重抓 selector — 但搜尋價值遠超過。screenshot 只擺最後做視覺確認用。' },
      { author: 'ywang', days_after: 1,
        body: '+1 純文字。我們也是這樣，已經用了快一年。' },
    ],
  },
  {
    product: 'cloud', lang: 'zh', category: 'feature',
    author: 'ywang', pinned: false, days_ago: 22, views: 67, reactions: 7,
    title: '希望把錄製檔輸出成 markdown — 讓 PM 也看得懂流程',
    body:
`目前錄製檔是 JSON，工程師讀沒問題，但 PM 同事每次要 review 流程都要請我口頭講一遍。

想要的功能是「把這份錄製檔產生一份 markdown 文件」— 每一步寫成「點擊 [搜尋按鈕]、輸入 "report"、等待 [報表載入]」這種人話描述，PM 自己就能讀。`,
    tags: ['export', 'documentation', 'markdown'],
    comments: [
      { author: 'admin', days_after: 1,
        body: '已在規劃中 — 內部代號 "workflow narrative"。目標是輸出 markdown 跟 PDF 兩種格式，markdown 還能直接 paste 進 Notion 頁面。預計 2.5 進 beta，會在 changelog 公告。' },
      { author: 'shulin', days_after: 2,
        body: '這個我們等很久了，PM 反覆要我寫 SOP 寫到崩潰。期待！' },
    ],
  },

  // ---------- JA ----------
  {
    product: 'cloud', lang: 'ja', category: 'question',
    author: 'yuki', pinned: false, days_ago: 13, views: 41, reactions: 3,
    title: 'Notion APIを直接叩くか、Flyto2でブラウザ経由か、メンテのしやすさは？',
    body:
`チームでNotionにデータを書き込むワークフローを設計中です。

APIを直接叩く方が高速で安定しているのは理解していますが、Notionのページ構造が頻繁に変わる前提で考えると、API側でブロックタイプの仕様変更に追従するコストが地味に重い気がしています。

ブラウザ経由のFlyto2なら「目に見えるUI」が変わらない限り壊れにくい、という認識は合っていますか？それともAPIのほうが結局は楽でしょうか。`,
    tags: ['notion', 'api', 'design'],
    comments: [
      { author: 'admin', hours_after: 8,
        body: 'チームで分けて運用するのが現実的だと思います。書き込み量が多く構造がシンプルならAPI、Notionの可視UIの「見え方」も保ちたい・少量で構造が複雑ならFlyto2。両方使う事例も多いです。APIで本体データを書き、Flyto2で見た目の最終調整（ブロック並び替え等）を加える、という分業がよく聞く構成です。' },
      { author: 'shimizu', days_after: 2,
        body: '私たちは混在運用です。APIで7割、UI周りでFlyto2で3割、という感覚。' },
    ],
  },
];

// ----------------------------------------------------------------
// Apply
// ----------------------------------------------------------------

function tsFromDaysAgo(daysAgo, hoursOffset = 0, minutesOffset = 0) {
  const ms =
    Date.now() -
    daysAgo * 24 * 3600 * 1000 +
    hoursOffset * 3600 * 1000 +
    minutesOffset * 60 * 1000;
  return Timestamp.fromMillis(ms);
}

async function main() {
  console.log(`Mode: ${APPLY ? 'APPLY (wipes + reseeds forum_posts)' : 'DRY-RUN (no writes)'}`);
  console.log(`Corpus: ${POSTS.length} posts across en/zh/ja, ${Object.keys(PERSONAS).length} personas.\n`);

  const summary = { en: 0, zh: 0, ja: 0 };
  const byCat = {};
  let totalComments = 0;
  for (const p of POSTS) {
    summary[p.lang]++;
    byCat[p.category] = (byCat[p.category] ?? 0) + 1;
    totalComments += (p.comments || []).length;
  }
  console.log('By language:', summary);
  console.log('By category:', byCat);
  console.log(`Total comments to seed: ${totalComments}\n`);

  if (!APPLY) {
    console.log('Dry-run complete. Re-run with --apply to wipe + reseed.');
    return;
  }

  const db = ensureFirebase();
  console.log('Wiping existing forum_posts…');
  await db.recursiveDelete(db.collection('forum_posts'));
  console.log('Wiped.\n');

  console.log('Seeding curated corpus…');
  let i = 0;
  for (const p of POSTS) {
    const postCreated = tsFromDaysAgo(p.days_ago);
    const a = author(p.author);

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

    // Comments
    let commentRefs = [];
    for (const c of p.comments || []) {
      const ca = author(c.author);
      const offsetMs =
        ((c.minutes_after ?? 0) * 60 +
          (c.hours_after ?? 0) * 3600 +
          (c.days_after ?? 0) * 24 * 3600) *
        1000;
      const createdAt = Timestamp.fromMillis(postCreated.toMillis() + offsetMs);
      const parentId =
        c.parent_idx !== undefined && commentRefs[c.parent_idx]
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
    process.stdout.write(`\r  ${i}/${POSTS.length} seeded   `);
  }
  console.log('\n\nDone.');
}

// Only run main() when invoked directly, not on import.
const invokedDirectly = import.meta.url === `file://${process.argv[1]}`;
if (invokedDirectly) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
