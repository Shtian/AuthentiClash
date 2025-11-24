# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AuthentiClash is a competitive 2FA code game where players enter their authentication codes (10-99) daily to accumulate points. The player with the highest total score when the game ends wins. Players can select character classes with unique abilities and passive effects that modify scoring.

Built with SvelteKit, Supabase, and deployed on Vercel.

## Development Setup

### Initial Setup

1. Start Supabase locally:

   ```bash
   supabase start
   ```

2. Create `.env` file with credentials from `supabase status`:

   ```
   PUBLIC_SUPABASE_URL={API URL}
   PUBLIC_SUPABASE_ANON_KEY={anon key}
   SUPABASE_SERVICE_KEY={service key}
   PUBLIC_ENV=local
   ```

3. Run migrations and install dependencies:

   ```bash
   supabase migration up
   pnpm install
   ```

4. Start development server:
   ```bash
   pnpm dev
   ```

### Common Commands

- `pnpm dev` - Start dev server
- `pnpm build` - Production build
- `pnpm preview` - Preview production build
- `pnpm check` - Type checking with svelte-check
- `pnpm check:watch` - Type checking in watch mode
- `pnpm lint` - Run Prettier and ESLint checks
- `pnpm format` - Auto-format code
- `pnpm test` - Run all tests (unit + integration)
- `pnpm test:unit` - Run Vitest unit tests only
- `pnpm test:integration` - Run Playwright integration tests only
- `pnpm supabase:reset` - Reset local DB and seed with demo data (10 users, 10 games)

### Running Single Tests

For unit tests, use Vitest filtering:

```bash
pnpm test:unit <test-name-pattern>
```

For integration tests, use Playwright filtering:

```bash
pnpm test:integration -g "<test-name-pattern>"
```

## Architecture

### Core Game Logic

**Score Engine** (`src/routes/games/[code]/score-engine.ts`):

- Central scoring logic for the game
- Enforces daily cooldown (one score entry per UTC day)
- Handles active abilities (one-time use per game)
- Handles passive abilities (automatic effects on each score)
- All score modifications go through `handleScoreUpdate()`

**Abilities System**:

- Active abilities (in `ABILITIES` const) - one-time powerful effects:
  - CUTPURSE: Steal 20-40 points from top player
  - CRIMSON_REAP: Deal 10-20 damage to 5 random players
  - INFERNAL_RAGE: Double your score (max 99)
  - PROTECTORS_OATH: Heal last place player 30-40 points, get 25% back
  - FINAL_WAGER: 50% chance for +50 points, otherwise -50
  - JUDGMENT: Gain +10 per opponent ahead of you (max +50)
- Passive abilities (triggered automatically):
  - Fateful Flick (Diceblade): 33% chance +10, otherwise -5
  - Berserker's Reprisal (Barbarian): Stack-based damage boost
- Mitigation: Divine Aegis reduces incoming damage by 75%

**Class System** (`src/lib/classes/classes.ts`, `src/lib/classes/abilities.ts`):

- Each class has unique active and/or passive abilities
- Class definitions in `src/lib/classes/classes.ts`
- Ability constants in `src/lib/classes/abilities.ts`
- Mitigation logic in `src/lib/supabase/abilities/attacks.ts`

### Data Layer

**Supabase Integration**:

- Client initialization in `src/lib/supabase/supabaseClient.ts`
- Two clients: `supabase` (anon key) and `supabaseServerClient` (service key)
- Domain modules in `src/lib/supabase/`:
  - `games.ts` - Game CRUD operations
  - `participation.ts` - Player participation in games
  - `profiles.ts` - User profile management
  - `badges.ts` - Badge/achievement system
  - `gameLog.ts` - Event logging with AI commentary
  - `storage.ts` - File storage operations

**Response Pattern**: All Supabase operations use discriminated unions:

```typescript
type SupabaseResponse<T> =
	| { type: 'success'; data: T; error: null }
	| { type: 'error'; data: null; error: PostgrestError | Error };
```

### Authentication & Authorization

**Auth Flow** (`src/hooks.server.ts`):

- Two sequential hooks: `supabase` (session setup) → `authGuard` (route protection)
- Protected routes: `/games`, `/badges`, `/account`, `/gallery`, `/stats`
- `safeGetSession()` validates JWT tokens, not just session cookies
- Automatic redirects: unauthenticated → `/auth/login`, authenticated at login → `/games`

