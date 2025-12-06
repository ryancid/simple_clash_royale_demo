import { GetStaticProps } from 'next'
import { serverInstance } from 'src/server/server.config'
import CardComp from 'src/component/cardComp'
import { Box, Button, Container, Typography, Alert } from '@mui/joy'
import { useCallback, useState, useEffect, useRef } from 'react'
import { Card, CardsResponseSchema } from 'src/types/card.schema'

// ============================================================================
// 型別定義 (Phase 2: Foundational)
// ============================================================================

// 分頁狀態介面
interface PaginationState {
  currentPage: number        // 當前頁碼（0-based）
  cardsPerRow: number        // 每排卡片數量（動態計算）
  rowsPerPage: number        // 每頁顯示幾排（固定值）
  totalPages: number         // 總頁數（根據 cards.length 計算）
}

// 網格佈局配置介面
interface GridLayoutConfig {
  cardWidth: {
    xs: number     // 手機卡片寬度（px）
    sm: number     // 桌面卡片寬度（px）
  }
  gap: number      // 卡片間距（MUI spacing units）
  rowsPerPage: number  // 每頁顯示幾排
}

interface CardListProps {
  cards: Card[]
  error?: string
}

// ============================================================================
// 常數配置 (Phase 2: Foundational)
// ============================================================================

// 網格佈局配置常數
const GRID_LAYOUT_CONFIG: GridLayoutConfig = {
  cardWidth: {
    xs: 75,   // 對應 CardComp 的 width: { xs: 75 }
    sm: 106,  // 對應 CardComp 的 width: { sm: 106 }
  },
  gap: 2,     // MUI spacing: 2 × 8px = 16px
  rowsPerPage: 4,
}

// 每頁顯示的排數
const ROWS_PER_PAGE = 4

// ============================================================================
// 主要組件
// ============================================================================

const CardList = ({ cards, error }: CardListProps) => {
  // ============================================================================
  // Phase 3: User Story 1 - 響應式卡片網格佈局
  // ============================================================================

  // 狀態：每排可顯示的卡片數量（預設值 6，等待 ResizeObserver 計算）
  const [cardsPerRow, setCardsPerRow] = useState(6)

  // 狀態：當前頁碼（0-based）
  const [currentPage, setCurrentPage] = useState(0)

  // Ref：容器元素參考，用於 ResizeObserver
  const containerRef = useRef<HTMLDivElement>(null)

  // Ref：debounce timer
  const debounceTimerRef = useRef<number>(0)

  // ResizeObserver：監聽容器寬度變化並動態計算每排卡片數量
  // Phase 6: 使用 debounce 避免快速調整視窗導致效能問題
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 使用 ResizeObserver 監聽容器尺寸變化
    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width

      // Debounce：延遲 300ms 執行計算，避免過度頻繁的重新計算
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      debounceTimerRef.current = window.setTimeout(() => {
        // 判斷當前是否為手機尺寸（使用 MUI 的斷點邏輯）
        const isMobile = window.innerWidth < 600 // MUI 的 sm 斷點
        const cardWidth = isMobile
          ? GRID_LAYOUT_CONFIG.cardWidth.xs
          : GRID_LAYOUT_CONFIG.cardWidth.sm
        const gap = GRID_LAYOUT_CONFIG.gap * 8 // MUI spacing: 2 × 8px = 16px

        // 計算每排可顯示的卡片數量
        // 公式：Math.floor((容器寬度 + 間距) / (卡片寬度 + 間距))
        const calculatedCardsPerRow = Math.floor((width + gap) / (cardWidth + gap))

        // 確保至少顯示 1 張卡片（處理極窄視窗的 edge case）
        const finalCardsPerRow = Math.max(1, calculatedCardsPerRow)

        setCardsPerRow(finalCardsPerRow)
      }, 300) // 300ms 延遲
    })

    observer.observe(container)

    // Cleanup：組件卸載時斷開 observer 並清除 timer
    return () => {
      observer.disconnect()
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  // ============================================================================
  // Phase 4: User Story 2 - 智慧分頁計算
  // ============================================================================

  // 動態計算每頁顯示的卡片數量（每排數量 × 每頁排數）
  // 這確保了每頁的卡片數量是每排的倍數，分頁邊界不會切斷某一排
  const itemsPerPage = cardsPerRow * ROWS_PER_PAGE

  // 動態計算總頁數
  // 邊界條件：當 cards.length === 0 時，totalPages = 0
  const totalPages = cards.length === 0 ? 0 : Math.ceil(cards.length / itemsPerPage)

  // 當 cardsPerRow 變化時，重置到第一頁
  // 原因：視窗調整可能導致 totalPages 減少，currentPage 可能超出範圍
  useEffect(() => {
    setCurrentPage(0)
  }, [cardsPerRow])

  // 分頁導航函數：檢查是否可以前往下一頁
  const canNextPage = useCallback(() => {
    return currentPage + 1 < totalPages
  }, [currentPage, totalPages])

  // 分頁導航函數：檢查是否可以前往上一頁
  const canPrevPage = useCallback(() => {
    return currentPage > 0
  }, [currentPage])

  // ============================================================================
  // 錯誤處理
  // ============================================================================

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert color="danger">
          載入卡片時發生錯誤：{error}
        </Alert>
      </Container>
    )
  }

  if (cards.length === 0) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography level="body-lg">
          目前沒有卡片
        </Typography>
      </Container>
    )
  }

  // ============================================================================
  // 渲染
  // ============================================================================

  // 計算當前頁面要顯示的卡片（使用動態的 itemsPerPage）
  const startIndex = currentPage * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentCards = cards.slice(startIndex, endIndex)

  return (
    <Box>
      {/* 卡片網格容器 - Phase 3: 使用 CSS Grid 響應式佈局 */}
      <Container
        ref={containerRef}
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(auto-fit, minmax(75px, 1fr))',
            sm: 'repeat(auto-fit, minmax(106px, 1fr))',
          },
          gap: 2,
          justifyContent: 'center',
          alignItems: 'start',
        }}
      >
        {currentCards.map((card) => (
          <CardComp key={card.id} card={card} />
        ))}
      </Container>

      {/* Phase 5: User Story 3 - 分頁導航體驗優化 */}
      {/* 只在有多於一頁時顯示分頁控制 */}
      {totalPages > 1 && (
        <Container
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 2,
            gap: 2,
          }}
        >
          {/* 分頁資訊：顯示「第 X 頁 / 共 Y 頁」 */}
          <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
            第 {currentPage + 1} 頁 / 共 {totalPages} 頁
          </Typography>

          {/* 分頁按鈕 */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              disabled={!canPrevPage()}
              onClick={() => setCurrentPage((page) => page - 1)}
              size="sm"
            >
              上一頁
            </Button>
            <Button
              disabled={!canNextPage()}
              onClick={() => setCurrentPage((page) => page + 1)}
              size="sm"
            >
              下一頁
            </Button>
          </Box>
        </Container>
      )}
    </Box>
  )
}

// ============================================================================
// Server-side data fetching
// ============================================================================

export const getStaticProps: GetStaticProps<CardListProps> = async () => {
  const props: CardListProps = { cards: [] }

  try {
    const axiosResult = await serverInstance.get('/cards')

    // Validate the response with Zod schema
    const validatedData = CardsResponseSchema.parse(axiosResult.data)
    props.cards = validatedData.items
  } catch (err) {
    console.error('Error fetching cards:', err)
    props.error = err instanceof Error ? err.message : 'Failed to fetch cards'
    props.cards = []
  }

  return {
    props,
  }
}

export default CardList
