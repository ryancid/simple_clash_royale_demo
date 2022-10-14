import { Box, Container, Typography } from "@mui/joy"
import CardComp from "src/component/cardComp"


const DeckComp = ({deck = []})=> {
    // console.log(deck)
    // TODO: card in deck have levels and star levels, might need to add card variant
    // 
    return <div>
        <Typography>Current User Deck</Typography>
        <Box sx={{display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 120px))'}}>
        {deck.map(card=><CardComp key={card.id} card={card}/>)}
        </Box>
    </div>
}

export default DeckComp