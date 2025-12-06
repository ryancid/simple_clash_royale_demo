<!--
  Sync Impact Report
  ==================
  Version Change: N/A → 1.0.0
  Change Type: MINOR - Initial constitution creation

  Modified Principles:
  - Created: I. 高品質程式碼
  - Created: II. 可測試性優先
  - Created: III. MVP 思維
  - Created: IV. 避免過度設計
  - Created: V. 正體中文優先

  Added Sections:
  - Core Principles (5 principles)
  - 技術標準
  - 開發流程
  - Governance

  Templates Requiring Updates:
  ✅ spec-template.md - Reviewed, compatible with constitution (prioritized user stories align with MVP principle)
  ✅ plan-template.md - Reviewed, constitution check section aligns with principles
  ✅ tasks-template.md - Reviewed, phase-based approach supports MVP incremental delivery

  Follow-up TODOs:
  - None. All placeholders filled with concrete values.
-->

# Simple Clash Royale Demo Constitution

## Core Principles

### I. 高品質程式碼

專案必須維持高品質的程式碼標準：
- 程式碼必須清晰、可讀、易於維護
- 遵循 TypeScript 嚴格型別檢查（在可行情況下啟用 strict mode）
- 使用 Zod 進行執行時資料驗證
- 遵循 Next.js 和 React 最佳實踐
- 使用 ESLint 進行程式碼品質檢查
- 安全漏洞必須立即修復（參考：axios 升級解決 CSRF、DoS、SSRF 漏洞）

**原理說明**：高品質程式碼可減少技術債，提升長期維護效率，並降低生產環境錯誤風險。

### II. 可測試性優先

所有功能必須設計為可測試：
- 每個功能必須有明確的測試方式（手動或自動）
- User stories 必須包含可驗證的 Acceptance Scenarios
- API endpoints 必須可獨立測試
- 組件必須可獨立渲染和測試
- 測試框架已安裝（Jest）且應被使用

**原理說明**：可測試性確保功能正確性，減少迴歸錯誤，並提供變更信心。測試不一定要自動化，但必須可執行。

### III. MVP 思維（不可協商）

功能開發必須遵循最小可行產品（MVP）原則：
- 優先實作核心功能，延後次要功能
- User stories 必須按優先級排序（P1、P2、P3）
- 每個 user story 必須可獨立交付價值
- 避免預先建立未來可能需要的功能
- "夠用就好" 優於 "完美但延遲"

**原理說明**：MVP 思維確保快速交付價值，及早獲得回饋，避免浪費資源在不需要的功能上。此原則不可協商。

### IV. 避免過度設計

技術決策必須符合當前需求，不預先設計未來擴展：
- 不建立抽象層除非有明確的重複使用需求
- 不引入新框架或 library 除非現有工具無法解決問題
- 保持架構簡單直接（參考：使用 Next.js API routes 作為 proxy 的簡單解決方案）
- 三次重複再考慮抽象，不提前優化
- 複雜度必須有明確的商業理由

**原理說明**：過度設計增加維護成本、學習曲線和錯誤風險。簡單的解決方案更容易理解、測試和修改。

### V. 正體中文優先

專案文件和溝通必須使用正體中文：
- 所有規格文件（spec.md）使用正體中文撰寫
- 所有計劃文件（plan.md）使用正體中文撰寫
- 所有任務說明（tasks.md）使用正體中文撰寫
- User stories 和 acceptance criteria 使用正體中文
- 程式碼註解優先使用正體中文（除非技術術語更適合英文）
- 例外：程式碼本身（變數名、函數名）使用英文以符合慣例

**原理說明**：統一語言降低溝通成本，確保所有團隊成員清楚理解需求和設計決策。

## 技術標準

### 技術堆疊

**前端框架**：
- Next.js 16（React 19）
- TypeScript（baseUrl: "." 支援絕對路徑導入）
- MUI Joy UI alpha 版本

**資料處理**：
- Axios 1.13.2+ 用於 HTTP 請求
- Zod 用於執行時型別驗證和資料驗證