**Supabase SSR**: Server-side auth uses `@supabase/ssr` for proper cookie handling across server/client boundary.

### AI Features

**Game Commentary** (`src/lib/ai/game-event-commentator.ts`):

- Uses OpenAI Responses API with `gpt-4.1-mini` model
- Stateful conversations via `previous_response_id`
- Personality-driven commentary based on game events
- Each game has a commentator with unique personality

**Image Generation** (`src/lib/ai/image-generator.ts`):

- Uses Fal AI for generating game-related images
- Character portraits, backgrounds, etc.

### Badge System

**Badge Architecture** (`src/lib/badges/`):

- Badge definitions split by category:
  - `valueEntryBadges.ts` - Score-based badges
  - `gameRankingBadges.ts` - Placement-based badges
  - `abilityBadges.ts` - Ability usage badges
- All badge slugs typed in `badgeSlugs.ts`
- Server-side checking via `/api/badge-check` endpoint
- Client-side tracking of seen badges in `SeenBadgesStore.ts`

### UI Components

**Component Structure**:

- Reusable UI components in `src/lib/components/ui/` (shadcn-svelte style)
- App-specific components in `src/lib/components/`
- Uses bits-ui for headless component primitives
- Tailwind CSS v4 for styling

**State Management**:

- Svelte 5 runes for reactive state
- Stores in `src/lib/stores/`:
  - `ToastStore.ts` - Toast notifications
  - `SeenBadgesStore.ts` - Badge tracking
  - `PersistantStorage.ts` - localStorage wrapper

## File Organization

```
src/
├── routes/              # SvelteKit routes (pages and API endpoints)
│   ├── +layout.svelte   # Root layout
│   ├── +layout.server.ts # Root layout data loading
│   ├── games/
│   │   ├── [code]/      # Dynamic game routes
│   │   │   ├── +page.svelte
│   │   │   ├── +page.server.ts
│   │   │   └── score-engine.ts  # Core scoring logic
│   │   └── create/
│   ├── badges/
│   ├── gallery/
│   └── api/             # API endpoints
│       └── badge-check/ # Badge checking logic
├── lib/
│   ├── supabase/        # Database operations
│   ├── classes/         # Class and ability definitions
│   ├── badges/          # Badge definitions and checks
│   ├── ai/              # OpenAI integration
│   ├── components/      # Reusable components
│   ├── stores/          # Svelte stores
│   └── utils/           # Utility functions
├── hooks.server.ts      # Server-side hooks (auth, Supabase)
├── hooks.client.ts      # Client-side hooks (Sentry)
└── app.d.ts            # TypeScript declarations

supabase/
├── migrations/          # Database migrations
├── seed.sql            # Base seed data
└── seed-participations.js # Additional seeding script
```

## Coding Standards

- **Language**: TypeScript with strict mode
- **Formatting**: Tabs (not spaces), single quotes, no trailing commas, 100 char width
- **Linting**: Run `pnpm lint` before committing
- **File naming**:
  - `kebab-case` for utilities and routes
  - `PascalCase.svelte` for components
- **SvelteKit conventions**: `+page.svelte`, `+layout.svelte`, `+page.server.ts`, `+layout.server.ts`

## Testing

- **Unit tests**: Vitest, co-located as `*.spec.ts` files
- **Integration tests**: Playwright in `tests/` directory
- Run `pnpm test` before pushing changes

## Changesets & Releases

- Use Changesets for versioning
- **Always add a changeset for user-visible changes** (features, fixes, breaking changes)
- CI automatically handles versioning and releases on merge to main

### Adding a Changeset

**Method 1: Interactive CLI** (when working locally with a TTY):

```bash
pnpm changeset
```

Follow the prompts to select bump type (patch/minor/major) and write summary.

**Method 2: Manual Creation** (recommended for automated environments):

Create a new file in `.changeset/` with format `<descriptive-name>.md`:

```markdown
---
'authenticlash': minor
---

Description of the change. This will appear in the changelog.
```

Bump types:

- `patch` - Bug fixes and minor tweaks (0.28.0 → 0.28.1)
- `minor` - New features, non-breaking changes (0.28.0 → 0.29.0)
- `major` - Breaking changes (0.28.0 → 1.0.0)

Example changeset file:

```markdown
---
'authenticlash': minor
---

Add configurable image generation provider with IMAGE_GENERATOR env variable.
```

- Run lint before pushing commits to origin
