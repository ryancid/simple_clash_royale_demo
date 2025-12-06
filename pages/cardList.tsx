import { GetStaticProps } from 'next'
import { serverInstance } from 'src/server/server.config'
import CardComp from 'src/component/cardComp'
import { Box, Button, Container } from '@mui/joy'
import { useCallback, useState } from 'react'
import { Card, CardsResponseSchema } from 'src/types/card.schema'

interface CardListProps {
  cards: Card[]
  error?: string
}

const CardList = ({ cards }: CardListProps) => {
  const size = 24
  const [page, setPage] = useState(0)

  const canNextPage = useCallback(() => {
    return (page + 1) * size < cards.length
  }, [page, cards.length])

  const canPrevPage = useCallback(() => {
    return page - 1 >= 0
  }, [page])

  return (
    <Box>
      <Container
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(auto-fill, 80px)',
            sm: 'repeat(auto-fill, 120px)',
          },
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
        {cards.slice(page * size, page * size + size).map((card) => (
          <CardComp key={card.id} card={card} />
        ))}
      </Container>
      <Container
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'right',
        }}
      >
        <Button disabled={!canPrevPage()} onClick={() => setPage((page) => page - 1)}>
          Previous
        </Button>
        &nbsp;
        <Button disabled={!canNextPage()} onClick={() => setPage((page) => page + 1)}>
          Next
        </Button>
      </Container>
    </Box>
  )
}

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
