import {Box, Card, CardCover, CardContent, Typography } from "@mui/joy"
import Image from "next/image"

const CardComp = ({card})=>{
    return (<Card
        // key={card.id}
        sx={{
          margin: 1,
          padding: 0.5,
          width: 106,
          height: 130,
          border: '1px solid grey',
          borderRadius: 8,
          textAlign: 'center',
          '&:hover .card-overlay': {
            display: 'unset'
          },
          '& .card-overlay': {
            display: 'none'
          },
        }}
      >
        <CardCover>
          <Image
            width={100}
            height={130}
            // style={{ objectFit: "cover" }}
            objectFit={'cover'}
            layout={'fixed'}
            src={card.iconUrls.medium}
            priority={true}
            alt={card.name + '\n not available'}
          />
        </CardCover>
        <Box className='card-overlay'
          sx={{
            top:0,
            left:0,
            background: 'rgba(0,0,0,0.3)',
            width: '100%',
            height: '100%',
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <Typography sx={{userSelect: 'none', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white'}} textAlign={'center'}>{card.name}</Typography>
        </Box>
      </Card>)
}

export default CardComp