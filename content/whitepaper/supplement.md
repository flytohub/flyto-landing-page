# Flyto2 Whitepaper Audit -- Supplement

> 補充 `whitepaper-audit.md` 遺漏的功能

---

## 1. MCP Server -- AI IDE 整合

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
- AI agent 可以直接透過 MCP 操控 Flyto2 引擎

---

## 2. Pre-built Recipes -- 38 個預建食譜

即開即用的 YAML 工作流模板，涵蓋常見自動化場景：

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

用戶可以透過 CLI `flyto run <recipe>` 或 MCP `run_recipe` 直接執行。

---

## 3. Expression Engine -- 安全表達式系統

**AST-based 安全求值器（非 eval/exec）：**
- 條件運算、算術運算、字串內插
- `${}` 變數語法 + `{{}}` Mustache 相容 + `[[]]` 模板變數
- 安全方法白名單（collection/string methods only）
- 批次求值（共享 context）
- 語法驗證 + 變數提取 + 警告回報

**Engine SDK -- 設計時智慧：**
- 變數目錄建構（edit-time schema-based / runtime trace-based）
- 上游節點偵測 + branch/merge 追蹤
- Autocomplete 建議 + 相關性評分（EXACT: 1.0, PREFIX: 0.8, CONTAINS: 0.5）
- Graph 分析：識別上游依賴、追蹤分支與合併

---

## 4. Catalog 三層架構 -- LLM 可消費

| 層 | API | 用途 |
|----|-----|------|
| Layer 1 | `get_outline()` | 模組類別概覽（40+ 類別） |
| Layer 2 | `get_category_detail()` | 單一類別詳情 |
| Layer 3 | `get_module_detail()` | 個別模組完整規格 |

- 設計給 LLM 漸進式探索，避免一次載入 411 個模組
- 公開 catalog 自動清洗敏感資訊（credentials, secrets）
- `get_modules_batch()` 批次取得多個模組

---

## 5. User Social System -- 社群功能

| 功能 | 描述 |
|------|------|
| 用戶檔案 | display_name, bio, avatar_url, website |
| Follow / Unfollow | 關注其他用戶 |
| Followers / Following | 雙向關注列表 + 計數 |
| Creator Program | 申請制、First 100 Creators 活動、invite code 自動核准 |
| User Preferences | theme, language, notifications_enabled, email_notifications |
| GDPR 刪除 | 30 天緩衝期、reason + feedback、審計日誌 |

---

## 6. Quality & Linting -- 模組品質保證

**Quality Engine（flyto-core）：**
- 6 類規則：execution, AST, security, capability, identity, schema
- 偵測器：capability_detector, return_detector, params_usage_detector
- Baseline 管理 + Policy 設定
- Fixer 自動修復建議

**Module Validator（SEC00x 安全檢查）：**
- SSRF 防護（從 imports 推斷網路能力）
- SQL 注入偵測（SQL keyword analysis）
- 危險函數標記（eval, exec, compile）
- 硬編碼密鑰偵測（regex pattern）
- 路徑穿越防護

---

## 7. Integration Framework -- 整合基礎設施

**位置：** `flyto-core/src/core/modules/integrations/`

| 元件 | 功能 |
|------|------|
| client.py | HTTP 客戶端封裝 |
| models.py | 整合資料模型 |
| pagination.py | 自動分頁處理（cursor/offset/page） |
| rate_limiter.py | 速率限制 |
| webhook.py | Webhook 處理 |
| OAuth client | PKCE 支援 |

**內建整合：** Jira, Slack, Salesforce（更多透過 http.request 自建）

---

## 8. CI/CD Pipelines -- 自動化部署

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
| validate-modules | flyto-core | 模組完整性驗證 |

**Desktop 發布流程：**
```
git tag v0.x.x 
  -> build-release.yml 
    -> macOS + Windows + Linux parallel build
      -> GitHub Release (flyto2 public repo) 
        -> Tauri hot-update auto-download
```
**Note:** 必須用 tag push，workflow_dispatch 不會建立 Release

