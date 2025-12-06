# Tasks: 卡片頁面響應式分頁優化

**Input**: Design documents from `/specs/001-card-responsive-pagination/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: 本功能以手動測試為主，不包含自動化測試任務（符合 constitution「測試不一定要自動化」）

**Organization**: 任務按 user story 優先級組織，每個 story 可獨立實作和測試

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 可平行執行（不同檔案、無依賴）
- **[Story]**: User story 標籤（US1, US2, US3）
- **檔案路徑**：每個任務都包含明確的檔案路徑

## Path Conventions

此專案為 Next.js web 應用，檔案路徑基於 repository root：
- 主要修改：`pages/cardList.tsx`
- 保持不變：`src/component/cardComp.tsx`, `pages/api/cards.ts`, `src/types/card.schema.ts`

---

## Phase 1: Setup（環境準備）

**Purpose**: 確認開發環境設定正確

- [x] T001 確認 Node.js >= 18.7 已安裝
- [x] T002 確認 .env.local 包含有效的 API_KEY
- [x] T003 執行 `npm install` 確保所有依賴套件已安裝
- [x] T004 執行 `npm run dev` 確認開發伺服器可正常啟動
- [x] T005 開啟 http://localhost:3000/cardList 確認現有頁面可正常顯示

---

## Phase 2: Foundational（基礎準備）

**Purpose**: 建立型別定義和常數配置，作為所有 user stories 的共用基礎

**⚠️ CRITICAL**: 此階段必須完成後才能開始 user story 實作

- [x] T006 在 pages/cardList.tsx 檔案頂部新增 PaginationState interface 型別定義
- [x] T007 在 pages/cardList.tsx 檔案頂部新增 GridLayoutConfig interface 型別定義
- [x] T008 在 pages/cardList.tsx 檔案頂部新增 GRID_LAYOUT_CONFIG 常數（cardWidth: {xs: 75, sm: 106}, gap: 2, rowsPerPage: 4）
- [x] T009 在 pages/cardList.tsx 檔案頂部新增 ROWS_PER_PAGE 常數（值為 4）

**Checkpoint**: 基礎型別和常數定義完成，可開始 user story 實作

---

## Phase 3: User Story 1 - 響應式卡片網格佈局 (Priority: P1) 🎯 MVP

**Goal**: 實作響應式卡片網格，確保在任何螢幕尺寸下每排卡片都整齊對齊

**Independent Test**: 調整瀏覽器視窗寬度（320px - 1920px），驗證每排卡片數量會自動調整且都完整對齊

### Implementation for User Story 1

- [x] T010 [US1] 在 CardList 組件新增 cardsPerRow state（預設值 6）在 pages/cardList.tsx
- [x] T011 [US1] 在 CardList 組件新增 containerRef（useRef）用於 ResizeObserver 在 pages/cardList.tsx
- [x] T012 [US1] 實作 ResizeObserver 邏輯監聽容器寬度變化並計算 cardsPerRow 在 pages/cardList.tsx
- [x] T013 [US1] 在 ResizeObserver 回調中實作卡片數量計算公式：Math.floor((width + gap) / (cardWidth + gap)) 在 pages/cardList.tsx
- [x] T014 [US1] 加入邊界條件處理：Math.max(1, cardsPerRow) 確保至少顯示 1 張卡片 在 pages/cardList.tsx
- [x] T015 [US1] 修改 Container 的 sx 屬性，使用 CSS Grid 取代現有的 auto-fill 佈局 在 pages/cardList.tsx
- [x] T016 [US1] 設定 gridTemplateColumns: repeat(auto-fit, minmax(...)) 並配合響應式斷點（xs/sm）在 pages/cardList.tsx
- [x] T017 [US1] 設定 gap: 2 和 justifyContent: 'center' 確保卡片對齊 在 pages/cardList.tsx
- [x] T018 [US1] 新增正體中文註解說明 ResizeObserver 邏輯和計算公式 在 pages/cardList.tsx

**Checkpoint**: User Story 1 完成。可透過調整視窗寬度測試，驗證卡片網格即時重排且每排數量一致。

### 手動測試 US1

參考 `quickstart.md` 場景 1：
1. 在桌面尺寸（≥1024px）檢視，每排應顯示 4+ 張卡片
2. 在手機尺寸（≤480px）檢視，每排應顯示 2-4 張卡片
3. 拖曳視窗寬度，卡片網格應即時重排（< 500ms）
4. 縮小到極窄（< 300px），至少顯示 1 張卡片

---

## Phase 4: User Story 2 - 智慧分頁計算 (Priority: P2)

**Goal**: 確保每頁顯示的卡片數量是「每排數量」的倍數，分頁邊界不切斷某一排

**Independent Test**: 在不同螢幕尺寸下點擊「下一頁」，驗證每一頁的最後一排都是完整的

### Implementation for User Story 2

- [x] T019 [US2] 修改現有的 page state 為 currentPage（從 page 重新命名）在 pages/cardList.tsx
- [x] T020 [US2] 移除現有的固定 size 常數（24）在 pages/cardList.tsx
- [x] T021 [US2] 新增動態計算：itemsPerPage = cardsPerRow × ROWS_PER_PAGE 在 pages/cardList.tsx
- [x] T022 [US2] 新增動態計算：totalPages = Math.ceil(cards.length / itemsPerPage) 在 pages/cardList.tsx
- [x] T023 [US2] 新增 useEffect 監聽 cardsPerRow 變化，當變化時重置 currentPage = 0 在 pages/cardList.tsx
- [x] T024 [US2] 修改 cards.slice 使用新的 startIndex 和 endIndex（基於 itemsPerPage）在 pages/cardList.tsx
- [x] T025 [US2] 修改 canNextPage 和 canPrevPage 函數使用 totalPages 而非硬編碼 在 pages/cardList.tsx
- [x] T026 [US2] 新增邊界條件處理：當 cards.length === 0 時設定 totalPages = 0 在 pages/cardList.tsx
- [x] T027 [US2] 新增正體中文註解說明智慧分頁計算邏輯 在 pages/cardList.tsx

**Checkpoint**: User Story 2 完成。每頁的卡片數量是每排的倍數，分頁邊界對齊每排。

### 手動測試 US2

參考 `quickstart.md` 場景 2：
1. 在桌面尺寸，觀察第一頁是否為「每排數量 × 4 排」
2. 點擊「下一頁」，驗證第一頁最後一排是完整的
3. 調整視窗寬度導致每排數量改變，驗證自動跳回第 1 頁
4. 驗證最後一頁的最後一排可能不滿（正常行為）

---

## Phase 5: User Story 3 - 分頁導航體驗優化 (Priority: P3)

**Goal**: 顯示當前頁碼和總頁數，提供清楚的分頁導航資訊

**Independent Test**: 點擊分頁按鈕，驗證頁碼顯示正確且按鈕啟用/停用狀態正確

### Implementation for User Story 3

- [x] T028 [US3] 在分頁控制區域新增 Typography 組件顯示「第 X 頁 / 共 Y 頁」在 pages/cardList.tsx
- [x] T029 [US3] 使用 currentPage + 1 顯示頁碼（因為 currentPage 是 0-based）在 pages/cardList.tsx
- [x] T030 [US3] 使用 totalPages 顯示總頁數 在 pages/cardList.tsx
- [x] T031 [US3] 調整分頁按鈕的樣式，確保頁碼資訊和按鈕排列合理（使用 flexbox）在 pages/cardList.tsx
- [x] T032 [US3] 當 totalPages <= 1 時，可選擇隱藏分頁按鈕或顯示「第 1 頁 / 共 1 頁」在 pages/cardList.tsx
- [x] T033 [US3] 新增正體中文註解說明分頁導航 UI 邏輯 在 pages/cardList.tsx

**Checkpoint**: User Story 3 完成。使用者能清楚看到當前頁碼和總頁數。

### 手動測試 US3

參考 `quickstart.md` 場景 3：
1. 驗證分頁資訊顯示「第 X 頁 / 共 Y 頁」
2. 在第 1 頁時，「上一頁」按鈕停用
3. 在最後一頁時，「下一頁」按鈕停用
4. 在中間頁，兩個按鈕都啟用

---

## Phase 6: Polish & Cross-Cutting Concerns（優化和跨功能關注）

**Purpose**: 處理錯誤狀態、Edge cases 和效能優化

- [x] T034 [P] 處理 API 錯誤狀態：當 props.error 存在時顯示 Alert 組件 在 pages/cardList.tsx
- [x] T035 [P] 處理空資料狀態：當 cards.length === 0 時顯示「目前沒有卡片」在 pages/cardList.tsx
- [x] T036 實作簡化版 debounce：避免快速調整視窗導致效能問題（300ms 延遲）在 pages/cardList.tsx
- [x] T037 將 debounce 應用到 ResizeObserver 的回調函數 在 pages/cardList.tsx
- [x] T038 [P] 新增完整的正體中文註解，解釋整體架構和關鍵邏輯 在 pages/cardList.tsx
- [ ] T039 執行 `npm run lint` 確保無 ESLint 錯誤 在專案根目錄
- [ ] T040 執行 `npm run build` 確保 TypeScript 編譯成功 在專案根目錄
- [ ] T041 執行 `npm start` 並手動測試 production build 在專案根目錄

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 無依賴 - 可立即開始
- **Foundational (Phase 2)**: 依賴 Setup 完成 - **BLOCKS 所有 user stories**
- **User Stories (Phase 3-5)**: 所有依賴 Foundational 完成
  - US1 (Phase 3): 依賴 Foundational，無其他依賴
  - US2 (Phase 4): 依賴 Foundational + US1 完成（因為修改 US1 建立的邏輯）
  - US3 (Phase 5): 依賴 Foundational + US2 完成（因為使用 US2 的 totalPages）
- **Polish (Phase 6)**: 依賴所有 user stories 完成

### User Story Dependencies

- **User Story 1 (P1)**: Foundational 完成後可開始 - 無其他依賴
- **User Story 2 (P2)**: 依賴 US1 完成（修改 US1 的分頁邏輯）
- **User Story 3 (P3)**: 依賴 US2 完成（使用 US2 的 totalPages 和 currentPage）

### Within Each User Story

- US1: T010-T018 必須依序執行（修改同一檔案的不同部分）
- US2: T019-T027 必須依序執行（修改 US1 建立的邏輯）
- US3: T028-T033 必須依序執行（在 US2 基礎上新增 UI）
- Polish: T034, T035, T038 可平行執行（不同功能區塊）；T036-T037 必須依序；T039-T041 必須依序

### Parallel Opportunities

- **Foundational Phase**: T006-T009 全部在同一檔案頂部，必須依序執行
- **Polish Phase**: T034（錯誤處理）、T035（空資料）、T038（註解）可平行處理
- **其他 Phase**: 因為都修改同一檔案（cardList.tsx）的相關邏輯，必須依序執行

---

## Parallel Example: Polish Phase

```bash
# 可同時處理這些獨立的功能（不同程式碼區塊）：
Task T034: 錯誤狀態處理（條件渲染）
Task T035: 空資料狀態（條件渲染）
Task T038: 新增註解（不影響邏輯）
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup（環境準備）
2. Complete Phase 2: Foundational（基礎型別定義）
3. Complete Phase 3: User Story 1（響應式網格）
4. **STOP and VALIDATE**: 手動測試 US1，驗證視窗調整時卡片網格即時重排
5. 若測試通過，即為可交付的 MVP

