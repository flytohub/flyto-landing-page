# Flyto2 Platform -- Whitepaper Audit

> 全平台技術審計。涵蓋 27 個儲存庫、451 個 registry-backed modules、
> 84 個 catalog categories、41 個 recipes，以及 665 個 Engine HTTP route registrations。

---

## 1. Platform Overview

Flyto2 是一個 **全棧工作流自動化平台**，由 27 個分工儲存庫組成。
下表列出主要公開執行、產品與開發者介面，不代表完整清單：

| 專案 | 技術 | 定位 |
|------|------|------|
| flyto-core | Python (PyPI) | 執行引擎 -- 451 模組、84 類別、41 食譜、4 層架構 |
| flyto-cloud | Vue 3 + FastAPI | SaaS 平台 -- 4 服務架構、Provider 模式 |
| flyto-pro | Python (PyPI) | 智慧 SDK -- 合約引擎、EMS、演化系統 |
| flyto-indexer | Python (PyPI) | 程式碼智慧 MCP Server -- 20 smart tools、47 compatibility definitions、污點分析 |
| flyto-vscode | TypeScript | IDE 安全代理 -- Guardian Gate、MCP 整合 |
| flyto-modules-pro | Python | 進階模組 -- 隱身瀏覽器、驗證碼、企業連接器 |
| flyto-i18n | JSON | 16 語言、CDN OTA 更新 |
| flyto-landing-page | Next.js 15 + OpenNext | 多語公開網站、Cloudflare Worker、SEO/AEO/GEO |

---

## 2. Core Philosophy -- 設計理念

### 2.1 用戶自主整合，不受平台限制

**用戶自主整合機制：** 不需要等官方開發新整合，使用者可立即串接任何外部服務。

**10 種自主整合機制：**

| 機制 | 模組/功能 | 場景 |
|------|----------|------|
| HTTP 任意 API | `http.request` -- GET/POST/PUT/PATCH/DELETE + Bearer/Basic/API Key 認證 + 自動重試 | 串接任何 REST API |
| GraphQL | `graphql.query`, `graphql.mutation` | 串接 GraphQL 端點 |
| OAuth2 任意 Provider | `auth.oauth2` -- authorization code, refresh, client credentials, PKCE | Google/GitHub/Notion/Stripe 等任何 OAuth2 服務 |
| Webhook 接收 | `http.webhook_wait` -- 臨時 HTTP server + ngrok tunnel | 接收任何服務的推送 |
| Template 當模組 | `template.invoke` -- 把模板變成可複用節點 | 把做好的整合包裝成「積木」 |
| 沙箱程式碼 | `sandbox.execute_python`, `sandbox.execute_js` | 自定義資料轉換邏輯 |
| Shell 執行 | `shell.exec` -- 支援 git, npm, python, node 等 | 系統層級整合 |
| 自訂 Tools | `/tools/` API -- JavaScript/Python 自定義工具 | 可分享的程式碼工具 |
| Plugin 系統 | `plugin.manifest.json` -- PyPI 發布、多語言 | 專業開發者擴充 |
| 瀏覽器自動化 | `browser.*` 50+ 模組 -- 點擊/輸入/擷取/截圖 | 沒有 API 的服務也能自動化 |

### 2.2 可除錯的自動化

**vs 競品的黑箱執行：** 每次執行都有完整的追蹤、回放、斷點、證據收集。

| 能力 | 實作 |
|------|------|
| 三層追蹤 | ExecutionTrace (工作流) -> StepTrace (步驟) -> ItemTrace (資料項) |
| 任意步驟回放 | ReplayManager -- 從任何步驟重新開始，可修改 context |
| 人工審批斷點 | BreakpointManager -- SINGLE / MAJORITY / UNANIMOUS 審批模式 |
| 證據收集 | EvidenceStore -- 截圖、DOM snapshot、context diff |
| 資料血統 | LineageTracker -- 追蹤每個變數的來源和影響 |
| AI 自癒 | StepHealer -- LLM 自動修復失敗步驟（selector 修復、timeout 調整等） |

