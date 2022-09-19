import { Card, CardCover, CardContent, Typography } from "@mui/joy"
import Image from "next/image"

const CardComp = ({card})=>{
    return (<Card
        // key={card.id}
        style={{
          margin: 8,
          padding: 4,
          width: 108,
          height: 185,
          border: '1px solid grey',
          borderRadius: 8,
          textAlign: 'center',
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
        <br />
        <CardContent
          sx={{
            bottom: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <Typography textAlign={'center'}>{card.name}</Typography>
        </CardContent>
      </Card>)
}

export default CardComp