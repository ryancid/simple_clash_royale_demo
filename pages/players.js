import axios from 'axios'
import { Button, TextField, Typography } from '@mui/joy'
import { useCallback, useEffect, useState } from 'react'
import DeckComp from 'src/component/deckComp'

// show player info view
const Player = ({ player = {} }) => {
  return (
    <div>
      <Typography variant="h2" component="h2">
        {player.name}&nbsp;{player.tag}
      </Typography>
      <div>
        wins:{player.wins}&nbsp;losses:{player.losses}
      </div>
      {player.currentDeck && <DeckComp deck={player.currentDeck} />}
    </div>
  )
}

const Players = () => {
  const [playerId, setPlayerId] = useState('')
  const [fetch, setFetch] = useState(false)

  const [player, setPlayer] = useState()
  const fetchPlayer = useCallback(() => {
    axios('/api/player/' + encodeURIComponent(playerId))
      .then(
        (result) => {
          setPlayer(result.data)
        },
        (reason) => console.error(reason)
      )
      .finally(() => setFetch(false))
  }, [playerId])

  useEffect(() => {
    if (fetch) {
      fetchPlayer()
    }
    return () => {}
  }, [fetch, fetchPlayer])

  return (
    <div>
      <TextField
        placeholder="type game tag like #R09228V"
        onFocus={(e) => {
          if (!playerId) {
            const defaultId = '#R09228V'
            e.target.value = defaultId
            setPlayerId(defaultId)
          }
        }}
        onChange={(e) => setPlayerId(e.target.value)}
        endDecorator={
          <Button disabled={fetch} onClick={() => setFetch(true)}>
            Search
          </Button>
        }
      />
      {player && <Player player={player} />}
    </div>
  )
}

export default Players
