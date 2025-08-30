# Repository Guidelines

## Project Structure & Module Organization
- `src/`: SvelteKit app source.
  - `routes/`: Pages and endpoints (e.g., `+page.svelte`, `+page.server.ts`, `+layout.svelte`).
  - `lib/`: Reusable modules/components (e.g., `lib/utils/*`).
- `static/`: Public assets served as-is.
- `tests/`: Playwright E2E tests (e.g., `tests/test.ts`).
- `supabase/`: Local DB setup, migrations, and seed scripts.
- Config: `svelte.config.js`, `vite.config.ts`, `eslint.config.mjs`, `.prettierrc`.

## Build, Test, and Development Commands
- `pnpm dev`: Run the app locally with Vite.
- `pnpm build`: Production build.
- `pnpm preview`: Preview the production build.
- `pnpm check`: Svelte type checking (`svelte-check`).
- `pnpm lint`: Prettier check + ESLint.
- `pnpm format`: Auto-format with Prettier.
- `pnpm test`: Run unit (Vitest) and integration (Playwright) tests.
- `pnpm test:unit`: Run Vitest specs.
- `pnpm test:integration`: Run Playwright tests.
- `pnpm supabase:reset`: Reset local DB and seed demo data.

## Coding Style & Naming Conventions
- Language: TypeScript + Svelte.
- Formatting: tabs, single quotes, trailingComma none, printWidth 100 (see `.prettierrc`).
- Linting: ESLint with Svelte/TypeScript presets (`eslint.config.mjs`). Run `pnpm lint` before pushing.
- SvelteKit routing: use `+page.svelte`, `+layout.svelte`, `+page.server.ts`, etc.
- Filenames: use `kebab-case` for files; `PascalCase.svelte` for components.

## Testing Guidelines
- Unit: Vitest. Place `*.spec.ts` near the code (e.g., `src/lib/utils/dateUtils.spec.ts`). Run with `pnpm test:unit`.
- Integration/E2E: Playwright specs under `tests/`. Run with `pnpm test:integration`.
- Aim for meaningful coverage on utilities, server loaders, and critical flows.

## Commit & Pull Request Guidelines
- Commit style: Conventional Commits where practical (`feat:`, `fix:`, `chore:`, `style:`). Example: `feat: add Diceblade class`.
- PRs: include a concise description, linked issue, and screenshots/GIFs for UI changes.
- CI: ensure `pnpm lint`, `pnpm check`, and `pnpm build` pass locally. CI runs lint, type check, and build on push.

## Security & Configuration Tips
- Create `.env` from `.env.example`. Required: `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`, `PUBLIC_ENV`.
- Do not commit secrets or local DB dumps. Use `pnpm supabase:reset` to reseed locally.

## Architecture Overview
- Framework: SvelteKit + Vite. Routing via `src/routes` using SvelteKit conventions.
- Data/Auth: Supabase (migrations + seeds in `supabase/`).
- Observability: Sentry initialized in `src/hooks.client.ts` and `src/hooks.server.ts`.
- AI: OpenAI client used for game commentary/media in `src/lib`.
- Deploy: Vercel (see `.github/workflows/*vercel*.yaml`).

## CI & Releases (Changesets)
- CI (`.github/workflows/build.yaml`): installs deps, runs `pnpm lint`, `pnpm check`, and `pnpm build` on every push.
- Releases (`.github/workflows/release.yaml`): after successful CI on `main`, Changesets creates a release PR and publishes.
- Add a changeset for user-visible changes (features, fixes, breaking changes):
  - Run `pnpm dlx changeset` (or `pnpm changeset` if globally available).
  - Choose the package bump and write a concise summary. This creates a file in `.changeset/`.
  - Ensure the changeset file is included in your PR. CI will handle versioning (`pnpm changeset:version`) and publishing (`pnpm changeset:release`).
