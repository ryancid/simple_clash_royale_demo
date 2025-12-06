# Implementation Plan: 卡片頁面響應式分頁優化

**Branch**: `001-card-responsive-pagination` | **Date**: 2025-12-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-card-responsive-pagination/spec.md`

## Summary

本功能優化卡片列表頁面的響應式佈局和分頁機制。核心需求是確保在任何螢幕尺寸下，卡片網格的每一排都能完整對齊（除了最後一頁的最後一排可能不滿），並且每頁顯示的卡片數量是「每排卡片數量」的倍數。

技術方法：修改現有的 `pages/cardList.tsx` 組件，使用 CSS Grid 取代現有的 `auto-fill` 佈局，實作動態計算每排卡片數量的邏輯，並根據此數量調整每頁顯示的卡片總數。使用 React hooks（`useEffect`, `useState`, `useRef`）來監聽視窗尺寸變化並即時重新計算佈局參數。

## Technical Context

**Language/Version**: TypeScript 5.9.3, Next.js 16.0.7, React 19.2.1
**Primary Dependencies**:
- MUI Joy UI 5.0.0-alpha.43（UI 組件）
- Emotion 11.10.0（CSS-in-JS）
- Zod 4.1.13（執行時資料驗證）
- Axios 1.13.2（API 請求）

**Storage**: N/A（此功能不涉及資料儲存，使用 Next.js getStaticProps 在 build time 取得卡片資料）

**Testing**: Jest 29.1.2（已安裝但尚未配置，本功能將以手動測試為主）

**Target Platform**: 現代網頁瀏覽器（支援 CSS Grid、Flexbox、ES6+）
- 桌面：Chrome, Firefox, Safari, Edge（最新版本）
- 手機：iOS Safari 14+, Android Chrome 90+
- 平板：iPad Safari, Android Chrome

**Project Type**: Web 應用（Next.js SSG/SSR）

**Performance Goals**:
- 視窗調整時重新計算佈局 < 500ms
- 頁面初次載入 < 3 秒
- 支援快速連續調整視窗（debounce 處理）

**Constraints**:
- 不引入新的依賴套件（使用現有的 React、MUI Joy UI）
- 保持 SEO 友善（使用 SSG，避免過度依賴 client-side 渲染）
- 保持現有卡片功能（evolution 切換、hover 效果）不變

**Scale/Scope**:
- 卡片總數：約 100-150 張（Clash Royale 卡片數量）
- 頁面尺寸範圍：320px - 1920px 寬度
- 預期同時使用者：< 1000（個人 demo 專案規模）

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

根據 constitution v1.0.0 檢查：

### ✅ I. 高品質程式碼
- **符合**：使用 TypeScript 確保型別安全
- **符合**：遵循 React 19 和 Next.js 16 最佳實踐
- **符合**：使用 ESLint 進行程式碼品質檢查
- **符合**：避免引入安全漏洞（不新增外部依賴）

### ✅ II. 可測試性優先
- **符合**：每個 user story 都有明確的手動測試步驟
- **符合**：佈局邏輯可透過調整視窗尺寸測試
- **符合**：分頁邏輯可透過點擊按鈕驗證
- **注意**：自動化測試暫時不實作（符合 constitution「測試不一定要自動化」）

### ✅ III. MVP 思維（不可協商）
- **符合**：P1（響應式網格）可獨立交付和測試
- **符合**：P2（智慧分頁）在 P1 基礎上增強
- **符合**：P3（導航優化）為體驗提升，非必要功能
- **符合**：不預先建立未來功能，專注解決當前問題

### ✅ IV. 避免過度設計
- **符合**：不引入新的 UI 框架或 library
- **符合**：使用現有的 CSS Grid 和 React hooks
- **符合**：不建立抽象層或複雜的狀態管理
- **符合**：直接修改現有的 cardList.tsx，不重構整體架構

### ✅ V. 正體中文優先
- **符合**：本計劃使用正體中文撰寫
- **符合**：程式碼註解將使用正體中文
- **符合**：變數名和函數名保持英文（符合慣例）

### 整體評估：✅ 通過所有 Constitution 檢查

無需填寫 Complexity Tracking 表格（無 constitution 違規）。

## Project Structure

### Documentation (this feature)

```text
specs/001-card-responsive-pagination/
├── spec.md              # 功能規格
├── plan.md              # 本檔案（實作計劃）
├── research.md          # Phase 0 輸出（技術研究）
├── data-model.md        # Phase 1 輸出（資料模型）
├── quickstart.md        # Phase 1 輸出（快速開始指南）
└── checklists/
    └── requirements.md  # 品質檢查清單
```

### Source Code (repository root)

此專案為 Next.js web 應用，結構如下：

```text
/Users/ryanhsieh/Develop/simple_clash_royale_demo/
├── pages/
│   ├── cardList.tsx         # 【主要修改】卡片列表頁面
│   ├── _app.js              # Next.js App 組件
│   ├── _document.js         # Next.js Document 組件
│   ├── index.js             # 首頁
│   ├── players.js           # 玩家頁面
│   └── api/
│       ├── cards.ts         # 卡片 API route（無需修改）
│       └── player/[id].ts   # 玩家 API route（無需修改）
│
├── src/
│   ├── component/
│   │   └── cardComp.tsx     # 卡片組件（保持不變）
│   ├── model/
│   │   └── useCards.js      # 卡片資料 hook（可能移除，改用 getStaticProps）
│   ├── layout/
│   │   └── layout.tsx       # 佈局組件（無需修改）
│   ├── server/
│   │   └── server.config.ts # Axios 實例配置（無需修改）
│   └── types/
│       └── card.schema.ts   # 卡片 Zod schema（保持不變）
│
├── public/                  # 靜態資源（無需修改）
├── .next/                   # Next.js build 輸出（忽略）
├── node_modules/            # 依賴套件（忽略）
├── package.json             # 專案配置
├── tsconfig.json            # TypeScript 配置
└── .env.local               # 環境變數（API_KEY）
```

**Structure Decision**:
此功能主要修改 `pages/cardList.tsx` 檔案。專案使用 Next.js Pages Router 架構，前端組件位於 `pages/` 和 `src/component/`，API routes 位於 `pages/api/`。我們將：

1. 保持現有的檔案結構不變
2. 修改 `cardList.tsx` 的 JSX 佈局和分頁邏輯
3. 新增自訂 hooks 處理視窗尺寸監聽和佈局計算
4. 保留現有的 `getStaticProps` 和 `CardComp` 不變

## Complexity Tracking

> 無 constitution 違規，此表格留空。

---

**Phase 0 和 Phase 1 將在以下部分完成**
