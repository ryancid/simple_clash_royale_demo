# Technical Research: 卡片頁面響應式分頁優化

**Date**: 2025-12-06
**Feature**: 001-card-responsive-pagination

## 研究目標

針對響應式卡片網格佈局和智慧分頁功能，研究以下技術決策：

1. 如何動態計算每排可顯示的卡片數量
2. CSS Grid 佈局的最佳實作方式
3. 視窗尺寸監聽和 debounce 處理
4. 分頁邏輯如何配合動態的每排卡片數量

## 決策 1：動態計算每排卡片數量

### 選擇方案：使用 ResizeObserver + container width 計算

**Rationale**:
- **精確性**：ResizeObserver 能準確監聽容器寬度變化，不只是視窗變化
- **效能**：比 window.resize 更高效，只監聽特定元素
- **相容性**：現代瀏覽器均支援（iOS 14+, Chrome 64+）
- **計算公式**：`cardsPerRow = Math.floor((containerWidth + gap) / (cardWidth + gap))`

**Alternatives Considered**:

1. **CSS Grid auto-fill（現有方式）**
   - 優點：CSS 原生支援，無需 JavaScript
   - 缺點：無法得知實際每排卡片數量，無法實作「每頁是每排倍數」的需求
   - **拒絕原因**：不符合 FR-002 需求

2. **使用 matchMedia 和預設斷點**
   - 優點：簡單，使用固定斷點（xs: 3張, sm: 4張, md: 6張, lg: 8張）
   - 缺點：不夠精確，無法適應所有視窗尺寸
   - **拒絕原因**：不符合「無論使用者的頁面是大是小」的需求

3. **使用 IntersectionObserver**
   - 優點：可監聽元素是否在可見範圍
   - 缺點：不適用於計算寬度
   - **拒絕原因**：工具不匹配使用場景

**Implementation Details**:
```typescript
// 使用 ResizeObserver 監聽容器寬度
useEffect(() => {
  const container = containerRef.current
  if (!container) return

  const observer = new ResizeObserver((entries) => {
    const width = entries[0].contentRect.width
    const cardsPerRow = Math.floor((width + gap) / (cardWidth + gap))
    setCardsPerRow(Math.max(1, cardsPerRow)) // 至少顯示 1 張
  })

  observer.observe(container)
  return () => observer.disconnect()
}, [])
```

---

## 決策 2：CSS Grid 佈局實作方式

### 選擇方案：使用 `grid-template-columns: repeat(auto-fit, minmax(...))`

**Rationale**:
- **響應性**：auto-fit 會自動填滿可用空間
- **一致性**：配合 `justifyContent: 'center'` 確保卡片置中對齊
- **簡單性**：無需複雜的 JavaScript 計算網格佈局
- **維護性**：CSS 原生特性，瀏覽器優化良好

**Alternatives Considered**:

1. **Flexbox + flex-wrap**
   - 優點：廣泛支援，彈性高
   - 缺點：對齊控制較複雜，無法保證每排數量一致
   - **拒絕原因**：Grid 更適合二維佈局

2. **固定 grid-template-columns**（例如 `repeat(6, 1fr)`）
   - 優點：每排卡片數量固定
   - 缺點：無法響應不同螢幕尺寸
   - **拒絕原因**：不符合響應式需求

**Implementation Details**:
```typescript
sx={{
  display: 'grid',
  gridTemplateColumns: {
    xs: 'repeat(auto-fit, minmax(75px, 1fr))',
    sm: 'repeat(auto-fit, minmax(106px, 1fr))',
  },
  gap: 2,
  justifyContent: 'center',
}}
```

---

## 決策 3：視窗尺寸監聽和 Debounce 處理

### 選擇方案：ResizeObserver + lodash.debounce (手動實作簡化版)

**Rationale**:
- **即時性**：ResizeObserver 提供即時回饋
- **效能**：debounce 避免過度頻繁的重新計算
- **簡單性**：手動實作 debounce（300ms 延遲），避免引入 lodash
- **Constitution 符合**：不引入新依賴（IV. 避免過度設計）

**Alternatives Considered**:

1. **使用 lodash.debounce**
   - 優點：成熟的實作，經過充分測試
   - 缺點：需要引入新依賴
   - **拒絕原因**：違反「不引入新依賴」的約束

2. **使用 requestAnimationFrame**
   - 優點：與瀏覽器渲染週期同步
   - 缺點：可能過於頻繁，增加計算負擔
   - **拒絕原因**：對此場景過度複雜

3. **不使用 debounce**
   - 優點：最簡單
   - 缺點：快速調整視窗會導致效能問題
   - **拒絕原因**：不符合 SC-007（快速視窗調整不出現問題）

