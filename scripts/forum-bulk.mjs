/**
 * Bulk-authored forum corpus. Hand-written by Claude in conversation with
 * Chester so the forum has 500+ posts of consistent voice without burning
 * an external API key. seed-bulk.mjs imports BULK_POSTS and BULK_PERSONAS
 * and writes them alongside the 24 curated exemplars in seed-curated.mjs.
 *
 * Post schema:
 *   { product, lang, category, author, days_ago, views, reactions,
 *     pinned, title, body, tags, comments: [{author, body, hours_after}] }
 *
 * Persona schema:
 *   { uid, name, email, official? }
 *
 * Sections are split by (lang × product) bucket for readability.
 */

// ----------------------------------------------------------------
// Additional personas — beyond the 14 already in seed-curated.mjs.
// ----------------------------------------------------------------

export const BULK_PERSONAS = {
  bjacobs:   { uid: 'seed_bjacobs',   name: 'Ben Jacobs',       email: 'ben.j@floweave.io' },
  cmoreno:   { uid: 'seed_cmoreno',   name: 'Carla Moreno',     email: 'cmoreno@axis-and.com' },
  dkato:     { uid: 'seed_dkato',     name: 'Daniel Kato',      email: 'dkato@triadworks.co' },
  efranco:   { uid: 'seed_efranco',   name: 'Elena Franco',     email: 'elena@brassbridge.dev' },
  gnaidu:    { uid: 'seed_gnaidu',    name: 'Gauri Naidu',      email: 'gnaidu@marblegrid.io' },
  hlund:     { uid: 'seed_hlund',     name: 'Hanna Lund',       email: 'hanna@stevedore.se' },
  iperez:    { uid: 'seed_iperez',    name: 'Iván Pérez',       email: 'ivanp@cobaltlabs.mx' },
  jokafor:   { uid: 'seed_jokafor',   name: 'Jane Okafor',      email: 'jane@northgrove.ng' },
  klovric:   { uid: 'seed_klovric',   name: 'Krešo Lovrić',     email: 'kreso@silverquay.hr' },
  lnaka:     { uid: 'seed_lnaka',     name: 'Lina Nakamura',    email: 'lina.n@boxmachine.io' },
  mhalvor:   { uid: 'seed_mhalvor',   name: 'Magnus Halvorsen', email: 'magnus@fjordcraft.no' },
  nbrumm:    { uid: 'seed_nbrumm',    name: 'Nora Brummel',     email: 'nora@steepledge.io' },
  ofarah:    { uid: 'seed_ofarah',    name: 'Omar Farah',       email: 'omar@millrace.dev' },
  prustad:   { uid: 'seed_prustad',   name: 'Petter Rustad',    email: 'petter@hammerhead.se' },
  qhuang:    { uid: 'seed_qhuang',    name: '黃詠琪',             email: 'qhuang@kite-ops.com' },
  rivanov:   { uid: 'seed_rivanov',   name: 'Roman Ivanov',     email: 'roman@gridwide.io' },
  shaque:    { uid: 'seed_shaque',    name: 'Saira Haque',      email: 'saira@northlight.io' },
  tboone:    { uid: 'seed_tboone',    name: 'Theo Boone',       email: 'theo@lichenstack.dev' },
  uakin:     { uid: 'seed_uakin',     name: 'Umut Akın',        email: 'umut@spireline.com.tr' },
  vmadsen:   { uid: 'seed_vmadsen',   name: 'Vibeke Madsen',    email: 'vibeke@bjarkilabs.dk' },
  wkurosaki: { uid: 'seed_wkurosaki', name: '黒崎 渉',            email: 'wkuro@flatpine.jp' },
  xcheng:    { uid: 'seed_xcheng',    name: '鄭曉雯',             email: 'xcheng@nori-house.tw' },
  yokonkwo:  { uid: 'seed_yokonkwo',  name: 'Yusuf Okonkwo',    email: 'yusuf@bedrockfern.io' },
  zfedorov:  { uid: 'seed_zfedorov',  name: 'Zlata Fedorov',    email: 'zlata@stillwell.io' },
  aweiss:    { uid: 'seed_aweiss',    name: 'Anya Weiss',       email: 'anya@silverbarn.de' },
  brye:      { uid: 'seed_brye',      name: 'Benji Rye',        email: 'benji@flat-and-thin.io' },
  cdvorak:   { uid: 'seed_cdvorak',   name: 'Clara Dvořák',     email: 'clara@hornkraft.cz' },
  dmello:    { uid: 'seed_dmello',    name: 'Daniela Mello',    email: 'dmello@oakgrove.br' },
  esakai:    { uid: 'seed_esakai',    name: '坂井 恵',            email: 'esakai@hashmark.jp' },
  fnguyen:   { uid: 'seed_fnguyen',   name: 'Felix Nguyễn',     email: 'felix@plumcrest.vn' },
  ghoffer:   { uid: 'seed_ghoffer',   name: 'Greta Hoffer',     email: 'greta@northgate.de' },
  hlaurent:  { uid: 'seed_hlaurent',  name: 'Hugo Laurent',     email: 'hugo@bramble.fr' },
  ipatel:    { uid: 'seed_ipatel',    name: 'Ishaan Patel',     email: 'ishaan@quartersun.dev' },
  jthorpe:   { uid: 'seed_jthorpe',   name: 'Jamie Thorpe',     email: 'jamie@quaintly.io' },
  kbergen:   { uid: 'seed_kbergen',   name: 'Karl Bergen',      email: 'karl@hueblock.no' },
  lschmidt:  { uid: 'seed_lschmidt',  name: 'Lara Schmidt',     email: 'lara@hivewall.de' },
  mtanaka:   { uid: 'seed_mtanaka',   name: '田中 真央',           email: 'mtanaka@kakuyo.jp' },
  noh:       { uid: 'seed_noh',       name: 'Naomi Oh',         email: 'naomi@beadwise.co' },
  oblake:    { uid: 'seed_oblake',    name: 'Oliver Blake',     email: 'oliver@steelhouse.dev' },
};

// ----------------------------------------------------------------
// EN × cloud
// ----------------------------------------------------------------

