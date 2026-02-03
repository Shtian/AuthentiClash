# Project Structure & Architecture

## Source Layout

- `src/`: SvelteKit app source.
  - `routes/`: Pages/endpoints such as `+page.svelte`, `+page.server.ts`, `+layout.svelte`.
  - `lib/`: Reusable modules and components (e.g., `lib/utils/*`).
- `static/`: Public assets served as-is.
- `tests/`: Playwright E2E specs (e.g., `tests/test.ts`).
- `supabase/`: Local database migrations and seed scripts.
- Config roots: `svelte.config.js`, `vite.config.ts`, `eslint.config.mjs`, `.prettierrc`.

## Architecture Highlights

- Routing strictly follows the `src/routes` convention files listed above.
- Supabase migrations/seeds under `supabase/` define the local database shape.
- Observability: Sentry is initialized in `src/hooks.client.ts` and `src/hooks.server.ts`.
- AI services: OpenAI client in `src/lib` powers commentary/media generation.
- Deploy target: Vercel via `.github/workflows/*vercel*.yaml`.