### 2.3 一套程式碼，四種部署

**Provider Hub 模式** 讓同一套 code 支援四種部署模式：

| 模式 | Auth | Storage | 場景 |
|------|------|---------|------|
| Cloud (SaaS) | Firebase Auth | Firestore | cloud.flyto2.com |
| Enterprise | JWT (enterprise-backend) | PostgreSQL | 企業私有部署 |
| Offline | Local JWT + SQLite | SQLite + Local FS | 桌面離線使用 |
| Desktop | Firebase (proxy to cloud) | Cloud proxy | Tauri 桌面應用 |

### 2.4 LLM 在用戶空間，Runtime 在核心空間

**Dual-AI 架構（flyto-pro）：**
- LLM = 用戶空間（可以出錯）
- Runtime = 核心空間（必須正確）
- ObservationPacket + EvidencePipeline + VerificationRules = 確定性驗證

---

## 3. flyto-core -- 執行引擎

### 3.1 模組系統（451 個 registry-backed modules）

**4 層架構（ADR-001）：**

| 層 | 數量 | 定位 | UI 顯示 |
|----|------|------|---------|
| Builtin | ~10 | 流程控制（in-process） | 隱藏 |
| Atomic | 65 類別 | 核心積木（無外部依賴） | 預設/進階 |
| Third-Party | 7 類別 | 外部服務整合 | 預設 |
| Composite | 8 類別 | 高階工作流模板 | 預設 |

**65 個原子類別：** ai, analysis, archive, array, auth, browser, cache, check, communication, compare, convert, crypto, data, database, datetime, dns, docker, document, element, encode, env, error, file, flow, format, git, graphql, hash, http, huggingface, image, k8s, llm, logic, markdown, math, meta, monitor, network, notification, object, output, path, port, process, queue, random, regex, sandbox, scheduler, set, shell, ssh, stats, storage, string, template, testing, text, training, ui, utility, validate, vector, verify, vision

**連線規則系統：** 設計時就防止語義錯誤
- browser 模組只能連 browser/element/flow（不能直接接 AI/API）
- element 模組需要 browser context
- data 模組可接收任何來源

**模組驗證（validator.py）：** 
- M00x: 元資料完整性
- S00x: Schema 完整性
- C00x: 一致性
- SEC00x: 安全性（SSRF 防護、注入偵測、硬編碼密鑰偵測）

### 3.2 執行引擎

**Item Pipeline（pairedItem 模型，業界相容）：**
- 2D 結果陣列: `[output_port][item_index]`
- 每個 Item 可獨立失敗（partial batch execution）
- Edge 類型: CONTROL, DATA, ITERATE, DONE
- Merge 策略: APPEND, MULTIPLEX, WAIT_ALL, FIRST
- 向後相容: 舊格式 `{ok, data}` 自動轉換

**變數解析：**
```
${step_id.field}          -- 步驟輸出
${step_id.items[0].field} -- 特定 item
${$item.field}            -- 當前 item（forEach 模式）
${params.name}            -- 工作流參數
${env.VAR}                -- 環境變數
${timestamp}              -- ISO 時間戳
[[var]]                   -- 模板變數
{{var}}                   -- Mustache 相容
```

**Flow Control：** branch, switch, goto, loop, foreach, fork, merge, container, breakpoint, end

**Timeout Guards：** 工作流 5 分鐘 / 步驟 1 分鐘（可設定）

### 3.3 Hook 系統（Lifecycle Extension Points）

```
on_workflow_start    -> HookResult: CONTINUE / ABORT
on_pre_execute       -> HookResult: CONTINUE / SKIP / SUBSTITUTE
on_post_execute      -> HookResult: CONTINUE / SUBSTITUTE
on_error             -> HookResult: CONTINUE / RETRY / ABORT
on_module_missing    -> HookResult: SKIP / SUBSTITUTE / ABORT
on_workflow_complete
on_workflow_failed
```

**內建 Hook：**
- LoggingHooks -- 結構化日誌
- MeteringHook -- 用量計費（License-aware，FREE tier zero overhead）

### 3.4 瀏覽器自動化

