# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js demo application that interfaces with the Clash Royale API to display player information and card data. Built with React, Next.js 12, TypeScript, and MUI Joy UI (alpha).

**Demo**: https://simple-clash-royale-demo.vercel.app/

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Environment Setup

The application requires a Clash Royale API key to function:

1. Register and generate a key at https://developer.clashroyale.com/
2. Set IP to `45.79.218.79` (current proxy IP for https://proxy.royaleapi.dev)
3. Create `.env.local` with:
   ```
   API_KEY=[YOUR_API_TOKEN]
   ```

## Architecture

### API Proxy Pattern

The application uses a server-side proxy to handle Clash Royale API requests, solving two key challenges:
- **IP binding**: Clash Royale API requires fixed IP (handled via royaleapi.dev proxy)
- **API key security**: Keys are never exposed to the client side

**Flow**: Client → Next.js API Route → Proxy (proxy.royaleapi.dev) → Clash Royale API

The proxy configuration is centralized in `src/server/server.config.ts`, which creates an axios instance with the proxy base URL and authorization header.

### API Routes

All API routes are server-side only and located in `pages/api/`:

- **`/api/cards`**: Fetches all card data from `/cards` endpoint
- **`/api/player/[id]`**: Fetches player data by tag (e.g., `#R09228V`)
  - Handles both single strings and array query params
  - Returns 404 on error

### Component Architecture

- **CardComp** (`src/component/cardComp.tsx`): Displays individual card with hover overlay showing card name. Uses Next.js Image with `layout='fill'` for responsive images.
- **DeckComp** (`src/component/deckComp.tsx`): Displays a 4-column grid of cards representing a player's current deck
- **Layout** (`src/layout/layout.tsx`): App-wide layout wrapper

### Data Fetching Pattern

The codebase uses two patterns for data fetching:
1. **Custom hooks** (e.g., `useCards` in `src/model/useCards.js`): Encapsulates state management and axios calls
2. **Component-level state** (e.g., `players.js`): Uses `useCallback` to bind fetch functions to state changes

### File Organization

- `pages/`: Next.js pages and API routes (mix of `.js` and `.tsx`)
- `src/component/`: React components (`.tsx`)
- `src/model/`: Custom hooks for data fetching (`.js`)
- `src/layout/`: Layout components
- `src/server/`: Server configuration (axios instance)

### Tech Stack Notes

- **MUI Joy UI**: Using alpha version (`@mui/joy@5.0.0-alpha.43`)
- **TypeScript**: Configured with `strict: false` and `baseUrl: "./"` for absolute imports
- **Image Handling**: Uses Next.js Image component with `priority={true}` for above-fold cards
- **Styling**: Emotion for CSS-in-JS with MUI's `sx` prop

## Known Issues

1. `/api/cards` endpoint returns cards with inconsistent image sizes
2. Player deck cards have `levels` and `starLevels` properties not currently displayed (see TODO in `deckComp.tsx:7`)

## Testing

Jest is installed (`"jest": "^29.1.2"`) but no test files or configuration currently exist in the repository.
