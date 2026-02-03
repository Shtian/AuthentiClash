# AuthentiClash Agent Guide

AuthentiClash is a SvelteKit + Supabase multiplayer experience that layers AI-driven commentary onto each match.

- Package manager: pnpm (always install dependencies and run scripts with `pnpm`).
- Pre-push gate: `pnpm lint`, `pnpm check`, and `pnpm build` must succeed locally before opening a PR.
- Secrets: copy `.env.example` to `.env`, fill Supabase keys, and never commit credentials or database dumps.

## Deep Dives

- [Project structure & architecture](docs/agents/project-structure.md)
- [Tooling & commands](docs/agents/tooling-and-commands.md)
- [Coding conventions](docs/agents/coding-conventions.md)
- [Testing](docs/agents/testing.md)
- [Git workflow & releases](docs/agents/git-and-releases.md)
- [Security & configuration](docs/agents/security-and-configuration.md)
