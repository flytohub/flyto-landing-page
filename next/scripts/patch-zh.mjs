/**
 * One-shot script to fill in Traditional Chinese translations for sections
 * that were added to en.json but not yet mirrored in zh.json. Also rewrites
 * home.hero and home.cta which were left as old Cloud-specific copy.
 *
 * Usage:  node scripts/patch-zh.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs';

const path = 'messages/zh.json';
const zh = JSON.parse(readFileSync(path, 'utf8'));

// ---- home.hero — platform-neutral ----
zh.home.hero = {
  eyebrow:     'FLYTO2 · 離線優先的自動化',
  title:       '把工作留在',
  titleAccent: '你自己的機器上。',
  lede:        'Flyto2 用同一套離線優先引擎,做兩款產品。一個自動化你在瀏覽器裡的重複工作,一個審你出貨的每一行程式碼的安全姿態。',
  reassure:    '開源 · 無遙測 · 屬於你',
};

// ---- home.cta — neutral platform ----
zh.home.cta = {
  label:     '探索平台',
  title:     '兩款產品。同一個哲學。',
  body:      'Cloud 已出貨,Warroom 在路上。底層共用同一套離線優先引擎 — 挑今天能解決你問題的那個。',
  primary:   '前往 Cloud',
  secondary: '前往 Warroom',
};

// ---- home.products ----
zh.home.products = {
  label:    '兩款產品',
  title:    '挑能解決今天問題的那個。',
  subtitle: '同一套引擎、同一種哲學。每款產品有自己的目標族群、自己的頁、自己的定價。',
  cloud: {
    name:        'Cloud',
    statusLabel: '出貨中',
    tagline:     '無程式碼瀏覽器自動化。一次錄製,永遠重播。',
    point1:      '錄製任何瀏覽器流程,不用寫選擇器',
    point2:      '執行中可暫停、檢查、改值、繼續',
    point3:      '250+ 預先接好的模組 — CSV、Stripe、Notion、Slack、OpenAI',
    cta:         '前往 Cloud',
  },
  warroom: {
    name:        'Warroom',
    statusLabel: '預上線',
    tagline:     '應用程式安全戰情室。SCA、SAST、密鑰、授權、CVE — 一張作戰圖。',
    point1:      'A–F 健康分數,把所有訊號收斂成一個成績',
    point2:      '可達性分析 — 修真的會跑到的 CVE',
    point3:      '今天可裝的開源 CLI,代管戰情室緊接著上',
    cta:         '前往 Warroom',
  },
};

// ---- home.benefits ----
zh.home.benefits = {
  items: [
    { iconName: 'Zap',       metric: '1.2 秒', title: '中位執行時間', body: '大多數工作流兩秒內結束。跑得跟你動作一樣快。' },
    { iconName: 'ShieldOff', metric: '0',       title: '送出去的 byte', body: '憑證、執行紀錄全在你機器上。沒有遙測,沒有偷偷回家。' },
    { iconName: 'Code2',     metric: 'MIT',     title: '開源核心',     body: '讀程式碼、Fork、出貨。執行引擎在 GitHub + PyPI 上。' },
    { iconName: 'Globe2',    metric: '16',      title: '語言',         body: '錄製器、執行環境、文件、錯誤訊息 — 全部翻譯,不只貼標籤。' },
  ],
};

// ---- home.examples (when shown) ----
zh.home.examples = {
  label:        '真實工作流',
  title:        '別人實際做出來的東西。',
  subtitle:     '每張卡都是 Flyto2 端到端跑過的工作流 — 錄一次、按時程重播、產出歸檔到你想要的地方。',
  viewWorkflow: '檢視這個工作流',
  items: [
    { category: '每日摘要',   title: 'Hacker News 早報',     body: '每天 7 點抓 Top 30、用 OpenAI 摘要、開站立會議前推到私 Slack。',                       metric: '執行 · 每日 06:55' },
    { category: '開發情報',   title: 'GitHub trending 追蹤', body: '盯一個 tag 的 trending,新 repo 寫進 Sheets 帶 stars、licence、語言。',               metric: '執行 · 每小時' },
    { category: '效能',       title: 'Pagespeed 批次稽核',   body: '吃一份 URL CSV,回一張 Sheet 含 mobile/desktop 分數、Core Web Vitals 變化、退步 Slack 通知。', metric: '執行 · 每週' },
    { category: '安全',       title: 'Security headers 巡邏', body: '探測一群 domain,給 header 評分,按 owner 歸檔。取代沒人有空維護的季度稽核腳本。',         metric: '執行 · 每月' },
  ],
};

// ---- home.integrations ----
zh.home.integrations = {
  label:    '整合',
  title:    '開箱即用 250+ 模組。',
  subtitle: '配線都接好了。拖拉、設定、跑 — 不用再寫一次「把 Sheet A 的這列複製到 API B」這種腳本。',
  andMore:  '+ 230 個更多 · 也可以自己用 Python / JS 寫',
};

// ---- cloud.codeSample ----
zh.cloud.codeSample = {
  label:    '幕後',
  title:    '它就是一個你看得懂的檔案。',
  subtitle: '錄好的工作流是一個 JSON 檔。提交到 git、code review 看 diff、從 CI 跑、從任何地方觸發。',
  point1:   '純 JSON — 不是私有二進位格式',
  point2:   '從 CLI、webhook、cron、自家後端觸發都行',
  point3:   '一行指令 export 成 GitHub Actions、GitLab CI 或 Jenkins',
};

// ---- cloud.comparison ----
zh.cloud.comparison = {
  label:         '對比其他選項',
  title:         '為什麼有人從別家換到 Flyto2。',
  subtitle:      'Zapier、Make、Selenium 各補一塊。需要瀏覽器真實行為、跑在自己機器上、不按工作量計費時 — 你會用 Flyto2。',
  featureHeader: '你需要的能力',
  data: {
    rows: [
      { feature: '錄製真實瀏覽器動作',         values: ['yes', 'no',      'no',      'yes'] },
      { feature: '離線跑 / 在自己機器上',      values: ['yes', 'no',      'no',      'yes'] },
      { feature: '個人使用免費',                values: ['yes', 'partial', 'partial', 'yes'] },
      { feature: '視覺編輯器(免寫程式)',      values: ['yes', 'yes',     'yes',     'no']  },
      { feature: '執行中可暫停、檢查、繼續',    values: ['yes', 'no',      'no',      'partial'] },
      { feature: '按 points 計價,不是按 task', values: ['yes', 'no',      'no',      'yes'] },
      { feature: '工作流是純 JSON',            values: ['yes', 'no',      'no',      'no']  },
      { feature: '開源引擎',                    values: ['yes', 'no',      'no',      'yes'] },
    ],
  },
};

// ---- cloud.recipes ----
zh.cloud.recipes = {
  label:    '預錄方',
  title:    '一行指令,真實結果。',
  subtitle: 'Recipe 是已經接好線、跑過的工作流。裝 Cloud、`flyto recipe [name]`,直接拿到報表。基本款不需要設定也不需要 API key。',
  items: [
    {
      iconName: 'Search',
      name:     'competitor-intel',
      command:  'flyto recipe competitor-intel --url https://competitor.com/pricing',
      body:     '抓定價方案、桌機 + 手機截圖、Web Vitals、SEO meta,回一份結構化 JSON 報表。',
      outputs:  ['pricing.json', 'intel-desktop.png', 'intel-mobile.png', 'vitals', 'seo'],
    },
    {
      iconName: 'Activity',
      name:     'full-audit',
      command:  'flyto recipe full-audit --url https://example.com',
      body:     'Web Vitals + SEO + 無障礙(alt 標籤、label)+ console 錯誤 + 行動/桌機截圖 + 可印 PDF。',
      outputs:  ['audit.json', 'audit-desktop.png', 'audit-mobile.png', 'audit-page.pdf'],
    },
    {
      iconName: 'Globe',
      name:     'site-audit',
      command:  'flyto recipe site-audit --url https://github.com',
      body:     'SEO + 效能稽核 — meta、heading、缺 alt、Web Vitals、整頁截圖。比 full-audit 輕,幾秒就跑完。',
      outputs:  ['report.json', 'page.png'],
    },
    {
      iconName: 'Camera',
      name:     'screenshot',
      command:  'flyto recipe screenshot --url https://flyto2.com --device mobile',
      body:     '任意 viewport 像素級精準截圖。QA、設計 review、每日變化偵測 diff 都用得上。',
      outputs:  ['screenshot.png'],
    },
  ],
};

// ---- download ----
zh.download = {
  metaTitle:       '下載 Flyto2',
  metaDescription: '下載 Flyto2 — macOS、Windows、Linux 桌面版免費。離線運行的瀏覽器自動化,不需開帳號。',
  downloadFor:     '下載 {os} 版',
  allReleases:     '在 GitHub 上看所有版本',
  hero: {
    eyebrow:     '桌面版 · 免費',
    title:       '下載',
    titleAccent: 'Flyto2。',
    lede:        '個人使用永久免費。macOS、Windows、Linux,內建開源引擎。不開帳號、不發遙測、離線跑。',
  },
  docker: {
    title: '用 Docker 自架',
    body:  '在容器裡跑同一套引擎 — 適合無頭伺服器、CI agent 或氣隙企業環境部署。',
    cta:   'Docker Hub',
  },
  oss: {
    title: '或就要引擎,直接 PyPI',
    body:  '執行核心是 MIT 授權的 Python。當函式庫裝、用 CLI、嵌進你自己的 pipeline。',
    cta:   '在 GitHub 看原始碼',
  },
  cta: {
    label:     '其他資源',
    title:     '需要更具體的東西?',
    body:      '想找舊版、不同架構、或要進入受規範環境部署?到 GitHub releases 或文件看看。',
    primary:   '前往 releases',
    secondary: '閱讀文件',
  },
};

// ---- pricing ----
zh.pricing = {
  metaTitle:       '定價 — Flyto2',
  metaDescription: '個人使用永久免費。Pro 每月 $9、Team 每月 $19。離線運行的瀏覽器自動化,定價透明。',
  perMonth:        '/ 每月',
  mostPopular:     '最熱門',
  priceFootnote:   'USD · 隨時取消 · 開始不需信用卡',
  hero: {
    eyebrow:     '定價',
    title:       '個人永久免費。',
    titleAccent: '需要時再升級。',
    lede:        '桌面版和開源引擎個人用免費。需要代管排程、團隊管理或更高月運算量時再升級。',
  },
  plans: {
    free: {
      label:    '免費',
      name:     'Free',
      tagline:  '個人探索自動化。',
      feature1: '每月 1,000 運算點數',
      feature2: '最多 5 個工作流',
      feature3: '全部 250+ 模組',
      feature4: '社群支援',
      cta:      '免費下載',
    },
    pro: {
      label:    'PRO',
      name:     'Pro',
      tagline:  '每天跑自動化的進階使用者。',
      feature1: '每月 50,000 運算點數',
      feature2: '無限工作流',
      feature3: '代管排程 — cron、webhook、retry',
      feature4: '優先支援,24 小時 SLA',
      feature5: '可發布到市集',
      cta:      '從 Pro 開始',
    },
    team: {
      label:    'TEAM',
      name:     'Team',
      tagline:  '營運團隊跨公司共用工作流。',
      feature1: '每月 200,000 運算點數',
      feature2: '最多 10 席',
      feature3: 'RBAC 與共用市集',
      feature4: 'SSO(Google、Microsoft)',
      feature5: '專屬導入',
      cta:      '從 Team 開始',
    },
  },
  faq: {
    label:    '常見問題',
    title:    '定價問題,先答清楚。',
    subtitle: '運算點數、席次上限、計費 — 買家刷卡前會問的問題。',
    items: [
      { q: '什麼是「運算點數」?',           a: '一個 point 大致等於一個工作流步驟(一次點擊、一個 CSV 列、一次 API 呼叫)。50,000 點數約等於每月 100 小時的典型瀏覽器自動化。' },
      { q: '免費方案真的永久免費?',           a: '是。桌面版和開源引擎個人使用永久免費。免費版唯一沒有的就是代管排程和團隊功能。' },
      { q: '超過月點數會怎樣?',               a: '工作流暫停到下一週期,或加購 $0.20 / 1,000 點數。我們不會偷偷超收 — 加購前會請你確認。' },
      { q: '有年付折扣嗎?',                   a: '年付 Pro 和 Team 省 20%。教育和非營利有折扣 — 寫信到 info@flyto2.com。' },
      { q: '可以 self-host 嗎?',              a: '可以。PyPI 上的開源引擎除了代管排程之外什麼都跑得了。企業版含 SSO、氣隙部署在路線圖上。' },
    ],
  },
  cta: {
    label:     '還在猶豫',
    title:     '先試,再付。',
    body:      '下載免費桌面版,錄一個工作流,看 Flyto2 適不適合你正在解的問題。決定值得了再升級。',
    primary:   '免費下載',
    secondary: '閱讀文件',
  },
};

// ---- templates ----
zh.templates = {
  metaTitle:           '範本 — Flyto2 市集',
  metaDescription:     '預先做好的工作流範本:抓發票、爬資料、富化 lead 等等。一鍵安裝。',
  gridLabel:           '最多人裝',
  gridTitle:           '人們真的在跑的工作流。',
  gridSubtitle:        '這些是真實客戶帳號裡會看到的食譜。每張都是起點 — clone、改、跑。',
  contributeOnGithub:  '在 GitHub 貢獻一個範本',
  hero: {
    eyebrow:     '市集 · 持續成長',
    title:       '一鍵就能裝起來的',
    titleAccent: '工作流範本。',
    lede:        '錄好、貼好標籤、可直接跑。從 app 內看市集,或先掃下面最熱門的 — 每個都附原始工作流檔可改。',
  },
  items: [
    { iconName: 'Receipt',      category: '財務',     title: '發票抓取',          body: '登入廠商系統、下載 PDF、按客戶歸檔、把總額推到 Sheets。' },
    { iconName: 'ShoppingCart', category: '電商',     title: '訂單對帳',          body: '從 Stripe 拉訂單、跟 Shopify 對應、把差異浮上 Slack。' },
    { iconName: 'Search',       category: '研究',     title: '競品監控',          body: '訪問 URL 清單、抓定價、有變化就通知 Slack。' },
    { iconName: 'Mail',         category: '成長',     title: 'Lead 富化',         body: '從 CRM 拉、走公開網路富化、加標籤再寫回去。' },
    { iconName: 'Database',     category: '同步',     title: '跨 SaaS 同步',     body: '橋兩個原生不會講話的 SaaS,每晚跑一次。' },
    { iconName: 'Calendar',     category: '營運',     title: '行事曆批次處理',    body: '讀預約 CSV、建行事曆事件、發提醒。' },
    { iconName: 'FileText',     category: '合規',     title: '文件抓取',          body: '季度下載對帳單、合約、證書 — 自動歸檔。' },
    { iconName: 'Bell',         category: '監控',     title: '網站可用性檢查',    body: '掃一份 URL、檢查狀態、變紅就警示。' },
  ],
  cta: {
    label:     '找不到嗎',
    title:     '告訴我們你最想自動化什麼。',
    body:      '想要某個工作流範本?到 GitHub Discussions 留言或自己寫 — 執行環境是開源的。',
    primary:   '到 Discussions',
    secondary: '閱讀文件',
  },
};

// ---- code.closedLoop ----
zh.code.closedLoop = {
  label:        '差異化',
  title:        '閉環驗證。',
  subtitle:     '其他安全工具報完警告就停了。Warroom 把每個 finding 變成 YAML pentest、用真實瀏覽器對你的 staging 跑、回一個判決 — 可重現、被擋下、不可達。',
  find:        { title: '發現',     body: 'SCA、SAST、密鑰、授權、IaC。同一次掃描順便把你的程式碼解析成 call graph 與架構圖。',                          signal: 'scan' },
  craft:       { title: '生成',     body: '對每個跟安全有關的 finding,產出一個範圍鎖在受影響路由上的 YAML pentest 工作流。',                            signal: 'yaml' },
  run:         { title: '執行',     body: '在真實 Chrome session 裡對 staging 跑工作流。今天就有 12 支官方 OWASP / LLM / 業務邏輯 playbook。',           signal: 'live' },
  verdictStep: { title: '判決',     body: '採集 HMAC 簽章證據、回報 exploitable / sanitized / unreachable、把工作流入 regression vault 每晚重跑。',     signal: 'ledger' },
  verdict: {
    exploitable: { title: '可重現', body: '弱點端到端跑通。證據包附上。提到處理佇列最前面。' },
    sanitized:   { title: '被擋下', body: '被下游控制(auth、WAF、framework)擋住。記下來、降優先。' },
    unreachable: { title: '不可達', body: '弱點程式碼存在,但沒有 user input 路徑能走到。承認、低優先。' },
  },
};

// ---- code.proof ----
zh.code.proof = {
  label:    '實證',
  title:    '我們對 OWASP Juice Shop 跑過。',
  subtitle: '不是合成沙箱。經典的故意做漏洞的電商 app,端到端走過閉環。一次 campaign 跑出這些。',
  caption:  '每個 finding 都附 HMAC 簽章證據包。攻擊鏈每晚透過 regression vault 重跑 — 修了就會驗證它有沒有壞回去。',
  data: {
    metric: [
      { value: '5',    label: 'BREACH 級攻擊鏈' },
      { value: '11',   label: 'Critical findings' },
      { value: '12',   label: 'Pentest playbook' },
      { value: '100%', label: '每晚可重跑' },
    ],
    chain: [
      { vector: 'SQLi · login',         finding: 'POST /rest/user/login 的 `email` 欄套套邏輯繞過驗證 — 跳過 auth、發出 session token。' },
      { vector: 'Token theft',          finding: '從 response 抽出 JWT、解碼 — 沒有 admin claim,但簽章金鑰跨 user 共用。' },
      { vector: 'Chained IDOR',         finding: 'GET /api/Users/{id} 接受任意 id;server 回完整紀錄含密碼 hash。' },
      { vector: 'Privilege escalation', finding: '用洩漏的金鑰偽造 JWT、設 role=admin、重送請求 — admin 端點回 200。' },
      { vector: 'Data exfiltration',    finding: 'GET /api/Orders 列舉每個客戶的購買紀錄。證據包大小 2.4 MB。' },
    ],
  },
};

// ---- code.features (7 screenshot rows) ----
zh.code.features = {
  label:    '戰情室裡',
  title:    '七個視角,一個事實源。',
  subtitle: 'Warroom 的每個面板都對應安全團隊已經在問的問題。這些就是你進戰情室實際看到的東西。',
  items: [
    {
      label: '儀表板', title: '一個 A–F 分數,管所有專案。',
      body: '把每個訊號 — SCA、SAST、密鑰、授權、CVE、執行期 — 收斂成一個成績。CISO 看標題,工程師鑽進在流血的那塊。',
      imageAlt: 'Warroom 健康儀表板含 A–F 評分',
      bullets: ['每個類別的趨勢線', '依團隊與服務的彙整', '自動產生的週報'],
    },
    {
      label: '可達性', title: '哪些 CVE 真的會被跑到。',
      body: '大多數 CVE 警告是雜訊 — 弱點函式根本沒被你的程式碼呼叫到。可達性分析追真實 call path,讓你修真正會被打的 5%,不是 95% 不會被打的。',
      imageAlt: '可達性分析顯示可被利用的呼叫路徑',
      bullets: ['靜態 + 動態 call graph', '跨 package 的 taint 傳播', '誤報率用測的,不是宣稱的'],
    },
    {
      label: '依賴關係', title: '把你的供應鏈畫出來。',
      body: '所有直接與遞移依賴,按風險加權,疊上 CVE。點任一節點看誰把它拉進來、它接下來拉誰、你哪個服務依賴它。',
      imageAlt: '帶弱點疊加的依賴圖',
      bullets: ['授權 + 維護者風險疊圖', '抓出多版本鎖在不同地方的重複', 'monorepo 設定自動帶出 ownership 標籤'],
    },
    {
      label: '架構', title: '你 codebase 的整體形狀。',
      body: '模組、服務、資料流、ownership 邊界 — 直接從原始碼推導出來,不是六個月沒更新的 wiki。完全不靠註解就能讀,出貨越多越精確。',
      imageAlt: '服務與模組的架構圖',
      bullets: ['從 build file 自動發現服務', '標出跨邊界呼叫', 'diff 上一版抓漂移'],
    },
    {
      label: 'API 表面', title: '每個端點都列冊。',
      body: 'REST、gRPC、GraphQL — Warroom 從你的 handler 找出來,列出收什麼、回什麼、誰呼叫。Auth 缺口和未驗證端點自動浮上來。',
      imageAlt: 'API 端點清單含 auth metadata',
      bullets: ['每條路由的 auth 策略欄', '對外 vs 對內分類', '任何框架都能 export OpenAPI'],
    },
    {
      label: '基礎設施', title: '同一輪掃 IaC。',
      body: 'Terraform、Kubernetes manifest、Dockerfile — Warroom 跟應用程式碼一起讀,安全姿態與執行期拓樸一次跑出來。',
      imageAlt: '基礎設施即代碼掃描畫面',
      bullets: ['Terraform、Helm、K8s、Dockerfile', '錯誤設定目錄跟著 CIS 同步', '漂移偵測:部署的 vs 簽進去的'],
    },
    {
      label: '脈動', title: '安全姿態隨時間漂移。',
      body: '一個團隊級的即時跑馬燈,顯示什麼變了、何時變的、影響分數多少。不是用來瀏覽的儀表板,是用來「察覺」的儀表板。',
      imageAlt: '顯示安全姿態漂移時間線的脈動視圖',
      bullets: ['每個工程師對風險變動的貢獻', '分數突降的升級規則', '可重播歷史 — 看哪個 commit 動了指針'],
    },
  ],
};

// ---- code.cta ----
zh.code.cta = {
  label:     '搶先體驗',
  title:     '第一個進戰情室。',
  body:      '代管戰情室是瀏覽器版 — 不用裝 app。加等候名單拿 Phase III 開放邀請,今天就先抓開源掃描器。',
  primary:   '加入等候名單',
  secondary: '安裝開源掃描器',
};

writeFileSync(path, JSON.stringify(zh, null, 2) + '\n');
console.log('zh.json patched.');
