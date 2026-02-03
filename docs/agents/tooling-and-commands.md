# Tooling & Commands

## Core Scripts

- `pnpm dev`: run the Vite-powered dev server.
- `pnpm build`: produce the production bundle.
- `pnpm preview`: preview the production build locally.
- `pnpm check`: run `svelte-check` for type and Svelte validation.
- `pnpm lint`: run Prettier check + ESLint.
- `pnpm format`: apply Prettier formatting.

## Testing Shortcuts

- `pnpm test`: run both Vitest unit specs and Playwright integration tests.
- `pnpm test:unit`: run Vitest suites co-located with source (`*.spec.ts`).
- `pnpm test:integration`: run Playwright specs under `tests/`.

## Database Utilities

- `pnpm supabase:reset`: rebuild the local Supabase database and seed demo data.
