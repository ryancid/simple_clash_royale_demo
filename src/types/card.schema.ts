import { z } from 'zod'

/**
 * Zod schema for card icon URLs
 */
export const IconUrlsSchema = z.object({
  medium: z.string().url(),
  evolutionMedium: z.string().url().optional(),
})

/**
 * Zod schema for card rarity enum
 */
export const CardRaritySchema = z.enum([
  'COMMON',
  'RARE',
  'EPIC',
  'LEGENDARY',
  'CHAMPION',
])

/**
 * Zod schema for a single card from the Clash Royale API
 */
export const CardSchema = z.object({
  name: z.string(),
  id: z.number(),
  maxLevel: z.number(),
  iconUrls: IconUrlsSchema,
  rarity: z.string(), // Changed from enum to string for flexibility with API variations
  elixirCost: z.number().int().min(0).max(10).optional(), // Some cards may not have elixir cost
  maxEvolutionLevel: z.number().optional(),
})

/**
 * Zod schema for the cards API response
 */
export const CardsResponseSchema = z.object({
  items: z.array(CardSchema),
  supportItems: z.array(CardSchema).optional(),
})

/**
 * TypeScript types inferred from Zod schemas
 */
export type IconUrls = z.infer<typeof IconUrlsSchema>
export type CardRarity = z.infer<typeof CardRaritySchema>
export type Card = z.infer<typeof CardSchema>
export type CardsResponse = z.infer<typeof CardsResponseSchema>