**Implementation Details**:
```typescript
// 簡化的 debounce 實作
function useDebouncedResize(callback: () => void, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout>()

  return useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(callback, delay)
  }, [callback, delay])
}
```

---

## 決策 4：分頁邏輯與動態每排數量的配合

### 選擇方案：動態計算 `itemsPerPage = cardsPerRow × rowsPerPage`

**Rationale**:
- **對齊需求**：確保每頁的卡片數量是每排的倍數
- **彈性**：`rowsPerPage` 可設定（例如 4 排），適應不同螢幕
- **簡單**：分頁邏輯仍使用 `currentPage` 和 `itemsPerPage`
- **重置機制**：當 `cardsPerRow` 變化時，重置到第一頁避免顯示空頁

**Alternatives Considered**:

1. **固定 itemsPerPage（現有方式 = 24）**
   - 優點：簡單
   - 缺點：無法配合動態的每排數量
   - **拒絕原因**：不符合 FR-002 需求

2. **使用虛擬滾動（virtual scrolling）**
   - 優點：效能最佳，適合大量資料
   - 缺點：過度複雜，卡片數量 < 200 不需要
   - **拒絕原因**：違反 IV. 避免過度設計

**Implementation Details**:
```typescript
const ROWS_PER_PAGE = 4 // 每頁顯示 4 排

const [cardsPerRow, setCardsPerRow] = useState(6)
const [currentPage, setCurrentPage] = useState(0)

const itemsPerPage = cardsPerRow * ROWS_PER_PAGE

// 當 cardsPerRow 變化時，重置到第一頁
useEffect(() => {
  setCurrentPage(0)
}, [cardsPerRow])

const totalPages = Math.ceil(cards.length / itemsPerPage)
const startIndex = currentPage * itemsPerPage
const endIndex = startIndex + itemsPerPage
const currentCards = cards.slice(startIndex, endIndex)
```

---

## 決策 5：載入和錯誤狀態處理

### 選擇方案：使用 MUI Joy UI 的 CircularProgress 和 Alert 組件

**Rationale**:
- **一致性**：使用專案現有的 UI 套件
- **簡單性**：無需自行實作 loading skeleton
- **可訪問性**：MUI 組件內建 ARIA 支援
- **Constitution 符合**：不引入新依賴

**Alternatives Considered**:

1. **自訂 loading skeleton**
   - 優點：更精緻的 UX
   - 缺點：增加開發時間，不符合 MVP
   - **拒絕原因**：P1 不需要，可留待未來優化

2. **使用 Suspense + React.lazy**
   - 優點：Next.js 原生支援
   - 缺點：此功能使用 getStaticProps，不適用
   - **拒絕原因**：不適合 SSG 場景

**Implementation Details**:
```typescript
// 在 getStaticProps 中處理錯誤
if (props.error) {
  return (
    <Alert color="danger">
      載入卡片時發生錯誤：{props.error}
    </Alert>
  )
}

// 空資料狀態
if (cards.length === 0) {
  return (
    <Typography level="body-lg">
      目前沒有卡片
    </Typography>
  )
}
```

---

## 決策 6：TypeScript 型別定義

### 選擇方案：擴充現有的 Card 型別，新增 PaginationState 介面

**Rationale**:
- **型別安全**：確保分頁狀態的正確性
- **可維護性**：明確定義狀態結構
- **Constitution 符合**：符合 I. 高品質程式碼原則

**Implementation Details**:
```typescript
interface PaginationState {
  currentPage: number
  cardsPerRow: number
  rowsPerPage: number
  totalPages: number
}

interface CardListProps {
  cards: Card[]
  error?: string
}
```

---

## 技術風險評估

### 低風險
- ✅ ResizeObserver 相容性（目標瀏覽器均支援）
- ✅ CSS Grid 相容性（現代瀏覽器均支援）
- ✅ TypeScript 型別安全（編譯時檢查）

### 中風險
- ⚠️ 效能（快速調整視窗）
  - **緩解措施**：使用 debounce（300ms）
  - **驗證方式**：手動測試 SC-007

- ⚠️ 極窄視窗（< 300px）
  - **緩解措施**：`Math.max(1, cardsPerRow)` 確保至少顯示 1 張
  - **驗證方式**：手動測試 Edge Case

### 高風險
- 無

---

## 實作檢查清單

Phase 0 完成後，確認以下項目：

- [x] 所有技術決策已記錄
- [x] 替代方案已評估並說明拒絕原因
- [x] 符合 Constitution 檢查
- [x] 技術風險已識別並有緩解措施
- [x] 無未解決的 NEEDS CLARIFICATION

---

## 下一步

Phase 0 完成。進入 Phase 1：設計資料模型和快速開始指南。