**50+ 瀏覽器模組：** launch, navigate, click, type, extract, screenshot, cookies, download, drag, evaluate, form, frame, intercept, pdf, scroll, select, wait, close...

**BrowserPool：** N 個獨立瀏覽器實例、各自 Proxy、acquire/release 模式、健康檢查

**HumanBehavior（4 種行為模式）：**

| 模式 | 點擊延遲 | 打字延遲 | 滑鼠移動 | 打字錯誤率 |
|------|---------|---------|---------|----------|
| fast | 0ms | 0ms | 無 | 0% |
| normal | 50-200ms | 30-80ms | 無 | 0% |
| careful | 100-400ms | 50-120ms | 自然曲線 | 0% |
| human_like | 200-800ms | 80-200ms | 自然曲線 | 2% |

**CAPTCHA Solver：** reCAPTCHA v2/v3, hCaptcha, Cloudflare Turnstile（透過 2Captcha/CapSolver）

**ProxyPool：** round_robin / random / failover 策略、per-proxy 失敗追蹤、線程安全

**RateLimiter：** Token bucket 演算法、per-domain 限速

### 3.5 企業功能

| 模組 | 能力 |
|------|------|
| RPA | 桌面自動化 -- pyautogui + OpenCV 圖像匹配 + OCR |
| IDP | 智慧文件處理 -- PDF/Image/Scan 擷取、欄位信心分數、人工審核佇列 |
| Process Mining | 流程挖掘 -- DFG 演算法、瓶頸識別、合規檢查 |
| State Machine | 狀態機 -- Guard conditions, 並行狀態, History states |
| AI Native | LLM Client + AI Agent + NL-to-Workflow + Workflow Evolution |
| Orchestrator | 機器人管理 + Cron 排程 + 重試策略（線性/指數 backoff） |
| Work Queue | 優先權佇列 + Dead letter queue + Visibility timeout |

### 3.6 Runtime Plugin 系統

**多語言支援：** Python, Node.js, Go, Rust, Ruby, Java

**Process 隔離：** 每個 Plugin 獨立 subprocess、stdio/stderr 分離、timeout + 資源限制

**多租戶路由（PoolRouter）：**

| Tier | Pool 類型 | 目的 |
|------|----------|------|
| FREE | Shared | 成本效率、公平排隊 |
| PRO | Shared | 成本效率 |
| TEAM | Dedicated | 隔離、保證資源 |
| ENTERPRISE | Dedicated | 最大隔離 |

**Plugin 安全：** Manifest 驗證、危險權限標記（filesystem:*, network:*, shell:execute）、路徑穿越防護

### 3.7 AI 自癒（Evolution）

**可修復的錯誤模式：** selector/element not found, timeout exceeded, element not visible/clickable, page closed

**修復流程：**
1. `is_healable()` 檢查
2. 查找 EvolutionMemory 已知修復
3. 若無，請 LLM 建議修復
4. 套用 patch 並重試
5. 成功則儲存 patch 供未來使用

**Patch 類型：** replace_param, modify_selector, increase_timeout, change_strategy

### 3.8 授權與計量

**三層授權：** FREE (本地執行) / PRO (雲端功能) / ENTERPRISE (全部功能)

**30+ Feature Flags：** BASIC_WORKFLOW, CLOUD_EXECUTION, TEAM_COLLABORATION, API_ACCESS, DESKTOP_AUTOMATION, DOCUMENT_PROCESSING, PROCESS_MINING, AI_AGENT, SSO, AUDIT_LOG...

**計量系統：** 每次呼叫追蹤 cost_class (free/standard/premium/enterprise) x multiplier = total_points

---

## 4. flyto-cloud -- SaaS 平台

### 4.1 架構（2+N 服務模型）

```
cloud.flyto2.com  ->  main_web.py (SPA + Smart Proxy)
                       |-- modules/, executions/, ai/chat  -> Worker (flyto-core + Chrome)
                       \-- 其他 -> Cloud API (Firebase + Stripe)

api.flyto2.com    ->  main_cloud.py (Auth, CRUD, 計費)
                      main_worker.py x N (瀏覽器執行, 0->N autoscale)

Desktop           ->  main_local.py (全合一 sidecar)
```

