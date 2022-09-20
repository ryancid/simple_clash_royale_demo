import { serverInstance } from 'src/server/server.config'
import CardComp from 'src/component/cardComp'
import { Button, Container } from '@mui/joy'

const CardList = ({ cards }) => {
  // console.log(cards)
  return (
    <Container sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
      {cards.slice(0, 24).map((card) => (
        <CardComp key={card.id} card={card} />
      ))}
      {cards.length > 24 && <Button variant="outlined">show more</Button>}
    </Container>
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
