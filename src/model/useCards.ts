import { useState } from 'react'
import axios from 'axios'
import { Card, CardsResponseSchema } from 'src/types/card.schema'

/**
 * Custom hook for fetching and managing Clash Royale cards
 * Uses Zod validation to ensure API response matches expected schema
 */
const useCards = () => {
  const [cards, setCards] = useState<Card[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCards = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await axios.get('/api/cards')

      // Validate the response with Zod schema
      const validatedData = CardsResponseSchema.parse(result.data)

      if (Array.isArray(validatedData.items)) {
        setCards(validatedData.items)
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to fetch cards')
      }
      console.error('Error fetching cards:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return { cards, fetchCards, isLoading, error }
}

export default useCards