**Smart Proxy：** 路徑分類 -- 需要 flyto-core 的走 Worker，其他走 Cloud API

### 4.2 安全層

| 層 | 實作 |
|----|------|
| 認證 | Firebase / Enterprise JWT / Offline JWT（可插拔） |
| 速率限制 | Token Bucket -- Auth 3-5/min, API 120/min, Webhook 300/min |
| 安全標頭 | CSP, HSTS, X-Frame-Options, Permissions-Policy |
| 請求大小 | 50MB 上限 |
| 桌面安全 | 每次啟動隨機 Sidecar Secret（HMAC 比對） |
| 錯誤清洗 | 生產環境隱藏 stack trace |

### 4.3 模板市場 -- Git-like 協作模型

**獨特的 Git 式協作（自動化平台唯一）：**

| 功能 | 描述 |
|------|------|
| Fork | 完整版本歷史保留 |
| Pull Request | 建立、審核（approve/reject）、合併、關閉、重開、草稿模式 |
| Merge Check | 偵測 base version 衝突 |
| Issue | bug/feature/question 分類、Labels、Assignees、Upvote |
| Reactions | thumbs_up, heart, tada, confused, eyes, rocket |
| Versioning | version_number 每次合併遞增 |
| Invite Keys | 私有模板分享（最大使用次數、過期時間） |
| YAML Import/Export | CLI 友好的工作流交換格式 |
| Auto-Update | Library 自動更新（off/patch/minor/all） |

**Workflow Visibility Protection：** `mutability=locked` 的模板隱藏工作流邏輯（購買者只能執行，看不到步驟）

### 4.4 裝置執行

**Cloud Tasks Push（非 Polling）：** 
- Cloud Run autoscale Worker based on job queue
- OIDC token 驗證
- Semaphore 鎖定單一 Chrome 執行
- 大 payload 退化為 ref_only（裝置自行拉取）

**Streaming 模式：** 一次只發一步驟，裝置看不到完整工作流（保護 locked template）

**Remote Wake：** FCM push + daemon heartbeat + wake command polling

**Browser Relay WebSocket：** 桌面推送 JPEG 幀 -> 行動端即時觀看

### 4.5 AI 整合

**BYOK（Bring Your Own Key）：** OpenAI / Anthropic / OpenAI-compatible，API Key Fernet 加密存儲

**Moat 系統（Cloud IP）：**
- System prompt template
- Allowed domains/tools/categories policies
- Blueprint 系統：list -> expand -> learn -> outcome

**AI Insights Service：**
- Daily Digest（確定性，無 LLM）
- Anomaly Detection（規則式，無 LLM）
- Root Cause Analysis（Anthropic Sonnet LLM）

### 4.6 計費系統

**Stripe 深度整合：** Subscription + One-time + Per-call + Wallet Credits

| 機制 | 描述 |
|------|------|
| 訂閱 | Pro/Team 方案，月/年計費 |
| 單次購買 | 模板購買 + 30 天退款窗口 |
| 每次呼叫 | call_price 扣 credits（失敗退款） |
| Wallet | 500/$5 到 10000/$100 充值包 |
| Creator 分潤 | Stripe Connect + 平台抽成 |
| 金額慣例 | 內部 cents、API 出入 dollars |

### 4.7 可觀測性（SQLite 本地版）

- Prometheus 格式 metrics
- Alert rules + silence/mute
- Distributed tracing (spans + timeline)
- 全部 SQLite 備份，離線也能用

### 4.8 桌面整合

- **Tauri** 框架 + **PyInstaller** sidecar
- `flyto://` deep link 協議
- Hot-updated flyto-core: `~/.flyto/core/{version}/`（免重啟）
- 持久化 Playwright: `~/.flyto/browsers/`
- macOS + Windows + Linux 三平台

---

## 5. flyto-pro -- 智慧 SDK

### 5.1 Contract Engine
工作流驗證、Binding 解析、編譯 -- 作為 flyto-core 和 flyto-cloud 的驗證權威