const EN_CLOUD = [
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'bjacobs', days_ago: 2, views: 78, reactions: 4,
    title: 'Salesforce Lightning report export — page seems to load before the data arrives',
    body:
`I'm scraping the "Pipeline Trend" report from Salesforce Lightning. The recorder captures everything fine in interactive mode, but when I run it headless the export button click fires before the chart finishes rendering, and the CSV that comes back is the previous filter's data.

Tried waitForSelector on the chart's svg root — fires too early because the SVG is mounted empty. Anything more reliable than a fixed 3s sleep?`,
    tags: ['salesforce', 'wait', 'headless'],
    comments: [
      { author: 'admin', hours_after: 4,
        body: `Lightning uses a "stale data" attribute on its viz components — \`[data-stale="false"]\` is what you want to wait for. Lightning sets it true while a query is in-flight and back to false when the dataset matches the filter. Cleaner than counting paths or chart elements.` },
      { author: 'rwhite', hours_after: 11,
        body: 'We hit this almost weekly. Started using waitForNetworkIdle as the cheap fallback — heavier but it survives Salesforce internal rewrites.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'bug',
    author: 'cmoreno', days_ago: 5, views: 134, reactions: 12,
    title: 'Recorder eats input on macOS when IME (Korean / Japanese / Chinese) is active',
    body:
`Hit this trying to record a workflow that types into a Notion page in Japanese. The Hangul/Romaji conversion stage gets captured as a series of individual ASCII keystrokes rather than the composed character. Replay then types gibberish.

Repro: macOS 14.4, recorder 2.4.1, Pinyin and Romaji IMEs both affected. Switching to direct keystroke (English) works fine.`,
    tags: ['bug', 'macos', 'ime', 'i18n'],
    comments: [
      { author: 'admin', hours_after: 3,
        body: `Confirmed — we listen on keydown before the IME composition resolves. Fix in 2.4.2 listens on the \`compositionend\` event and captures the final composed string. Workaround until then: pre-compose the text in a scratch app and paste it in.` },
      { author: 'cmoreno', hours_after: 5,
        body: 'Paste workaround works fine for me. Thanks for the fast turnaround.' },
      { author: 'shimizu', days_after: 1,
        body: 'Also affects Japanese kana → kanji conversion. Adding myself to the affected list.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'feature',
    author: 'efranco', days_ago: 7, views: 102, reactions: 18,
    title: 'Inline preview of what the next step will click before it runs',
    body:
`When I step-debug a recording, I'd love a "highlight what step N+1 will target" overlay on the live page — like Chrome devtools' inspect-element box around the selector that's about to fire. Right now I run the step and find out it pointed at the wrong button after the fact.

Especially useful when a workflow has 30+ steps and I'm tracing why step 18 broke.`,
    tags: ['feature', 'debug', 'devx'],
    comments: [
      { author: 'admin', hours_after: 9,
        body: `On the 2.5 list. Internal preview: a yellow outline appears around the resolved element when you hover the step in the timeline; click "advance" and it lights green as the click fires. Good signal that we should bump priority.` },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'gnaidu', days_ago: 9, views: 51, reactions: 2,
    title: 'Dynamic dropdowns where options load after the open click',
    body:
`Workflow: open a custom Vue-based dropdown, pick "Finance" from the options. The "open" click works, but the option-click step fires while the list is still empty and the recording errors out.

Currently doing open → waitForSelector on a specific option text → click. Wondering if there's a shorter idiom or if everyone does the explicit wait.`,
    tags: ['vue', 'dropdown', 'wait'],
    comments: [
      { author: 'kdiallo', hours_after: 14,
        body: 'Explicit wait is what we do. Pro: survives the dropdown being lazy-loaded asynchronously. Con: have to remember to do it. Hasn\'t become a real pain in our workflow yet.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'jhammond', days_ago: 12, views: 88, reactions: 6,
    title: 'Best pattern for "screenshot the dashboard and email it"',
    body:
`Trying to build a weekly Monday-morning report: log into our internal dashboard, screenshot the homepage, attach to an email and send to the leadership Slack.

Two questions:
1. Is the recommended export to send the screenshot through a Gmail web recording (recorder all the way), or call out to a Python step that uses SMTP?
2. Storage — does Flyto2 keep the screenshot anywhere persistent or do I need to handle that?`,
    tags: ['screenshot', 'email', 'reporting'],
    comments: [
      { author: 'admin', hours_after: 7,
        body: `For "weekly to leadership" we'd recommend the Python step calling SMTP — Gmail web recording works but rots whenever Google ships a UI change. Screenshots are kept in the workflow's run-artifact directory for 30 days by default; tune via \`--artifact-retention\`. If you need longer-term, copy to your own S3 / GCS bucket as the last step.` },
      { author: 'jhammond', hours_after: 10,
        body: 'Makes sense, will go SMTP. Thanks.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'bug',
    author: 'hlund', days_ago: 15, views: 67, reactions: 5,
    title: 'Workflow crashes silently when target site triggers a download',
    body:
`Specifically a "click to download CSV" button on a finance tool. The browser starts the download, the workflow's status indicator goes to "running" forever, and the run never terminates. No error, no log entry.

Manually killing the runner is the only way out. Reproducible on Linux desktop runner 2.4.0.`,
    tags: ['bug', 'download', 'runner'],
    comments: [
      { author: 'admin', hours_after: 5,
        body: `The runner is waiting on a navigation event that never comes — downloads on Linux Chromium don't fire it. Workaround: set \`treatDownloadAsNavigation: false\` on the click step, the runner will continue past it. Proper fix is wiring the download-completion signal directly; targeting 2.5.` },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'discussion',
    author: 'rwhite', days_ago: 18, views: 245, reactions: 31,
    title: 'Our team\'s rule: no recording longer than 25 steps',
    body:
`Adopted a soft rule a few months back and it's worked out well — no single recorded workflow over 25 steps. Anything longer gets factored into 2-3 sub-workflows that call each other.

Why: 25 steps is the upper bound of what one of our ops folks can mentally hold while triaging a flake. Past that we found ourselves re-recording from scratch instead of fixing.

Curious how others are partitioning their workflows. Step count? Logical "transaction" boundaries? Some other heuristic?`,
    tags: ['discussion', 'best-practice', 'architecture'],
    comments: [
      { author: 'mvelasco', hours_after: 4,
        body: 'We use logical transactions — "log in", "find target", "extract", "export". A single workflow stops being readable once it crosses two transactions. Roughly maps to your 25 but the boundary matters more than the count.' },
      { author: 'kdiallo', hours_after: 12,
        body: '+1 to the transaction approach. We tag each sub-workflow with the transaction name and our handoff docs basically write themselves.' },
      { author: 'admin', days_after: 1,
        body: 'Worth knowing the recorder itself starts hinting at "consider splitting" past 30 steps — soft signal, not a hard cap. Glad the heuristic is converging in your team practice; we\'ll surface it in the upcoming workflow-architecture doc.' },
      { author: 'evgenia', days_after: 2,
        body: 'We hit a different wall — recordings that touch more than three browser tabs. The tab-switching steps are the most flake-prone for us regardless of total length.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'iperez', days_ago: 21, views: 44, reactions: 2,
    title: 'Detecting whether the page is fully loaded — what counts as "ready"?',
    body:
`Tried networkidle0, networkidle2, domcontentloaded, load. Each one bites me on a different site. Single-page apps don't fire load; sites with constant background polling never reach networkidle.

Has anyone landed on a heuristic that works across React / Vue / Angular / vanilla sites without per-site tuning?`,
    tags: ['wait', 'page-load'],
    comments: [
      { author: 'admin', hours_after: 6,
        body: `Short answer: no one-size-fits-all. Slightly longer: we recommend waitForSelector against a "this UI is interactive" element that you, as the workflow author, know exists when the page is usable. Background polling never lets you trust networkidle; load fires too early on SPAs. The interactivity selector is the only signal that survives.` },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'feature',
    author: 'jokafor', days_ago: 25, views: 73, reactions: 11,
    title: 'Run a workflow on a schedule without leaving the desktop runner open',
    body:
`Right now we keep a Mac mini running 24/7 just to fire the daily 9am workflows. Would be amazing if there were a hosted scheduled-runner option (or even just a local daemon that survives logouts) so the laptop doesn't have to babysit.`,
    tags: ['feature', 'scheduler', 'cron'],
    comments: [
      { author: 'admin', hours_after: 15,
        body: `Hosted scheduled runner is on the roadmap — should land in beta this summer. Local daemon (launchd / systemd) integration is closer; \`flyto daemon install\` is in main branch already and survives logouts. Docs page coming with 2.5.` },
      { author: 'jokafor', days_after: 1,
        body: 'Local daemon would cover us. Will give the main-branch install a try.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'bug',
    author: 'klovric', days_ago: 28, views: 42, reactions: 3,
    title: 'Replay drops the second click of a double-click step',
    body:
`Recorded a double-click on a Google Sheets cell to open the edit mode. Recorder shows two click events with a 60ms gap. On replay only one click fires and the cell stays in "selected" rather than "editing" state.

If I manually edit the workflow to add a small wait between the two clicks it works.`,
    tags: ['bug', 'double-click', 'google-sheets'],
    comments: [
      { author: 'admin', hours_after: 8,
        body: `The replay engine coalesces clicks under 100ms apart to avoid producing phantom doubles on hover-heavy UIs. A literal dblclick step (not two clicks) handles this case correctly — recorder is updated in main to emit dblclick when it sees the pattern. Workaround until release: do exactly what you did — split with a wait.` },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'lnaka', days_ago: 31, views: 56, reactions: 4,
    title: 'How to share env-var values with a teammate without checking them in',
    body:
`Building on the credential-substitution thread from last month — we have the env-var placeholder pattern set up, but the actual values still live in my .env locally and not on my coworker's machine.

Curious what people use as the shared store. 1Password CLI? AWS Secrets Manager? Some homegrown thing? We're a 4-person team so anything beyond "1Password" is probably overkill.`,
    tags: ['credentials', 'team', 'secrets'],
    comments: [
      { author: 'tkonig', hours_after: 14,
        body: '1Password CLI piped into the workflow runner via an env-var shim. Works for our 6-person team. The pattern is basically `op read "op://Eng/Stripe/api-key" | xargs -I{} STRIPE_KEY={} flyto run …` — wrapped in a small shell helper.' },
      { author: 'jhammond', days_after: 1,
        body: 'Same but with Doppler. Pick whichever your team already uses for the rest of the stack and you avoid yet another tool.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'mhalvor', days_ago: 35, views: 49, reactions: 3,
    title: 'iframe handling for embedded forms (HubSpot, Typeform)',
    body:
`I want to fill out a HubSpot form embedded in our marketing site. The form is in an iframe. The recorder seems to record the click in the iframe but the replay can't find the field — selector resolves at the wrapping document level.

Anything I should toggle on the recorder, or do I need to switch to the iframe explicitly with a step?`,
    tags: ['iframe', 'hubspot', 'typeform'],
    comments: [
      { author: 'admin', hours_after: 4,
        body: `Recorder should be inserting an "enterFrame" step before the iframe-internal click — sounds like it didn't on your recording. Check the workflow JSON; if there's no enterFrame, that's the bug. Workaround: insert one by hand pointing at the iframe's selector. We're tightening iframe detection for 2.5.` },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'feature',
    author: 'nbrumm', days_ago: 38, views: 87, reactions: 13,
    title: 'Per-workflow log retention setting',
    body:
`Right now retention is global (default 30 days). For our compliance flows we want 1 year. For our throwaway dev flows we want 1 day. Setting one global value forces us to pick the larger and eat the storage cost.

Per-workflow override would be nice. UI affordance level is fine — even just a YAML key.`,
    tags: ['feature', 'logs', 'retention', 'compliance'],
    comments: [
      { author: 'admin', hours_after: 11,
        body: `Fair. Per-workflow retention is a small change; opening an issue for it now. Question for the design — would you also want per-tag retention (e.g., everything tagged "compliance" gets 1 year) or strictly per-workflow?` },
      { author: 'nbrumm', hours_after: 16,
        body: 'Per-tag would actually be cleaner for us — we already tag flows by their downstream system, "compliance" is one of those tags.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'discussion',
    author: 'mvelasco', days_ago: 41, views: 183, reactions: 22,
    title: 'Four months into using Flyto2 daily — what changed in our team',
    body:
`Four-month checkpoint on our team's Flyto2 adoption. Posting because I think the team-level effects are under-discussed.

The good:
- Ops team owns automation now. Before, every "can you automate this thing?" was an engineering ticket. Now ops folks write their own workflows and ping engineering only when an API or auth boundary gets in the way.
- Engineers reclaimed an estimated 8-12 hours per week as a team.
- Workflows-as-code (we version them in git) makes audit a non-event.

The mixed:
- "Why isn't this automatable?" became a weekly question, sometimes targeting things that genuinely shouldn't be (judgment calls, sensitive customer touchpoints).
- We re-learned which UI changes break which workflows. ~6 broken workflows per major dashboard rev.

The not-yet:
- Multi-team workflow sharing. We have flows that would be useful to another team but the discovery story is still "ping me on Slack".

Happy to answer questions.`,
    tags: ['discussion', 'adoption', 'retrospective'],
    comments: [
      { author: 'admin', hours_after: 8,
        body: `Sharing-discovery is on our list — internal name is "workflow gallery". Idea is a per-org gallery surface where teams can publish + clone. Sketches happening now; would love your input on what the ideal "search a workflow you might reuse" experience looks like in your shop.` },
      { author: 'rwhite', hours_after: 14,
        body: 'The "Why isn\'t this automatable?" point is real. We added a one-page rubric ("Can a junior do it by reading docs in 10 min? → automatable. Otherwise no.") and the conversation stopped pulling sideways.' },
      { author: 'jhammond', days_after: 1,
        body: 'Mind sharing the rubric? Would lift it wholesale if you\'re OK with that.' },
      { author: 'rwhite', days_after: 1, parent_idx: 2,
        body: 'Sent via DM. Use freely.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'ofarah', days_ago: 44, views: 38, reactions: 1,
    title: 'Switching browser profile mid-workflow — does it persist cookies?',
    body:
`Need to log into two different Notion workspaces in the same run. Profile-switch sounded like the right approach but I want to confirm: when I switch from profile A to B, does A's cookies survive when I switch back?

Trying to avoid having to re-login on every profile flip.`,
    tags: ['profiles', 'cookies', 'notion'],
    comments: [
      { author: 'admin', hours_after: 6,
        body: `Yes — profiles are persistent on disk, cookies survive across runs and across switches within a run. The persistence happens at the browser-context layer; Flyto2 just attaches to a named profile dir each time. The login is done once per profile, ever.` },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'bug',
    author: 'prustad', days_ago: 47, views: 71, reactions: 6,
    title: 'CSP errors break the recorder injection on some internal admin pages',
    body:
`Our internal admin tool has a strict CSP that blocks the recorder's injected helper script. The page console shows a "Refused to load the script because it violates the following Content Security Policy directive" and the recorder UI never appears on the page.

Adding the recorder's domain to the CSP is fine for our team-owned tools but I can't modify CSPs on tools we don't own. Is there a non-injection mode?`,
    tags: ['bug', 'csp', 'recorder'],
    comments: [
      { author: 'admin', hours_after: 5,
        body: `CSP is unfortunately the right thing for those admin tools to do — we don't want to recommend you loosen it. Two paths: (1) the desktop recorder bypasses CSP because it runs in a Chromium instance we control; (2) for the embedded recorder, we're working on an iframe-based injection that doesn't trip CSP — targeting 2.6. Desktop is the recommendation for now.` },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'shaque', days_ago: 50, views: 62, reactions: 4,
    title: 'Captcha — when is it worth working around vs. accepting human-in-the-loop?',
    body:
`A workflow we run once a week now hits a captcha maybe 1 in 5 runs. Solving services exist but they feel sketchy. The "pause and ask a human" pattern works but I have to be available to respond.

What's the team-of-1 / team-of-small heuristic here? At what frequency does it become worth investing in something heavier?`,
    tags: ['captcha', 'human-in-loop'],
    comments: [
      { author: 'admin', hours_after: 9,
        body: `Our heuristic: at 1-in-5 frequency for a weekly workflow, you'll hit one a month. That's fine for human-in-loop. Past once-a-week-or-more, look at why the site is throwing captchas in the first place — usually it means they think your traffic is bot-like and the right fix is rate-limiting the recording, not solving captchas. Solving services we don't recommend.` },
      { author: 'png', days_after: 1,
        body: 'Rate-limiting was the unblock for us — we were running our flow every 5 minutes "to be safe", site went from captcha-every-time to never. Lower frequency = less suspicious.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'feature',
    author: 'tboone', days_ago: 53, views: 92, reactions: 16,
    title: 'Branching: "if this element is present, take path A, else path B"',
    body:
`Currently workflows are linear — same N steps every run. We have flows where the page sometimes shows a "Welcome back" prompt and sometimes doesn't, and we want to handle both paths cleanly.

Adding optional steps with "continue on failure" works but feels hacky. A first-class branch step would be much cleaner.`,
    tags: ['feature', 'branching', 'control-flow'],
    comments: [
      { author: 'admin', hours_after: 7,
        body: `Branching is in design. The shape we're prototyping is a "presenceCheck" step that emits a boolean, plus a "branch" step that takes two child step-arrays. The recorder will eventually let you record both arms by toggling site state — but for the initial release the UI will be JSON-only. Sound usable?` },
      { author: 'tboone', hours_after: 13,
        body: 'JSON-only is fine for the first release. Most of my workflows already get hand-edited after recording anyway.' },
      { author: 'evgenia', days_after: 1,
        body: 'Curious how it interacts with error paths — does a step inside a branch arm count toward the parent\'s retry budget?' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'uakin', days_ago: 56, views: 47, reactions: 2,
    title: 'Recording mode for one-off vs. parametric workflows',
    body:
`When I record a workflow to "click search, type cat, click result", the recorder captures "cat" as a literal. Next time I want to search for "dog" I have to either re-record or edit the JSON.

Is there a recorder mode where typed values get auto-parametrized? Or is editing JSON the expected workflow?`,
    tags: ['recorder', 'parameters'],
    comments: [
      { author: 'admin', hours_after: 4,
        body: `JSON edit is the current path for now — recorder doesn't infer which fields are parameters vs. constants. We're prototyping a "make this a parameter" right-click action on the recorded step which is a much lighter-weight workflow. Likely 2.5.` },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'discussion',
    author: 'evgenia', days_ago: 60, views: 198, reactions: 24,
    title: 'Three pain points that would have saved us a month, in order',
    body:
`Posting these so the next team avoids what we ate. In priority order, biggest pain first:

1. **Selector decay on third-party SaaS.** We naively recorded against Salesforce, HubSpot, Stripe etc. and got bitten on every quarterly UI refresh. Fix was switching to text-anchor selectors (find by visible label, navigate by relative position). Three weeks lost figuring this out.

2. **No environment story.** We built half our workflows in personal accounts and had to redo them when we created service accounts. Service account first, always — even for a prototype. One week of redo.

3. **Tab-switching flakiness.** Multi-tab flows are 3x flakier than single-tab. We moved everything to single-tab where possible (open links in same tab, not new tab). Two weeks of debugging before we accepted this.

If you're starting now: service accounts, text selectors, single tab. Those three would have saved us a calendar month.`,
    tags: ['discussion', 'lessons-learned'],
    comments: [
      { author: 'admin', hours_after: 5,
        body: `Pinning the "service accounts first" advice on our onboarding doc. The other two we know about and are slowly chipping at — text selectors are now the default in 2.4+, multi-tab is on the longer-term improvement list. Thanks for the writeup.` },
      { author: 'mvelasco', hours_after: 12,
        body: '+1 on single-tab. We have a rule that any flow that needs a second tab gets reviewed by two people before merge. Half the time the second tab turns out to be unnecessary.' },
      { author: 'gnaidu', days_after: 1,
        body: 'Bookmarking. Currently in week-2 of the selector-decay pain so this is timely.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'bug',
    author: 'vmadsen', days_ago: 63, views: 39, reactions: 2,
    title: 'Workflow timeout doesn\'t propagate to the underlying browser tab',
    body:
`When the workflow's total timeout fires, the runner marks the run failed but the Chromium tab keeps running its current step. If the step was a long XHR, the tab just sits there until the request comes back.

Means I end up with 6 zombie tabs by end of day from runs that hit their cap.`,
    tags: ['bug', 'timeout', 'cleanup'],
    comments: [
      { author: 'admin', hours_after: 6,
        body: `Yes — the cleanup tear-down only fires on clean exit, not timeout exit. Fixing in 2.4.3. Workaround: \`flyto kill-zombies\` cleans up orphan tabs older than 1h.` },
      { author: 'vmadsen', hours_after: 9,
        body: 'Useful command, didn\'t know it existed. Will add to my hourly cron until the fix lands.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'aweiss', days_ago: 66, views: 33, reactions: 1,
    title: 'Are there guidelines for naming workflow files?',
    body:
`Question about conventions, not technical. We're hitting 80+ workflow files in our repo and finding things is starting to hurt. Curious what naming pattern other teams use.

We've been doing \`{system}-{action}.yaml\` (stripe-monthly-export.yaml, notion-daily-rollup.yaml) but compound systems get awkward.`,
    tags: ['naming', 'convention', 'team'],
    comments: [
      { author: 'tkonig', hours_after: 11,
        body: '{system}/{action}.yaml — directory per system, not flat names. Once we crossed ~40 flows the directory grouping started carrying its weight.' },
      { author: 'aweiss', hours_after: 14,
        body: 'That\'s much better, will refactor.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'feature',
    author: 'brye', days_ago: 70, views: 81, reactions: 12,
    title: 'Workflow-level retry budget separate from step-level',
    body:
`Have step-level retry (great, already shipping it sounds like) and currently a single "run the whole workflow up to N times" knob. What I want is the middle — "retry these 3 grouped steps as a unit if any of them fails, up to 2 times".

Use case: a 5-step "login + verify session + open dashboard" sequence where if the login leg fails I want all 5 redone, not just the failing one.`,
    tags: ['feature', 'retry', 'control-flow'],
    comments: [
      { author: 'admin', hours_after: 8,
        body: `Step groups with shared retry budget are part of the branching work — same primitive, different ergonomics. Targeting same release window. Will ping the design thread.` },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'cdvorak', days_ago: 73, views: 55, reactions: 3,
    title: 'Recording a workflow that involves switching to a desktop app briefly',
    body:
`Specifically, a flow needs to grab an OTP from our authenticator desktop app (1Password) and paste it back into a web form. Right now the recorder doesn't see anything outside the browser.

Is there an "external paste" step pattern, or am I forced to handle the desktop side outside of Flyto2 entirely?`,
    tags: ['recorder', 'desktop', 'paste'],
    comments: [
      { author: 'admin', hours_after: 5,
        body: `Recorder is browser-only by design. Pattern for this case: \`exec\` step that calls \`op item get …\` and pipes the result into a clipboard substitute via env var; the next paste step references the env. Concrete example in templates → "1Password OTP". Works for most TOTP-style flows without leaving the browser context for the actual workflow logic.` },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'discussion',
    author: 'dmello', days_ago: 76, views: 142, reactions: 17,
    title: 'Why we kept Selenium for one specific workflow and migrated everything else',
    body:
`Counterintuitive piece — we did the full Selenium → Flyto2 migration last quarter, with one exception. Posting because the rationale might save someone else the same evaluation.

The exception: a workflow that exercises 12 browser versions in parallel as part of our compatibility matrix. Selenium Grid handles the parallel-browser orchestration in a way that's still simpler than rolling it ourselves in Flyto2.

For everything else — single-browser, recording-first, ops-team-owned — Flyto2 was a clear win. The pattern: keep the legacy tool where its orchestration story is stronger; migrate where recording-first matters more.`,
    tags: ['discussion', 'selenium', 'migration', 'tradeoffs'],
    comments: [
      { author: 'admin', hours_after: 7,
        body: `The 12-browser parallel matrix is a fair edge case — our parallel runner is single-host first, and Selenium Grid's multi-host story is more mature. Worth flagging in our docs for folks evaluating; thanks for the writeup.` },
      { author: 'oblake', days_after: 1,
        body: 'We have a similar split — Playwright for unit-test-style flows where deterministic Chromium control matters, Flyto2 for the ops/business flows. Tools-not-religion is the way.' },
    ],
  },

  // ---- EN cloud · batch 2 ----
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'jthorpe', days_ago: 3, views: 64, reactions: 4,
    title: 'GitHub PR — auto-label by changed file paths',
    body:
`Want to add labels to a PR based on which directories the diff touches (frontend/, infra/, docs/). The GitHub UI has the "Files changed" tab and I can read the path list visually but the auto-label step in my recording always picks the same label regardless of the diff.

Anyone scraped the file list reliably?`,
    tags: ['github', 'pr', 'labels'],
    comments: [
      { author: 'admin', hours_after: 6,
        body: `Use the GitHub Files-changed page's \`.file-header[data-path]\` attribute — each block has the full path on a data-* attribute. The auto-label step can iterate those and apply rules. Heads-up the page is virtualized: scroll to bottom to collect the long-tail paths.` },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'ipatel', days_ago: 4, views: 47, reactions: 2,
    title: 'Jira issue creation from an inbound shared mailbox',
    body:
`We have a support@ alias that gets ~20 emails a day. Currently a human reads them and files Jira tickets. Want to automate the "read → categorize → file Jira" loop.

Mix of Gmail web + Jira web seems doable but the categorize step is what I'm stuck on — does Flyto2 have any classification primitive, or do I bolt on something separate?`,
    tags: ['gmail', 'jira', 'classification'],
    comments: [
      { author: 'admin', hours_after: 8,
        body: `Flyto2 doesn't classify content directly — you'd shell out to an LLM step or rule-based regex matcher. For "categorize into 3-5 buckets", the rule-based path is usually less brittle. We have an "exec" step that pipes text in and reads JSON out, which makes either approach a clean wrap.` },
      { author: 'tkonig', hours_after: 13,
        body: 'We do this with a small Python helper — Flyto2 grabs the email body, exec step pipes through a `classify.py\` we own, result drives the Jira project/component fields. Worth keeping the classifier separate so you can iterate on its rules without touching the workflow.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'bug',
    author: 'kbergen', days_ago: 6, views: 51, reactions: 3,
    title: 'Monday.com board column order is randomized on copy-to-new-board',
    body:
`Workflow that templates a new Monday.com board from a master. The board copies fine but the columns come out in random order — sometimes the order is preserved, sometimes not, on the same source board.

Suspect it's a Monday-side race. Anyone else seeing this?`,
    tags: ['bug', 'monday'],
    comments: [
      { author: 'rwhite', hours_after: 10,
        body: 'Yes — Monday\'s "duplicate board" endpoint doesn\'t guarantee column order. We work around by re-sorting columns as a separate step after the duplicate completes.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'feature',
    author: 'noh', days_ago: 8, views: 78, reactions: 11,
    title: 'Native Calendly booking step',
    body:
`Calendly's web UI is recordable but the steps are fragile because the timezone picker, slot grid, and confirmation dialog each change quarterly. A native "book a Calendly slot" step with handle / date / participants as params would survive UI churn.`,
    tags: ['feature', 'calendly', 'integration'],
    comments: [
      { author: 'admin', hours_after: 9,
        body: 'On the integrations shortlist — Calendly\'s public API would back the step, no recording involved. Currently weighing it against Slack, HubSpot, and Notion integrations for the next release. Helps if you reply with the specific use case.' },
      { author: 'noh', hours_after: 14,
        body: 'Use case: customer-success person books a kickoff call when a deal flips to "Closed Won" in HubSpot. End-to-end: HubSpot deal trigger → grab participant emails → Calendly book → Slack confirm. Calendly is the only fragile step right now.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'oblake', days_ago: 10, views: 55, reactions: 5,
    title: 'Notion API vs Flyto2 — when does each one win?',
    body:
`Working on a Notion automation and torn between calling the Notion API directly (faster, more reliable) and recording through Flyto2 (matches the UX our team already uses).

For folks who've gone both routes: what was the deciding factor?`,
    tags: ['notion', 'api', 'design'],
    comments: [
      { author: 'jhammond', hours_after: 5,
        body: 'Bulk data writes → API. Single-page polished outputs that PMs will look at → Flyto2 (preserves the visual structure that API-built pages lose).' },
      { author: 'evgenia', hours_after: 11,
        body: 'Concur. We do both — API for the data layer, Flyto2 for the final "make it look right" pass. Two-step pipeline.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'bug',
    author: 'rivanov', days_ago: 12, views: 42, reactions: 3,
    title: 'Confluence pasted images get re-uploaded on every run',
    body:
`A workflow that posts the same template image to a new Confluence page each week. Expected: image is uploaded once, referenced thereafter. Actual: a new attachment is created in Confluence on every run, attachment count climbing into the thousands.

Workaround: pre-upload the image and reference its attachment ID instead of pasting?`,
    tags: ['bug', 'confluence', 'attachments'],
    comments: [
      { author: 'admin', hours_after: 7,
        body: 'Pre-upload is the right workaround. The recorder pastes images as a literal upload because it can\'t introspect the existing attachment library. We\'re scoping an "attach existing" step that takes a content hash and reuses; for now, manual upload + reference is what we recommend.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'feature',
    author: 'yokonkwo', days_ago: 14, views: 61, reactions: 8,
    title: 'Execute a Zendesk macro from a workflow step',
    body:
`Zendesk macros are the canonical way our support team replies to tickets. Right now I record the macro selection click-by-click, which breaks every time Zendesk reorders the macros menu.

A "run macro by name" step would survive UI changes and be easier for support folks to maintain.`,
    tags: ['feature', 'zendesk', 'macro'],
    comments: [
      { author: 'admin', hours_after: 11,
        body: 'Reasonable. Zendesk\'s API has macros as first-class objects so this is API-backed. Adding to the integrations shortlist alongside Calendly. Reply with priority order if you have other Zendesk needs that would benefit from API-backed steps.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'iperez', days_ago: 16, views: 39, reactions: 2,
    title: 'Best path to export an Intercom conversation transcript',
    body:
`Need to grab the full message history of an Intercom conversation as text. The web UI shows it pageable; the API works but requires pagination + assembly.

Has anyone wired the API approach as a single Flyto2 "fetch transcript" step? Worth the upfront work?`,
    tags: ['intercom', 'export'],
    comments: [
      { author: 'aweiss', hours_after: 13,
        body: 'We wrote it as an exec step calling a small Python helper. Worth it — the helper is ~30 lines and the workflow no longer touches Intercom\'s UI at all. Survives their UI rev cycle, runs in 1.5s instead of 12s.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'discussion',
    author: 'zfedorov', days_ago: 19, views: 121, reactions: 14,
    title: 'We deliberately kept Slack out of all our recorded workflows',
    body:
`Counter-pattern people might find useful: our team has a rule against putting Slack steps inside Flyto2 recordings, even though it's tempting.

Why: Slack changes its DOM more than any other tool in our stack. Roughly one breakage per month if we recorded against the web client. Switched everything Slack-related to incoming webhooks via an exec step. Zero breakages since.

The general principle: if a tool has a stable JSON API, prefer it. The recorder is for tools that don't.`,
    tags: ['discussion', 'slack', 'principles'],
    comments: [
      { author: 'admin', hours_after: 7,
        body: 'Worth amplifying. We agree this is the right default. Recorder is for "no API exists" or "API doesn\'t cover this surface". Slack has both APIs covering everything that matters, so this rule of thumb is correct.' },
      { author: 'mvelasco', hours_after: 14,
        body: 'Same policy here, same conclusion. Worth adding: GitHub falls in the same bucket — well-instrumented API, fragile UI, prefer the API.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'aweiss', days_ago: 22, views: 36, reactions: 2,
    title: 'Google Drive bulk file operations — rate limiting',
    body:
`Moving ~2000 files between Drive folders. Recorded through the Drive UI; after about 400 operations the page starts throwing "this is taking longer than expected" overlays and the workflow times out.

Drive's API would be the obvious answer but I'm curious if anyone's found a recorder-friendly rate that avoids tripping the throttle.`,
    tags: ['google-drive', 'rate-limit'],
    comments: [
      { author: 'admin', hours_after: 9,
        body: 'Drive throttles bulk UI ops aggressively — recorder rate that worked for us is ~5 ops/min, anything faster trips the overlay. At 2000 ops that\'s 7 hours, which is why everyone ends up at the API for this scale. Genuinely worth the migration here.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'bug',
    author: 'brye', days_ago: 24, views: 58, reactions: 4,
    title: 'SharePoint Online MFA loops back to the login page',
    body:
`Workflow that signs into our SharePoint tenant. The MFA prompt comes up correctly, I get the push on my phone, approve it — and the page lands back at the login screen instead of progressing to the dashboard.

Only on SharePoint; same tenant's Outlook and Teams logins work.`,
    tags: ['bug', 'sharepoint', 'mfa'],
    comments: [
      { author: 'admin', hours_after: 6,
        body: 'Known SharePoint quirk — its post-MFA redirect uses a session cookie that gets dropped when the workflow runs in a fresh browser context. Workaround: persist the profile dir across the MFA step (already a profile if you\'re using one, otherwise add `--persist-profile`). Proper fix in 2.5 will land alongside the broader auth-cookie work.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'hlaurent', days_ago: 26, views: 33, reactions: 1,
    title: 'OneDrive — race between rename and the subsequent move',
    body:
`Rename a file in OneDrive, then move it. The move step sometimes fails because the file path it remembers is the pre-rename path.

Currently inserting a 2s sleep between rename and move. Works but feels brittle.`,
    tags: ['onedrive', 'race', 'wait'],
    comments: [
      { author: 'tkonig', hours_after: 8,
        body: 'OneDrive\'s UI doesn\'t reflect the rename until the server ack arrives. waitForSelector on the new filename in the file list (instead of a sleep) bridges the gap and survives slower network days.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'feature',
    author: 'dmello', days_ago: 28, views: 53, reactions: 7,
    title: 'Native Dropbox file-picker dialog handling',
    body:
`When the workflow needs to grab a Dropbox file via their picker iframe on a third-party site, the iframe's auth handshake is tricky to record and the picker DOM is heavily abstracted.

A native step that takes a Dropbox path and returns the file selection without touching the picker UI would unblock several flows.`,
    tags: ['feature', 'dropbox', 'iframe'],
    comments: [
      { author: 'admin', hours_after: 12,
        body: 'Dropbox file picker is fair ask — comes up enough we should have a native step. Adding to the list. The iframe-auth piece is the part we\'ll need to architect carefully since it touches our cross-origin story.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'ghoffer', days_ago: 30, views: 27, reactions: 1,
    title: 'Outlook web — does anyone have selectors that survive the new ribbon?',
    body:
`Microsoft rolled out the redesigned ribbon to our tenant last week. Half our Outlook recordings broke. The reply/forward buttons moved into a "More" overflow.

Curious if anyone has a stable selector set, or if we just eat the re-record.`,
    tags: ['outlook', 'selectors'],
    comments: [
      { author: 'admin', hours_after: 5,
        body: 'The new ribbon uses `aria-label\` consistently — our updated Outlook templates target by aria-label rather than role+position. Refreshed templates are in the gallery under "Outlook 2025 ribbon". The re-record is unfortunately the right call if your previous selectors were role-based.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'discussion',
    author: 'mvelasco', days_ago: 33, views: 154, reactions: 19,
    title: 'Reducing a 50-field form recording from 8 minutes to 90 seconds',
    body:
`Long-form recording for a 50-field internal request form. Initial recording: 8 minutes of typing. Felt obviously wrong.

What helped, in order:
1. Realized 30 of the 50 fields had defaults that were correct for our use case. Skipped them entirely.
2. The remaining 20 were grouped — name fields, address fields, account fields. Combined each group into a single "paste blob" step rather than per-field typing.
3. Replaced the final "click submit and wait for confirmation page" with a network-idle wait against the confirmation endpoint.

Final: 90 seconds. The "paste blob" trick is the one I'd recommend most — most forms accept tab-separated paste that fills multiple fields at once.`,
    tags: ['discussion', 'optimization', 'forms'],
    comments: [
      { author: 'admin', hours_after: 6,
        body: 'The "paste blob" pattern is one we should be teaching more aggressively — it works on the majority of HTML forms because most input fields handle paste-with-tab as field advancement. Will add to the recorder tips page.' },
      { author: 'sgupta', hours_after: 15,
        body: 'Tried this immediately on our intake form. Worked first try. Saved 4 minutes per run, ~80 runs a month. Huge.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'bug',
    author: 'nbrumm', days_ago: 36, views: 31, reactions: 2,
    title: 'PDF download times out on slower VPN connections',
    body:
`Workflow that exports a 40MB PDF report. On office wifi the download completes in ~8s. Same workflow over our remote VPN reliably hits the 60s default timeout.

Bumping the download-timeout knob to 180s works but I\'d rather have it scale with actual download progress.`,
    tags: ['bug', 'pdf', 'timeout'],
    comments: [
      { author: 'admin', hours_after: 8,
        body: 'Fair — fixed timeout is the wrong model for downloads. 2.5 changes the download wait to a "no progress for N seconds" heuristic, which keeps shorter timeouts on small files and lets slow connections finish big files. Use the bumped timeout for now.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'feature',
    author: 'tkonig', days_ago: 38, views: 46, reactions: 6,
    title: 'CSV import templates with field mapping presets',
    body:
`Building a Flyto2 workflow that imports a CSV into our internal CRM. The CSV's columns don\'t match the CRM\'s field names — every recording has a "map column X to field Y" stage that\'s ~12 clicks.

Mapping is identical run-to-run. Would love to express it as a one-time template rather than re-record it.`,
    tags: ['feature', 'csv', 'mapping'],
    comments: [
      { author: 'admin', hours_after: 10,
        body: 'Reasonable. The general primitive is "named subroutine with parameters" — same need shows up for any mapping/transform stage. We\'re scoping it; it\'s adjacent to the branching work.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'shaque', days_ago: 40, views: 25, reactions: 1,
    title: 'Excel Online — formulas don\'t recalculate after a programmatic edit',
    body:
`Edit a cell with a typed-text step. Adjacent cells with formulas referencing that cell don\'t update until I manually click into another cell.

Is there a way to fire a recalc, or is the trick to just touch another cell after the edit?`,
    tags: ['excel-online', 'formulas'],
    comments: [
      { author: 'admin', hours_after: 4,
        body: 'Excel Online debounces recalc on typed edits — a single Tab keypress as the next step forces commit + recalc. Cleaner than touching another cell.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'bug',
    author: 'uakin', days_ago: 42, views: 49, reactions: 4,
    title: 'Two workflows running in sequence — second one inherits stale session',
    body:
`Workflow A logs into our admin tool, does its thing. Workflow B starts immediately after, expects a fresh session, but gets A\'s session because the browser context didn\'t fully tear down.

Inserting a 5s gap between A and B fixes it. Reliable, but feels wrong.`,
    tags: ['bug', 'session', 'lifecycle'],
    comments: [
      { author: 'admin', hours_after: 7,
        body: 'Sequential workflow runs are supposed to reuse the context — that\'s an optimization, not a bug. If you want a fresh session, pass `--isolated-context\` on workflow B\'s invocation. Documentation on this is thin; we\'ll bump the visibility.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'klovric', days_ago: 44, views: 38, reactions: 3,
    title: 'Random "are you sure?" modals on retail-site checkout flows',
    body:
`Our test-mode workflow checks out a fake order on our own e-comm site. About 1 in 4 runs we get a "discount code expired, continue anyway?" modal that wasn\'t in the original recording. Workflow doesn\'t know what to do with it.

Is this where the upcoming branching feature would help, or is there a simpler "if-present-click-X-else-continue" idiom today?`,
    tags: ['ecommerce', 'modals', 'branching'],
    comments: [
      { author: 'admin', hours_after: 8,
        body: 'Branching will be the proper home. Today the workaround is an "optional step with continueOnFailure" — set the click step to optional, the workflow skips it cleanly when the modal isn\'t present. Less elegant than a real conditional but works.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'bug',
    author: 'vmadsen', days_ago: 46, views: 23, reactions: 1,
    title: 'SurveyMonkey submit click reports success but no response is recorded',
    body:
`Recording fills out a SurveyMonkey form and clicks submit. The workflow logs the click as successful and the "thank you" page appears, but the response doesn\'t show up in the survey\'s response list.

Suspect there\'s a client-side validation step the recorder isn\'t triggering. Anyone seen this?`,
    tags: ['bug', 'surveymonkey'],
    comments: [
      { author: 'cmoreno', hours_after: 12,
        body: 'Saw this last quarter. SurveyMonkey fires a beforeunload validation that the recorder skips. Workaround: add an explicit blur step on the last field before submit. The blur triggers the validation.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'discussion',
    author: 'cmoreno', days_ago: 49, views: 89, reactions: 11,
    title: 'Airtable view export — what works, what didn\'t',
    body:
`Tried three approaches to export Airtable views over the last month. Findings:

- **CSV export via Airtable UI**: Works, but the click-through is 5 steps per view, multiplied by the 12 views we export. Got tedious.
- **Airtable API**: Works fast (sub-second per view) but loses the view's grouping/sorting that's only stored at the view layer, not the table layer.
- **Direct page scrape via Flyto2**: Sweet spot for us. Captures the view exactly as the team sees it, including sort order and visible columns. Slower than API but matches what people expect.

We landed on Flyto2 for views, API for raw table data. Two-tool pattern.`,
    tags: ['discussion', 'airtable'],
    comments: [
      { author: 'admin', hours_after: 9,
        body: 'The visible-as-the-team-sees-it semantics is exactly where Flyto2 beats the API. Worth the writeup, will reference from our Airtable docs.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'gnaidu', days_ago: 51, views: 29, reactions: 2,
    title: 'WordPress admin — Gutenberg block ordering on programmatic insert',
    body:
`Adding 3 blocks to a Gutenberg post programmatically. The order I insert them is consistent in the recorder; on replay they sometimes land out of order.

Suspect Gutenberg\'s async block insertion is racing with the next "click new block" step.`,
    tags: ['wordpress', 'gutenberg', 'race'],
    comments: [
      { author: 'admin', hours_after: 6,
        body: 'Yes — Gutenberg returns from the "insert block" action before the block is fully mounted. waitForSelector on the new block\'s unique class (each block has a generated client-id) between inserts solves the race deterministically.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'feature',
    author: 'png', days_ago: 54, views: 64, reactions: 8,
    title: 'Shopify variant bulk update — beyond the existing CSV import',
    body:
`Shopify\'s CSV import handles bulk price updates fine, but anything beyond price (image swap, SEO description, tag set) is a per-product manual edit.

A native step that takes a list of product IDs + a partial-update spec would unblock several seasonal-update workflows that we currently dread.`,
    tags: ['feature', 'shopify'],
    comments: [
      { author: 'admin', hours_after: 11,
        body: 'Shopify\'s GraphQL admin API supports this directly — wrapping it as a step is feasible. Question for prioritization: would the same set of teams that wanted Calendly + Zendesk also benefit, or is this a distinct cohort?' },
      { author: 'png', hours_after: 18,
        body: 'Different cohort — mostly e-commerce ops folks, less SaaS-CRM-shaped. Maybe 30-40 teams in the community.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'rwhite', days_ago: 57, views: 47, reactions: 3,
    title: 'Session warmup — workflow first run is always slow',
    body:
`Every workflow\'s first run after the runner starts takes ~30s longer than subsequent runs. Cold cache, no DNS warmth, presumably JIT for the headless Chromium.

Anyone have a "warmup" pattern to amortize this? A dummy nav-to-blank step?`,
    tags: ['performance', 'warmup'],
    comments: [
      { author: 'admin', hours_after: 9,
        body: 'A simple "navigate to about:blank, wait 1s" pre-step warms the browser without doing anything. Most teams that care about first-run latency add it. We\'re looking at making it the implicit default but want to confirm it doesn\'t mess with anyone\'s context-sensitive setup first.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'bug',
    author: 'jokafor', days_ago: 60, views: 41, reactions: 3,
    title: 'Drag-and-drop reordering in Notion drops the item back to original spot',
    body:
`Recording a drag of a Notion database row from position 5 to position 1. Recorder captures the drag start, the move, and the drop. On replay the item snaps back to position 5.

Pretty sure Notion has its own drag-recognition that\'s not seeing the synthetic events.`,
    tags: ['bug', 'notion', 'drag-and-drop'],
    comments: [
      { author: 'admin', hours_after: 7,
        body: 'Notion uses pointer events with a custom drag controller — synthetic events alone won\'t trigger it. The recorder needs to emit pointer-down + move + up sequence which it does on most sites but Notion\'s drag detector requires specific event ordering we missed. Fix is in main; ships 2.4.3.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'discussion',
    author: 'jhammond', days_ago: 63, views: 137, reactions: 18,
    title: 'Friday "what broke this week" review — saved us several headaches',
    body:
`Small-team practice that helped us: every Friday 30 minutes we look at the run logs from the past 5 days and rank failures by frequency + impact.

Why it works:
- Surfaces flakes before they become "this workflow doesn\'t work anymore"
- Forces us to actually triage instead of clicking "rerun" 6 times
- The top-of-list item gets fixed Friday afternoon, blocks gone by Monday

Cost: 30 min/week. Saved at least 4 escalations in the last quarter.`,
    tags: ['discussion', 'process', 'reliability'],
    comments: [
      { author: 'rwhite', hours_after: 11,
        body: 'Same practice here, called "Friday flake hour". Same outcome. The "rerun" reflex is the trap to avoid.' },
      { author: 'admin', days_after: 1,
        body: 'Worth surfacing in the docs as a recommended practice — most teams that hit reliability problems are caught between "ignore" and "rewrite everything". A weekly triage hour is the missing middle.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'hlund', days_ago: 66, views: 32, reactions: 2,
    title: 'Pinning a workflow to a specific Chromium version',
    body:
`We have a workflow that\'s well-tested against the Chromium version that ships with runner 2.4.0. Don\'t want it auto-upgrading when 2.5 lands until we\'ve re-validated.

Is there a version-pin knob, or does each runner version come with one Chromium?`,
    tags: ['versioning', 'chromium'],
    comments: [
      { author: 'admin', hours_after: 6,
        body: 'Today: each runner version ships one Chromium, and pinning the runner pins the Chromium. We\'re scoping a separate Chromium override (`--chromium-version`) for exactly your case — known stable browser, want to upgrade the runner without churning the workflow. Targeting 2.5.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'bug',
    author: 'dkato', days_ago: 69, views: 38, reactions: 3,
    title: 'Headless mode misses sticky popovers that block interaction',
    body:
`Interactive mode: recorder sees the "we use cookies" popover, dismisses it, moves on. Headless mode: the popover is rendered but the recorder doesn\'t see it as blocking, tries to click the underlying button, gets a "click intercepted" error.

Workaround: explicit dismiss step at the top of every workflow that runs on a customer-facing page. Feels redundant.`,
    tags: ['bug', 'headless', 'popovers'],
    comments: [
      { author: 'admin', hours_after: 8,
        body: 'Headless click-intercept handling is more aggressive than headed for security reasons (sites can\'t trick headless into clicking obscured elements). The explicit-dismiss step is the recommended pattern; we\'re unlikely to auto-handle popovers in headless mode because the heuristic is hard to keep safe.' },
    ],
  },

  // ---- EN cloud · batch 3 ----
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'bjacobs', days_ago: 2, views: 71, reactions: 6,
    title: 'LinkedIn Sales Nav — connection requests above the daily soft cap',
    body:
`Our SDR is sending ~80 connection requests a day from Sales Nav. LinkedIn starts rate-limiting at ~50 with a soft warning, hard-cap at ~100. The workflow we recorded runs in 3 minutes and hits the warning every time.

Anyone landed on a request cadence that LinkedIn doesn\'t consider robotic? I\'m thinking long pauses but the SDR isn\'t available to "drive" 80 click-through queries.`,
    tags: ['linkedin', 'rate-limit', 'sales'],
    comments: [
      { author: 'admin', hours_after: 7,
        body: 'LinkedIn\'s cadence detection is the rate-limit, not the volume — they care about timing variance. Random sleep between 45-120s per request + run during normal work hours pushes most accounts below the warning threshold. ~80/day is achievable but takes ~3 hours of background runtime, not 3 minutes.' },
      { author: 'mvelasco', hours_after: 14,
        body: 'Confirming the timing-variance point. We added jitter to sleeps and the warnings went away. The "fast and uniform" pattern is what trips it.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'efranco', days_ago: 4, views: 38, reactions: 2,
    title: 'LinkedIn — InMail bulk-send fails after 8 messages',
    body:
`Workflow opens a saved Sales Nav search, sends an InMail to each first-page result. The 9th message reliably 500s because LinkedIn redirects to a "We\'ve detected unusual activity" interstitial.

The body of each message is unique (template + personalization). Is the issue volume or some signature pattern in my templates?`,
    tags: ['linkedin', 'inmail'],
    comments: [
      { author: 'admin', hours_after: 11,
        body: 'LinkedIn\'s anti-spam is mostly about the rate of new conversations from one account, less about message content. Eight per session is roughly the trigger. Spread across the day at one message every 5-10 minutes is the cadence that survives.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'bug',
    author: 'gnaidu', days_ago: 6, views: 47, reactions: 4,
    title: 'Salesforce — duplicate-lead modal blocks bulk import on the 23rd record',
    body:
`Importing 50 leads via the Salesforce UI. The first 22 import fine, the 23rd triggers Salesforce\'s built-in duplicate-detection modal asking to merge/skip/create-anyway. The workflow times out waiting for the "Save" button which is now hidden behind the modal.

Suspect a specific lead in our list collides with an existing record, but the workflow has no way to react to the modal.`,
    tags: ['salesforce', 'duplicates'],
    comments: [
      { author: 'admin', hours_after: 9,
        body: 'The branching feature we\'re building lands directly on this — "if duplicate modal present, click create-anyway, else continue". Today, the optional-step-with-continueOnFailure pattern combined with an explicit modal-dismiss click works. The trick: the modal dismiss has to be optional too, otherwise it fails on the records that don\'t trigger duplicates.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'iperez', days_ago: 8, views: 52, reactions: 3,
    title: 'HubSpot ↔ Pipedrive — what wins for cross-CRM dedupe?',
    body:
`We have HubSpot as primary, Pipedrive as a legacy install we\'re shutting down. ~3000 contacts to migrate, ~600 are duplicates of records already in HubSpot.

Tried building a "check HubSpot for email, skip if present" loop in Flyto2. Works but takes 4 hours. Tempted to do the dedupe upstream via the HubSpot API and only bring the cleaned list through Flyto2.`,
    tags: ['hubspot', 'pipedrive', 'dedupe', 'migration'],
    comments: [
      { author: 'admin', hours_after: 6,
        body: 'Cleaning upstream with the API is the right call. Flyto2\'s strength is when no API exists or the API is partial. For dedupe both sides expose first-class APIs and you\'ll get 10x runtime back. Save the recording for the final write step if you want to preserve UI-only field semantics.' },
      { author: 'rwhite', hours_after: 13,
        body: 'Did this same migration last year. API for dedupe, recording only for the import. Took 40 min total. The 4-hour route is real.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'bug',
    author: 'jokafor', days_ago: 11, views: 36, reactions: 2,
    title: 'Pipedrive custom-field dropdown options not exposed in the recorder',
    body:
`Pipedrive has custom dropdown fields on Deals. When I record selecting an option, the recorder captures the click on the dropdown\'s display label but not the underlying option ID. On replay it sometimes picks the wrong option because the rendered label is the same for two underlying values.`,
    tags: ['pipedrive', 'recorder'],
    comments: [
      { author: 'admin', hours_after: 8,
        body: 'Pipedrive renders dropdowns via a custom virtualized component; the recorder falls back to label-match in that case. Workaround: in the workflow JSON, add a `value\` field with the option ID explicitly. The IDs are stable across UI changes. Long-term we\'re looking at recording the option-id when the component exposes it via aria-value.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'feature',
    author: 'klovric', days_ago: 13, views: 84, reactions: 13,
    title: 'Zoom meeting bot for auto-transcription record',
    body:
`We have a weekly stakeholder meeting that should be transcribed for the team members who can\'t attend. Today someone records, uploads, runs the transcript. A "Zoom join + record + email transcript" workflow would be a one-time setup vs. a weekly chore.`,
    tags: ['feature', 'zoom', 'transcription'],
    comments: [
      { author: 'admin', hours_after: 12,
        body: 'Zoom has an SDK for bot-style joiners that\'s the right primitive — auto-recording through Flyto2\'s browser stack would be fragile compared to a native Zoom bot. We\'re scoping a "meeting hooks" integration point rather than building Zoom-specific automation; that way Meet/Webex/Teams can plug in the same way.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'lnaka', days_ago: 15, views: 33, reactions: 2,
    title: 'Google Meet captions — best way to extract during a live call?',
    body:
`Trying to grab the auto-generated captions track from a live Meet for an internal accessibility tool. The captions are visible in the UI but the DOM updates so fast that the recorder can\'t keep up.

Anyone done this? Polling pattern? Mutation observer hookup?`,
    tags: ['google-meet', 'captions', 'accessibility'],
    comments: [
      { author: 'admin', hours_after: 9,
        body: 'Polling the caption container every 500ms and de-duping on text content works for the recorder pattern. The Meet API doesn\'t expose live captions, so DOM scrape is the only path. The de-dupe is critical — Meet rewrites the caption text frequently as the model corrects itself.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'bug',
    author: 'mhalvor', days_ago: 17, views: 24, reactions: 1,
    title: 'Teams — automated breakout room creation drops the first room',
    body:
`Recording creates 4 breakout rooms in MS Teams. On replay only 3 of them appear; the first creation always silently no-ops.

Suspect Teams\' first-room-shortcut is firing differently than the subsequent ones.`,
    tags: ['bug', 'teams'],
    comments: [
      { author: 'admin', hours_after: 14,
        body: 'Teams\' UI for the first breakout uses a slightly different click target than rooms 2+. The recorder matches the "create another" button by aria-label, which doesn\'t exist on the initial create. Use a dummy first-click step that\'s allowed to fail (continueOnFailure), then the rest run cleanly.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'feature',
    author: 'nbrumm', days_ago: 19, views: 41, reactions: 4,
    title: 'Cisco Webex recording download as a one-step pull',
    body:
`Webex stores recordings in a strange "tap to download, wait 30s for processing, click again" flow. Currently a 4-step recording that breaks twice a quarter when Cisco moves a button.

A native Webex step that takes a meeting ID and returns the recording file would survive their UI churn.`,
    tags: ['feature', 'webex', 'recordings'],
    comments: [
      { author: 'admin', hours_after: 16,
        body: 'Webex\'s API has recording download as a first-class endpoint. Native step is feasible; queueing alongside Zoom/Meet/Teams as the "meeting hooks" set. Order of priority within that set will be driven by request volume.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'ofarah', days_ago: 21, views: 28, reactions: 2,
    title: 'Loom — upload + share in a single workflow',
    body:
`Recording an internal Loom and immediately sharing with a specific team. Loom\'s post-record flow has the share dialog inside an overlay that\'s sometimes there and sometimes hidden behind the editor.

Anyone got a reliable pattern? Tempted to skip Loom\'s web entirely and use their upload API.`,
    tags: ['loom', 'upload'],
    comments: [
      { author: 'admin', hours_after: 7,
        body: 'Loom\'s upload API is much cleaner than the web flow for this case. The web overlay you\'re hitting is conditional on whether you\'re mid-edit; not worth wrestling with when the API is a 1-call upload + share. Recommend API.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'prustad', days_ago: 23, views: 45, reactions: 3,
    title: 'Auth0 Universal Login — which variant does the recorder land on?',
    body:
`Auth0 has at least three Universal Login layouts depending on tenant settings (Classic, New, Custom). Our workflow records against one tenant\'s "New" layout and breaks on another tenant\'s "Classic".

Is there a recording mode that abstracts this, or is per-tenant a workflow boundary we should accept?`,
    tags: ['auth0', 'sso'],
    comments: [
      { author: 'admin', hours_after: 10,
        body: 'Per-tenant is a real boundary because the Auth0 layouts have different DOMs entirely. Two practical paths: (1) split the workflow at the auth step — separate "log in to tenant A" / "log in to tenant B" sub-flows, dispatcher picks one; (2) drive Auth0 via its API + a session-cookie injection step, bypassing the login UI entirely. (2) is cleaner if you can manage the M2M credentials.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'qhuang', days_ago: 25, views: 32, reactions: 2,
    title: 'AWS Cognito hosted UI redirect — workflow doesn\'t follow the bounce',
    body:
`Login → Cognito hosted UI → back to our app. The recorder picks up the initial click but stops following at the Cognito domain. After login Cognito redirects via 302 and the recording resumes at "page didn\'t change" error.

Tried followCrossOriginNav: true. No effect.`,
    tags: ['cognito', 'sso', 'redirect'],
    comments: [
      { author: 'admin', hours_after: 8,
        body: 'followCrossOriginNav covers single hops; Cognito chains 2-3 redirects. Use `waitForUrl\` with a glob matching your final app URL — the workflow waits through the redirect chain regardless of intermediate hops. Documented under "auth flows / SSO redirects".' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'bug',
    author: 'rivanov', days_ago: 27, views: 19, reactions: 1,
    title: 'Keycloak federated identity flow — second factor button never registers',
    body:
`Keycloak with WebAuthn second factor. Recorder captures the click on the second-factor button; on replay the click happens but the WebAuthn prompt never appears. Suspect the click event reaches the button before Keycloak\'s init script has bound its handler.`,
    tags: ['bug', 'keycloak', 'webauthn'],
    comments: [
      { author: 'admin', hours_after: 12,
        body: 'Keycloak\'s init delay is non-trivial — WebAuthn handlers bind 200-500ms after page interactive. waitForSelector on the button\'s `data-init="true"` (Keycloak sets this when handlers are attached) before clicking will resolve the race. A bare waitForSelector by id fires too early.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'shaque', days_ago: 30, views: 26, reactions: 1,
    title: 'Magic-link auth flow — clicking the email link from inside the workflow',
    body:
`Internal tool uses magic-link login. Workflow needs to: request a link, wait for the email, click the link, continue.

Right now I have a Gmail web recording that opens the inbox and clicks. Works but adds 3 fragile steps. Anyone using a more direct path — maybe an IMAP poll step?`,
    tags: ['magic-link', 'email-auth'],
    comments: [
      { author: 'tkonig', hours_after: 11,
        body: 'IMAP poll via a small exec step is what we do — `imap.search({subject: "Sign in to X"})\` and pull the link from the body, then a Flyto2 nav step with the extracted URL. Three lines of helper code; way more reliable than the Gmail UI.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'discussion',
    author: 'tboone', days_ago: 33, views: 137, reactions: 16,
    title: 'EC2 t3.medium is the wrong runner instance — here\'s the math',
    body:
`We ran our headless workflows on a t3.medium for two months and the throttling cost us more than the savings.

Numbers from last month:
- t3.medium baseline: 20% CPU. Chromium headless idles at ~15%. Margin: thin.
- During workflow runs CPU pegged at 100%. After ~6 minutes of cumulative high CPU per hour, t3 burst credits drained. Workflows started taking 4x longer.
- Moved to c5.large (no burst, fixed perf). Workflow times stabilized. Bill went up $12/month. Workflow value: ~$500/month in saved engineer time.

Don\'t use burst-class instances for headless browsers. The "small workflow" intuition is misleading because Chromium is consistently CPU-heavy.`,
    tags: ['discussion', 'aws', 'infrastructure'],
    comments: [
      { author: 'admin', hours_after: 5,
        body: 'Worth surfacing in the deployment docs. We\'d had hand-wavy guidance about "any modest instance" — your concrete numbers are more actionable.' },
      { author: 'evgenia', hours_after: 14,
        body: 'Same lesson on GCP. e2-small is too small. e2-standard-2 is the cheapest that doesn\'t kneecap headless Chromium.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'bug',
    author: 'uakin', days_ago: 35, views: 49, reactions: 5,
    title: 'Long-running recorder session leaks memory until OS kills it',
    body:
`Keep the recorder open for ~2 hours while iterating on a recording. Resident memory climbs steadily from 800MB at start to 4.5GB at the 2-hour mark, then macOS terminates it for runaway memory.

Workaround: close and reopen the recorder every 90 minutes. Annoying but works.`,
    tags: ['bug', 'memory', 'recorder'],
    comments: [
      { author: 'admin', hours_after: 9,
        body: 'Known regression in 2.4.0 — DOM snapshot cache wasn\'t evicting old entries. Fixed in 2.4.1. If you\'re already on 2.4.1+, the next likely culprit is a captured iframe staying live in memory; check whether the workflow visits iframes that don\'t unload.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'feature',
    author: 'vmadsen', days_ago: 38, views: 53, reactions: 7,
    title: 'Datadog dashboard screenshot upload as a workflow output',
    body:
`Every Monday I need a screenshot of our Datadog SLO dashboard for the weekly review deck. Currently a 4-step recording that occasionally trips on Datadog\'s lazy chart rendering.

A "fetch Datadog dashboard as PNG" step (probably via their API) would be a clean one-call replacement.`,
    tags: ['feature', 'datadog', 'screenshot'],
    comments: [
      { author: 'admin', hours_after: 11,
        body: 'Datadog has a screenshot API for dashboards — wrapping it as a step is straightforward. Adding to the observability-integrations cluster alongside Grafana and PagerDuty. Order will follow request volume.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'bug',
    author: 'cdvorak', days_ago: 40, views: 22, reactions: 1,
    title: 'Grafana alert auto-snooze — second snooze in the chain fails',
    body:
`Workflow snoozes a list of alerts. The first snooze always works; the second one fails ~30% of the time with Grafana\'s "alert state in transition" error.

Suspect we\'re hitting Grafana faster than its alert state machine settles.`,
    tags: ['bug', 'grafana'],
    comments: [
      { author: 'admin', hours_after: 7,
        body: 'Grafana 10+ debounces alert state transitions over ~2s. Add a wait between snoozes targeting the alert\'s state badge transitioning back to "active" before triggering the next snooze. Polling pattern, not fixed sleep.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'aweiss', days_ago: 42, views: 34, reactions: 2,
    title: 'PagerDuty incident close — Flyto2 vs API for a daily cleanup job',
    body:
`Daily cleanup: close out PagerDuty incidents that have been "resolved" for >24h. ~30 incidents per day. PagerDuty has an API; we have a workflow that does the same via the web UI.

For a daily 30-call job, is the recorder ever the right call, or is API the obvious answer?`,
    tags: ['pagerduty', 'api-vs-recorder'],
    comments: [
      { author: 'admin', hours_after: 5,
        body: 'API. Even for 30 calls a day, the recorder has UI-update risk you don\'t want for a critical cleanup job. PagerDuty\'s incident endpoints are stable. Use the recorder when you need PagerDuty\'s UI semantics (like a specific dashboard view) — not for state transitions.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'bug',
    author: 'fnguyen', days_ago: 45, views: 18, reactions: 1,
    title: 'Cmd+K firing on macOS opens Spotlight instead of the page command palette',
    body:
`On macOS, Cmd+K is bound to a page-internal command palette in our app. The recorder captures the keystroke but on replay the macOS Spotlight overlay opens instead — Spotlight wins the keychord race.

Recording works fine in headed Chromium when the workflow drives it on a Linux runner.`,
    tags: ['bug', 'macos', 'keychord'],
    comments: [
      { author: 'admin', hours_after: 9,
        body: 'macOS Spotlight\'s system-level shortcut wins over Chromium when the runner is in the foreground. Workaround: run headless on macOS too — Chromium headless is hidden from the system shortcut handler. If you need headed mode, the runner has a `--suppress-system-shortcuts\` flag that releases the binding for the duration of the run.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'bug',
    author: 'hlund', days_ago: 47, views: 24, reactions: 2,
    title: 'Date picker locale defaulting to en-US regardless of browser locale',
    body:
`Workflow types into a date field expecting Norwegian format (dd.mm.yyyy). The site\'s date picker accepts it in the recorder but rejects it on headless replay — the headless browser is en-US locale by default, the field validates accordingly.

Setting locale per-workflow would fix this.`,
    tags: ['bug', 'locale', 'date'],
    comments: [
      { author: 'admin', hours_after: 4,
        body: '`--browser-locale=nb-NO\` on the runner invocation sets it. Defaults to en-US for historical reasons; we\'re looking at inheriting from the host OS in 2.5.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'bug',
    author: 'ipatel', days_ago: 49, views: 38, reactions: 3,
    title: 'Clipboard read permission prompt re-fires on every workflow run',
    body:
`Workflow needs to read from the clipboard. Each run shows the "allow clipboard access?" Chrome prompt; the workflow times out because no one is there to click "Allow".

Set \`--auto-grant-permissions=clipboard-read\` but the prompt still appears.`,
    tags: ['bug', 'permissions', 'clipboard'],
    comments: [
      { author: 'admin', hours_after: 7,
        body: 'The flag works but the persistent profile dir needs to be set too — the grant is remembered in profile storage, not session state. `--persist-profile=clipboard-flow --auto-grant-permissions=clipboard-read\` together survives across runs.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'feature',
    author: 'jthorpe', days_ago: 51, views: 67, reactions: 9,
    title: 'Visual diff between two workflow runs',
    body:
`When a workflow starts failing intermittently I want to see "what changed visually between the last good run and the first bad run". A side-by-side screenshot diff at each step would make root cause obvious.

Especially useful for the "third-party site shipped a UI change" failure mode where the diff would show the actual change immediately.`,
    tags: ['feature', 'observability', 'diff'],
    comments: [
      { author: 'admin', hours_after: 8,
        body: 'On the list. The "automated regression detection" use case is the main driver. Sketching the screenshot-store + diff-render as a separate service so we don\'t bloat run artifacts. No firm date yet.' },
      { author: 'rwhite', hours_after: 15,
        body: 'Would be the single most useful debug feature for our team. Currently we eyeball screenshots manually in the artifact directory.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'feature',
    author: 'kbergen', days_ago: 54, views: 44, reactions: 5,
    title: '"Screenshot if assertion fails" as a built-in step option',
    body:
`Today I add a manual screenshot step before every assert. If the assert passes, that screenshot is noise; if it fails, it\'s essential. A built-in "snap on failure" flag on the assert step would clean this up.`,
    tags: ['feature', 'assert', 'screenshot'],
    comments: [
      { author: 'admin', hours_after: 6,
        body: 'Reasonable and small. Adding to 2.5. Probably surfaces as `assert: {selector, onFailure: ["screenshot", "log-dom"]}` — composable failure side-effects.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'feature',
    author: 'lschmidt', days_ago: 56, views: 38, reactions: 4,
    title: 'Workflow input validation schema',
    body:
`Workflows take inputs (env vars, params). Currently invalid inputs surface as cryptic step failures mid-run. A schema-level "this workflow requires X, Y, Z" check that fails fast before the browser even launches would prevent a class of "what changed?" debugging.`,
    tags: ['feature', 'validation', 'schema'],
    comments: [
      { author: 'admin', hours_after: 12,
        body: 'Yes — a workflow-level `inputs\` block with type + required + default is in the 2.5 draft. Pre-run validation comes free once that\'s declared.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'discussion',
    author: 'kdiallo', days_ago: 59, views: 124, reactions: 15,
    title: 'Running Flyto2 inside Docker — gotchas after 3 months',
    body:
`We containerized our headless runs. Gotchas in order of pain:

1. **Shared memory**. Default Docker has 64MB /dev/shm; Chromium needs ~2GB for non-trivial pages. Mount /dev/shm with --shm-size=2g or Chromium tabs crash mysteriously.

2. **Locale**. Base node image has en-US only. Workflows that type non-ASCII fail silently. Install locales-all or set LANG/LC_ALL explicitly.

3. **Fonts**. Headless Chromium uses Liberation by default. PDFs and screenshots looked weird until we mounted host fonts. Install fonts-noto and fonts-cjk-* if you screenshot international content.

4. **Crash dumps**. /tmp fills with Chromium crash dumps over time. Mount /tmp as a tmpfs or add a periodic cleaner.

Once those four are dialed in, container-based runs have been more stable than our previous bare-metal setup.`,
    tags: ['discussion', 'docker', 'deployment'],
    comments: [
      { author: 'admin', hours_after: 6,
        body: 'Should be in the canonical Docker docs. Will lift this directly (with attribution if OK). The shm-size point alone has bitten enough teams that surfacing it earlier saves real time.' },
      { author: 'kdiallo', hours_after: 9,
        body: 'Lift away.' },
      { author: 'tkonig', hours_after: 14,
        body: 'Adding to the list: `--no-sandbox\` is sometimes necessary in containers but disables a Chromium safety layer. If you can run with a non-root user inside the container, do that instead of dropping the sandbox.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'discussion',
    author: 'rwhite', days_ago: 62, views: 96, reactions: 12,
    title: 'How our small RPA team names workflows after a year',
    body:
`A year of naming churn distilled into our current convention:

\`{system}/{cadence}-{action}.flyto\`

Examples:
- \`hubspot/weekly-mrr-export.flyto\`
- \`zendesk/hourly-priority-triage.flyto\`
- \`internal/monthly-vendor-list.flyto\`

Cadence in the filename surfaces "what runs how often" without opening the file. The single biggest readability win — when something breaks at 9am we can grep for "morning" patterns immediately.

Earlier conventions we discarded: numbered prefixes (lost ordering when count changed), date-stamped (rotted constantly), by-owner (people leave).`,
    tags: ['discussion', 'naming', 'convention'],
    comments: [
      { author: 'admin', hours_after: 8,
        body: 'The cadence-in-name idea is good. Will add to the conventions doc as a recommended pattern. Worth noting it also helps log filtering downstream.' },
      { author: 'aweiss', hours_after: 13,
        body: 'Adopting this. Our \`{system}-{action}\` was leaving us guessing at cadence in the docs.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'discussion',
    author: 'evgenia', days_ago: 65, views: 108, reactions: 14,
    title: 'Observability for headless Flyto2 runs — what we ship',
    body:
`Three things we wired up that turned headless runs from "black box" to "tractable":

1. **Per-step duration histogram → Datadog**. Every step emits a metric. Anomaly detection catches "this step usually takes 2s now takes 18s" before the whole flow times out.

2. **DOM snapshot on failure → S3**. The runner\'s \`--snapshot-on-error\` writes HTML + screenshot. We then have a "show me the error from yesterday\'s 3am run" UX without re-running.

3. **Slack on first failure of the day, not every failure**. Dedupe by workflow ID + 24h window. Flake-driven alert noise stops being a problem.

Setup time was about a day. Cost is negligible. Worth it.`,
    tags: ['discussion', 'observability'],
    comments: [
      { author: 'admin', hours_after: 9,
        body: 'The "first failure of the day" pattern is the right shape — most teams either alert on every failure (noisy) or build big incident logic (overkill). Saving this thread for the observability docs.' },
      { author: 'mvelasco', hours_after: 16,
        body: 'Stealing the per-step histogram. We log run-level totals but step-level would have caught two regressions earlier last quarter.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'noh', days_ago: 68, views: 31, reactions: 2,
    title: 'Running 5 workflows in parallel — safe defaults?',
    body:
`Want to fan out 5 workflows from a single dispatch. Each independent, no shared state. Concerns:
- Chromium instances stepping on each other for /dev/shm
- Default profile dir being shared
- CPU thrash on a 4-vCPU host

Anyone running parallel at small scale, what defaults did you settle on?`,
    tags: ['parallel', 'scaling'],
    comments: [
      { author: 'tkonig', hours_after: 7,
        body: '5 parallel on 4 vCPU is too tight — Chromium needs at minimum 1 vCPU per instance for headless work. We run 3 parallel on a 4-vCPU box without throttling. For 5 in parallel, scale up or out.' },
      { author: 'admin', hours_after: 9,
        body: 'Per-workflow profile dir is essential. `--profile-dir-per-run\` flips this on. The other two (shm and CPU) are infra concerns once that\'s handled.' },
    ],
  },
  {
    product: 'cloud', lang: 'en', category: 'question',
    author: 'oblake', days_ago: 71, views: 26, reactions: 2,
    title: 'Recording the mobile-web variant of a site',
    body:
`Our site has distinct mobile-web layout that some workflows need to exercise. Today I emulate mobile in Chrome devtools manually, but the recorder always records in desktop layout.

Is there a recorder option to set viewport / user-agent that changes which layout the site serves?`,
    tags: ['mobile-web', 'recorder', 'viewport'],
    comments: [
      { author: 'admin', hours_after: 6,
        body: 'Yes — `flyto record --emulate=iPhone15` (or `--viewport=375x812 --user-agent="...mobile..."`) sets it for the session. The recording carries the emulation metadata so replays use the same viewport. Mobile emulation docs are here: docs/recorder/emulation.' },
    ],
  },
];

// ----------------------------------------------------------------
// EN × code
// ----------------------------------------------------------------

const EN_CODE = [
  {
    product: 'code', lang: 'en', category: 'question',
    author: 'evgenia', days_ago: 3, views: 84, reactions: 9,
    title: 'Does taint analysis follow await chains in TypeScript?',
    body:
`We pass a tainted request body through three awaited helpers before it lands at a DB query. The audit doesn\'t flag the final query. Is the analyzer dropping taint at the await boundary, or am I missing a source declaration on the request wrapper?`,
    tags: ['taint', 'typescript', 'async'],
    comments: [
      { author: 'admin', hours_after: 4,
        body: 'await chains are followed — taint survives Promise resolution. More likely the wrapper isn\'t registered as a source. `flyto-index taint --debug <symbol>\` prints the source resolution path; if your wrapper doesn\'t show up there, add it to `.flyto-rules.yaml\` under taint.sources.' },
      { author: 'evgenia', hours_after: 7,
        body: 'Yep — the wrapper was the issue. Added it as a source, finding shows up. Thanks.' },
    ],
  },
  {
    product: 'code', lang: 'en', category: 'question',
    author: 'tboone', days_ago: 6, views: 51, reactions: 4,
    title: 'audit complexity threshold — why is Vue 100 and Python 80?',
    body:
`Saw the file-type-aware thresholds in the docs (.vue/.tsx/.jsx = 100, others = 80). Curious about the rationale — is it because template-heavy files inflate naturally, or is there a different reason?`,
    tags: ['audit', 'complexity'],
    comments: [
      { author: 'admin', hours_after: 6,
        body: 'Template-heavy. Vue SFC and JSX files include both logic and rendering branches in the same file, which inflates the branch count without the file being actually harder to reason about. The threshold compensates so the audit doesn\'t flag every component as complex. Pure-Python at 80 reflects what our internal calibration found as the inflection where review time spikes.' },
    ],
  },
  {
    product: 'code', lang: 'en', category: 'question',
    author: 'jhammond', days_ago: 9, views: 38, reactions: 3,
    title: 'Custom rule regex — does grep_deny anchor to lines or full files?',
    body:
`Writing a rule to forbid \`console.log\` in production source. Does the grep_deny pattern match per-line or against the file as a whole? Wondering whether I need to anchor with \`^\` or trust the engine to handle line breaks.`,
    tags: ['rules', 'regex'],
    comments: [
      { author: 'admin', hours_after: 4,
        body: 'Per-line. Patterns match line-by-line and report the matching line numbers. No need to anchor unless you specifically want start-of-line semantics. Multi-line patterns require the `multiline: true\` option which we mostly discourage — single-line patterns produce better error messages.' },
    ],
  },
  {
    product: 'code', lang: 'en', category: 'question',
    author: 'brye', days_ago: 12, views: 33, reactions: 2,
    title: 'LSP fallback path when pyright isn\'t installed',
    body:
`Running flyto-indexer in a CI container without pyright. Does the analyzer degrade gracefully or fail outright? Want to know whether to install pyright in the image or accept reduced accuracy.`,
    tags: ['lsp', 'pyright', 'ci'],
    comments: [
      { author: 'admin', hours_after: 5,
        body: 'Graceful — type-aware references fall back to symbol-name matching, which has more false-positive references but never errors out. CI runs without pyright work fine; the audit accuracy delta is small for most projects. Install pyright if you have it in your dev environment to keep CI mirroring local behavior.' },
    ],
  },
  {
    product: 'code', lang: 'en', category: 'question',
    author: 'rwhite', days_ago: 15, views: 41, reactions: 3,
    title: 'search semantics — exact vs fuzzy',
    body:
`When I \`flyto-index search "validateUser"\` does it require an exact identifier match, or fuzzy like fzf? Trying to figure out if I should reach for the regex flag for "anything containing this substring".`,
    tags: ['search'],
    comments: [
      { author: 'admin', hours_after: 6,
        body: 'Defaults to exact-on-symbol-name with case sensitivity. Use `--regex\` for substring matching. There\'s also `--fuzzy\` for fzf-style ranking but it\'s slower on large codebases. For most "find this thing" lookups, exact is what you want.' },
    ],
  },
  {
    product: 'code', lang: 'en', category: 'question',
    author: 'uakin', days_ago: 17, views: 29, reactions: 2,
    title: 'impact analysis — how deep does the transitive call graph go?',
    body:
`Running \`flyto-index impact --target validateUser\`. Output lists 47 call sites. Is that the immediate callers only, or does it include callers-of-callers all the way up?`,
    tags: ['impact'],
    comments: [
      { author: 'admin', hours_after: 5,
        body: 'By default it goes 3 levels deep with diminishing reachability scores. Pass `--depth N\` to override. Past depth 5 the signal/noise gets bad for most codebases — too many things are technically reachable. The default 3 surfaces the changes that matter.' },
    ],
  },
  {
    product: 'code', lang: 'en', category: 'question',
    author: 'shaque', days_ago: 20, views: 36, reactions: 3,
    title: 'Reachability — what registers as a sink?',
    body:
`Looking at the taint output and trying to understand which calls the analyzer considers sinks. SQL execute is obvious. Is \`console.log\` a sink? \`res.send\`? Custom request loggers?`,
    tags: ['taint', 'sinks'],
    comments: [
      { author: 'admin', hours_after: 7,
        body: 'Built-in sinks: SQL execute (sequelize, knex, pg, mysql), HTML response (`res.send`, `res.write\`, template-rendering with unescaped), child process exec, eval, dynamic require. console.log is NOT a sink — too noisy to flag. Custom loggers/sinks: declare under `taint.sinks\` in `.flyto-rules.yaml\`.' },
    ],
  },
  {
    product: 'code', lang: 'en', category: 'question',
    author: 'kdiallo', days_ago: 23, views: 47, reactions: 4,
    title: 'Monorepo with Go + TypeScript + Python — what\'s the indexing pattern?',
    body:
`We have a single repo with a Go backend, TypeScript frontend, and a small Python service. Does \`flyto-index scan .\` handle all three simultaneously, or should I run three separate indexes scoped per language?`,
    tags: ['monorepo', 'languages'],
    comments: [
      { author: 'admin', hours_after: 6,
        body: 'Single `flyto-index scan .\` handles them all — the indexer detects language per file and applies the right analyzer. Cross-language references (e.g. TypeScript fetch calling a Go endpoint via shared OpenAPI) aren\'t followed yet but each tree is correctly indexed in isolation. For memory: `--scope-by-package\` chunks the work if you hit limits.' },
    ],
  },
  {
    product: 'code', lang: 'en', category: 'question',
    author: 'vchen', days_ago: 26, views: 32, reactions: 2,
    title: 'Inline suppression pragma — what\'s the syntax?',
    body:
`We have one specific call site that\'s a false positive for a SQL-injection finding. The fix would be intrusive. Is there an inline comment pragma to suppress just that one finding?`,
    tags: ['suppression', 'pragma'],
    comments: [
      { author: 'admin', hours_after: 4,
        body: '`// flyto-ignore: <rule-id>\` on the line above. Optional `<rule-id>\` to suppress only that rule; bare `// flyto-ignore\` suppresses everything on the next line (we recommend the specific form so you don\'t silently swallow new findings). Also works with `# flyto-ignore\` for Python and `<!-- flyto-ignore -->\` for templates.' },
    ],
  },
  {
    product: 'code', lang: 'en', category: 'question',
    author: 'kbergen', days_ago: 29, views: 28, reactions: 2,
    title: 'Excluding `__tests__/` from complexity scoring',
    body:
`Our test files have intentionally high branch counts (parametric assertions). They\'re inflating the audit\'s complexity finding list. I see the docs mention test files are excluded — but our naming convention is \`__tests__/X.test.ts\`, not \`_test.X\` or \`.spec.X\`. Does it still detect us?`,
    tags: ['audit', 'complexity', 'tests'],
    comments: [
      { author: 'admin', hours_after: 5,
        body: 'The built-in heuristic recognizes `__tests__/`, `*.test.*`, `*.spec.*\`, and `tests/`. Your convention matches the first. If you want to add custom test-file globs, `audit.test_file_globs\` in `.flyto-rules.yaml\` accepts overrides.' },
    ],
  },
  {
    product: 'code', lang: 'en', category: 'question',
    author: 'sgupta', days_ago: 32, views: 39, reactions: 3,
    title: 'Writing a sanitizer-aware rule for our custom escapeHtml()',
    body:
`We have an in-house \`safe.escapeHtml()\` that we want the taint analyzer to recognize as a sanitizer. Output should be clean tainted-data when it passes through. Where do I declare this?`,
    tags: ['taint', 'sanitizer', 'rules'],
    comments: [
      { author: 'admin', hours_after: 6,
        body: '`taint.sanitizers\` in `.flyto-rules.yaml\`. Each entry is `{symbol, output_pattern}` — symbol is the fully-qualified name (`safe.escapeHtml`), output_pattern controls which output positions are considered cleansed (`return`, `args[0]\`, etc). Default is `return\` for most cases.' },
    ],
  },
  {
    product: 'code', lang: 'en', category: 'question',
    author: 'mvelasco', days_ago: 35, views: 64, reactions: 7,
    title: 'flyto-code vs Semgrep — when do you reach for which?',
    body:
`Our team has used Semgrep for a year and we\'re evaluating flyto-code. Curious how others draw the line in their head — what does flyto-code do better, what does Semgrep do better?`,
    tags: ['comparison', 'semgrep'],
    comments: [
      { author: 'admin', hours_after: 9,
        body: 'Honest answer: Semgrep is excellent at "find this specific pattern" rules with its DSL. flyto-code is stronger on cross-function flow analysis (taint), the audit/impact reasoning, and the agent-friendly tool surface. We use both in our own dogfooding — Semgrep for pattern-specific custom rules, flyto-code for the broader codebase-aware analysis. They\'re complementary more than they\'re competitive.' },
      { author: 'rwhite', hours_after: 14,
        body: 'Confirming this pattern. We keep Semgrep rules for our team-specific anti-patterns, use flyto-code for the cross-cutting analyses. Different jobs.' },
    ],
  },
  {
    product: 'code', lang: 'en', category: 'question',
    author: 'klovric', days_ago: 38, views: 21, reactions: 1,
    title: 'flyto-index scan — verbose mode for debugging slow runs?',
    body:
`Our scan takes 14 minutes and I\'d like to see where the time is going. Is there a verbose flag that prints per-file or per-stage timing?`,
    tags: ['performance', 'verbose'],
    comments: [
      { author: 'admin', hours_after: 5,
        body: '`flyto-index scan --profile\` writes a timing breakdown to `.flyto-index/profile.json\`. Per-file timing is on by default in `--profile\`. Most slow scans are dominated by either the AST parse stage (large files) or the LSP roundtrip (lots of cross-references); the profile makes which one obvious.' },
    ],
  },
  {
    product: 'code', lang: 'en', category: 'question',
    author: 'hlaurent', days_ago: 41, views: 26, reactions: 2,
    title: 'Excluding `vendor/` and `node_modules/` from indexing',
    body:
`Our Go project has a \`vendor/\` dir with ~80MB of dependency code. Indexing it adds 6 minutes to scan time and the audit findings inside it are not actionable for us.

Is there a default exclude list, or do I add it manually?`,
    tags: ['exclude', 'vendor'],
    comments: [
      { author: 'admin', hours_after: 4,
        body: '`node_modules/`, `vendor/`, `.venv/`, `target/`, `dist/`, `build/`, `__pycache__/` are excluded by default. If you\'re seeing them indexed, check `.flyto-rules.yaml\` for an explicit `include\` that\'s overriding — explicit include wins over default exclude. Otherwise should be skipped automatically.' },
    ],
  },
  {
    product: 'code', lang: 'en', category: 'bug',
    author: 'rivanov', days_ago: 5, views: 67, reactions: 5,
    title: 'Indexer crashes on Vue SFC with `<script setup lang="ts">`',
    body:
`Specifically on files that use both \`<script setup>\` and \`<script>\` (the dual-block pattern for Composition API + Options API mix). The indexer reports a parse error and skips the file silently.

Repro: any .vue file with two script blocks. v2.7.2.`,
    tags: ['bug', 'vue', 'parser'],
    comments: [
      { author: 'admin', hours_after: 6,
        body: 'Confirmed. Our Vue SFC parser handles single `<script setup>\` and single `<script>\` but not the dual-block pattern. Fix is small — extending the block iteration — landing in v2.7.4 this week. Workaround: temporarily merge to single `<script setup>\` if you can, otherwise the file will skip without failing the run.' },
      { author: 'rivanov', hours_after: 9,
        body: 'Confirmed skip is silent in v2.7.2 — that\'s the bigger issue for me, I assumed those files were getting analyzed. Will watch for the fix.' },
    ],
  },
  {
    product: 'code', lang: 'en', category: 'bug',
    author: 'aweiss', days_ago: 11, views: 38, reactions: 3,
    title: 'Watcher mode memory climbs over multi-day runs',
    body:
`Started \`flyto-index watch\` Monday morning. By Friday morning resident memory is at 8GB on a project that initial-indexes at 1.2GB. Restart cycle drops it back to baseline.`,
    tags: ['bug', 'memory', 'watcher'],
    comments: [
      { author: 'admin', hours_after: 7,
        body: 'Known — the reverse-index doesn\'t fully evict references when files change. Tightened in v2.7.4 (LRU on the reference cache). Workaround: `--restart-interval 24h\` recycles the watcher daily without you noticing.' },
    ],
  },
  {
    product: 'code', lang: 'en', category: 'bug',
    author: 'hlund', days_ago: 17, views: 31, reactions: 2,
    title: 'SARIF output missing `level\` field for medium-severity findings',
    body:
`Exported a scan to SARIF for GitHub Code Scanning. GitHub rejects medium-severity findings because their SARIF entries don\'t have the \`level\` field set. High and low both come out fine.`,
    tags: ['bug', 'sarif', 'github'],
    comments: [
      { author: 'admin', hours_after: 5,
        body: 'Confirmed — the SARIF emitter has medium mapped to a deprecated property name. Fixed in v2.7.4. The mapping is medium → "warning" per the GitHub schema; high → "error", low → "note".' },
    ],
  },
  {
    product: 'code', lang: 'en', category: 'bug',
    author: 'gnaidu', days_ago: 22, views: 24, reactions: 1,
    title: 'False positive: tagged template literal flagged as SQL injection',
    body:
`We use a sql-tagged template that handles parameterization correctly internally (looks like sql\`SELECT ... \${x}\`). The audit flags it as SQL injection because it sees user-provided x flowing into a SQL-shaped string.`,
    tags: ['bug', 'false-positive', 'sql'],
    comments: [
      { author: 'admin', hours_after: 6,
        body: 'Tagged templates with sanitizer-by-construction aren\'t auto-detected. Add your `sql\` tag function to `taint.sanitizers\` and the false positive goes away. Sample config in the docs under "tagged template sanitizers".' },
    ],
  },
  {
    product: 'code', lang: 'en', category: 'bug',
    author: 'mhalvor', days_ago: 28, views: 19, reactions: 1,
    title: 'Rust cross-crate references — only resolving within the current crate',
    body:
`In a Cargo workspace with 5 crates, calling a function defined in crate A from crate B doesn\'t show up in flyto-index references. Within a single crate it works.`,
    tags: ['bug', 'rust', 'cargo-workspace'],
    comments: [
      { author: 'admin', hours_after: 8,
        body: 'rust-analyzer LSP support is single-crate by default in our integration. Set `lsp.rust_analyzer.workspace = true\` in `.flyto-rules.yaml\` to flip on workspace mode. Slower but resolves cross-crate properly.' },
    ],
  },
  {
    product: 'code', lang: 'en', category: 'bug',
    author: 'png', days_ago: 34, views: 22, reactions: 2,
    title: '`.ts.snap\` snapshot files being indexed as TypeScript',
    body:
`Jest snapshot files end in \`.ts.snap\`. Indexer is picking them up as TypeScript and the parser errors out because they\'re a custom format. Adds noise to the scan output.`,
    tags: ['bug', 'jest', 'snapshots'],
    comments: [
      { author: 'admin', hours_after: 5,
        body: 'Default exclude updated in v2.7.3 to skip `*.snap\`. If you\'re on an older version, add it to your exclude list manually. The file extension heuristic was wrong — we matched on `.ts\` suffix without checking the full `.ts.snap\`.' },
    ],
  },
  {
    product: 'code', lang: 'en', category: 'bug',
    author: 'dkato', days_ago: 39, views: 26, reactions: 2,
    title: 'scan errors out on a single file > 10MB',
    body:
`We have one generated TypeScript file at ~14MB (autogenerated API client). flyto-index errors out with "file too large" and skips the entire scan rather than just that file.`,
    tags: ['bug', 'large-files'],
    comments: [
      { author: 'admin', hours_after: 6,
        body: 'Should skip-and-continue, not bail. Tracking as v2.7.4 bug fix. Workaround: add the generated file to exclude. Generated API clients are usually a good exclude candidate anyway since findings inside them are not actionable.' },
    ],
  },
  {
    product: 'code', lang: 'en', category: 'feature',
    author: 'jhammond', days_ago: 7, views: 58, reactions: 8,
    title: 'Streaming output for large scans',
    body:
`Current \`flyto-index scan\` prints results at end-of-run. For our 600k-line monorepo (14-minute scan) it would be useful to see findings as they\'re discovered rather than wait 14 minutes for the summary.`,
    tags: ['feature', 'streaming'],
    comments: [
      { author: 'admin', hours_after: 8,
        body: '`--stream\` flag in v2.7.4 emits findings as they\'re generated, one JSON per line on stdout. The summary still prints at end. Was on the internal list anyway; you bumped priority.' },
    ],
  },
  {
    product: 'code', lang: 'en', category: 'feature',
    author: 'tkonig', days_ago: 13, views: 52, reactions: 9,
    title: 'Pre-commit hook helper',
    body:
`Would love a one-liner \`flyto-code install-precommit\` that wires up a \`.pre-commit-config.yaml\` (or equivalent) running scan on changed files only. Less infrastructure setup, more "just works" for new repos.`,
    tags: ['feature', 'precommit'],
    comments: [
      { author: 'admin', hours_after: 10,
        body: 'Reasonable. The pre-commit framework support is on the list; we already have the hook entry point (`flyto-code scan --staged`), what\'s missing is the install helper that wires up the framework config. Tracking.' },
    ],
  },
  {
    product: 'code', lang: 'en', category: 'feature',
    author: 'brye', days_ago: 19, views: 41, reactions: 5,
    title: 'JSON Schema for `.flyto-rules.yaml`',
    body:
`Right now I write rules YAML and find out it was malformed when the audit silently ignores them. A JSON Schema published alongside releases would let editors (VSCode, JetBrains) validate the file inline.`,
    tags: ['feature', 'rules', 'schema'],
    comments: [
      { author: 'admin', hours_after: 6,
        body: 'Published in v2.7.4 at `https://flyto2.com/schemas/rules-v1.json\`. VSCode users can wire it via `yaml.schemas\` in settings; JetBrains has its own JSON Schema field per file pattern. The silent-ignore behavior is also being addressed — malformed rules now print a load-time warning.' },
    ],
  },
  {
    product: 'code', lang: 'en', category: 'feature',
    author: 'ipatel', days_ago: 25, views: 47, reactions: 6,
    title: 'Findings dashboard URL inside the PR comment',
    body:
`Today the PR comment lists findings inline. For PRs with 20+ findings it\'s a wall of text. A link to a hosted dashboard with filter/triage UX would make the comment scannable and the deep dive ergonomic.`,
    tags: ['feature', 'pr-comment', 'dashboard'],
    comments: [
      { author: 'admin', hours_after: 11,
        body: 'Hosted findings dashboard is on the roadmap. Until then, the JSON output + `flyto-code report --html\` produces a static HTML triage page you can host wherever you already host build artifacts. Less slick than the planned hosted version but covers the immediate need.' },
    ],
  },
  {
    product: 'code', lang: 'en', category: 'feature',
    author: 'rwhite', days_ago: 31, views: 38, reactions: 4,
    title: 'Auto-detect generated code',
    body:
`We mark generated code with \`// Code generated by ... DO NOT EDIT\` (Go convention) or \`// @generated\` (TS convention). Would be nice if findings in generated files were tagged or excluded by default.`,
    tags: ['feature', 'generated-code'],
    comments: [
      { author: 'admin', hours_after: 7,
        body: 'Heuristic for both header conventions is added in v2.7.4. Generated files get tagged `is_generated: true\` in the finding output, and by default they\'re moved to a separate "generated" section in the audit summary. Hard exclude is configurable in `.flyto-rules.yaml\`.' },
    ],
  },
  {
    product: 'code', lang: 'en', category: 'feature',
    author: 'dmello', days_ago: 37, views: 28, reactions: 3,
    title: 'Configurable indexing cache eviction (long-lived watchers)',
    body:
`The watcher mode\'s reference cache grows unbounded in long sessions. A \`cache.max_mb\` setting would let us cap it to a sensible value for our CI hosts.`,
    tags: ['feature', 'cache', 'watcher'],
    comments: [
      { author: 'admin', hours_after: 9,
        body: 'Coming in v2.7.4 alongside the memory-leak fix. Default cap will be 1GB (configurable). The LRU eviction was already in the planning; surfacing it as a knob is the small additional change.' },
    ],
  },
  {
    product: 'code', lang: 'en', category: 'feature',
    author: 'yokonkwo', days_ago: 44, views: 67, reactions: 11,
    title: '.NET / C# language support',
    body:
`We have a C# Web API service in our org. Would be valuable to have flyto-code support for C# given it\'s a big chunk of the security-scanning market. Curious if it\'s on the roadmap or out-of-scope.`,
    tags: ['feature', 'csharp', 'dotnet'],
    comments: [
      { author: 'admin', hours_after: 13,
        body: 'On the long-term roadmap. The blockers are: (1) good open-source LSP (OmniSharp/Roslyn — feasible), (2) C#-specific taint sources/sinks (different surface from JS/Python). No firm timeline yet — bumped by the number of asks. Track via the GitHub issue if you want notification.' },
    ],
  },
  {
    product: 'code', lang: 'en', category: 'feature',
    author: 'qhuang', days_ago: 49, views: 36, reactions: 4,
    title: 'Slack alert on new high-severity finding (not duplicate)',
    body:
`Would love a built-in "post to Slack when a new HIGH appears that wasn\'t in the previous scan". Dedupe is the important part — alerting on the same finding every run trains the team to ignore.`,
    tags: ['feature', 'slack', 'alerts'],
    comments: [
      { author: 'admin', hours_after: 8,
        body: 'In design alongside the generic webhook out. Dedupe key will be the (file, line, rule_id) tuple so unchanged findings don\'t re-alert. Generic webhook ships first; Slack-specific helper as a thin wrapper around it.' },
    ],
  },
  {
    product: 'code', lang: 'en', category: 'bug',
    author: 'jokafor', days_ago: 14, views: 33, reactions: 3,
    title: '`task(action="plan")\` returns stale step list after `.flyto-rules.yaml\` edit',
    body:
`Edit my rules file. Run \`task plan\` immediately. The plan output still references the old rule set. Re-running the indexer doesn\'t pick it up either — only restart of the MCP server does.`,
    tags: ['bug', 'task', 'rules'],
    comments: [
      { author: 'admin', hours_after: 5,
        body: 'Rules file changes don\'t invalidate the in-memory rule cache. Fix in v2.7.4 watches `.flyto-rules.yaml\` and reloads on change. Workaround: `flyto-index reload-rules` (added in v2.7.3) triggers the reload without restarting the server.' },
    ],
  },
  {
    product: 'code', lang: 'en', category: 'discussion',
    author: 'evgenia', days_ago: 21, views: 187, reactions: 24,
    title: 'Three months of flyto-code in CI — false-positive rate by rule category',
    body:
`Posting a category-level FP breakdown since "8% false positive overall" doesn\'t help when picking which rules to trust.

Numbers from our last 90 days, ~200 PRs:

- Hardcoded secrets:       2% FP rate (mostly test fixtures)
- SQL injection:           14% FP (sanitizer recognition gaps)
- XSS / template injection: 9% FP
- Path traversal:           3% FP
- SSRF:                     6% FP
- Auth bypass:              22% FP (rule is broader than the actual class)
- Crypto misuse:            5% FP

Auth-bypass is by far the noisiest. The rule fires on patterns that often turn out to be legitimate (e.g. explicit \`is_admin\` flags in tests). We\'ve been suppressing aggressively. Other categories are honestly fine to act on.`,
    tags: ['discussion', 'false-positives'],
    comments: [
      { author: 'admin', hours_after: 9,
        body: 'The auth-bypass rule is one we know is broader than ideal — it catches a lot of "checking authorization" patterns that are correct uses. Tightening is on the work list. Your numbers are exactly the kind of feedback that helps us prioritize the rule-by-rule cleanup; sharing if OK.' },
      { author: 'rwhite', hours_after: 14,
        body: 'Mirroring this nearly exactly on our project. The 22% on auth-bypass tracks. Confirms it\'s not just our codebase\'s shape.' },
    ],
  },
  {
    product: 'code', lang: 'en', category: 'discussion',
    author: 'rwhite', days_ago: 27, views: 142, reactions: 18,
    title: 'Migrated from CodeQL to flyto-code — six-week report',
    body:
`Six weeks in. Things that went well:
- Scan time dropped from 18 minutes (CodeQL on GitHub Actions) to 3 minutes (flyto-code self-hosted).
- The audit\'s structural reasoning catches things CodeQL didn\'t — complexity hotspots, dead code, architectural drift. CodeQL is purely security; flyto-code is broader.
- Custom rule writing is faster. Our team got from "we need a rule for X" to "rule shipped" in a day for the average case; CodeQL queries took us 2-3 days for equivalent.

Things that didn\'t:
- We lost the GitHub-native finding deduplication. CodeQL\'s "this finding was already reported in a previous scan" is convenient. flyto-code\'s dedupe is good but lives in a separate dashboard.
- Some specific high-severity CodeQL queries didn\'t have flyto-code equivalents yet. We ported two manually; the rest were edge cases we lived without.

Net positive for us. Wouldn\'t go back.`,
    tags: ['discussion', 'codeql', 'migration'],
    comments: [
      { author: 'admin', hours_after: 7,
        body: 'GitHub-native dedupe is a fair gap — appearing in the GitHub Code Scanning UX requires SARIF, and our dedupe semantics over SARIF are still being tightened. The custom-rule speed claim matches our own dogfooding experience; YAML rules with the audit shape are genuinely faster to write than QL queries. Thanks for the writeup.' },
      { author: 'mvelasco', hours_after: 12,
        body: 'Scan time delta tracks for us too. CodeQL\'s setup cost is real even after you\'ve got it working.' },
    ],
  },
  {
    product: 'code', lang: 'en', category: 'discussion',
    author: 'tboone', days_ago: 33, views: 78, reactions: 10,
    title: 'Tuning complexity thresholds for our codebase style',
    body:
`Default complexity threshold (score >= 5) was too noisy for our codebase — we have a deliberately functional style where most functions are 10-15 lines but they nest a lot.

We tuned by:
- Lowered the nesting weight (default 2.5, we use 1.5)
- Raised the branch weight (default 1.0, we use 1.5)

After the rebalance, audit findings dropped 40% and the remaining findings were almost all genuinely worth refactoring. Took an afternoon of calibration against three "we know this is bad" functions and three "we know this is fine" functions.`,
    tags: ['discussion', 'audit', 'tuning'],
    comments: [
      { author: 'admin', hours_after: 10,
        body: 'Tuning your weights against known-good and known-bad files is the right approach. We default to a balance that works for object-oriented codebases; functional-leaning teams reasonably want different ratios. The weights config is intentionally surface-level so this kind of calibration is easy.' },
    ],
  },
  {
    product: 'code', lang: 'en', category: 'discussion',
    author: 'kdiallo', days_ago: 41, views: 89, reactions: 11,
    title: '`.flyto-rules.yaml\` as the team\'s living architecture doc',
    body:
`Unintended consequence: our \`.flyto-rules.yaml\` has become the canonical place where team conventions get written down.

When someone proposes a code rule in review ("we should never X"), the response is now "open a PR against .flyto-rules.yaml". The rule lands, the audit enforces it, the file documents the convention for future onboardings.

It\'s nicer than the prior pattern of "convention lives in a Notion doc no one reads".`,
    tags: ['discussion', 'rules', 'documentation'],
    comments: [
      { author: 'admin', hours_after: 8,
        body: 'This is the use case we hoped would emerge. The audit-enforces-convention loop is the goal; documentation that ages out is a different problem. Glad it\'s landing.' },
      { author: 'jhammond', hours_after: 13,
        body: 'Adopting this pattern. Our team\'s Notion conventions doc is already half-stale.' },
    ],
  },
  {
    product: 'code', lang: 'en', category: 'discussion',
    author: 'jhammond', days_ago: 47, views: 64, reactions: 7,
    title: 'flyto-indexer alone vs flyto-code — when do you need the full thing?',
    body:
`We started with just flyto-indexer for code intelligence (search, impact). Recently added flyto-code for the security audit layer.

Mental model that helped:
- flyto-indexer = "understand the codebase" (developer ergonomics)
- flyto-code = "judge the codebase" (security + quality opinion)

If you\'re only doing the first thing, you don\'t need the second. We ran on indexer-only for ~4 months before the audit became the bigger value.`,
    tags: ['discussion', 'indexer', 'product'],
    comments: [
      { author: 'admin', hours_after: 6,
        body: 'Clean framing. We position them in roughly that split but it\'s nice to hear the user-facing version. Most teams find the indexer is the daily-driver tool and the code-audit shows up in CI; both surfaces of the same underlying model.' },
    ],
  },
];

// ----------------------------------------------------------------
// Combined export
// ----------------------------------------------------------------

// ----------------------------------------------------------------
// ZH × cloud
// ----------------------------------------------------------------

const ZH_CLOUD = [
  {
    product: 'cloud', lang: 'zh', category: 'question',
    author: 'shulin', days_ago: 3, views: 47, reactions: 3,
    title: 'Notion 中文版面捲動，懶載入有時候抓不到後段資料',
    body:
`團隊在用 Notion 收日報。錄製滑到底再點開卡片這個流程，前 30 筆都好，後面就會點到還沒渲染完的空白卡。

固定 sleep 不太穩，有時候 1.5 秒夠、有時候要 3 秒。請問大家是用 waitForSelector 鎖某個 sentinel 元素嗎？`,
    tags: ['notion', 'scroll', '懶載入'],
    comments: [
      { author: 'admin', hours_after: 6,
        body: 'Notion 滑到底之後可以 waitForSelector 抓「最後一張卡的 data-block-id」，每次滑都會生新的 id，這個 id 出現就代表新一批 hydrate 完成了。比 sleep 穩。中文文件路徑可能慢一點，建議 timeout 拉到 5 秒。' },
      { author: 'ywang', hours_after: 11,
        body: '我們也是這樣處理，後來把 timeout 拉到 8 秒比較保險，週末 Notion 反應特別慢的時候不會炸。' },
    ],
  },
  {
    product: 'cloud', lang: 'zh', category: 'question',
    author: 'xcheng', days_ago: 5, views: 38, reactions: 2,
    title: 'LINE 官方帳號 webhook 想用 Flyto2 模擬測試訊息',
    body:
`想自動化送一批測試訊息到 LINE 官方帳號然後檢查 webhook 是否正確接收。LINE 後台的「測試訊息」按鈕在 Flyto2 錄製時抓得到，但 send 後沒有狀態 callback，很難判斷成功。`,
    tags: ['line', 'webhook'],
    comments: [
      { author: 'admin', hours_after: 8,
        body: 'LINE 後台不提供發送 callback，建議用 Flyto2 點完送出 + waitForRequest 攔 LINE 自己的 /api/send-test API response，response status 200 就算發送成功。這個 pattern 在大多數 SaaS 後台都通用。' },
    ],
  },
  {
    product: 'cloud', lang: 'zh', category: 'bug',
    author: 'qhuang', days_ago: 7, views: 29, reactions: 2,
    title: '繁中表單送出之後 redirect 卡在 about:blank',
    body:
`是公司內部報修系統，按了「送出」之後正常會跳轉到「處理中」頁面。最近 1.5 個月開始錄製重播會卡在 about:blank。

頁面標題、URL 都是英文，但表單欄位是繁中 placeholder。`,
    tags: ['bug', 'redirect'],
    comments: [
      { author: 'admin', hours_after: 4,
        body: '聽起來是 form 用了 POST + 302 redirect 的舊式 pattern，新版 Chromium headless 對這條 chain 有 bug。可以試 `--follow-cross-origin-nav` 或者在送出後加 `waitForUrl` 指到「處理中」頁面的 URL pattern。' },
      { author: 'qhuang', hours_after: 9,
        body: 'waitForUrl 解決了。感謝。' },
    ],
  },
  {
    product: 'cloud', lang: 'zh', category: 'feature',
    author: 'ywang', days_ago: 9, views: 52, reactions: 7,
    title: '希望可以原生支援 LINE Bot 推送步驟',
    body:
`目前要把工作流結果推到 LINE，要走 webhook + 自己拼 payload，新人接手很容易踩到。內建一個「推送到 LINE Bot」步驟（給 access token + channel + message）會大幅降低門檻。`,
    tags: ['line', 'integration'],
    comments: [
      { author: 'admin', hours_after: 10,
        body: 'LINE Messaging API 是穩定的，包裝成步驟可行。整合清單裡會跟 Slack / Teams / Discord 一起評估排序，亞太區用戶要 LINE 是經常被提到的需求。' },
      { author: 'shulin', days_after: 1,
        body: '+1，台灣大部分客戶都是 LINE 不是 Slack。' },
    ],
  },
  {
    product: 'cloud', lang: 'zh', category: 'question',
    author: 'shulin', days_ago: 11, views: 34, reactions: 3,
    title: '鼎新 / 正航 這類舊式 ERP 怎麼錄製？',
    body:
`公司用鼎新 Workflow ERP（IE 內嵌的 ActiveX 元件）。Flyto2 是基於 Chromium 的，這種 ActiveX 介面根本進不去。

想知道大家在處理這類舊式企業內部系統時是怎麼做？是有 Web 版本就用 Web，沒有就放棄？`,
    tags: ['erp', '舊系統'],
    comments: [
      { author: 'admin', hours_after: 7,
        body: 'ActiveX / IE 嵌入式應用 Flyto2 沒有覆蓋，這是瀏覽器自動化工具的共同限制。鼎新近兩年有推 Web 版本（鼎新 Workflow Web），如果你們版本支援可以走 Web 版。否則這類舊系統建議走 UI 級別之外的 path —— RDP + 螢幕讀取或者 vendor 提供的 API。' },
    ],
  },
  {
    product: 'cloud', lang: 'zh', category: 'question',
    author: 'xcheng', days_ago: 13, views: 41, reactions: 4,
    title: '蝦皮賣家後台商品上下架的批次自動化',
    body:
`賣家有 200 個 SKU，每週要根據庫存盤點結果上下架。蝦皮後台的批次操作每次只能選 50 個，做完還要重新整理頁面，很煩。

有人寫過類似的工作流嗎？大概抓個方向。`,
    tags: ['shopee', '電商'],
    comments: [
      { author: 'ywang', hours_after: 6,
        body: '寫過。重點是蝦皮的「全選」checkbox 是用 JavaScript 觸發的，Flyto2 直接 click 抓不到。要用 evaluate step 跑 `document.querySelector(...).click()` 才行。其他就是分頁 + waitForSelector + 批次操作，沒什麼難的。' },
      { author: 'xcheng', hours_after: 11,
        body: 'evaluate step 的關鍵，學到了。謝謝。' },
    ],
  },
  {
    product: 'cloud', lang: 'zh', category: 'bug',
    author: 'qhuang', days_ago: 15, views: 25, reactions: 2,
    title: '中華電信 Webmail 登入後 session 半小時內就過期',
    body:
`寫了一個自動讀公司中華電信信箱抓附件的 workflow。第一次跑 OK，半小時內第二次跑就要求重新登入。

中華電信 Webmail 應該不會這麼短就過期吧？是 Flyto2 沒保存 cookie 嗎？`,
    tags: ['bug', 'session', '中華電信'],
    comments: [
      { author: 'admin', hours_after: 5,
        body: '不是 Flyto2 沒保存，是中華電信 Webmail 預設「閒置 30 分鐘」就清 session。解法：用 persistent profile（每次跑都同一個 profile dir），這樣下次跑會走 cookie 自動續期路徑。或者直接走 IMAP + 一個小 helper 抓信，比 Web 介面穩很多。' },
    ],
  },
  {
    product: 'cloud', lang: 'zh', category: 'discussion',
    author: 'shulin', days_ago: 18, views: 168, reactions: 22,
    title: '把週報自動化的故事 — 從 3 小時降到 8 分鐘',
    body:
`小組每週一早上 9 點要交週報給主管。內容是上週 Jira 已完成 ticket + GA 流量數據 + Stripe MRR 數字 + 一段團隊狀況自評。

原本流程：手動進 Jira 篩 → 截 GA 圖 → 複製 Stripe 數字 → 用 Notion 模板拼貼 → 上傳給主管。3 小時起跳。

換 Flyto2 後：
- Jira ticket：API 抓（不是錄製），輸出 markdown 條列
- GA / Stripe 兩個 dashboard 走錄製截圖
- Notion 頁面：API 建立 + 模板帶入
- 完成後自動 LINE 通知主管

現在週一 8:50 開機，8:58 訊息進主管 LINE。團隊裡有人說那不如把「9 點報告」也自動化算了，我們笑了一週。

如果有人在做類似的東西可以 DM 我交流。`,
    tags: ['discussion', '週報', '自動化'],
    comments: [
      { author: 'admin', hours_after: 9,
        body: '這個案例很適合放在 docs 的 case study。如果你方便分享 workflow 結構（不用實際內容），我們會引用。' },
      { author: 'ywang', hours_after: 13,
        body: '+1 想看 workflow 結構。我們也在做類似的東西。' },
      { author: 'xcheng', days_after: 1,
        body: '同問 Notion API 建立頁面那段，是直接 markdown 還是 block-by-block？' },
      { author: 'shulin', days_after: 1, parent_idx: 2,
        body: 'block-by-block，因為要 callout / toggle 結構。直接 markdown 我試過 Notion 會用預設樣式，視覺不夠突顯。' },
    ],
  },
  {
    product: 'cloud', lang: 'zh', category: 'question',
    author: 'ywang', days_ago: 21, views: 32, reactions: 2,
    title: 'Slack 頻道訊息自動翻譯 zh ↔ en，要怎麼設計？',
    body:
`團隊有香港跟台灣同事用繁中、新加坡同事用英文，Slack 同一個頻道講話。想做一個 bot 把新訊息自動翻譯成「另一邊看得懂」的語言。

問題：要走 Slack Web 還是 Slack API？Web 比較像「真實使用者」但 Flyto2 跟 Slack DOM 抗戰我看大家都嫌煩。`,
    tags: ['slack', '翻譯'],
    comments: [
      { author: 'admin', hours_after: 8,
        body: 'Slack 走 API，這個是固定建議。Slack DOM 改太頻繁，自動化撐不過一季。把翻譯邏輯接 LLM 或 DeepL API，Flyto2 在這個 case 沒有角色。如果你需要視覺化編輯 Slack 訊息（例如改格式），那才是 Flyto2 的位置。' },
    ],
  },
  {
    product: 'cloud', lang: 'zh', category: 'question',
    author: 'xcheng', days_ago: 24, views: 88, reactions: 11,
    title: '用 Flyto2 自動對統一發票，怎麼處理 OCR 的部分？',
    body:
`一張一張對統一發票太麻煩，想做個 workflow：登入財政部對獎頁 → 輸入發票號碼 → 抓中獎結果 → 寫進 Google Sheet。

問題：發票號碼怎麼來？我們有一堆紙本發票拍照，需要 OCR 抽號碼。Flyto2 自己沒 OCR step，要外掛嗎？`,
    tags: ['ocr', '統一發票'],
    comments: [
      { author: 'admin', hours_after: 7,
        body: 'OCR 不是 Flyto2 範圍。建議：exec step 呼叫 Google Cloud Vision API 或 Tesseract（本地 OCR）抽號碼出來，然後 Flyto2 接著做對獎部分。中文發票號碼是純數字，OCR 準確度不太需要擔心。' },
      { author: 'shulin', days_after: 1,
        body: '我們是用財政部官方 App 的「掃描條碼」功能，匯出 CSV 直接餵給 Flyto2，省掉 OCR 那一段。建議檢查看看 App 那條路。' },
    ],
  },
  {
    product: 'cloud', lang: 'zh', category: 'feature',
    author: 'shulin', days_ago: 27, views: 38, reactions: 4,
    title: 'Mac mini headless 支援 — 給家裡老 Mac 跑 24/7',
    body:
`家裡有閒置 Mac mini 2018，想拿來跑 Flyto2 24/7 排程。Headless 在 Linux 沒問題，Mac 上 headless 卻會跳「需要授權鎖屏 access」的對話框。`,
    tags: ['mac', 'headless'],
    comments: [
      { author: 'admin', hours_after: 6,
        body: 'macOS 上 headless 確實會被系統 prompt 卡，因為 Chromium headless 預設仍會嘗試取得螢幕 access。解法：跑 `flyto runner --truly-headless` 模式（在 2.5 加入）直接跳過螢幕 capabilities check。或者把 Mac mini 切到 SSH 跑、不要登入 GUI session，那個 prompt 就不會出現。' },
    ],
  },
  {
    product: 'cloud', lang: 'zh', category: 'bug',
    author: 'qhuang', days_ago: 30, views: 27, reactions: 2,
    title: 'Cmd+Tab 在錄製時觸發 macOS Spotlight 而不是切換 App',
    body:
`錄製到一半切回 IDE 看代碼，按 Cmd+Tab，Spotlight 跳出來了。錄製檔內也記了那個 Cmd+Tab。

Flyto2 在搶系統 keychord 嗎？`,
    tags: ['macos', 'keychord'],
    comments: [
      { author: 'admin', hours_after: 8,
        body: '錄製器確實會 hook 系統熱鍵以便完整錄製。`--filter-system-shortcuts` 開啟後 Cmd+Tab / Cmd+Space 這類系統級的就會被忽略。預設是關的（為了相容性），下個版本會切到預設開。' },
    ],
  },
  {
    product: 'cloud', lang: 'zh', category: 'question',
    author: 'ywang', days_ago: 33, views: 24, reactions: 1,
    title: 'Notion 中文 markdown export 之後表格格式跑掉',
    body:
`從 Notion 把頁面 export 成 markdown，繁中內容裡的表格在 markdown 裡是亂的（欄位錯位）。用 Flyto2 抓畫面再轉 markdown 反而比較準。`,
    tags: ['notion', 'markdown'],
    comments: [
      { author: 'admin', hours_after: 5,
        body: 'Notion 的官方 markdown export 對全形字元的欄寬計算有 bug，表格欄位對齊會錯位（不只繁中，日文、韓文都有）。這是 Notion 端問題，第三方 markdown 處理工具能正常 render，所以實際使用沒問題；但如果你需要「看得舒服的 markdown 檔」，建議走 Flyto2 抓 HTML 再用 pandoc 轉。' },
    ],
  },
  {
    product: 'cloud', lang: 'zh', category: 'discussion',
    author: 'xcheng', days_ago: 36, views: 84, reactions: 9,
    title: '我們跑 90 天的失敗率報告',
    body:
`內部團隊推行 Flyto2 三個月，做了一份失敗率報告：

- 總 workflow 數：47 條，平均每天執行 ~120 次
- 整體成功率：91.4%
- 失敗主因 (依次)：
  1. 第三方網站 UI 變更（49% 的失敗）— Notion / Salesforce / HubSpot 是主要嫌犯
  2. 網路超時（22%）— 多數是公司 VPN 慢
  3. 帳號 session 過期（14%）— 沒設 persistent profile 的 workflow
  4. 自家系統升級沒同步更新 workflow（11%）
  5. 其他（4%）

學到的事情：第三方網站 UI 變更是最大噪音來源，這個沒辦法靠工具預防，只能靠 Flyto2 的監控 + 早期警告。我們現在每天看一次 nightly 跑的 smoke test 結果。`,
    tags: ['discussion', '可靠性'],
    comments: [
      { author: 'admin', hours_after: 11,
        body: '91.4% 成功率對「3 個月剛上線」的團隊是健康數字。第三方 UI 變更這條我們也在想能不能做點什麼，例如自動截圖比對 + 警告。你有興趣參與 alpha 測試的話可以 DM。' },
      { author: 'shulin', days_after: 1,
        body: '我們類似的數字 89%，第三方 UI 也是主因。看到不只我們這樣有點安慰。' },
    ],
  },
  {
    product: 'cloud', lang: 'zh', category: 'question',
    author: 'shulin', days_ago: 39, views: 31, reactions: 2,
    title: '抓 PChome 商品價格 — 反爬蟲怎麼處理？',
    body:
`想監控自家賣的商品在 PChome / momo / 蝦皮上的價格波動。PChome 對 headless Chromium 比較敏感，幾秒就會跳人機驗證。

有人成功跑過嗎？需要走代理 IP 還是有別的 trick？`,
    tags: ['pchome', '反爬蟲'],
    comments: [
      { author: 'admin', hours_after: 9,
        body: 'PChome 的反爬蟲對「太快、太規律」最敏感。建議：(1) 隨機 sleep 5-15 秒 (2) 用 headed 模式（不要 headless）(3) 加 user-agent 隨機化 (4) 一天最多查 200 次。商業價格監控如果是長期需求，買 PChome 開發者 API 比較根本。' },
    ],
  },
  {
    product: 'cloud', lang: 'zh', category: 'bug',
    author: 'qhuang', days_ago: 42, views: 23, reactions: 1,
    title: 'Google 表單需要登入時 redirect chain 太長',
    body:
`公司內部用 Google 表單做問卷，設定為「僅限組織內成員」。跑 Flyto2 進這種表單會經過 Google login → SSO → 回 form 三次 redirect，workflow 在第三次跳轉超時。`,
    tags: ['google-forms', 'sso'],
    comments: [
      { author: 'admin', hours_after: 6,
        body: 'Google SSO 的 redirect chain 很長（3-4 hop），預設 follow-redirect timeout 太短。`waitForUrl` 指到最終的 forms.gle 或 /viewform URL pattern，這樣中間幾跳都會被 wait 包住。' },
    ],
  },
  {
    product: 'cloud', lang: 'zh', category: 'question',
    author: 'ywang', days_ago: 45, views: 19, reactions: 1,
    title: 'Excel Online 中文欄位名稱在公式引用會自動換掉',
    body:
`在 Excel Online 寫公式引用「金額」這個中文欄位名稱，Flyto2 typed text 進去之後 Excel 自動把它換成 \`@金額\`（加 @ 符號）。

這個 @ 是 Excel 的結構化引用功能，但我不要它，因為下游 parser 看不懂 @。`,
    tags: ['excel-online', '中文'],
    comments: [
      { author: 'admin', hours_after: 7,
        body: 'Excel Online 對表格結構化引用會自動加 @。要避開，輸入完之後用 evaluate step 把 @ 移除：`cell.value = cell.value.replace(/^@/, "")`。或者繞過 typed text 直接走 evaluate 寫 cell value（不會觸發 auto-complete）。' },
    ],
  },
  {
    product: 'cloud', lang: 'zh', category: 'feature',
    author: 'shulin', days_ago: 48, views: 41, reactions: 5,
    title: '工作流文件輸出 — 想要繁中說明的 markdown',
    body:
`工程師看 JSON workflow 沒問題，PM / 老闆要看流程說明，每次要我口頭講一遍。希望有「export workflow 為繁中說明文件」功能，每一步用人話描述：點擊 [搜尋按鈕]、輸入 "report"、等待 [報表載入]。`,
    tags: ['export', '文件'],
    comments: [
      { author: 'admin', hours_after: 12,
        body: 'workflow narrative 內部代號的功能，預計 2.5 進 beta。會出 en/zh/ja 三語的人話描述。markdown 跟 PDF 兩種格式。' },
      { author: 'xcheng', days_after: 2,
        body: '催更 +1，PM 老問為什麼這個 step 沒用。' },
    ],
  },
  {
    product: 'cloud', lang: 'zh', category: 'question',
    author: 'xcheng', days_ago: 51, views: 27, reactions: 2,
    title: '自動處理 Gmail 中文附件名稱（亂碼問題）',
    body:
`從 Gmail 下載附件，名稱有中文的會變成 \`=?UTF-8?B?...?=\` 這種 RFC 2047 編碼字串。Flyto2 下載步驟存檔之後檔名就是這個亂碼。`,
    tags: ['gmail', 'encoding'],
    comments: [
      { author: 'admin', hours_after: 5,
        body: '原因是 Gmail Web 介面對中文附件名不做完整解碼。建議的 workaround：下載完 exec step 跑一個 helper 把 RFC 2047 解碼回正常中文檔名（Python `email.header.decode_header` 一行）。' },
    ],
  },
  {
    product: 'cloud', lang: 'zh', category: 'question',
    author: 'qhuang', days_ago: 54, views: 21, reactions: 1,
    title: 'LinkedIn 中文搜尋 — 關鍵字 vs 公司名稱的差別',
    body:
`用 LinkedIn 找台灣的 backend 工程師。搜「Backend」+ 地區「台灣」結果很多，但加上中文「資深後端工程師」結果反而少。

LinkedIn 是分中英文索引嗎？或者是搜尋演算法對中文有特別處理？`,
    tags: ['linkedin', '中文搜尋'],
    comments: [
      { author: 'mvelasco', hours_after: 10,
        body: 'LinkedIn 的索引對中文沒做特別處理，但中文 job title 用得比較少（多數人填英文）。建議搜「Backend」+ 公司位於台灣 + 大頭照在中文姓名地區，配組合條件比較準。' },
    ],
  },
  {
    product: 'cloud', lang: 'zh', category: 'bug',
    author: 'shulin', days_ago: 57, views: 25, reactions: 2,
    title: '注音輸入錄製時，候選字選擇步驟有時被吃掉',
    body:
`注音輸入「ㄒㄧㄠ ㄐㄧㄝ」要選「校接」第二個候選字。錄製器有時候捕捉到候選框出現的瞬間就直接按下「校解」（第一個），重播時也照做。

我手動按了第二個候選但錄不到？`,
    tags: ['bug', '注音', 'ime'],
    comments: [
      { author: 'admin', hours_after: 6,
        body: '注音 IME 的候選框是系統級 popup（不在 page DOM 內），錄製器看不到你選了哪一個。Workaround：用「整段貼上」取代逐字輸入，或者切到拼音 IME（拼音的候選框是 inline 的，錄製器抓得到）。長期看，系統 IME 候選框錄製是個結構性限制，不容易解。' },
    ],
  },
  {
    product: 'cloud', lang: 'zh', category: 'feature',
    author: 'ywang', days_ago: 60, views: 33, reactions: 4,
    title: '行事曆同步 — Flyto2 → Google Calendar 一鍵',
    body:
`我們做了一個 workflow 自動從多個 sources（HubSpot deal / Jira ticket / Notion）拉「需要排會議」的項目。
現在要把這些塞進 Google Calendar 還是要走 Google Cal API 自己寫 helper。

希望有一個 native 步驟「create-google-event」，input 是時間 / 參與者 / 描述，省掉 helper 那段。`,
    tags: ['google-calendar', 'integration'],
    comments: [
      { author: 'admin', hours_after: 9,
        body: '已在 integrations 短名單。Google Cal API 是穩定的，包裝成步驟可行。亞太區優先級評估會把 Calendar + LINE 一起考慮（後者上面有人提到）。' },
    ],
  },
  {
    product: 'cloud', lang: 'zh', category: 'question',
    author: 'xcheng', days_ago: 63, views: 24, reactions: 2,
    title: '兩個 Notion workspace — 切換時 cookie 會混嗎？',
    body:
`公司有兩個 Notion workspace（一個內部、一個客戶）。同一個 Flyto2 workflow 要切換進兩邊抓資料。

profile-switch 我看過，但兩個 workspace 是同一個 Notion 帳號登入，profile 真的會分得乾淨嗎？`,
    tags: ['notion', 'profile'],
    comments: [
      { author: 'admin', hours_after: 7,
        body: '同一個帳號兩個 workspace 不需要分 profile —— Notion workspace 切換是 URL-level 的（`/workspace-a` vs `/workspace-b`），不會混。直接導航到目標 workspace URL 就會切換。Profile 是給「不同帳號」用的，例如客戶帳號 vs 你自己帳號。' },
    ],
  },
  {
    product: 'cloud', lang: 'zh', category: 'discussion',
    author: 'qhuang', days_ago: 66, views: 96, reactions: 13,
    title: '從 UiPath 換到 Flyto2 的中文團隊心得 — 6 週後',
    body:
`公司去年導入 UiPath 後一直覺得學習成本太高，今年初評估換 Flyto2，做了 6 週後總結：

優點：
- 中文 UI 很直觀，操作員 onboarding 從 UiPath 的 2 週縮到 3 天
- 錄製優先的設計，操作員可以自己錄、自己改，工程師被打擾的次數變很少
- 工作流 JSON 在 git 裡，code review 流程通

不太順的地方：
- UiPath 有的 Excel 深度整合（直接讀寫 cell 不開 Office），Flyto2 需要走 Excel Online 或 exec helper
- 多螢幕錄製比較弱，操作員要習慣只用單螢幕錄

如果有人在評估這條路可以 DM 我。`,
    tags: ['discussion', 'uipath', '遷移'],
    comments: [
      { author: 'admin', hours_after: 8,
        body: '中文 UI onboarding 從 2 週縮到 3 天這條我們會引用。多螢幕的部分正在改進，alpha 在跑。Excel 整合短期沒打算做（決定用 Online + helper 是有意的設計選擇），長期看市場反饋。' },
      { author: 'mvelasco', hours_after: 14,
        body: 'Excel 整合這條我也有同感，但 helper 的維護成本很低（30 行 Python），實際使用下來不是大問題。' },
    ],
  },
  {
    product: 'cloud', lang: 'zh', category: 'question',
    author: 'shulin', days_ago: 69, views: 18, reactions: 1,
    title: '公司內部 Confluence 中文搜尋 — selector 路徑不穩',
    body:
`Confluence 中文版的搜尋按鈕和篩選介面比英文版多一層 wrapper。錄製的 selector 在我電腦跑沒問題，同事的英文版 Confluence 跑不起來。`,
    tags: ['confluence', '中文'],
    comments: [
      { author: 'admin', hours_after: 5,
        body: 'Confluence 多語介面 wrapper 不同，建議用 aria-label 而不是 CSS class（aria-label 是語言中性的）。Confluence 各個關鍵按鈕都有 aria-label，跨語言通用。' },
    ],
  },
  {
    product: 'cloud', lang: 'zh', category: 'question',
    author: 'ywang', days_ago: 72, views: 16, reactions: 1,
    title: 'Trello 卡片移動到 Asana — 欄位名怎麼 mapping？',
    body:
`公司從 Trello 遷移到 Asana。要把舊卡片連同 description / due date / assignee 都帶過去。

Trello 跟 Asana 的欄位語意不完全一樣（Trello 沒有 task type 概念），這種 mapping 通常怎麼處理？`,
    tags: ['trello', 'asana', '遷移'],
    comments: [
      { author: 'admin', hours_after: 6,
        body: '建議：Trello → Asana 走 API（兩邊都有 stable API），workflow 用一個 mapping 表（Trello label → Asana custom field value）控制轉換。`task_type` 這種 Trello 沒有的概念，用 Trello label 填一個進去就好。Flyto2 在這個遷移 case 不是主角，純 API + 中間 transform 就夠。' },
    ],
  },
  {
    product: 'cloud', lang: 'zh', category: 'bug',
    author: 'xcheng', days_ago: 75, views: 21, reactions: 2,
    title: 'Microsoft 365 中文版 ribbon 改版後一半 workflow 跑不起來',
    body:
`微軟最近把 Microsoft 365 中文版的 ribbon 改成新的「簡化版」，很多按鈕的位置 / aria-label 都變了。我們半數 Outlook / Word / Excel workflow 全部炸掉。

英文版好像也有改但 aria-label 變得比較少？`,
    tags: ['bug', 'microsoft-365', '中文'],
    comments: [
      { author: 'admin', hours_after: 7,
        body: '微軟 ribbon 改版中文版的 aria-label 動得確實比英文版多。我們在更新中文模板裡。短期 workaround：用「visible-text」selector（找按鈕的中文標籤文字）而不是 aria-label，這個比較穩。模板更新會在這幾天的 changelog 公告。' },
    ],
  },
  {
    product: 'cloud', lang: 'zh', category: 'question',
    author: 'qhuang', days_ago: 78, views: 27, reactions: 3,
    title: '自動填單跑經費報帳 — 公司 SAP Concur 中文版',
    body:
`公司用 Concur 報差旅費。每個月 40-50 張收據，填單要填日期、項目、金額、附上收據圖。

想做一個 workflow 從 Notion 表格抓資料、自動跑完 Concur 填單。但 Concur 中文版有很多 dropdown 是 「點開才載入選項」的 lazy load。`,
    tags: ['concur', '報帳'],
    comments: [
      { author: 'admin', hours_after: 8,
        body: 'Concur dropdown 的 lazy load 是已知 pattern，open + waitForSelector + click 三步驟就能解。比較麻煩的是 Concur 的「收據附件」上傳 widget，那個 iframe 通常需要 enterFrame step 才抓得到。Concur 中文版有些 widget 跟英文版 DOM 不同步，建議先 alpha 跑英文版確認流程通，再切中文。' },
    ],
  },
  {
    product: 'cloud', lang: 'zh', category: 'discussion',
    author: 'shulin', days_ago: 81, views: 47, reactions: 6,
    title: '小團隊 3 人怎麼 review workflow — 我們的做法',
    body:
`我們團隊三個人（我、ywang、qhuang），輪流寫 workflow。要 code review 但又不想做太重。

落地的規矩：
- 每個 workflow PR 至少要有一個人說 "lgtm" 才能 merge
- review 看三件事：1) 是不是用了 hardcoded credential 2) 有沒有 retry budget 3) 失敗訊息是不是人類看得懂
- 不看 selector 細節（這部分必然會 rotate，看了也沒用）
- 不看 step 名稱（誰寫的誰負責）

每週五輪流負責看一遍上一週新加的 workflow 過去 7 天跑的 log，挑可能要改的回報。`,
    tags: ['discussion', 'review', '小團隊'],
    comments: [
      { author: 'admin', hours_after: 8,
        body: '「不看 selector 細節」這條很對 —— 那是 noise，每個 PR 都看反而疲憊。我們內部團隊的 review 也類似。' },
    ],
  },
  {
    product: 'cloud', lang: 'zh', category: 'question',
    author: 'ywang', days_ago: 84, views: 22, reactions: 1,
    title: '行銷團隊想抓 GA4 dashboard 截圖 — 哪個指標要 wait？',
    body:
`要把 GA4「用戶 → 轉換」儀表板每週一截圖貼到團隊 Slack。GA4 的圖表載入有先後順序，最後載入的那張要 wait 大概 5 秒。

用什麼當 signal 比較準？`,
    tags: ['ga4', 'screenshot'],
    comments: [
      { author: 'admin', hours_after: 5,
        body: 'GA4 圖表完成載入後會把 `data-rendering="false"` 加到 chart wrapper 上。waitForSelector 抓所有 chart 的 `data-rendering="false"` 都到位，就可以截。比固定 sleep 穩很多。' },
    ],
  },
  {
    product: 'cloud', lang: 'zh', category: 'bug',
    author: 'xcheng', days_ago: 87, views: 18, reactions: 1,
    title: 'Notion table 用中文標題排序時順序錯誤',
    body:
`Notion table 第一欄是中文姓名，排序選「A → Z」結果不是 pinyin 順序，是 Unicode codepoint 順序。對中文使用者很不直觀。`,
    tags: ['notion', '中文', 'sort'],
    comments: [
      { author: 'admin', hours_after: 4,
        body: "這是 Notion 端的問題，不是 Flyto2 抓錯。Notion 對 CJK 字串排序用的是 codepoint，跟使用者期待的 pinyin / stroke order 都不同。如果要排序準確，建議自己 export 後在 Flyto2 的 evaluate step 用 Intl.Collator('zh-Hans-CN') 重新排。" },
    ],
  },
  {
    product: 'cloud', lang: 'zh', category: 'feature',
    author: 'qhuang', days_ago: 90, views: 28, reactions: 3,
    title: '客服 Zendesk 中文 macro — 一鍵運行',
    body:
`客服每天回 50+ 張票，常用 macro 不到 10 個。Zendesk macro 中文版 menu 的展開比英文版多一步，希望可以「指定 macro 名稱直接運行」而不必每次點開 menu。`,
    tags: ['zendesk', 'macro', '客服'],
    comments: [
      { author: 'admin', hours_after: 9,
        body: '前面 EN 區有同樣的需求（yokonkwo 的 thread），會走 Zendesk API 包裝成步驟，中英文 macro name 都會支援。整合短名單已加。' },
    ],
  },
  {
    product: 'cloud', lang: 'zh', category: 'question',
    author: 'shulin', days_ago: 93, views: 16, reactions: 1,
    title: 'Trello card cover 自動換圖怎麼處理 file upload？',
    body:
`想做一個 workflow 自動把每張 Trello card 的 cover image 換成「該 card 對應商品的最新照片」。檔案在 Dropbox。

Trello 的 file upload 是個 widget，不直接接受 drag-and-drop 從外部來。`,
    tags: ['trello', 'upload'],
    comments: [
      { author: 'admin', hours_after: 6,
        body: 'Trello 的 cover 上傳，建議走 Trello REST API 的 `attachments` endpoint + 設 cover flag。Web UI 上傳 widget 不穩、各種 race condition。API 在這個 case 是無痛的。' },
    ],
  },
  {
    product: 'cloud', lang: 'zh', category: 'question',
    author: 'ywang', days_ago: 96, views: 19, reactions: 1,
    title: 'Stripe 月報 export 給財務 — 數字準度問題',
    body:
`Stripe dashboard 的「上個月營收」截圖給財務，跟財務從 Stripe export CSV 自己算的數字差了一點點。

Flyto2 抓的是 dashboard 顯示，dashboard 的數字是 Stripe 端聚合的。差的可能是時區或者退款處理？`,
    tags: ['stripe', '財務'],
    comments: [
      { author: 'admin', hours_after: 7,
        body: '幾乎一定是時區。Stripe dashboard 預設用 viewer 時區，CSV export 用 UTC。建議：(1) 統一用 UTC，dashboard 設定改 UTC 顯示 (2) 或者財務的 CSV export 改成同樣的 viewer 時區。再對一次數字應該就齊。' },
    ],
  },
  {
    product: 'cloud', lang: 'zh', category: 'discussion',
    author: 'xcheng', days_ago: 99, views: 73, reactions: 9,
    title: '我們用 Flyto2 養客服 SOP — 從 50 條到 12 條',
    body:
`客服團隊有 50 條「處理 X 類問題」的 SOP 文件。實際上每天用到的不到 12 條，剩下的 38 條沒人看、沒人更新。

去年開始把 SOP 改寫成 Flyto2 workflow（步驟級的、給客服跑而不是純文字）。三個月後：
- 12 條「真正會用」的 SOP 被 workflow 化
- 客服平均處理時間從 8 分降到 5 分鐘
- 新人 onboarding 從學 SOP 變成「跟著 workflow 跑 5 次就會了」
- 38 條沒人用的 SOP 我們發現大部分是「以前出過事所以寫了」的歷史記憶，老闆同意都刪掉

不是 Flyto2 的功能厲害，是寫 workflow 強迫我們把 SOP 改成可執行的東西，過濾掉了「寫了沒人看」的部分。`,
    tags: ['discussion', '客服', 'sop'],
    comments: [
      { author: 'admin', hours_after: 7,
        body: '「強迫 SOP 變成可執行」這個觀察很有意思。「寫了沒人看」是傳統 SOP 的通病，workflow 化是強制的 forcing function。這個寫法可以引用。' },
      { author: 'qhuang', hours_after: 13,
        body: '同感。我們客服 SOP 也是堆了很多歷史包袱，改寫的過程就是清理過程。' },
    ],
  },
];

// ----------------------------------------------------------------
// ZH × code
// ----------------------------------------------------------------

const ZH_CODE = [
  {
    product: 'code', lang: 'zh', category: 'question',
    author: 'shulin', days_ago: 4, views: 41, reactions: 4,
    title: 'flyto-indexer 對中文 comment 有特別處理嗎？',
    body:
`我們 Python codebase 裡面 comment 大量寫繁中。請問 indexer 在 search / audit 時是把它當一般字串掃，還是有針對中文做 tokenize？`,
    tags: ['indexer', '中文', 'comment'],
    comments: [
      { author: 'admin', hours_after: 5,
        body: '預設 search / grep 是把中文當原樣比對（substring match），不做 CJK 斷詞。如果需要按詞搜尋，傳 `--cjk-tokenize` 會用 jieba 做斷詞索引，但會慢一點。多數團隊用預設就夠。' },
      { author: 'shulin', hours_after: 9,
        body: '了解，謝謝。我們用預設就好。' },
    ],
  },
  {
    product: 'code', lang: 'zh', category: 'question',
    author: 'xcheng', days_ago: 9, views: 28, reactions: 2,
    title: 'audit 對中文檔名怎麼判斷？',
    body:
`我們 Vue 專案有檔名是中文的 component (例如 \`組件/輸入框.vue\`)。audit 是否能正常找到並掃描？`,
    tags: ['audit', '中文'],
    comments: [
      { author: 'admin', hours_after: 6,
        body: '可以。檔名是 Unicode 處理，中文檔名不影響掃描。但建議：中文檔名在跨平台時可能踩到（特別是 Windows 預設碼頁），Vue 專案 import 路徑用中文也容易在不同 OS 上行為不同。技術上 indexer 支援，組織上不太推薦。' },
    ],
  },
  {
    product: 'code', lang: 'zh', category: 'bug',
    author: 'qhuang', days_ago: 13, views: 22, reactions: 2,
    title: 'scan 在 Windows + 中文路徑時 OSError',
    body:
`Windows 11 + Python 3.11，專案路徑是 \`C:\\開發\\我的專案\\\`。\`flyto-index scan\` 跑到一半 OSError "[Errno 22] Invalid argument"，懷疑是中文路徑問題。

WSL 內跑同一個專案就沒問題。`,
    tags: ['bug', 'windows', '中文路徑'],
    comments: [
      { author: 'admin', hours_after: 7,
        body: 'Windows + 非 ASCII 路徑的常見問題。indexer 內部某個 path normalize 用了 latin-1 假設，已經是 v2.7.4 的修復目標。短期 workaround：(1) 用 WSL（你已經這麼做了）(2) 或者把專案路徑改成全 ASCII（不理想但會動）。' },
    ],
  },
  {
    product: 'code', lang: 'zh', category: 'feature',
    author: 'ywang', days_ago: 18, views: 24, reactions: 3,
    title: 'rules YAML 支援繁中 source 字串',
    body:
`\`.flyto-rules.yaml\` 裡面我寫了一條 rule：

\`\`\`yaml
- rule: "不要寫中文 console.log"
  grep_deny:
    pattern: 'console\\.log.*[\\u4e00-\\u9fa5]'
\`\`\`

但 rule 名字（中文）在 audit 輸出時被印成 \`?????\`。源字串的 UTF-8 沒問題嗎？`,
    tags: ['rules', '繁中'],
    comments: [
      { author: 'admin', hours_after: 6,
        body: '應該不會。聽起來像是 audit 輸出時 console 編碼設成了 latin-1。檢查 `LANG` 環境變數，CI 容器常常沒設。設 `LANG=zh_TW.UTF-8` 或至少 `LC_ALL=C.UTF-8` 解決。' },
      { author: 'ywang', hours_after: 8,
        body: '對，CI 沒設 LANG。設了 C.UTF-8 就正常了，謝謝。' },
    ],
  },
  {
    product: 'code', lang: 'zh', category: 'question',
    author: 'shulin', days_ago: 23, views: 19, reactions: 1,
    title: 'taint 分析能否識別自訂 sanitizer (Python)？',
    body:
`我們有一個 \`escape_xss(s)\` 工具函數，taint 分析會把它當 sanitizer 認嗎？還是要在 rules 裡聲明？`,
    tags: ['taint', 'python'],
    comments: [
      { author: 'admin', hours_after: 5,
        body: '不會自動認得 — 需要在 `.flyto-rules.yaml` 的 `taint.sanitizers` 聲明。內建的 sanitizer 只涵蓋標準庫的 escape 函數（`html.escape`, `urllib.parse.quote` 等）。自訂的要聲明，文件在 docs/taint/sanitizers。' },
    ],
  },
  {
    product: 'code', lang: 'zh', category: 'question',
    author: 'xcheng', days_ago: 28, views: 32, reactions: 3,
    title: 'flyto-indexer 跟 SonarQube 怎麼分工？',
    body:
`公司同事用 SonarQube 很久了。我想引進 flyto-indexer，但被問到「跟 Sonar 怎麼分工」答不上來。

兩個工具的重疊跟差異在哪？`,
    tags: ['comparison', 'sonarqube'],
    comments: [
      { author: 'admin', hours_after: 8,
        body: 'SonarQube 的強項是「靜態指標」(code smells, 複雜度, 重複代碼, coverage 整合) 跟團隊治理面 (quality gate, branch policy)。flyto-indexer 的強項是「探索式分析」(symbol search, impact, taint, structural reasoning)。比較像「Sonar 給 manager 看，flyto-indexer 給 engineer 在 IDE 邊用」。多數客戶兩個並存。' },
    ],
  },
  {
    product: 'code', lang: 'zh', category: 'bug',
    author: 'qhuang', days_ago: 33, views: 17, reactions: 1,
    title: 'scan 在 monorepo 找不到 i18n JSON 內的 source',
    body:
`Monorepo 裡 i18n 翻譯字串放在 \`packages/locales/zh.json\`。audit 應該要把這些當「字串資源」掃，但 scan 完全跳過 JSON 檔。`,
    tags: ['bug', 'i18n', 'json'],
    comments: [
      { author: 'admin', hours_after: 4,
        body: '預設 audit 不掃 JSON（太多 noise）。如果你要把 i18n 當分析來源，加 `include_extra: ["**/locales/*.json"]` 到 `.flyto-rules.yaml`，audit 會把它們 indexed 進來但不做語法分析。' },
    ],
  },
  {
    product: 'code', lang: 'zh', category: 'discussion',
    author: 'ywang', days_ago: 38, views: 64, reactions: 8,
    title: '我們導入 flyto-code 三個月 — 中文 team 的觀察',
    body:
`公司導入 3 個月，PR check 上掛 flyto-code。團隊有 8 個工程師，全部繁中為主溝通。

正向：
- 中文 issue / PR comment / commit message 都掃得到（前面有問 indexer 支援，確實沒問題）
- 每個 PR 自動跑分析、結果留在 PR comment，team review 變快
- 工程師之間開始用「flyto-code 說 ...」當依據討論

不足：
- 中文 console.log 看起來不被當成 production code（沒被 grep_deny 抓到，可能是 regex 對 unicode range 處理弱）
- 工程師有用 Cursor / Copilot 自動產生程式，那些程式有時候會生出 flyto-code 不喜歡的 pattern，我們會討論「是規則太嚴還是 AI 寫太差」

整體值得用。`,
    tags: ['discussion', '中文團隊'],
    comments: [
      { author: 'admin', hours_after: 9,
        body: '中文 unicode range regex 那條我們有看到，會在 v2.7.4 加 native CJK 支援 — 不需要使用者自己寫 `[\\u4e00-\\u9fa5]`，直接 `\\p{Script=Han}` 就可以。「AI 生 code 跟 audit 不合」這個觀察很有意思，可能成為一個 case study。' },
    ],
  },
  {
    product: 'code', lang: 'zh', category: 'question',
    author: 'shulin', days_ago: 43, views: 21, reactions: 2,
    title: 'flyto-indexer 怎麼把 LSP 換成 type-aware 加強？',
    body:
`目前用 indexer 的 search 找符號偶爾會 false positive。文件提到「LSP integration」可以加強 type 識別，但裝了 pyright 之後好像沒變化？`,
    tags: ['lsp', 'pyright'],
    comments: [
      { author: 'admin', hours_after: 6,
        body: '裝了 pyright 還要在 `.flyto-rules.yaml` 啟用 `lsp.pyright.enabled: true`，預設關（因為會增加 indexing 時間）。啟用後 search / impact 的精度會明顯提升，但 indexing 時間翻 2-3 倍。建議在 CI 開、本地關。' },
    ],
  },
  {
    product: 'code', lang: 'zh', category: 'feature',
    author: 'xcheng', days_ago: 48, views: 27, reactions: 3,
    title: 'findings dashboard 中文化',
    body:
`flyto-code 的 web dashboard（\`flyto-code report --html\`）UI 目前只有英文。團隊裡非工程師（QA、主管）看 finding 標籤都霧煞煞。希望支援 zh / ja 介面切換。`,
    tags: ['feature', 'i18n', 'dashboard'],
    comments: [
      { author: 'admin', hours_after: 8,
        body: 'dashboard 的 i18n 在 v2.8 計畫內。會跟 en / zh / ja 三語起頭。findings 分類描述也會一起翻。' },
    ],
  },
];

// ----------------------------------------------------------------
// JA × cloud
// ----------------------------------------------------------------

const JA_CLOUD = [
  {
    product: 'cloud', lang: 'ja', category: 'question',
    author: 'yuki', days_ago: 4, views: 38, reactions: 3,
    title: 'kintoneのカスタムアプリ自動入力のベストプラクティス',
    body:
`kintoneでカスタムアプリ（在庫管理用）の入力を自動化したいと考えています。フィールド数が多く、関連レコード参照もあるので、APIで書くべきかFlyto2で録画するべきか迷っています。`,
    tags: ['kintone', 'automation'],
    comments: [
      { author: 'admin', hours_after: 7,
        body: 'kintone REST APIが整備されているので、シンプルなレコード入力ならAPI推奨です。Flyto2は「kintone上での視覚的な確認も必要」とか「kintoneのカスタムビジネスロジックがUI経由でしか動かない」ケースで活きます。最初はAPIで試して、足りない部分だけFlyto2で補完するのが現実的です。' },
    ],
  },
  {
    product: 'cloud', lang: 'ja', category: 'question',
    author: 'mtanaka', days_ago: 7, views: 31, reactions: 2,
    title: 'マネーフォワードの月次レポート自動取得',
    body:
`マネーフォワードクラウドの月次レポートを毎月自動取得して、社内共有フォルダに保存したい。ログイン後のレポート画面でCSVダウンロードする流れですが、CSVボタンが「準備中」状態を経由するので録画の待ち時間調整が難しいです。`,
    tags: ['money-forward', 'csv-export'],
    comments: [
      { author: 'admin', hours_after: 8,
        body: 'マネフォの「準備中→ダウンロード可能」状態遷移は、ボタンのdisabled属性が外れるタイミングで判定できます。waitForSelectorで `button.csv-download:not([disabled])` を待つのが固定sleepより堅牢です。' },
      { author: 'shimizu', hours_after: 13,
        body: '同じパターン使ってます。マネフォは1〜3分かかることもあるのでtimeoutは5分推奨。' },
    ],
  },
  {
    product: 'cloud', lang: 'ja', category: 'bug',
    author: 'esakai', days_ago: 11, views: 42, reactions: 4,
    title: 'macOSで日本語IME使用時の録画ミス',
    body:
`Notionに日本語を入力するワークフローを録画したのですが、再生時にかな漢字変換が崩れてローマ字のままになります。composition resolveのタイミングが取れていない印象。`,
    tags: ['bug', 'macos', 'ime'],
    comments: [
      { author: 'admin', hours_after: 4,
        body: '確認済みの不具合です。v2.4.2でcompositionendイベントベースに切り替え、確定後の文字列を捕捉するようになります。それまでは別アプリで文字を準備してペーストする方法でしのいでください。同じ問題が韓国語・中国語IMEでも発生していました。' },
      { author: 'esakai', hours_after: 9,
        body: 'ペースト回避法で対応しました。v2.4.2待ちます。ありがとうございます。' },
    ],
  },
  {
    product: 'cloud', lang: 'ja', category: 'question',
    author: 'shimizu', days_ago: 14, views: 27, reactions: 2,
    title: 'freee経費精算ワークフローの設計',
    body:
`月末の経費精算をFlyto2で自動化したい。Notionに記録した経費を読み取って、freeeの経費申請画面に入力する流れを考えています。

freeeの経費入力画面はカテゴリ選択がdropdown、金額が数値、領収書がファイルアップロード。それぞれ少し癖がありそうで、設計のコツがあれば教えてください。`,
    tags: ['freee', '経費'],
    comments: [
      { author: 'admin', hours_after: 8,
        body: 'freeeのカテゴリdropdownはlazy-load型なので、開く→waitForSelector→選択、の3ステップ必須です。領収書アップロードはdrag-and-dropよりfile inputへの直接attachが安定。Notionから読む部分はNotion API推奨です。' },
    ],
  },
  {
    product: 'cloud', lang: 'ja', category: 'question',
    author: 'wkurosaki', days_ago: 17, views: 24, reactions: 1,
    title: 'Backlog課題の一括移動と関連付け',
    body:
`チーム再編で、あるプロジェクトの課題100件を別プロジェクトに一括移動したい。Backlogの「移動」操作はUIで1件ずつしかできないのですが、Flyto2で連続実行するパターンに何かハマりやすいポイントはありますか？`,
    tags: ['backlog'],
    comments: [
      { author: 'admin', hours_after: 9,
        body: 'Backlog REST APIに `bulk update` 相当のエンドポイントがあります。UIで100件繰り返すよりAPI 1回呼ぶ方が圧倒的に安定・高速です。Flyto2はBacklogの視覚的な操作（添付ファイル目視確認など）が必要なケースに残してください。' },
    ],
  },
  {
    product: 'cloud', lang: 'ja', category: 'feature',
    author: 'dkato', days_ago: 21, views: 35, reactions: 5,
    title: 'kintoneカスタムフィールド対応ステップ',
    body:
`kintoneにはルックアップ、関連レコード、計算フィールドなど、標準のテキスト入力では入らない特殊フィールドが多数あります。これらをFlyto2のネイティブステップで扱えるとAPI併用が減って助かります。`,
    tags: ['feature', 'kintone'],
    comments: [
      { author: 'admin', hours_after: 12,
        body: 'kintoneは日本市場で重要なので統合候補に入れています。ただkintoneは前述の通りAPIが優秀なので、ネイティブステップを作るより、推奨パターン（APIで書く、UIで確認する）のドキュメント整備が先かなと考えています。具体的に「APIで届かない」ケースがあれば共有ください。' },
    ],
  },
  {
    product: 'cloud', lang: 'ja', category: 'question',
    author: 'lnaka', days_ago: 25, views: 22, reactions: 2,
    title: 'Sansan名刺管理との統合',
    body:
`Sansanで取り込んだ名刺データを社内CRMに転記するワークフローを検討中。SansanはAPIがあるのですが、企業によってはAPI契約が別料金でブロックされていて、Web UI経由でしか取れない場合があります。

そういう制約下でFlyto2の現実的な構成は？`,
    tags: ['sansan', 'crm'],
    comments: [
      { author: 'admin', hours_after: 7,
        body: 'API契約なし条件は典型的なFlyto2のユースケースです。Sansan Web UIから一覧画面→詳細→必要項目を抽出、の流れを録画。検索結果一覧の仮想スクロールがやや厄介で、scroll + waitForSelectorで虚化を解消する標準パターンが必要です。' },
    ],
  },
  {
    product: 'cloud', lang: 'ja', category: 'discussion',
    author: 'shimizu', days_ago: 28, views: 124, reactions: 16,
    title: 'WinActorからFlyto2への移行 90日レポート',
    body:
`国内RPAのWinActorを5年使ってきましたが、保守費とライセンス費の見直しを機にFlyto2を評価。90日経った報告です。

良かった点：
- WinActorのデスクトップアプリ操作は強力だが、最近の業務はブラウザ完結が多くWinActorのオーバースペック感があった
- Flyto2は録画ベースで非エンジニアでも触りやすい
- スクリプトのgit管理ができてレビュー文化が定着

苦戦した点：
- WinActorで使っていたExcelマクロ連携は別途Python helper化が必要だった
- 大量のWinActorワークフロー（200本超）の移植は計画通りには進まず、優先度高いものから順次

総合的にはコストと生産性で前進。移行を検討するチームへ：80/20で「よく動かす20%」だけ移行して、残り80%は段階的でいいです。`,
    tags: ['discussion', 'winactor', '移行'],
    comments: [
      { author: 'admin', hours_after: 7,
        body: '日本市場ではWinActor / UiPathからの移行事例を蓄積中なので、貴重なフィードバックです。「80/20で先に動かすもの移行」の方針は他社事例とも一致します。' },
      { author: 'yuki', hours_after: 12,
        body: '同じ移行を検討中。80/20アプローチ参考になります。' },
    ],
  },
  {
    product: 'cloud', lang: 'ja', category: 'question',
    author: 'yuki', days_ago: 32, views: 19, reactions: 1,
    title: 'Slack DMの翻訳 en-ja の自動化',
    body:
`英語圏のメンバーとSlack DMでやり取りすることが多い。受信メッセージを自動で日本語に翻訳して、新規メッセージのドラフトを日本語→英語で生成する仕組みを考えています。

Slack DMはAPI、翻訳はDeepLで、Flyto2の出番は…どこ？`,
    tags: ['slack', 'translation'],
    comments: [
      { author: 'admin', hours_after: 6,
        body: '正直に言うと、このケースではFlyto2の出番はありません。Slack API + DeepL APIで完結します。Flyto2はAPIが届かない領域に使うツールなので、適材適所の判断は正解です。' },
    ],
  },
  {
    product: 'cloud', lang: 'ja', category: 'bug',
    author: 'mtanaka', days_ago: 35, views: 26, reactions: 2,
    title: 'Google Driveに日本語ファイル名でアップロード時、文字化け',
    body:
`Flyto2のworkflowでGoogle Driveに「請求書_2026年4月.pdf」をアップロードすると、Driveに表示される名前が「???2026???.pdf」に。

ローカルでのファイル名は正しく、Drive側で何か起きている印象。`,
    tags: ['bug', 'google-drive', '日本語'],
    comments: [
      { author: 'admin', hours_after: 4,
        body: 'Drive APIのアップロードヘッダーでファイル名がlatin-1エンコードされている既知不具合。Workaround: ファイル名をASCII化してアップロード後、Drive UI上でリネーム。修正はv2.5の対象。' },
    ],
  },
  {
    product: 'cloud', lang: 'ja', category: 'question',
    author: 'esakai', days_ago: 39, views: 17, reactions: 1,
    title: 'Notion 日本語検索のあいまい一致',
    body:
`Notionの検索で「請求書」を検索すると、「請求」や「請求書類」も拾うのですが、「請求書 2026」のような複合語が拾えない。Flyto2側で何か工夫できますか？`,
    tags: ['notion', '検索'],
    comments: [
      { author: 'admin', hours_after: 6,
        body: 'Notion検索のCJK対応はかなり弱いです（Notion側の問題）。Flyto2でできるのはAPIで全件取得→ローカルでより良い検索（kuromojiでtokenize等）。Web UI検索のクオリティはNotion改善待ちです。' },
    ],
  },
  {
    product: 'cloud', lang: 'ja', category: 'feature',
    author: 'wkurosaki', days_ago: 42, views: 23, reactions: 3,
    title: 'LINE WORKSとの統合',
    body:
`LINE WORKSは日本企業で広く使われています。Flyto2の通知送信先にLINE WORKSを追加したい。`,
    tags: ['feature', 'line-works'],
    comments: [
      { author: 'admin', hours_after: 11,
        body: 'LINE WORKSはMessaging APIあり。LINE（個人向け）と一緒に統合候補に入れます。日本市場の優先度評価でリクエスト多いかどうかで実装順を決めます。' },
    ],
  },
  {
    product: 'cloud', lang: 'ja', category: 'question',
    author: 'dkato', days_ago: 46, views: 20, reactions: 2,
    title: '経費精算ワークフローの設計指針',
    body:
`月50件程度の経費精算を自動化したい。領収書スキャン（OCR）→社内承認システム入力→Slackで承認者通知、までの流れ。

設計上気をつけることは？`,
    tags: ['設計', '経費'],
    comments: [
      { author: 'shimizu', hours_after: 8,
        body: 'OCR部分はFlyto2の範囲外（exec stepで外部に委譲）。承認システムは多くの場合UIアクセスなのでFlyto2の出番。重要なのは「OCR間違いを人間がチェックするゲート」をワークフローに入れること。完全自動化はOCR精度的にリスク高い。' },
      { author: 'admin', hours_after: 12,
        body: '+1 human-in-the-loop checkpoint推奨。OCR間違いで誤った金額で承認回した場合のリカバリーが面倒。' },
    ],
  },
  {
    product: 'cloud', lang: 'ja', category: 'question',
    author: 'lnaka', days_ago: 49, views: 18, reactions: 1,
    title: 'SmartHR従業員データの同期',
    body:
`SmartHRから従業員データを別の社内システム（独自）に同期したい。SmartHRはAPIあり、別システムはAPIなし（Web only）。Flyto2でこの間をつなぐ構成で問題ないでしょうか？`,
    tags: ['smarthr'],
    comments: [
      { author: 'admin', hours_after: 7,
        body: 'ちょうど良いユースケースです。SmartHR API → 構造化データ → Flyto2が独自システムに入力、の流れ。APIで読み込んだデータをワークフロー入力として渡す方法はドキュメントの「inputs」セクションを参照ください。' },
    ],
  },
  {
    product: 'cloud', lang: 'ja', category: 'bug',
    author: 'shimizu', days_ago: 52, views: 19, reactions: 2,
    title: 'macOS Sequoia で録画中のカーソル位置がずれる',
    body:
`macOS Sequoia 15.0にアップグレードしてから、録画中のクリック座標がブラウザの実際の位置と数px ずれるようになりました。再生時にクリック失敗が起きます。`,
    tags: ['bug', 'macos', 'sequoia'],
    comments: [
      { author: 'admin', hours_after: 5,
        body: 'Sequoiaでのウィンドウ座標系の扱いが微妙に変わったのが原因。v2.4.2でmacOS Sequoia対応のキャリブレーションを追加します。それまでのworkaroundとして、座標ベースではなくselectorベースで録画してください（座標は最終手段）。' },
    ],
  },
  {
    product: 'cloud', lang: 'ja', category: 'discussion',
    author: 'yuki', days_ago: 56, views: 89, reactions: 11,
    title: '営業チーム月60件案件の自動化',
    body:
`営業3人のチームで、月60件のSFAレコード更新（Salesforce）を自動化。それぞれの案件の進捗フラグ、メモ、添付資料リンク等。

学んだこと：
- 営業のメモは手書きベース（紙）が多く、まずデジタル化（音声入力ベース）が必要だった
- Flyto2でSalesforceに入れる部分は安定しているが、その前のデータ整形が9割
- 営業メンバーは「自動化された」より「メモ書きが少し楽になった」と感じている

Flyto2の自動化が本当に効くのは、その前後の準備作業を整理した時。`,
    tags: ['discussion', '営業', 'salesforce'],
    comments: [
      { author: 'admin', hours_after: 9,
        body: '「自動化される側の上流を整理する」というのは多くのチームが見落とすポイントです。RPA / 自動化導入の8割の失敗はここから来ています。' },
    ],
  },
  {
    product: 'cloud', lang: 'ja', category: 'question',
    author: 'mtanaka', days_ago: 60, views: 16, reactions: 1,
    title: 'スプレッドシート関数の自動入力',
    body:
`Google Sheetsに「=VLOOKUP(...)」のような関数をFlyto2で入力すると、=が普通の文字として入る（関数として認識されない）。回避策ありますか？`,
    tags: ['google-sheets', '関数'],
    comments: [
      { author: 'admin', hours_after: 4,
        body: 'typed text stepは関数開始の=を文字としてエスケープしてしまいます。evaluate stepで `cell.setFormula(...)` を呼ぶか、貼り付け（clipboard）経由で入れると関数として認識されます。' },
    ],
  },
  {
    product: 'cloud', lang: 'ja', category: 'question',
    author: 'esakai', days_ago: 63, views: 17, reactions: 1,
    title: 'AsanaからBacklogへの移行',
    body:
`AsanaからBacklogに乗り換え検討中。タスクの履歴とコメントをBacklogに持っていきたいのですが、両者のデータモデルが微妙に違います。

移行時のフィールドマッピングのコツは？`,
    tags: ['asana', 'backlog', '移行'],
    comments: [
      { author: 'admin', hours_after: 6,
        body: '両APIで完結します。重要なフィールドマッピング：Asana sections → Backlogマイルストーン、Asana custom fields → Backlog課題タイプ。コメントは時系列保持、添付ファイルは別途ダウンロード→再アップロードが必要。Flyto2は両者API直叩きできない部分（権限設定UIなど）に残しておくと良いです。' },
    ],
  },
  {
    product: 'cloud', lang: 'ja', category: 'feature',
    author: 'wkurosaki', days_ago: 67, views: 24, reactions: 3,
    title: 'Teams議事録の自動まとめ',
    body:
`MS Teamsの会議録画→自動文字起こし→Notion議事録ページ作成、という流れを標準サポートして欲しい。手動だと録画後30分の作業。`,
    tags: ['feature', 'teams', '議事録'],
    comments: [
      { author: 'admin', hours_after: 10,
        body: '「meeting hooks」統合の一環としてTeams / Zoom / Meet / Webex 横断で考えています。Teamsは公式APIがあるのでJoinerボット的に動かすパターンが現実的。' },
    ],
  },
  {
    product: 'cloud', lang: 'ja', category: 'question',
    author: 'dkato', days_ago: 70, views: 15, reactions: 1,
    title: 'Confluence日本語タイトルのスクレイピング',
    body:
`社内Confluenceの記事タイトルが日本語混在。検索結果ページから一覧取得時、日本語タイトルが文字化けして取れる現象。`,
    tags: ['confluence', '日本語'],
    comments: [
      { author: 'admin', hours_after: 5,
        body: 'Confluence APIで取る場合は文字化けしないはず。Flyto2の録画でWeb UIから取っていますか？その場合、ブラウザのコンソール文字エンコーディング設定で確認。LANG設定が正しければ問題ないはずです。' },
    ],
  },
];

// ----------------------------------------------------------------
// JA × code
// ----------------------------------------------------------------

const JA_CODE = [
  {
    product: 'code', lang: 'ja', category: 'question',
    author: 'yuki', days_ago: 6, views: 32, reactions: 3,
    title: 'flyto-indexer 日本語コメントへの対応',
    body:
`Pythonコードベース内に日本語コメントが多数あります。flyto-indexerは検索や監査時にこれらを正しく扱いますか？`,
    tags: ['indexer', '日本語'],
    comments: [
      { author: 'admin', hours_after: 5,
        body: 'はい、Unicodeコメントは正しく扱われます。検索の単語分かち書きをしたい場合は `--cjk-tokenize` オプション（jieba利用）がありますが、日本語は MeCab ベースが望ましいケースもあります。v2.7.4で日本語専用tokenizerを評価中。' },
    ],
  },
  {
    product: 'code', lang: 'ja', category: 'question',
    author: 'mtanaka', days_ago: 14, views: 24, reactions: 2,
    title: 'audit が厳しすぎる、しきい値の調整方法',
    body:
`audit実行すると300件の指摘が出てきて、優先度判断が難しい。デフォルトしきい値の調整方法と推奨設定は？`,
    tags: ['audit', '設定'],
    comments: [
      { author: 'admin', hours_after: 6,
        body: '300件は多いですね。最初の調整：(1) test files除外（.flyto-rules.yamlのaudit.test_file_globs）(2) complexity threshold を10に上げる (3) generated code除外。これだけで通常50-70件まで絞れます。優先度はseverity HIGH > MEDIUMの順で確認するのが王道です。' },
    ],
  },
  {
    product: 'code', lang: 'ja', category: 'bug',
    author: 'esakai', days_ago: 22, views: 18, reactions: 1,
    title: 'Windows + 日本語パスでscanエラー',
    body:
`Windows 11、Python 3.11環境。プロジェクトパスに「ドキュメント」が含まれているとscanがOSErrorで落ちる。WSLでは問題なし。`,
    tags: ['bug', 'windows', '日本語パス'],
    comments: [
      { author: 'admin', hours_after: 7,
        body: 'Windows非ASCIIパスの既知問題。v2.7.4で修正予定。当面はWSL利用かASCIIパスへの移動で回避してください。' },
    ],
  },
  {
    product: 'code', lang: 'ja', category: 'feature',
    author: 'shimizu', days_ago: 32, views: 27, reactions: 4,
    title: 'レポート日本語化',
    body:
`flyto-codeのreport出力（HTMLとPDF）を日本語化したい。findingsの分類名や説明が日本語だと、非エンジニア（管理職、QA）にも理解しやすい。`,
    tags: ['feature', 'i18n', 'report'],
    comments: [
      { author: 'admin', hours_after: 8,
        body: 'dashboard / reportのi18nはv2.8計画内。日本語含めen/zh/jaで開始予定。findings分類名の翻訳もネイティブ品質を確保するためレビューをかけています。' },
    ],
  },
  {
    product: 'code', lang: 'ja', category: 'discussion',
    author: 'wkurosaki', days_ago: 45, views: 56, reactions: 7,
    title: 'flyto-code 60日レビュー',
    body:
`flyto-codeを社内CIに組み込んで60日。Goで書かれた監視サービス（30万行）が対象。

数字：
- 平均PR scan time：1分20秒
- 検出されたHIGH issue：23件
- 実際にbugfix扱いになった：8件
- false positive：5件
- 該当箇所だが意図的にそのままだった：10件

判断率（実際のfix率）は35%。チーム内で「flyto-code指摘の85%は読む価値あり」と評価されています。`,
    tags: ['discussion', '60日'],
    comments: [
      { author: 'admin', hours_after: 9,
        body: '「読む価値あり率85%」は具体的で説得力のある数値。fix率35%は妥当な範囲です（false positive 5/23 + 意図的 10/23）。レポート作成された場合、引用させていただきたいです（匿名でも可）。' },
    ],
  },
];

// ----------------------------------------------------------------
// Combined export
// ----------------------------------------------------------------

export const BULK_POSTS = [
  ...EN_CLOUD,
  ...EN_CODE,
  ...ZH_CLOUD,
  ...ZH_CODE,
  ...JA_CLOUD,
  ...JA_CODE,
];
