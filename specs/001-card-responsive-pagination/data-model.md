# Data Model: 卡片頁面響應式分頁優化

**Date**: 2025-12-06
**Feature**: 001-card-responsive-pagination

## 概述

此功能主要處理前端狀態管理，不涉及後端資料模型變更。所有資料模型延用現有的 `Card` schema（定義於 `src/types/card.schema.ts`），新增前端分頁狀態管理。

## 實體定義

### 1. Card（現有，無需修改）

**用途**：代表 Clash Royale 卡片的基本資訊

**來源**：Clash Royale API (`/api/cards`)

**Schema**（Zod）：
```typescript
const CardSchema = z.object({
  name: z.string(),
  id: z.number(),
  maxLevel: z.number(),
  iconUrls: IconUrlsSchema,
  rarity: z.string(),
  elixirCost: z.number().int().min(0).max(10).optional(),
  maxEvolutionLevel: z.number().optional(),
})
```

**欄位說明**：
- `id`: 卡片唯一識別碼（number）
- `name`: 卡片名稱（string）
- `iconUrls`: 卡片圖示 URL（IconUrls 物件）
  - `medium`: 一般版本圖片 URL
  - `evolutionMedium`: 進化版本圖片 URL（可選）
- `elixirCost`: Elixir 消耗（0-10，可選）
- `maxEvolutionLevel`: 最大進化等級（可選）
- `maxLevel`: 最大等級（number）
- `rarity`: 稀有度（string）

**關聯**：
- 無關聯（獨立實體）

**驗證規則**：
- `id` 必須是正整數
- `elixirCost` 必須在 0-10 範圍內
- `iconUrls.medium` 必須是有效的 URL

---

### 2. PaginationState（新增，前端狀態）

**用途**：管理卡片列表的分頁狀態

**來源**：前端 React state

**TypeScript Interface**：
```typescript
interface PaginationState {
  currentPage: number        // 當前頁碼（0-based）
  cardsPerRow: number        // 每排卡片數量（動態計算）
  rowsPerPage: number        // 每頁顯示幾排（固定值，例如 4）
  totalPages: number         // 總頁數（根據 cards.length 計算）
}
```

**欄位說明**：
- `currentPage`: 當前顯示的頁碼（從 0 開始）
- `cardsPerRow`: 根據視窗寬度計算的每排卡片數量
- `rowsPerPage`: 固定值，定義每頁顯示幾排（例如 4 排）
- `totalPages`: 總頁數 = `Math.ceil(cards.length / (cardsPerRow × rowsPerPage))`

**驗證規則**：
- `currentPage` ≥ 0 且 < `totalPages`
- `cardsPerRow` ≥ 1（至少顯示 1 張卡片）
- `rowsPerPage` > 0（至少顯示 1 排）

**狀態轉換**：
```
初始狀態:
  currentPage = 0
  cardsPerRow = 6 (預設值，等待計算)
  rowsPerPage = 4
  totalPages = Math.ceil(cards.length / 24)

視窗調整觸發:
  cardsPerRow = 重新計算
  totalPages = 重新計算
  currentPage = 0 (重置到第一頁)

上一頁/下一頁:
  currentPage = currentPage ± 1
  (需驗證邊界條件)
```

---

### 3. GridLayoutConfig（新增，前端配置）

**用途**：定義響應式網格佈局的配置參數

**來源**：前端常數配置

**TypeScript Interface**：
```typescript
interface GridLayoutConfig {
  cardWidth: {
    xs: number     // 手機卡片寬度（px）
    sm: number     // 桌面卡片寬度（px）
  }
  gap: number      // 卡片間距（MUI spacing units）
  rowsPerPage: number  // 每頁顯示幾排
}
```

**欄位說明**：
- `cardWidth.xs`: 手機螢幕上的卡片寬度（75px）
- `cardWidth.sm`: 桌面螢幕上的卡片寬度（106px）
- `gap`: 卡片間距（2 = 16px，使用 MUI 的 spacing scale）
- `rowsPerPage`: 每頁顯示的排數（4 排）

**常數值**：
```typescript
const GRID_LAYOUT_CONFIG: GridLayoutConfig = {
  cardWidth: {
    xs: 75,   // 對應 CardComp 的 width: { xs: 75 }
    sm: 106,  // 對應 CardComp 的 width: { sm: 106 }
  },
  gap: 2,     // MUI spacing: 2 × 8px = 16px
  rowsPerPage: 4,
}
```