### 5.2 Error Memory System (EMS)
**Error -> Fix -> Lesson 學習循環：**
- 5 種錯誤來源
- 7 種錯誤分類
- 18+ 語言支援
- 20+ 錯誤模式
- 跨專案知識共享

### 5.3 Agent Runtime（Dual-AI）
- ObservationPacket -- 結構化觀察
- EvidencePipeline -- 證據流水線
- VerificationRules -- 確定性驗證
- LLM 產出必須被 Runtime 驗證才能執行

### 5.4 Cost Controller
多資源預算控制：cost (USD), tokens, tool calls, LLM calls, iterations, runtime
Tier 支援：Free / Pro / Enterprise

### 5.5 Knowledge Layer
模組元資料倉庫 + 語義搜尋 + 版本追蹤 + 解決方案管理

### 5.6 Interface-Driven Architecture
純抽象介面：ILLMService, IEmbeddingService, IFileRepository, IVectorStoreRepository
`configure()` 一鍵切換 Provider

### 5.7 Evolution System
自主程式碼生成 + 影響分析 + 沙箱 + 風險評分 + PR 建立

---

## 6. flyto-indexer -- 程式碼智慧

### 6.1 Five Smart Tools
5 個意圖導向工具取代 45+ 細粒度工具：

| 工具 | 功能 | 自動豐富 |
|------|------|---------|
| `search()` | BM25 + 語義 + callers | 自動附帶相關引用 |
| `impact()` | 引用 + 爆炸半徑 + 跨專案 | 自動包含測試檔案 |
| `audit()` | 健康分數 + 6 維評分 | 自動展開弱項維度 |
| `task()` | 風險評分 + 執行計劃 + Gate | 伺服器端強制 gate |
| `structure()` | API + 依賴 + 模式 + 型別 | 自動偵測架構模式 |

### 6.2 污點分析（Taint Analysis）
AST-based 跨函數資料流追蹤、Sanitizer 感知、自訂 YAML 規則

### 6.3 Project Rules (.flyto-rules.yaml)
三層規則系統：Architecture constraints + Style patterns + Conventions
自動從用戶反饋生成、audit() 自動檢查

### 6.4 增量索引
兩級偵測（10s mtime + 300s watcher）、Delta 更新、10-50x 加速

### 6.5 Composite Complexity Scoring
6 維健康評分：Complexity, Security, Dead code, Documentation, Test coverage, Duplication

### 6.6 Execution Guard
伺服器端 Gate 強制、禁止跳過執行計劃步驟、30 分鐘任務過期

---

## 7. flyto-vscode -- IDE 安全代理

### 7.1 Guardian Gate System
- 封鎖路徑: .flyto/, .env, .git/
- 唯讀意圖: audit 模式禁止寫入
- 審計配額: 最少 8 個檔案
- 去重快取 + 迭代上限 (50 max)

### 7.2 OAuth 2.0 + Token Refresh
URI handler flow、OS keychain 存儲、401 自動重試、lock-based refresh dedup
Mid-execution session recovery（不中斷 agent 執行）

### 7.3 Native IDE 功能
Webview chat, Project Navigator, Agent Runs tracker (rollback), Dead Code detector, Code Lens, Cmd+K inline edit

---

## 8. flyto-modules-pro -- 進階模組

| 類別 | 模組 | 特點 |
|------|------|------|
| Stealth Browser | `stealth.launch`, `stealth.fingerprint` | WebDriver 偵測繞過、viewport/UA 隨機化 |
| Captcha | `captcha.solve_recaptcha/hcaptcha/image` | 2Captcha/Anti-Captcha/CapSolver |
| Enterprise | `enterprise.salesforce/sap/jira` | 企業系統連接器 |
| Checkpoint | `checkpoint.save/restore` | 長時間工作流可靠性 |
| Parallel | `parallel.batch/map_reduce/pool` | 批次 + MapReduce |
| Document Pro | 增強 PDF/Excel/Word | 超越社群模組 |
| Vision Pro | Object detection + OCR | YOLO + Tesseract/EasyOCR |