**API 模式**：
- Server-side API routes（`pages/api/`）處理所有外部 API 呼叫
- 使用 proxy pattern 保護 API keys 和處理 IP 限制
- API routes 必須處理錯誤並回傳適當的 HTTP 狀態碼

**影像處理**：
- 使用 Next.js Image 組件
- Above-fold 影像使用 `priority={true}`
- 使用 `layout='fill'` 實現響應式影像

**樣式**：
- Emotion CSS-in-JS
- MUI 的 `sx` prop 用於樣式定義

### 安全要求

- API keys 絕不能暴露在 client-side
- 使用 `.env.local` 管理環境變數
- 定期執行 `npm audit` 並修復漏洞
- 避免常見安全漏洞（XSS、SQL injection、CSRF）

### 效能標準

- 使用 Next.js Image 優化減少載入時間
- API responses 必須在合理時間內回應（< 5秒）
- 避免不必要的 re-renders（使用 useCallback、useMemo 等）

## 開發流程

### 功能開發循環

1. **規格定義**（`/speckit.specify`）：
   - 使用正體中文撰寫 user stories
   - 標記優先級（P1 = MVP 核心功能）
   - 定義可測試的 acceptance criteria

2. **計劃設計**（`/speckit.plan`）：
   - 選擇符合當前需求的最簡單技術方案
   - 檢查 Constitution Check 關卡
   - 避免過度設計

3. **任務分解**（`/speckit.tasks`）：
   - 按 user story 優先級組織任務
   - 每個 story 必須可獨立實作和測試
   - 標記可平行執行的任務 [P]

4. **一致性檢查**（`/speckit.analyze`）：
   - 驗證規格、計劃、任務的一致性
   - 確認符合 constitution 原則
   - 在實作前解決 CRITICAL 問題

5. **實作**（`/speckit.implement`）：
   - 優先完成 P1 user stories（MVP）
   - 每個 story 完成後獨立測試
   - 增量交付，不等待所有功能完成

### 程式碼審查要求

- 所有變更必須符合 constitution 原則
- 新增複雜度必須有明確理由
- 安全問題必須在 merge 前解決
- 遵循專案既有的編碼風格

### 品質關卡

**必要檢查**：
- ESLint 檢查無錯誤
- TypeScript 編譯成功
- `npm audit` 無 CRITICAL 或 HIGH 漏洞
- 核心功能可手動測試通過

**建議檢查**：
- Jest 測試通過（若有撰寫）
- 效能未明顯退化
- 文件已更新（若有影響）

## Governance

### Constitution 權威

本 Constitution 是專案最高指導原則：
- 所有功能開發必須符合 core principles
- Principles 衝突視為 CRITICAL 問題，必須在實作前解決
- 若 principle 本身需要修改，必須透過正式修憲流程

### 修憲程序

1. **提出修改**：明確說明修改原因、影響範圍、替代方案評估
2. **影響評估**：檢查對現有規格、計劃、任務、templates 的影響
3. **版本控制**：
   - MAJOR 版號：移除或重新定義 principle（向後不相容）
   - MINOR 版號：新增 principle 或大幅擴充指導方針
   - PATCH 版號：文字修正、釐清說明、非語義性調整
4. **文件同步**：更新所有受影響的 templates 和文件
5. **記錄變更**：在檔案頂部 Sync Impact Report 記錄變更歷史

### 合規性審查

- 所有 Pull Requests 必須驗證是否符合 constitution
- `/speckit.analyze` 必須在實作前執行並解決 CRITICAL 問題
- 新增複雜度必須在 plan.md 的 "Complexity Tracking" 表格中說明理由

### 執行時開發指導

- 本 constitution 提供高層次原則
- 詳細執行指引參見：
  - `CLAUDE.md` - AI 助手開發指引
  - `README.md` - 專案設定和執行說明
  - `.specify/templates/` - 規格和計劃 templates

**Version**: 1.0.0 | **Ratified**: 2025-12-06 | **Last Amended**: 2025-12-06