---

## 資料流

```
┌─────────────────────────────────────────────────────┐
│ getStaticProps (Build Time)                         │
│ - 呼叫 serverInstance.get('/cards')                 │
│ - Zod 驗證回傳資料（CardsResponseSchema）          │
│ - 回傳 { cards: Card[], error?: string }           │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│ CardList Component (Client Side)                    │
│ - 接收 cards: Card[]                                │
│ - 初始化 PaginationState                            │
│ - 使用 ResizeObserver 監聽容器寬度                 │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│ 容器寬度變化                                        │
│ - 計算 cardsPerRow = floor((width + gap) / (cardWidth + gap))
│ - 更新 PaginationState.cardsPerRow                  │
│ - 重新計算 totalPages                               │
│ - 重置 currentPage = 0                              │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│ 計算當前頁面要顯示的卡片                            │
│ - itemsPerPage = cardsPerRow × rowsPerPage          │
│ - startIndex = currentPage × itemsPerPage           │
│ - endIndex = startIndex + itemsPerPage              │
│ - currentCards = cards.slice(startIndex, endIndex)  │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│ 渲染卡片網格                                        │
│ - 使用 CSS Grid 顯示 currentCards                   │
│ - 每個 Card 傳給 CardComp 渲染                      │
└─────────────────────────────────────────────────────┘
```

---

## 與現有資料的關聯

### 保持不變的部分：

1. **Card Schema**（`src/types/card.schema.ts`）
   - 完全不修改
   - 繼續使用 Zod 驗證 API 回傳資料

2. **CardComp**（`src/component/cardComp.tsx`）
   - 完全不修改
   - 繼續接收 `Card` 型別的 props

3. **API Routes**（`pages/api/cards.ts`）
   - 完全不修改
   - 繼續回傳相同的資料格式

### 修改的部分：

1. **CardList Component**（`pages/cardList.tsx`）
   - 新增 `PaginationState` 狀態管理
   - 新增 `GridLayoutConfig` 常數配置
   - 修改分頁邏輯使用動態的 `itemsPerPage`
   - 新增 ResizeObserver 邏輯

---

## 邊界條件處理

### 空資料
```typescript
if (cards.length === 0) {
  // 顯示「目前沒有卡片」訊息
  // totalPages = 0
  // 不顯示分頁按鈕
}
```

### 卡片數量少於一頁
```typescript
if (cards.length <= itemsPerPage) {
  // totalPages = 1
  // 顯示「第 1 頁 / 共 1 頁」
  // 上一頁/下一頁按鈕均停用
}
```

### 極窄視窗
```typescript
const cardsPerRow = Math.max(1, calculatedCardsPerRow)
// 確保至少顯示 1 張卡片，避免除以零錯誤
```

### 頁碼超出範圍
```typescript
const safeCurrentPage = Math.min(currentPage, totalPages - 1)
// 當視窗調整導致 totalPages 減少時，確保 currentPage 不超出範圍
```

---

## 型別定義檔案

建議在 `pages/cardList.tsx` 檔案內定義以下型別（不需要獨立檔案）：

```typescript
// 分頁狀態介面
interface PaginationState {
  currentPage: number
  cardsPerRow: number
  rowsPerPage: number
  totalPages: number
}

// 網格佈局配置介面
interface GridLayoutConfig {
  cardWidth: {
    xs: number
    sm: number
  }
  gap: number
  rowsPerPage: number
}

// CardList 組件 props（已存在，無需修改）
interface CardListProps {
  cards: Card[]
  error?: string
}
```

---

## 資料驗證

### Build Time（getStaticProps）
- 使用 `CardsResponseSchema.parse()` 驗證 API 回傳資料
- 確保所有 Card 物件符合 schema

### Runtime（Component）
- `cardsPerRow` 必須 ≥ 1
- `currentPage` 必須在 0 到 totalPages-1 範圍內
- `itemsPerPage` 必須 > 0

---

## 總結

此功能的資料模型變更集中在前端狀態管理，新增了兩個介面：
1. **PaginationState**: 管理分頁狀態
2. **GridLayoutConfig**: 定義佈局配置

現有的 `Card` schema 和後端 API 完全不需要修改，符合 Constitution 的「避免過度設計」原則。
