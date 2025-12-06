import { Box, Card, CardCover, Typography } from '@mui/joy'
import Image from 'next/image'
import { Card as CardType } from 'src/types/card.schema'

interface CardCompProps {
  card: CardType
}

const CardComp = ({ card }: CardCompProps) => {
  return (
    <Card
      sx={{
        margin: 1,
        padding: 0.5,
        width: { xs: 75, sm: 106 },
        height: { xs: 100, sm: 130 },
        border: '1px solid grey',
        borderRadius: 8,
        textAlign: 'center',
        position: 'relative',
        '&:hover .card-overlay': {
          display: 'unset',
        },
        '& .card-overlay': {
          display: 'none',
        },
      }}
    >
      <CardCover>
        <Image
          objectFit={'cover'}
          layout={'fill'}
          src={card.iconUrls.medium}
          priority={true}
          alt={card.name + '\n not available'}
        />
      </CardCover>

      {/* Elixir cost badge in top-right corner with elixir drop background */}
      {card.elixirCost !== undefined && (
        <Box
          sx={{
            position: 'absolute',
            top: 2,
            right: 2,
            zIndex: 2,
            width: { xs: 28, sm: 36 },
            height: { xs: 32, sm: 42 },
            backgroundImage: 'url(/Elixir.webp)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: { xs: '4px', sm: '6px' },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              fontWeight: 'bold',
              color: 'white',
              textShadow: '0 1px 3px rgba(0,0,0,0.8), 0 0 2px rgba(0,0,0,0.9)',
              lineHeight: 1,
            }}
          >
            {card.elixirCost}
          </Typography>
        </Box>
      )}

      {/* Hover overlay with card name */}
      <Box
        className="card-overlay"
        sx={{
          top: 0,
          left: 0,
          background: 'rgba(0,0,0,0.3)',
          width: '100%',
          height: '100%',
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <Typography
          sx={{
            userSelect: 'none',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
          }}
          textAlign={'center'}
        >
          {card.name}
        </Typography>
      </Box>
    </Card>
  )
}

export default CardComp