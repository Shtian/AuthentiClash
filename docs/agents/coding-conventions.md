# Coding Conventions

## Formatting

- Tabs for indentation, single quotes for strings, `trailingComma: none`, `printWidth: 100` (see `.prettierrc`).
- Use Prettier via `pnpm format` for bulk fixes, otherwise defer to ESLint warnings.

## Linting

- ESLint is configured via `eslint.config.mjs` with Svelte + TypeScript presets.
- Always run `pnpm lint` (and fix any reported issues) before pushing.

## Routing & Naming

- Follow SvelteKit file conventions: `+page.svelte`, `+layout.svelte`, `+page.server.ts`, etc.
- Source filenames live in `kebab-case`; Svelte components use `PascalCase.svelte`.