---

## 9. Caching System -- 快取機制

| 模組 | 功能 |
|------|------|
| `cache.get` | 讀取快取 |
| `cache.set` | 寫入快取（TTL 支援） |
| `cache.delete` | 刪除快取 |
| `cache.clear` | 清除全部 |

- In-memory cache + Redis 整合（memory_redis.py）
- 工作流內 key-value 狀態存儲
- 跨步驟資料共享

---

## 10. Vision & Analysis -- 影像與分析

| 模組 | 功能 |
|------|------|
| `vision.compare` | 圖像比較（像素級 diff） |
| `vision.analyze` | 圖像分析 |
| `ai.vision.analyze` | AI 視覺分析（LLM vision） |
| `browser.readability` | 文章內容擷取（readability heuristics，支援 AI fallback） |
| HTML Analyzer | Form / Table / Metadata / Pattern 擷取 |

---

## 11. Notification System -- 通知機制

**多通道通知：**

| 通道 | 用途 |
|------|------|
| In-app | 通知列表 + 未讀計數 + 標記已讀 |
| FCM Push | 行動端推送（裝置上線/離線/工作完成） |
| Discord Webhook | AI Insights daily digest + anomaly alerts |
| Email | 可配置 email 通知 |
| Cloud Pub/Sub | 執行事件串流 |

---

## 12. Cortex -- 知識工作空間

**Tauri 配置中的第二視窗：**
- 獨立 React 應用（`flyto-cortex/`）
- 資源管理：cortex_files, cortex_pages
- 與 flyto-cloud 共享設計語言
- 桌面應用專屬功能

---

## 13. Advanced Marketplace Features

### Creator Program
- 申請制（motivation + portfolio_url）
- `First 100 Creators` 活動：invite code + 自動核准 + 永久 Pro
- Admin 審批/拒絕（含拒絕原因）
- Creator number 追蹤

### Workflow Visibility Protection
- `mutability` 設定：`locked` / `fork_on_use` / `editable`
- locked 模板：購買者可執行但看不到步驟
- Streaming execution 逐步派發（保護工作流邏輯）
- Fork 時保留完整版本歷史

### Pricing Models
| 模式 | 描述 |
|------|------|
| free | 免費使用 |
| paid | 一次性購買（price 欄位，美元） |
| per_call | 每次呼叫扣 credits（call_price 欄位） |

### Regional Visibility
- `visibility_regions` -- 限制顯示區域
- `blocked_regions` -- 封鎖區域
- `X-User-Region` header 偵測

---

## 14. Recording System -- 瀏覽器錄製

| 功能 | 描述 |
|------|------|
| Start | 開啟瀏覽器錄製 session（桌面限定） |
| Stop | 停止錄製，編譯成工作流 |
| Apply/Discard | 前端 RecordingPanel 確認或放棄 |

用戶操作瀏覽器 -> 自動轉換成自動化工作流步驟。

---

## 15. Updated Numbers -- 更新後的量化指標

| 指標 | 數字 |
|------|------|
| 模組檔案 | 411 |
| 原子類別 | 67 |
| 瀏覽器模組 | 50+ |
| 預建食譜 | 38 |
| API Endpoints | 300+ |
| MCP Tools | 8 |
| Pinia Stores | 18+ |
| 支援語言 (i18n) | 16 (4 官方 + 12 社群) |
| Enterprise 子系統 | 7 |
| 部署模式 | 4 |
| Plugin 語言 | 6 |
| HumanBehavior 模式 | 4 |
| Feature Flags | 30+ |
| 審批模式 | 3 |
| Merge 策略 | 4 |
| CI/CD Workflows | 10+ |
| Quality 規則類別 | 6 |
| Catalog 層數 | 3 |
| 自主整合機制 | 10 |
| 通知通道 | 5 (in-app, FCM, Discord, Email, Pub/Sub) |
| 定價模式 | 3 (free, paid, per_call) |
| 社群功能 | Follow/Profile/Creator Program/GDPR |