### Incremental Delivery

1. Complete Setup + Foundational → 基礎就緒
2. Add User Story 1 → 手動測試 → 可交付 MVP（響應式網格）
3. Add User Story 2 → 手動測試 → 智慧分頁版本
4. Add User Story 3 → 手動測試 → 完整體驗版本
5. Add Polish → 最終優化版本

### Sequential Execution (單人開發)

由於所有任務都修改同一個檔案（`pages/cardList.tsx`），建議單人依序完成：

1. Phase 1: Setup（T001-T005）
2. Phase 2: Foundational（T006-T009）
3. Phase 3: US1（T010-T018）
4. Phase 4: US2（T019-T027）
5. Phase 5: US3（T028-T033）
6. Phase 6: Polish（T034-T041）

---

## Notes

- **所有任務都修改同一檔案**（`pages/cardList.tsx`），因此大部分任務必須依序執行
- **手動測試為主**：符合 constitution「測試不一定要自動化」原則
- **每個 user story 完成後都可獨立測試**：參考 `quickstart.md` 的驗證場景
- **MVP 範圍**：Phase 1-3（Setup + Foundational + US1）即為最小可交付版本
- **正體中文註解**：符合 constitution「正體中文優先」原則
- **無新增依賴**：符合 constitution「避免過度設計」原則
- **Edge cases 處理**：在 Polish phase（T034-T035）處理錯誤和空資料狀態

---

## Total Task Count

- **Setup**: 5 tasks
- **Foundational**: 4 tasks（BLOCKING）
- **User Story 1 (P1)**: 9 tasks（MVP 核心）
- **User Story 2 (P2)**: 9 tasks
- **User Story 3 (P3)**: 6 tasks
- **Polish**: 8 tasks

**Total**: 41 tasks

**Parallel opportunities**: 3 tasks (T034, T035, T038 in Polish phase)

**Independent test criteria**:
- US1: 調整視窗寬度，驗證卡片網格即時重排
- US2: 點擊分頁，驗證每頁最後一排完整對齊
- US3: 檢查分頁資訊顯示正確

**Suggested MVP scope**: Phase 1-3（18 tasks）提供基本的響應式卡片網格功能