**Hot-Reload：** 自動下載最新 wheel、zipimport 直接載入、1 小時檢查間隔、零停機

---

## 9. Flyto2 Cloud/Desktop Frontend -- Vue 3 SPA

### 技術棧
Vue 3 + Vite + Pinia + VueFlow + Monaco Editor + UnoCSS + Chart.js + Lucide Icons

### 工作流編輯器
- VueFlow 圖形編輯器
- 自訂節點類型：Default, Trigger, Switch, Loop, Branch, Container, AISubNode, AIAgent
- Glow 動畫邊緣
- 80+ Builder 元件

### 即時協作
- WebSocket cursor tracking
- Node-level locking（防止衝突）
- 應用內 chat
- Invite-based access + approval

### Debugger UI
- Step-by-step 執行時間線
- Breakpoint 人工審批面板
- Data lineage 圖形化
- JSON 資料檢視器
- Replay 面板

### 13 個 Pinia Store
builderStore (facade: metadata + uiState + workflow + execution), collaborationStore, telemetryStore, metricsStore, adminStore, modulesStore, executionControlStore, recordingStore, dashboardStore, capabilitiesStore, configStore, userStore, organizationStore, projectStore, roleStore, myTemplatesStore, templateStore, packageStore

---

## 10. i18n -- 16 語言

**官方 (4):** English, 簡體中文, 繁體中文, 日本語 (100% 覆蓋率)

**社群 (12):** Korean, French, Spanish, Hindi, German, Portuguese, Vietnamese, Indonesian, Thai, Turkish, Polish, Italian

**OTA 更新：** GitHub raw (主) + jsDelivr CDN (備) -> 7 天 TTL -> 自動版本失效

**Schema 驅動 i18n：** 從模組 params_schema 自動生成翻譯 key

## 12. Collaboration & Organization -- 協作與組織

### 12.1 即時協作模式

**CRDT 即時編輯（自動化平台唯一）：**
- VectorClock 因果追蹤
- OperationType: INSERT, DELETE, UPDATE, MOVE, SET
- `happens_before()`, `concurrent_with()` 自動衝突解決
- Undo/Redo 支援（operation reversal）
- 多人同時編輯，無需中央協調伺服器

**WebSocket 即時功能：**
- Cursor tracking -- 看到其他人的游標位置
- Node locking -- 編輯中的節點自動鎖定，避免衝突
- 應用內 Chat -- 在工作流內直接對話
- Presence -- 即時顯示在線成員

**協作權限：**
- Invite code 邀請（隨機碼、可重新生成）
- Collaboration request 申請制（owner 審批）
- 成員管理（owner 可移除成員）
- Session 管理（owner 可終止 session）

### 12.2 模板資料夾系統

**兩個 Tab 獨立資料夾：**
- `created` -- 自己建立的模板
- `installed` -- 從市場安裝的模板

**資料夾功能：**
- 建立（名稱 1-100 字、顏色 hex、父資料夾）
- 巢狀結構（支援子資料夾）
- 拖拉排序（`POST /templates/folders/reorder/`）
- 批次移動模板到資料夾（`POST /templates/folders/move/`）
- 刪除資料夾時內容移至父層
- Default Folder Position -- 預設資料夾在列表中的位置

**Library 設定（per item）：**
- autoUpdate: off / patch / minor / all
- folderId: 指定所屬資料夾

### 12.3 組織與團隊

**多租戶組織架構：**
- Organization -> Project -> Workflow 三層結構
- RBAC 角色系統（6 類別 16 權限）
- 內建角色 + 自訂角色
- Role Assignments（含到期時間）

**團隊工作流：**
- Workflow Sharing（scope: USER / PROJECT / ORGANIZATION）
- Comments（type: GENERAL / NODE / REVIEW / SUGGESTION / BUG）
- Workflow Versions（git-like commit, diff, restore）
- Activity Log（22 種事件類型）
- Team Dashboard（趨勢、Top contributors、Recent activities）

### 12.4 Audit Log（企業級）

