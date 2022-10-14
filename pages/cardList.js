import { serverInstance } from 'src/server/server.config'
import CardComp from 'src/component/cardComp'
import { Box, Button, Container, useTheme } from '@mui/joy'
import { useCallback, useState } from 'react'

const CardList = ({ cards }) => {
  const size = 24
  const [page, setPage] = useState(0)

  const canNextPage = useCallback(() => {
    return (page + 1) * size < cards.length
  }, [page, size, cards.length])
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

export async function getStaticProps() {
  let props = {}
  try {
    const axiosResult = await serverInstance.get('/cards')
    props.cards = axiosResult.data.items
  } catch (err) {
    console.error(err)
    props.error = err
  }

  return {
    props,
  }
}

export default CardList