- Hash-chained 不可竄改審計日誌
- 按 actor / resource / action 查詢
- 安全掃描（暴力破解、批量刪除偵測）
- 匯出（JSON / CSV）
- 歸檔 + 還原
- 完整性驗證（sequence-based）

---

## 13. MCP Server -- AI IDE 整合

**Model Context Protocol 原生支援（Claude Code / Cursor / Windsurf）：**

| MCP Tool | 功能 |
|----------|------|
| `list_modules` | 列出所有可用模組 |
| `search_modules` | 搜尋模組 |
| `get_module_info` | 取得模組詳細資訊 |
| `execute_module` | 執行模組 |
| `validate_params` | 驗證參數 |
| `get_module_examples` | 取得範例 |
| `list_recipes` | 列出預建食譜 |
| `run_recipe` | 執行食譜 |

- STDIO transport（CLI 整合） + HTTP transport（API 整合）
- Browser session 跨 MCP 呼叫持久化

---

## 14. Pre-built Recipes -- 41 個預建食譜

即開即用的工作流模板：

| 類別 | 食譜 |
|------|------|
| Web Scraping | scrape-to-csv, scrape-page, scrape-table, scrape-links, demo-scrape |
| Analytics | competitor-intel, responsive-report, full-audit, site-audit, web-perf |
| Monitoring | monitor-site, new-posting-alert, price-drop-alert, social-monitor, change-detector, stock-price |
| Data Processing | csv-to-json, json-to-csv, api-pipeline, http-get, pdf-extract |
| Image | image-compress, image-resize, image-convert, ocr, visual-snapshot |
| DevOps | docker-ps, port-scan, whois, git-changelog, github-issue |
| Forms | form-fill, form-fill-review |
| Output | page-to-pdf, screenshot, webpage-archive, scrape-to-slack |

---

## 15. Expression Engine -- 安全表達式系統

**AST-based 安全求值器（非 eval）：**
- 條件運算、算術運算、字串內插
- `${}` 變數語法 + `{{}}` Mustache 相容
- 安全方法白名單（collection/string methods only）
- 批次求值（共享 context）
- 語法驗證 + 變數提取 + 警告

**Engine SDK -- 設計時智慧：**
- 變數目錄建構（edit-time schema-based / runtime trace-based）
- 上游節點偵測 + branch/merge 追蹤
- Autocomplete 建議 + 相關性評分（EXACT: 1.0, PREFIX: 0.8, CONTAINS: 0.5）

---

## 16. Catalog 三層架構 -- LLM 可消費

| 層 | API | 用途 |
|----|-----|------|
| Layer 1 | `get_outline()` | 模組類別概覽（40+ 類別） |
| Layer 2 | `get_category_detail()` | 單一類別詳情 |
| Layer 3 | `get_module_detail()` | 個別模組完整規格 |

設計給 LLM 漸進式探索，避免一次載入 451 個模組。
公開 catalog 自動清洗敏感資訊（credentials, secrets）。

---

## 17. User Social System -- 社群功能

| 功能 | 描述 |
|------|------|
| 用戶檔案 | display_name, bio, avatar_url, website |
| Follow / Unfollow | 關注其他用戶 |
| Followers / Following | 雙向關注列表 + 計數 |
| Creator Program | 申請制、First 100 Creators 活動、自動核准 |
| User Preferences | theme, language, notifications_enabled, email_notifications |
| GDPR 刪除 | 30 天緩衝期、審計日誌 |

---

## 18. Quality & Linting -- 模組品質保證

**Quality Engine（flyto-core）：**
- 6 類規則：execution, AST, security, capability, identity, schema
- 偵測器：capability_detector, return_detector, params_usage_detector
- Baseline 管理 + Policy 設定
- Fixer 自動修復

**Module Lint：**
- `testing.lint` 模組
- 完整性檢查 + 安全檢查
- CI/CD 整合驗證

---

## 19. Integration Framework -- 整合基礎設施

**位置：** `flyto-core/src/core/modules/integrations/`

| 元件 | 功能 |
|------|------|
| client.py | HTTP 客戶端封裝 |
| models.py | 整合資料模型 |
| pagination.py | 自動分頁處理 |
| rate_limiter.py | 速率限制 |
| webhook.py | Webhook 處理 |
| OAuth client | PKCE 支援 |

**內建整合：** Jira, Slack, Salesforce（更多透過 http.request 自建）

---

## 20. CI/CD Pipelines -- 自動化部署

**跨專案 GitHub Actions：**

| Workflow | 專案 | 功能 |
|----------|------|------|
| build-release | flyto-cloud | Desktop 三平台建置（macOS + Windows + Linux，~40min） |
| deploy | flyto-cloud | Cloud Run 自動部署（Cloud API + Worker + Web） |
| deploy-health-check | flyto-cloud | 部署後健康檢查 |
| ci / test | flyto-core | 模組驗證 + 測試 |
| publish | flyto-core | PyPI 發布 |
| trigger-i18n-sync | flyto-cloud | 翻譯同步觸發 |
| purge-cdn | flyto-i18n | CDN 快取清除 |
| generate-docs | flyto-core | 文件生成 |

**Desktop 發布流程：**
```
git tag v0.x.x -> build-release.yml -> macOS/Windows/Linux -> GitHub Release (flyto2 public repo) -> Tauri hot-update
```

---

## 21. Caching System -- 快取機制

| 模組 | 功能 |
|------|------|
| `cache.get` | 讀取快取 |
| `cache.set` | 寫入快取（TTL） |
| `cache.delete` | 刪除快取 |
| `cache.clear` | 清除全部 |
| Redis 整合 | memory_redis.py |

工作流內的 key-value 狀態存儲，支援跨步驟資料共享。

---

## 22. Vision & Analysis -- 影像與分析

| 模組 | 功能 |
|------|------|
| `vision.compare` | 圖像比較 |
| `vision.analyze` | 圖像分析 |
| `ai.vision.analyze` | AI 視覺分析 |
| `browser.readability` | 文章內容擷取（readability heuristics） |
| HTML Analyzer | Form/Table/Metadata/Pattern 擷取 |

---

## 23. Architecture Decisions -- 關鍵設計決策

| 決策 | 原因 |
|------|------|
| 四服務分離 | Cloud API 輕量快速部署；Worker 獨立擴展執行負載 |
| Provider Hub | 單一 DEPLOYMENT_MODE 環境變數切換，消除散落的 if/else |
| Cloud Tasks Push | Cloud Run 自動擴展 Worker，消除 polling 開銷 |
| CRDT 協作 | 離線優先編輯、自動衝突解決、無需中央衝突伺服器 |
| Streaming Execution | Locked template 保護工作流邏輯 |
| 每次啟動 Sidecar Secret | 隨機 token 防止本地未授權存取 |
| Hot-updated flyto-core | 零停機核心更新（~/.flyto/core/） |
| SQLite 本地可觀測性 | 離線部署也有完整 metrics/alerts/traces |
| Item Pipeline | pairedItem 模型 + partial batch failure |
| Hook-Driven 擴展 | Lifecycle hooks 讓計量/日誌/自癒模組化掛載 |

---

## 13. Numbers -- 量化指標

| 指標 | 數字 |
|------|------|
| Registry-backed modules | 451 |
| 原子類別 | 65 |
| 瀏覽器模組 | 50+ |
| Engine HTTP route registrations | 665 |
| Pinia Stores | 13+ |
| 支援語言 | 16 |
| Enterprise 子系統 | 7 (RPA, IDP, Mining, StateMachine, AI Native, Orchestrator, Queue) |
| 部署模式 | 4 (Cloud, Enterprise, Offline, Desktop) |
| Plugin 語言 | 6 (Python, Node.js, Go, Rust, Ruby, Java) |
| HumanBehavior 模式 | 4 (fast, normal, careful, human_like) |
| Feature Flags | 30+ |
| 審批模式 | 3 (SINGLE, MAJORITY, UNANIMOUS) |
| Merge 策略 | 4 (APPEND, MULTIPLEX, WAIT_ALL, FIRST) |
